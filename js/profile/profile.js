import { CONFIG } from '../core/config.js';
import { http } from '../core/http.js';
import { $ } from '../core/dom.js';
import { mostrarToast } from '../core/toast.js';
import { abrirModal, cerrarModal } from '../core/modal.js';
import { getState, setState } from '../core/state.js';

export async function initProfile() {
  const st = getState();
  if (!st.usuario) {
    window.location.href = 'login.html';
    return;
  }

  const userSpan = $('#perfil-usuario');
  const nameSpan = $('#perfil-nombre');
  const fullNameInput = $('#perfil-nombre-completo');
  const usernameInput = $('#perfil-nombre-usuario');
  const bioInput = $('#perfil-bio');
  const habInput = $('#perfil-habilidades');
  const gitInput = $('#perfil-github');
  const btn2FAEmail = $('#btn-2fa-email');
  const btn2FATOTP = $('#btn-2fa-totp');

  if (userSpan) userSpan.textContent = st.usuario.usuario || 'usuario';
  if (nameSpan) nameSpan.textContent = st.usuario.nombre || 'Usuario';

  try {
    const result = await http.get(CONFIG.ENDPOINTS.obtenerPerfil);
    if (result.success) {
      if (fullNameInput) fullNameInput.value = result.data.nombre_completo || st.usuario.nombre || '';
      if (usernameInput) usernameInput.value = result.data.usuario || st.usuario.usuario || '';
      if (bioInput) bioInput.value = result.data.bio || '';
      if (habInput) habInput.value = result.data.habilidades || '';
      if (gitInput) gitInput.value = result.data.github || '';

      if (btn2FAEmail) {
        if (Number(result.data.twofa_email_activo) === 1) {
          btn2FAEmail.textContent = 'Contactar Soporte';
          btn2FAEmail.onclick = () => window.location.href = 'contacto.html';
        } else {
          btn2FAEmail.textContent = 'Activar';
          btn2FAEmail.onclick = toggle2FAEmail;
        }
      }

      if (btn2FATOTP) {
        if (Number(result.data.twofa_totp_activo) === 1) {
          btn2FATOTP.textContent = 'Contactar Soporte';
          btn2FATOTP.onclick = () => window.location.href = 'contacto.html';
        } else {
          btn2FATOTP.textContent = 'Configurar';
          btn2FATOTP.onclick = iniciar2FATOTP;
        }
      }
    }
  } catch (e) {
    mostrarToast('Error al cargar perfil. Revisa tu conexiÃ³n.', 'error');
  }

  const formPerfil = $('#form-perfil');
  if (formPerfil) {
    formPerfil.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const result = await http.post(CONFIG.ENDPOINTS.actualizarPerfil, {
          nombre_completo: fullNameInput ? fullNameInput.value : '',
          usuario: usernameInput ? usernameInput.value : '',
          bio: bioInput ? bioInput.value : '',
          habilidades: habInput ? habInput.value : '',
          github: gitInput ? gitInput.value : ''
        });
        if (result.success) {
          const usuario = { ...getState().usuario, usuario: result.data.usuario, nombre: result.data.nombre_completo };
          setState({ usuario });
          if (userSpan) userSpan.textContent = usuario.usuario;
          if (nameSpan) nameSpan.textContent = usuario.nombre;
          mostrarToast(result.message || 'Perfil actualizado correctamente', 'success');
        }
      } catch (error) {
        mostrarToast(error.message || 'Error al actualizar el perfil', 'error');
      }
    });
  }

  const btnConfirmTotp = $('#btn-confirmar-totp');
  if (btnConfirmTotp) {
    btnConfirmTotp.addEventListener('click', async () => {
      const codigo = $('#totp-codigo').value;
      if(!codigo) return mostrarToast("Introduce el cÃ³digo", "error");
      
      try {
        const result = await http.post(CONFIG.ENDPOINTS.confirmar2FATOTP, { codigo });
        if (result.success) {
          mostrarToast(result.message, 'success');
          cerrarModal('modal-totp');
          if(btn2FATOTP) {
            btn2FATOTP.textContent = 'Contactar Soporte';
            btn2FATOTP.onclick = () => window.location.href = 'contacto.html';
          }
        }
      } catch (error) {
        mostrarToast(error.message, 'error');
      }
    });
  }
}

async function toggle2FAEmail() {
  try {
    const result = await http.post(CONFIG.ENDPOINTS.activar2FAEmail, { activo: true });
    if (result.success) {
      mostrarToast(result.message, 'success');
      const btn = $('#btn-2fa-email');
      if(btn) {
        btn.textContent = 'Contactar Soporte';
        btn.onclick = () => window.location.href = 'contacto.html';
      }
    }
  } catch (error) {
    mostrarToast(error.message, 'error');
  }
}

async function iniciar2FATOTP() {
  try {
    const result = await http.get(CONFIG.ENDPOINTS.generar2FATOTP);
    if (result.success) {
      const qr = String(result.qr_svg || '');
      const container = $('#qr-container');
      if (container && /^data:image\/(png|jpe?g|gif|webp|svg\+xml)(;base64|;utf8)?,/i.test(qr)) {
        const image = document.createElement('img');
        image.src = qr;
        image.alt = 'CÃ³digo QR para configurar 2FA';
        image.className = 'qr-image';
        container.replaceChildren(image);
      }
      const secret = $('#secret-text');
      if (secret) secret.textContent = result.secret || '';
      abrirModal('modal-totp');
    }
  } catch {
    mostrarToast('Error al generar QR', 'error');
  }
}


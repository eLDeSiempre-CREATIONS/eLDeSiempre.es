import { CONFIG } from '../core/config.js';
import { http } from '../core/http.js';
import { $ } from '../core/dom.js';
import { mostrarToast } from '../core/toast.js';
import { abrirModal, cerrarModal } from '../core/modal.js';
import { getState } from '../core/state.js';

export async function initProfile() {
  const st = getState();
  if (!st.usuario) {
    window.location.href = 'login.html';
    return;
  }

  const userSpan = $('#perfil-usuario');
  const nameSpan = $('#perfil-nombre');
  const bioInput = $('#perfil-bio');
  const habInput = $('#perfil-habilidades');
  const gitInput = $('#perfil-github');
  const btn2FAEmail = $('#btn-2fa-email');
  const btn2FATOTP = $('#btn-2fa-totp');

  if (userSpan) userSpan.innerText = st.usuario.usuario || 'usuario';
  if (nameSpan) nameSpan.innerText = st.usuario.nombre || 'Usuario';

  try {
    const result = await http.get(CONFIG.ENDPOINTS.obtenerPerfil);
    if (result.success) {
      if (bioInput) bioInput.value = result.data.bio || '';
      if (habInput) habInput.value = result.data.habilidades || '';
      if (gitInput) gitInput.value = result.data.github || '';

      if (btn2FAEmail) {
        if (result.data.twofa_email_activo) {
          btn2FAEmail.innerText = 'Contactar Soporte';
          btn2FAEmail.onclick = () => window.location.href = 'contacto.html';
        } else {
          btn2FAEmail.innerText = 'Activar';
          btn2FAEmail.onclick = toggle2FAEmail;
        }
      }

      if (btn2FATOTP) {
        if (result.data.twofa_totp_activo) {
          btn2FATOTP.innerText = 'Contactar Soporte';
          btn2FATOTP.onclick = () => window.location.href = 'contacto.html';
        } else {
          btn2FATOTP.innerText = 'Configurar';
          btn2FATOTP.onclick = iniciar2FATOTP;
        }
      }
    }
  } catch (e) {
    mostrarToast('Error al cargar perfil. Revisa tu conexión.', 'error');
  }

  const formPerfil = $('#form-perfil');
  if (formPerfil) {
    formPerfil.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const result = await http.post(CONFIG.ENDPOINTS.actualizarPerfil, {
          bio: bioInput ? bioInput.value : '',
          habilidades: habInput ? habInput.value : '',
          github: gitInput ? gitInput.value : ''
        });
        if (result.success) mostrarToast('Perfil actualizado correctamente', 'success');
      } catch (error) {
        mostrarToast('Error al actualizar el perfil', 'error');
      }
    });
  }

  const btnConfirmTotp = $('#btn-confirmar-totp');
  if (btnConfirmTotp) {
    btnConfirmTotp.addEventListener('click', async () => {
      const codigo = $('#totp-codigo').value;
      if(!codigo) return mostrarToast("Introduce el código", "error");
      
      try {
        const result = await http.post(CONFIG.ENDPOINTS.confirmar2FATOTP, { codigo });
        if (result.success) {
          mostrarToast(result.message, 'success');
          cerrarModal('modal-totp');
          if(btn2FATOTP) {
            btn2FATOTP.innerText = 'Contactar Soporte';
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
        btn.innerText = 'Contactar Soporte';
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
      $('#qr-container').innerHTML = `<img src="${result.qr_svg}" alt="QR" style="max-width:200px;">`;
      $('#secret-text').innerText = result.secret;
      abrirModal('modal-totp');
    }
  } catch (error) {
    mostrarToast('Error al generar QR', 'error');
  }
}

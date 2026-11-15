import { CONFIG } from '../core/config.js';
import { http } from '../core/http.js';
import { $, hide, show } from '../core/dom.js';
import { mostrarToast } from '../core/toast.js';
import { abrirModal, cerrarModal } from '../core/modal.js';

let temp2FAMetodo = null;

export function initLogin() {
  const formLogin = $('#form-login');
  const formRegistro = $('#form-registro');

  window.toggleAuthForms = (e) => {
    if (e) e.preventDefault();
    if (formLogin.style.display === 'none') { show(formLogin); hide(formRegistro); } 
    else { hide(formLogin); show(formRegistro); }
  };

  window.enviarReset = async () => {
    const email = $('#forgot-email').value;
    if (!email) return mostrarToast("Introduce tu correo.", "error");
    try {
      const result = await http.post(CONFIG.ENDPOINTS.solicitarReset, { email });
      if (result.success) {
        mostrarToast(result.message, 'success');
        cerrarModal('modal-forgot');
      }
    } catch (error) { mostrarToast(error.message, 'error'); }
  };

  if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const result = await http.post(CONFIG.ENDPOINTS.login, {
          correo: $('#login-correo').value,
          contrasena: $('#login-contrasena').value
        });
        if (result.success) {
          if (result.requiere_2fa) {
            temp2FAMetodo = result.requiere_2fa;
            mostrarToast(result.message, 'success');
            abrirModal('modal-2fa');
          } else {
            mostrarToast('Bienvenido ' + result.nombre, 'success');
            setTimeout(() => window.location.href = 'biblioteca.html', 1000);
          }
        }
      } catch (error) { mostrarToast(error.message, 'error'); }
    });
  }

  if (formRegistro) {
    formRegistro.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const result = await http.post(CONFIG.ENDPOINTS.registro, {
          nombre_completo: $('#reg-nombre').value,
          usuario: $('#reg-usuario').value,
          correo: $('#reg-correo').value,
          contrasena: $('#reg-contrasena').value
        });
        if (result.success) {
          mostrarToast('Registro exitoso. Revisa tu correo.', 'success');
          formRegistro.reset();
          hide(formRegistro);
          show(formLogin);
        }
      } catch (error) { mostrarToast(error.message, 'error'); }
    });
  }

  const btnVerify2FA = $('#btn-verificar-2fa');
  if (btnVerify2FA) {
    btnVerify2FA.addEventListener('click', async () => {
      const codigo = $('#2fa-codigo').value;
      if (!codigo) return mostrarToast("Introduce el código.", "error");
      try {
        const result = await http.post(CONFIG.ENDPOINTS.verificar2FA, { codigo, metodo: temp2FAMetodo });
        if (result.success) {
          mostrarToast('Login exitoso.', 'success');
          setTimeout(() => window.location.href = 'biblioteca.html', 1000);
        }
      } catch (error) { mostrarToast(error.message, 'error'); }
    });
  }
}

import { CONFIG } from '../core/config.js';
import { http, HttpError } from '../core/http.js';
import { $, hide, show } from '../core/dom.js';
import { mostrarToast } from '../core/toast.js';
import { abrirModal, cerrarModal } from '../core/modal.js';

let temp2FAMetodo = null;

export function initLogin() {
  const formLogin = $('#form-login');
  const formRegistro = $('#form-registro');

  if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        correo: $('#login-correo').value,
        contrasena: $('#login-contrasena').value
      };

      try {
        const result = await http.post(CONFIG.ENDPOINTS.login, data);
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
      } catch (error) {
        mostrarToast(error.message || 'Error al iniciar sesión', 'error');
      }
    });
  }

  if (formRegistro) {
    formRegistro.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        nombre_completo: $('#reg-nombre').value,
        usuario: $('#reg-usuario').value,
        correo: $('#reg-correo').value,
        contrasena: $('#reg-contrasena').value
      };

      try {
        const result = await http.post(CONFIG.ENDPOINTS.registro, data);
        if (result.success) {
          mostrarToast('Registro exitoso. Revisa tu correo.', 'success');
          formRegistro.reset();
          hide(formRegistro);
          show(formLogin);
        }
      } catch (error) {
        mostrarToast(error.message || 'Error al registrar', 'error');
      }
    });
  }

  window.toggleAuthForms = (e) => {
    if (e) e.preventDefault();
    if (formLogin.style.display === 'none') {
      show(formLogin);
      hide(formRegistro);
    } else {
      hide(formLogin);
      show(formRegistro);
    }
  };

  const btnVerify2FA = $('#btn-verificar-2fa');
  if (btnVerify2FA) {
    btnVerify2FA.addEventListener('click', async () => {
      const codigo = $('#2fa-codigo').value;
      if (!codigo) return mostrarToast("Introduce el código.", "error");

      try {
        const result = await http.post(CONFIG.ENDPOINTS.verificar2FA, {
          codigo: codigo,
          metodo: temp2FAMetodo
        });
        if (result.success) {
          mostrarToast('Login exitoso.', 'success');
          setTimeout(() => window.location.href = 'biblioteca.html', 1000);
        }
      } catch (error) {
        mostrarToast(error.message || 'Error al verificar', 'error');
      }
    });
  }
}

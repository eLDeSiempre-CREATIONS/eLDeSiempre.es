import { CONFIG } from '../core/config.js';
import { http } from '../core/http.js';
import { $ } from '../core/dom.js';
import { mostrarToast } from '../core/toast.js';
import { abrirModal, cerrarModal } from '../core/modal.js';

let temp2FAMetodo = null;

function redirectTarget() {
  const raw = new URLSearchParams(window.location.search).get('redirect');
  if (!raw) return 'biblioteca.html';
  try {
    const target = new URL(raw, window.location.href);
    if (target.origin !== window.location.origin) return 'biblioteca.html';
    if (!/\.html$/.test(target.pathname)) return 'biblioteca.html';
    if (/\/login\.html$/.test(target.pathname)) return 'biblioteca.html';
    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return 'biblioteca.html';
  }
}

export function initLogin() {
  const formLogin = $('#form-login');
  const formRegistro = $('#form-registro');

  const showLogin = () => {
    if (formLogin) formLogin.hidden = false;
    if (formRegistro) formRegistro.hidden = true;
  };

  const showRegister = () => {
    if (formLogin) formLogin.hidden = true;
    if (formRegistro) formRegistro.hidden = false;
  };

  window.toggleAuthForms = (event) => {
    if (event) event.preventDefault();
    if (formLogin?.hidden) showLogin();
    else showRegister();
  };

  document.querySelectorAll('[data-auth-toggle]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      if (formLogin?.hidden) showLogin();
      else showRegister();
    });
  });

  const btnEnviarReset = $('#btn-enviar-reset');
  if (btnEnviarReset) {
    btnEnviarReset.addEventListener('click', async () => {
      const email = $('#forgot-email')?.value || '';
      if (!email) {
        mostrarToast('Introduce tu correo.', 'error');
        return;
      }
      try {
        const result = await http.post(CONFIG.ENDPOINTS.solicitarReset, { email });
        if (result.success) {
          mostrarToast(result.message, 'success');
          cerrarModal('modal-forgot');
        }
      } catch (error) {
        mostrarToast(error.message, 'error');
      }
    });
  }

  if (formLogin) {
    formLogin.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submit = formLogin.querySelector('button[type="submit"]');
      if (submit) submit.disabled = true;
      try {
        const result = await http.post(CONFIG.ENDPOINTS.login, {
          correo: $('#login-correo')?.value || '',
          contrasena: $('#login-contrasena')?.value || '',
        });
        if (result.success) {
          if (result.requiere_2fa) {
            temp2FAMetodo = result.requiere_2fa;
            mostrarToast(result.message, 'success');
            abrirModal('modal-2fa');
          } else {
            mostrarToast(`Bienvenido ${result.nombre}`, 'success');
            setTimeout(() => {
              window.location.href = redirectTarget();
            }, 1000);
          }
        }
      } catch (error) {
        mostrarToast(error.message, 'error');
      } finally {
        if (submit) submit.disabled = false;
      }
    });
  }

  if (formRegistro) {
    formRegistro.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submit = formRegistro.querySelector('button[type="submit"]');
      if (submit) submit.disabled = true;
      try {
        const result = await http.post(CONFIG.ENDPOINTS.registro, {
          nombre_completo: $('#reg-nombre')?.value || '',
          usuario: $('#reg-usuario')?.value || '',
          correo: $('#reg-correo')?.value || '',
          contrasena: $('#reg-contrasena')?.value || '',
        });
        if (result.success) {
          mostrarToast('Registro exitoso. Revisa tu correo.', 'success');
          formRegistro.reset();
          showLogin();
        }
      } catch (error) {
        mostrarToast(error.message, 'error');
      } finally {
        if (submit) submit.disabled = false;
      }
    });
  }

  const btnVerify2FA = $('#btn-verificar-2fa');
  if (btnVerify2FA) {
    btnVerify2FA.addEventListener('click', async () => {
      const codigo = $('#input-codigo-2fa')?.value || '';
      if (!codigo) {
        mostrarToast('Introduce el código.', 'error');
        return;
      }
      try {
        const result = await http.post(CONFIG.ENDPOINTS.verificar2FA, { codigo, metodo: temp2FAMetodo });
        if (result.success) {
          mostrarToast('Login exitoso.', 'success');
          setTimeout(() => {
            window.location.href = redirectTarget();
          }, 1000);
        }
      } catch (error) {
        mostrarToast(error.message || 'Código incorrecto', 'error');
      }
    });
  }
}

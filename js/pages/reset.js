import { initPage } from '../core/page.js';
import { CONFIG } from '../core/config.js';
import { http } from '../core/http.js';
import { $ } from '../core/dom.js';
import { mostrarToast } from '../core/toast.js';

function initReset() {
  const form = $('#form-reset');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) {
      mostrarToast('Token no válido o ausente.', 'error');
      return;
    }

    const password = $('#reset-password')?.value || '';
    const confirmation = $('#reset-password-confirm')?.value || '';

    if (password !== confirmation) {
      mostrarToast('Las contraseñas no coinciden.', 'error');
      return;
    }

    const submit = form.querySelector('button[type="submit"]');
    if (submit) submit.disabled = true;

    try {
      const result = await http.post(CONFIG.ENDPOINTS.resetPassword, { token, password });
      if (result.success) {
        mostrarToast('Contraseña actualizada. Redirigiendo al login...', 'success');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 2000);
      }
    } catch (error) {
      mostrarToast(error.message, 'error');
    } finally {
      if (submit) submit.disabled = false;
    }
  });
}

initPage({ page: 'reset', onReady: initReset });

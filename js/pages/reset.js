import { inicializarTema } from '../core/theme.js';
import { initNav } from '../ui/nav.js';
import { initDisclaimer } from '../ui/disclaimer.js';
import { CONFIG } from '../core/config.js';
import { http } from '../core/http.js';
import { $ } from '../core/dom.js';
import { mostrarToast } from '../core/toast.js';

window.addEventListener('DOMContentLoaded', () => {
  inicializarTema();
  initDisclaimer();
  initNav();

  const form = $('#form-reset');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
      mostrarToast("Token no válido o ausente.", "error");
      return;
    }

    const pass = $('#reset-password').value;
    const passConfirm = $('#reset-password-confirm').value;

    if (pass !== passConfirm) {
      mostrarToast("Las contraseñas no coinciden.", "error");
      return;
    }

    try {
      const result = await http.post(CONFIG.ENDPOINTS.resetPassword, { token, password: pass });
      if (result.success) {
        mostrarToast("Contraseña actualizada. Redirigiendo al login...", "success");
        setTimeout(() => window.location.href = 'login.html', 2000);
      }
    } catch (error) {
      mostrarToast(error.message, "error");
    }
  });
});

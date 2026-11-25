import { CONFIG } from '../core/config.js';
import { http } from '../core/http.js';
import { $ } from '../core/dom.js';
import { mostrarToast } from '../core/toast.js';

export function initContact() {
  const form = $('#form-contacto');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      nombre: $('#contact-nombre').value,
      email: $('#contact-email').value,
      asunto: $('#contact-asunto').value,
      mensaje: $('#contact-mensaje').value,
      website: $('#contact-website') ? $('#contact-website').value : ''
    };

    try {
      const result = await http.post(CONFIG.ENDPOINTS.contacto, data);
      if (result.success) {
        mostrarToast('Mensaje enviado con éxito.', 'success');
        form.reset();
      }
    } catch (error) {
      mostrarToast(error.message || 'Error de conexión.', 'error');
    }
  });
}

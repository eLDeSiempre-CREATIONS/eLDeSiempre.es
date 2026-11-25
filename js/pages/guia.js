import { initPage } from '../core/page.js';
import { CONFIG } from '../core/config.js';
import { http } from '../core/http.js';
import { $ } from '../core/dom.js';
import { sanitizeHTML } from '../core/sanitize.js';
import { getLevelBadgeClass } from '../core/badges.js';

function showMessage(container, title, message, action) {
  container.innerHTML = '';
  const heading = document.createElement('h2');
  heading.textContent = title;
  const paragraph = document.createElement('p');
  paragraph.textContent = message;
  container.append(heading, paragraph);
  if (action) {
    const link = document.createElement('a');
    link.href = action.href;
    link.className = 'btn-primary';
    link.textContent = action.label;
    container.appendChild(link);
  }
}

initPage({
  page: 'guia',
  onReady: async () => {
    const params = new URLSearchParams(window.location.search);
    const guiaId = params.get('id');
    const tituloElement = $('#guia-titulo');
    const nivelElement = $('#guia-nivel');
    const contenidoElement = $('#guia-contenido');

    if (!guiaId) {
      showMessage(contenidoElement, 'Error 404', 'No se ha especificado ninguna guía.');
      return;
    }

    try {
      const result = await http.get(`${CONFIG.ENDPOINTS.obtenerGuia}?id=${encodeURIComponent(guiaId)}`);
      if (!result.success) throw new Error(result.message || 'Guía no encontrada.');

      document.title = `${result.data.titulo} | eLDeSiempre.es`;
      tituloElement.textContent = result.data.titulo;
      contenidoElement.innerHTML = sanitizeHTML(result.data.contenido);

      if (nivelElement) {
        nivelElement.hidden = false;
        nivelElement.textContent = result.data.nivel || 'Guía';
        nivelElement.className = `badge ${getLevelBadgeClass(result.data.nivel)}`;
      }
    } catch (error) {
      if (error.status === 403) {
        if (tituloElement) tituloElement.textContent = 'Contenido protegido';
        showMessage(contenidoElement, 'Contenido protegido', error.message || 'Debes iniciar sesión para leer esta guía.', {
          href: 'login.html',
          label: 'Ir a iniciar sesión',
        });
      } else {
        showMessage(contenidoElement, 'Guía no encontrada', 'La guía que buscas no existe o ha sido eliminada.');
      }
    }
  },
});

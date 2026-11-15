import { inicializarTema } from '../core/theme.js';
import { initNav } from '../ui/nav.js';
import { initDisclaimer } from '../ui/disclaimer.js';
import { CONFIG } from '../core/config.js';
import { http, HttpError } from '../core/http.js';
import { $ } from '../core/dom.js';

window.addEventListener('DOMContentLoaded', async () => {
  inicializarTema();
  initDisclaimer();
  await initNav();

  const urlParams = new URLSearchParams(window.location.search);
  const guiaId = urlParams.get('id');
  const tituloElement = $('#guia-titulo');
  const nivelElement = $('#guia-nivel');
  const contenidoElement = $('#guia-contenido');

  if (!guiaId) {
    tituloElement.innerText = "Error 404";
    contenidoElement.innerHTML = "<p>No se ha especificado ninguna guía.</p>";
    return;
  }

  try {
    const result = await http.get(`${CONFIG.ENDPOINTS.obtenerGuia}?id=${guiaId}`);
    if (result.success) {
      document.title = result.data.titulo + " | Guía";
      tituloElement.innerText = result.data.titulo;
      contenidoElement.innerHTML = result.data.contenido;

      nivelElement.style.display = 'inline-block';
      nivelElement.innerText = result.data.nivel;

      if (result.data.nivel === 'Principiante') nivelElement.className = 'badge badge-curso';
      else if (result.data.nivel === 'Fácil') nivelElement.className = 'badge badge-lab';
      else if (result.data.nivel === 'Medio') nivelElement.className = 'badge badge-herramienta';
      else if (result.data.nivel === 'Difícil') nivelElement.className = 'badge badge-libro';
      else if (result.data.nivel === 'Experto') nivelElement.className = 'badge badge-sistema';

    }
  } catch (error) {
    if (error.status === 403) {
      tituloElement.innerText = "Contenido Protegido";
      contenidoElement.innerHTML = `<p>${error.message}</p><br><a href="login.html" class="btn-primary" style="text-decoration: none; display: inline-block;">Ir a Iniciar Sesión</a>`;
    } else {
      tituloElement.innerText = "Guía no encontrada";
      contenidoElement.innerHTML = "<p>La guía que buscas no existe o ha sido eliminada.</p>";
    }
  }
});

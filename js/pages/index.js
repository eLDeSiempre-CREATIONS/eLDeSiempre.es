import { initPage } from '../core/page.js';
import { $ } from '../core/dom.js';
import { mostrarToast } from '../core/toast.js';
import { renderQuickAccess, renderFeaturedTools } from '../library/render-home.js';
import { renderGuideList, initGuideFilters } from '../library/render-guides.js';

initPage({
  page: 'index',
  onReady: async () => {
    renderQuickAccess($('#accesos-rapidos'));
    renderFeaturedTools($('#herramientas-destacadas'));
    await renderGuideList($('#lista-guias'));
    initGuideFilters();

    const params = new URLSearchParams(window.location.search);
    if (params.get('verificado') === '1') {
      mostrarToast('¡Cuenta verificada con éxito! Ya puedes iniciar sesión.', 'success');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    if (params.get('magic_login') === '1') {
      mostrarToast('Acceso mágico correcto. Bienvenido.', 'success');
      window.history.replaceState({}, document.title, window.location.pathname);
      setTimeout(() => {
        window.location.href = 'biblioteca.html';
      }, 1500);
    }
  },
});

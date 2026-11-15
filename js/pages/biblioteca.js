import { inicializarTema } from '../core/theme.js';
import { initNav } from '../ui/nav.js';
import { initDisclaimer } from '../ui/disclaimer.js';
import { comprobarSesion } from '../auth/session.js';
import { initLibraryRouter } from '../library/router.js';
import { initAllTools } from '../tools/index.js';
import { mostrarToast } from '../core/toast.js';
import { initGlobalSearch } from '../ui/search.js';

window.addEventListener('DOMContentLoaded', () => {
  inicializarTema();
  initDisclaimer();
  initNav();
  initAllTools();
  initGlobalSearch();

  comprobarSesion().then((usuario) => {
    if (!usuario) {
      mostrarToast("Debes iniciar sesión para acceder a la biblioteca.", "error");
      setTimeout(() => { window.location.href = 'index.html'; }, 1500);
    } else {
      initLibraryRouter();
    }
  });
});

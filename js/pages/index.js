import { inicializarTema } from '../core/theme.js';
import { initNav } from '../ui/nav.js';
import { initDisclaimer } from '../ui/disclaimer.js';
import { comprobarSesion, comprobarAcceso } from '../auth/session.js';
import { mostrarToast } from '../core/toast.js';
import { initGlobalSearch } from '../ui/search.js';

window.addEventListener('DOMContentLoaded', async () => {
  inicializarTema();
  initDisclaimer();
  await initNav();
  await comprobarSesion();
  initGlobalSearch();

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('verificado') === '1') {
    mostrarToast('¡Cuenta verificada con éxito! Ya puedes iniciar sesión.', 'success');
    window.history.replaceState({}, document.title, window.location.pathname);
  }
  if (urlParams.get('magic_login') === '1') {
    mostrarToast('Acceso mágico correcto. Bienvenido.', 'success');
    window.history.replaceState({}, document.title, window.location.pathname);
    setTimeout(() => { window.location.href = 'biblioteca.html'; }, 1500);
  }

  window.filtrarNivel = (nivel, btn) => {
    document.querySelectorAll('.filter-container .btn-secondary').forEach(b => b.classList.remove('active-filter'));
    if (btn) btn.classList.add('active-filter');
    
    document.querySelectorAll('.guia-item').forEach(item => {
      if (nivel === 'todos' || item.dataset.nivel === nivel) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  };
});

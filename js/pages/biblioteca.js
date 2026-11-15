import { inicializarTema } from '../core/theme.js';
import { initNav } from '../ui/nav.js';
import { initDisclaimer } from '../ui/disclaimer.js';
import { comprobarSesion } from '../auth/session.js';
import { initLibraryRouter } from '../library/router.js';
import { mostrarToast } from '../core/toast.js';
import { getState } from '../core/state.js';

window.addEventListener('DOMContentLoaded', async () => {
  inicializarTema();
  initDisclaimer();
  await initNav();
  
  const usuario = await comprobarSesion();
  
  if (!usuario) {
    mostrarToast("Debes iniciar sesión para acceder a la biblioteca.", "error");
    setTimeout(() => { window.location.href = 'index.html'; }, 1500);
    return;
  }

  initLibraryRouter();
});

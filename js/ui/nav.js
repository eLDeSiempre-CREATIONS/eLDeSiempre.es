import { $, $$ } from '../core/dom.js';
import { subscribe, getState } from '../core/state.js';
import { comprobarSesion, renderNavAuth, cerrarSesion, comprobarAcceso } from '../auth/session.js';
import { abrirModal } from '../core/modal.js'; 

export async function initNav() {
  const bodyNav = document.body.dataset.nav;
  if (bodyNav) {
    $$('.nav-btn').forEach(btn => {
      const onclick = btn.getAttribute('onclick') || '';
      if (
        (bodyNav === 'inicio' && onclick.includes('index.html')) ||
        (bodyNav === 'aprender' && onclick.includes('biblioteca.html')) ||
        (bodyNav === 'contacto' && onclick.includes('contacto.html'))
      ) {
        btn.classList.add('active');
      }
    });
  }

  window.cerrarSesion = cerrarSesion;
  window.comprobarAcceso = comprobarAcceso;
  window.abrirModal = abrirModal;

  subscribe((st) => renderNavAuth(st.usuario));

  const st = getState();
  if (st.sessionChecked) {
    renderNavAuth(st.usuario);
  } else {
    const usuario = await comprobarSesion();
    renderNavAuth(usuario);
  }
}

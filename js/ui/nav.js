import { $, $$ } from '../core/dom.js';
import { subscribe, getState } from '../core/state.js';
import { comprobarSesion, renderNavAuth, cerrarSesion, comprobarAcceso } from '../auth/session.js';
import { abrirModal, cerrarModal } from '../core/modal.js'; 

export async function initNav() {
  // Resaltar automáticamente el botón del menú según la página actual
  const path = window.location.pathname;
  $$('.nav-btn').forEach(btn => {
    const onclick = btn.getAttribute('onclick') || '';
    if (path.includes('biblioteca') && onclick.includes('biblioteca.html')) btn.classList.add('active');
    else if (path.includes('contacto') && onclick.includes('contacto.html')) btn.classList.add('active');
    else btn.classList.remove('active');
  });

  // Exponer funciones globales necesarias para los onclick del HTML
  window.cerrarSesion = cerrarSesion;
  window.comprobarAcceso = comprobarAcceso;
  window.abrirModal = abrirModal;
  window.cerrarModal = cerrarModal;

  // Suscribirse a los cambios de sesión para actualizar los botones
  subscribe((st) => renderNavAuth(st.usuario));

  // Comprobar sesión inicial
  const st = getState();
  if (st.sessionChecked) {
    renderNavAuth(st.usuario);
  } else {
    const usuario = await comprobarSesion();
    renderNavAuth(usuario);
  }
}

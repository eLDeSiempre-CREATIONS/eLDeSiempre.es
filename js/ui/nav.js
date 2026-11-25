import { $, $$, copyToClipboard } from '../core/dom.js';
import { subscribe, getState } from '../core/state.js';
import { comprobarSesion, renderNavAuth, cerrarSesion, comprobarAcceso } from '../auth/session.js';
import { abrirModal, cerrarModal } from '../core/modal.js';
import { mostrarToast } from '../core/toast.js';
import { getPageNav } from '../data/navigation.js';

function paintActiveNav(section) {
  $$('.nav-btn[data-nav]').forEach((link) => {
    const active = link.getAttribute('data-nav') === section;
    link.classList.toggle('active', active);
    if (active) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

async function copiarAlPortapapeles(texto, etiqueta = 'Texto') {
  try {
    const ok = await copyToClipboard(texto);
    if (ok) {
      mostrarToast(`${etiqueta} copiado al portapapeles.`, 'success');
    } else {
      mostrarToast('No se pudo copiar.', 'error');
    }
  } catch {
    mostrarToast('No se pudo copiar.', 'error');
  }
}

export async function initNav() {
  paintActiveNav(getPageNav());

  window.cerrarSesion = cerrarSesion;
  window.comprobarAcceso = comprobarAcceso;
  window.abrirModal = abrirModal;
  window.cerrarModal = cerrarModal;
  window.copiarAlPortapapeles = copiarAlPortapapeles;

  const logout = $('#nav-logout-btn');
  if (logout) logout.addEventListener('click', cerrarSesion);

  document.addEventListener('click', (e) => {
    const target = e.target instanceof Element ? e.target.closest('[data-copy]') : null;
    if (!target) return;
    e.preventDefault();
    copiarAlPortapapeles(target.getAttribute('data-copy'), target.getAttribute('data-copy-label') || 'Texto');
  });

  subscribe((st) => renderNavAuth(st.usuario));

  const st = getState();
  if (st.sessionChecked) {
    renderNavAuth(st.usuario);
  } else {
    const usuario = await comprobarSesion();
    renderNavAuth(usuario);
  }
}

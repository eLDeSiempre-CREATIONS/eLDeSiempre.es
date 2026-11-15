import { $ } from './dom.js';

let _lastFocused = null;

function focusableIn(root) {
  return Array.from(root.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  ));
}

export function abrirModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;

  _lastFocused = document.activeElement;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('locked');

  const focusable = focusableIn(modal);
  if (focusable.length) focusable[0].focus();

  if (location.hash !== `#${id}`) {
    history.replaceState(null, '', `#${id}`);
  }
}

export function cerrarModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;

  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');

  if (!document.querySelector('.modal-overlay.active')) {
    document.body.classList.remove('locked');
  }

  if (_lastFocused?.focus) _lastFocused.focus();
  _lastFocused = null;

  if (location.hash === `#${id}`) {
    history.replaceState(null, '', location.pathname + location.search);
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const abierto = document.querySelector('.modal-overlay.active');
    if (abierto) cerrarModal(abierto.id);
  }

  if (e.key === 'Tab') {
    const abierto = document.querySelector('.modal-overlay.active');
    if (!abierto) return;
    const focusables = focusableIn(abierto);
    if (!focusables.length) return;
    const first = focusables[0];
    const last  = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

document.addEventListener('click', (e) => {
  if (e.target.classList?.contains('modal-overlay')) {
    cerrarModal(e.target.id);
  }
});

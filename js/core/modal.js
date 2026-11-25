let _lastFocused = null;

function focusableIn(root) {
  return Array.from(root.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  ));
}

export function syncBodyLock() {
  const activeModal = document.querySelector('.modal-overlay.active');
  const curtain = document.getElementById('curtain');
  const curtainVisible = curtain instanceof HTMLElement && !curtain.hidden;
  document.body.classList.toggle('locked', Boolean(activeModal) || curtainVisible);
}

export function abrirModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return false;

  _lastFocused = document.activeElement;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  if (modal.getAttribute('aria-modal') === null) modal.setAttribute('aria-modal', 'true');
  syncBodyLock();

  const focusable = focusableIn(modal);
  if (focusable.length) focusable[0].focus();

  if (location.hash !== `#${id}`) {
    history.replaceState(null, '', `#${id}`);
  }

  document.dispatchEvent(new CustomEvent('modal:open', { detail: { id } }));
  return true;
}

export function cerrarModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return false;

  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  if (!document.querySelector('.modal-overlay.active')) syncBodyLock();

  if (_lastFocused?.isConnected && typeof _lastFocused.focus === 'function') {
    _lastFocused.focus();
  }
  _lastFocused = null;

  if (location.hash === `#${id}`) {
    history.replaceState(null, '', location.pathname + location.search);
  }

  document.dispatchEvent(new CustomEvent('modal:close', { detail: { id } }));
  return true;
}

export function cerrarModalActivo() {
  const abierto = document.querySelector('.modal-overlay.active');
  return abierto ? cerrarModal(abierto.id) : false;
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    cerrarModalActivo();
  }

  if (e.key === 'Tab') {
    const abierto = document.querySelector('.modal-overlay.active');
    if (!abierto) return;
    const focusables = focusableIn(abierto);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
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
  const target = e.target instanceof Element ? e.target : null;
  if (!target) return;

  const opener = target.closest('[data-open-modal]');
  if (opener) {
    e.preventDefault();
    abrirModal(opener.getAttribute('data-open-modal'));
    return;
  }

  const closer = target.closest('[data-close-modal]');
  if (closer) {
    const isLink = closer instanceof HTMLAnchorElement && closer.hasAttribute('href');
    if (!isLink) e.preventDefault();
    cerrarModal(closer.getAttribute('data-close-modal'));
    return;
  }

  if (target.classList?.contains('modal-overlay')) {
    cerrarModal(target.id);
  }
});

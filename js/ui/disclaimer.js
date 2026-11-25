import { CONFIG } from '../core/config.js';
import { $ } from '../core/dom.js';
import { abrirModal, syncBodyLock } from '../core/modal.js';

export function comprobarDisclaimer() {
  const modal = $('#disclaimer-modal');
  if (!modal) return;

  if (localStorage.getItem(CONFIG.STORAGE_KEYS.disclaimer) === 'true') {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    syncBodyLock();

    if (!localStorage.getItem(CONFIG.STORAGE_KEYS.cookies)) {
      const banner = $('#cookie-banner');
      if (banner) banner.hidden = false;
    }
  } else {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    syncBodyLock();
  }
}

export function aceptarDisclaimer() {
  const modal = $('#disclaimer-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
  localStorage.setItem(CONFIG.STORAGE_KEYS.disclaimer, 'true');
  syncBodyLock();

  if (!localStorage.getItem(CONFIG.STORAGE_KEYS.cookies)) {
    const banner = $('#cookie-banner');
    if (banner) banner.hidden = false;
  }
}

export function aceptarCookies(aceptadas) {
  localStorage.setItem(CONFIG.STORAGE_KEYS.cookies, aceptadas ? 'true' : 'false');
  const banner = $('#cookie-banner');
  if (banner) banner.hidden = true;

  if (!aceptadas && typeof window._paq !== 'undefined') {
    window._paq.push(['disableCookies']);
    window._paq.push(['forgetUser']);
  }
}

export function mostrarAvisoLegal(e) {
  if (e) e.preventDefault();
  abrirModal('modal-legal');
}

export function initDisclaimer() {
  window.aceptarDisclaimer = aceptarDisclaimer;
  window.aceptarCookies = aceptarCookies;
  window.mostrarAvisoLegal = mostrarAvisoLegal;

  document.addEventListener('click', (e) => {
    const target = e.target instanceof Element ? e.target.closest('[data-action]') : null;
    if (!target) return;
    const action = target.getAttribute('data-action');
    if (action === 'aceptar-disclaimer') {
      e.preventDefault();
      aceptarDisclaimer();
    } else if (action === 'aceptar-cookies') {
      e.preventDefault();
      aceptarCookies(true);
    } else if (action === 'rechazar-cookies') {
      e.preventDefault();
      aceptarCookies(false);
    }
  });

  comprobarDisclaimer();
}

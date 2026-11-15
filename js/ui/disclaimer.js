import { CONFIG } from '../core/config.js';
import { $, show, hide } from '../core/dom.js';
import { abrirModal } from '../core/modal.js';

export function comprobarDisclaimer() {
  const modal = $('#disclaimer-modal');
  if (!modal) return;

  if (localStorage.getItem(CONFIG.STORAGE_KEYS.disclaimer) === 'true') {
    hide(modal);
    document.body.classList.remove('locked');
    if (!localStorage.getItem(CONFIG.STORAGE_KEYS.cookies)) {
      const banner = $('#cookie-banner');
      if (banner) show(banner);
    }
  } else {
    show(modal);
    document.body.classList.add('locked');
  }
}

export function aceptarDisclaimer() {
  const modal = $('#disclaimer-modal');
  if (modal) hide(modal);
  document.body.classList.remove('locked');
  localStorage.setItem(CONFIG.STORAGE_KEYS.disclaimer, 'true');
  
  if (!localStorage.getItem(CONFIG.STORAGE_KEYS.cookies)) {
    const banner = $('#cookie-banner');
    if (banner) show(banner);
  }
}

export function aceptarCookies(aceptadas) {
  localStorage.setItem(CONFIG.STORAGE_KEYS.cookies, aceptadas ? 'true' : 'false');
  const banner = $('#cookie-banner');
  if (banner) hide(banner);
  
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
  comprobarDisclaimer();
}

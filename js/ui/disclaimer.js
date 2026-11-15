import { CONFIG } from '../core/config.js';
import { $ } from '../core/dom.js';
import { abrirModal } from '../core/modal.js';

export function comprobarDisclaimer() {
  const modal = $('#disclaimer-modal');
  if (!modal) return;

  if (localStorage.getItem(CONFIG.STORAGE_KEYS.disclaimer) === 'true') {
    modal.classList.remove('active');
    document.body.classList.remove('locked');
    
    if (!localStorage.getItem(CONFIG.STORAGE_KEYS.cookies)) {
      const banner = $('#cookie-banner');
      if (banner) banner.style.display = 'flex';
    }
  } else {
    modal.classList.add('active');
    document.body.classList.add('locked');
  }
}

export function aceptarDisclaimer() {
  const modal = $('#disclaimer-modal');
  if (modal) modal.classList.remove('active');
  document.body.classList.remove('locked');
  localStorage.setItem(CONFIG.STORAGE_KEYS.disclaimer, 'true');
  
  if (!localStorage.getItem(CONFIG.STORAGE_KEYS.cookies)) {
    const banner = $('#cookie-banner');
    if (banner) banner.style.display = 'flex';
  }
}

export function aceptarCookies(aceptadas) {
  localStorage.setItem(CONFIG.STORAGE_KEYS.cookies, aceptadas ? 'true' : 'false');
  const banner = $('#cookie-banner');
  if (banner) banner.style.display = 'none';
  
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

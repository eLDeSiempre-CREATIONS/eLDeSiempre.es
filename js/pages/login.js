import { inicializarTema } from '../core/theme.js';
import { initNav } from '../ui/nav.js';
import { initDisclaimer } from '../ui/disclaimer.js';
import { initLogin } from '../auth/login.js';

window.addEventListener('DOMContentLoaded', () => {
  inicializarTema();
  initDisclaimer();
  initNav();
  initLogin();
});

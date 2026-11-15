import { inicializarTema } from '../core/theme.js';
import { initNav } from '../ui/nav.js';
import { initDisclaimer } from '../ui/disclaimer.js';
import { initContact } from '../contact/contact.js';

window.addEventListener('DOMContentLoaded', () => {
  inicializarTema();
  initDisclaimer();
  initNav();
  initContact();
});

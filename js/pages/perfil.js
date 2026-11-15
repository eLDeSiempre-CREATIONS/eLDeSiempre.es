import { inicializarTema } from '../core/theme.js';
import { initNav } from '../ui/nav.js';
import { initDisclaimer } from '../ui/disclaimer.js';
import { requireSession } from '../auth/session.js';
import { initProfile } from '../profile/profile.js';

window.addEventListener('DOMContentLoaded', async () => {
  inicializarTema();
  initDisclaimer();
  await initNav();
  
  const usuario = await requireSession();
  if (usuario) {
    initProfile();
  }
});

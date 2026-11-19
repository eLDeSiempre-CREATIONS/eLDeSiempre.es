import { inicializarTema } from '../core/theme.js';
import { initNav } from '../ui/nav.js';
import { initDisclaimer } from '../ui/disclaimer.js';
import { requireSession } from '../auth/session.js';
import { initProfile } from '../profile/profile.js';
import { mostrarToast } from '../core/toast.js';

window.addEventListener('DOMContentLoaded', async () => {
  inicializarTema();
  initDisclaimer();
  await initNav();
  
  try {
    const usuario = await requireSession();
    
    if (usuario) {
      const curtain = document.getElementById('curtain');
      if (curtain) curtain.style.display = 'none';
      document.body.classList.remove('locked');
      initProfile();
    }
  } catch (error) {
    mostrarToast("Debes iniciar sesión para acceder a tu perfil.", "error");
    const curtain = document.getElementById('curtain');
    if (curtain) curtain.innerHTML = "&gt; Acceso Denegado. Redirigiendo...";
    setTimeout(() => { window.location.href = 'login.html'; }, 1500);
  }
});

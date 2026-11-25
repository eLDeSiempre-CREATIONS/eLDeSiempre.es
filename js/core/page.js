import { mountLayout, loadToolModals } from '../ui/layout/index.js';
import { inicializarTema } from './theme.js';
import { initDisclaimer } from '../ui/disclaimer.js';
import { initNav } from '../ui/nav.js';
import { initGlobalSearch } from '../ui/search.js';
import { comprobarSesion } from '../auth/session.js';
import { mostrarToast } from './toast.js';
import { syncBodyLock } from './modal.js';
import { initAllTools } from '../tools/index.js';

export function hideCurtain() {
  const curtain = document.getElementById('curtain');
  if (curtain) curtain.hidden = true;
  syncBodyLock();
}

export function showCurtain(message = 'Verificando sesión...') {
  const curtain = document.getElementById('curtain');
  if (!curtain) return;
  curtain.textContent = `> ${message}`;
  curtain.hidden = false;
  syncBodyLock();
}

export async function initPage({
  page,
  requireAuth = false,
  tools = false,
  manualCurtain = false,
  onReady = null,
} = {}) {
  const { route } = mountLayout({ page });

  inicializarTema();
  initDisclaimer();
  await initNav();
  initGlobalSearch();

  if (tools) {
    const mounted = await loadToolModals();
    if (mounted) initAllTools();
  }

  if (requireAuth) {
    const usuario = await comprobarSesion();
    if (!usuario) {
      showCurtain('Acceso denegado. Redirigiendo al login...');
      mostrarToast('Debes iniciar sesión para acceder.', 'error');
      const returnTo = `${window.location.pathname}${window.location.search}`;
      setTimeout(() => {
        window.location.href = `login.html?redirect=${encodeURIComponent(returnTo)}`;
      }, 1500);
      return null;
    }
  }

  if (!manualCurtain) hideCurtain();

  if (typeof onReady === 'function') {
    try {
      await onReady({ route });
    } catch (error) {
      console.error(error);
      mostrarToast('No se pudo inicializar esta página.', 'error');
    }
  }

  return route;
}

import { CONFIG } from '../core/config.js';
import { http } from '../core/http.js';
import { getState, setState, resetSession } from '../core/state.js';
import { mostrarToast } from '../core/toast.js';
import { $, hide, show } from '../core/dom.js';

let _inflight = null;

export async function comprobarSesion({ force = false } = {}) {
  const st = getState();
  const fresh = st.sessionChecked && (Date.now() - st.sessionCheckedAt < CONFIG.SESSION_CACHE_MS);
  
  if (fresh && !force) return st.usuario;
  if (_inflight && !force) return _inflight;

  _inflight = (async () => {
    try {
      const result = await http.get(CONFIG.ENDPOINTS.comprobarSesion);
      const usuario = result.logueado ? result : null;
      setState({ usuario, sessionChecked: true, sessionCheckedAt: Date.now() });
      return usuario;
    } catch {
      setState({ usuario: null, sessionChecked: true, sessionCheckedAt: Date.now() });
      return null;
    } finally {
      _inflight = null;
    }
  })();

  return _inflight;
}

export async function cerrarSesion() {
  try {
    await http.get(CONFIG.ENDPOINTS.logout);
  } catch {}
  resetSession();
  window.location.href = 'index.html';
}

export function renderNavAuth(usuario) {
  const btnLogin  = $('#nav-login-btn');
  const btnLogout = $('#nav-logout-btn');
  const btnPerfil = $('#nav-perfil-btn');

  if (usuario) {
    hide(btnLogin);
    show(btnLogout);
    show(btnPerfil);
  } else {
    show(btnLogin);
    hide(btnLogout);
    hide(btnPerfil);
  }
}

export async function requireSession(redirectTo = 'login.html') {
  const usuario = await comprobarSesion();
  if (!usuario) {
    mostrarToast('Debes iniciar sesión para acceder.', 'error');
    setTimeout(() => { window.location.href = redirectTo; }, 1000);
    return null;
  }
  return usuario;
}

export function comprobarAcceso(url) {
  const st = getState();
  if (st.usuario) {
    window.location.href = url;
  } else {
    mostrarToast('Debes iniciar sesión para acceder.', 'error');
    setTimeout(() => { window.location.href = 'login.html'; }, 1500);
  }
}

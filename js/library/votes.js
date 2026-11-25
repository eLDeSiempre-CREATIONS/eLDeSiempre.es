import { CONFIG } from '../core/config.js';
import { http } from '../core/http.js';
import { getState } from '../core/state.js';
import { mostrarToast } from '../core/toast.js';

export async function votarRecurso(id, btn) {
  const st = getState();
  if (!st.usuario) {
    mostrarToast('Inicia sesión para votar.', 'error');
    return;
  }
  if (!btn) return;

  btn.disabled = true;
  try {
    const result = await http.post(CONFIG.ENDPOINTS.votar, { recurso_id: id });
    if (result.success) {
      btn.classList.toggle('votado', Boolean(result.votado));
      const span = btn.querySelector('span');
      if (span) span.textContent = String(result.votos ?? 0);
      btn.setAttribute('aria-pressed', result.votado ? 'true' : 'false');
    } else {
      mostrarToast(result.message || 'No se pudo votar.', 'error');
    }
  } catch {
    mostrarToast('Error al votar.', 'error');
  } finally {
    btn.disabled = false;
  }
}

export function initVotes() {
  document.addEventListener('click', (e) => {
    const btn = e.target instanceof Element ? e.target.closest('[data-vote-id]') : null;
    if (!btn) return;
    e.preventDefault();
    const id = Number(btn.getAttribute('data-vote-id'));
    if (!Number.isInteger(id) || id <= 0) return;
    votarRecurso(id, btn);
  });
}

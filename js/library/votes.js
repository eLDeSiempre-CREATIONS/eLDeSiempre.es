import { CONFIG } from '../core/config.js';
import { http } from '../core/http.js';
import { getState } from '../core/state.js';
import { mostrarToast } from '../core/toast.js';

export async function votarRecurso(id, btn) {
  const st = getState();
  if (!st.usuario) {
    mostrarToast("Inicia sesión para votar.", "error");
    return;
  }
  try {
    const result = await http.post(CONFIG.ENDPOINTS.votar, { recurso_id: id });
    if (result.success) {
      if (result.votado) {
        btn.classList.add('votado');
      } else {
        btn.classList.remove('votado');
      }
      const span = btn.querySelector('span');
      if (span) span.innerText = result.votos;
    } else {
      mostrarToast(result.message, "error");
    }
  } catch (error) {
    mostrarToast("Error al votar.", "error");
  }
}

window.votarRecurso = votarRecurso;

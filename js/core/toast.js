import { CONFIG } from './config.js';

export function mostrarToast(mensaje, tipo = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;
  toast.setAttribute('role', tipo === 'error' ? 'alert' : 'status');
  toast.setAttribute('aria-live', tipo === 'error' ? 'assertive' : 'polite');
  toast.textContent = mensaje;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 200);
  }, CONFIG.TOAST_DURATION);
}

import { CONFIG } from './config.js';
import { $ } from './dom.js';

export function inicializarTema() {
  const guardado = localStorage.getItem(CONFIG.STORAGE_KEYS.theme);
  const body = document.body;
  const btn = $('#theme-toggle');

  if (guardado === 'light') body.classList.add('light-mode');
  if (!btn) return;

  const paint = () => {
    btn.innerText = body.classList.contains('light-mode') ? '☀️' : '🌙';
  };
  paint();

  btn.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const light = body.classList.contains('light-mode');
    localStorage.setItem(CONFIG.STORAGE_KEYS.theme, light ? 'light' : 'dark');
    paint();
  });
}

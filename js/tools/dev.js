import { $ } from '../core/dom.js';

export const formatearJSON = () => {
  const input = $('#json-input')?.value.trim() || '';
  const result = $('#json-result');
  if (!result || !input) return;
  try {
    result.textContent = JSON.stringify(JSON.parse(input), null, 2);
    result.style.color = 'var(--neon-green)';
  } catch {
    result.textContent = 'JSON inválido.';
    result.style.color = 'var(--danger)';
  }
};

export const probarRegex = () => {
  const pattern = $('#regex-pattern')?.value || '';
  const text = $('#regex-text')?.value || '';
  const result = $('#regex-result');
  if (!result || !pattern) return;
  try {
    const matches = new RegExp(pattern).test(text);
    result.textContent = matches ? '✅ Coincide.' : '❌ No coincide.';
    result.style.color = matches ? 'var(--neon-green)' : 'var(--neon-gold)';
  } catch {
    result.textContent = 'Expresión regular inválida.';
    result.style.color = 'var(--danger)';
  }
};

export const convertirFechaATimestamp = () => {
  const value = $('#ts-date-input')?.value;
  const result = $('#ts-result');
  if (!value || !result) return;
  result.textContent = `Unix: ${Math.floor(new Date(value).getTime() / 1000)}`;
  result.style.color = 'var(--neon-green)';
};

export const convertirTimestampAFecha = () => {
  const value = $('#ts-input')?.value;
  const result = $('#ts-result');
  if (!value || !result) return;
  result.textContent = `Fecha: ${new Date(Number(value) * 1000).toLocaleString('es-ES')}`;
  result.style.color = 'var(--neon-green)';
};

export const analizarUA = () => {
  const result = $('#ua-result');
  if (!result) return;
  const agent = navigator.userAgent;
  result.innerHTML = `<strong>User-Agent:</strong><br><span class="mono-break">${agent.replace(/[<>&"]/g, '')}</span>`;
  result.style.color = 'var(--text-main)';
};

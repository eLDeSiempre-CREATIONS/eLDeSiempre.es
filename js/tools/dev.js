import { $ } from '../core/dom.js';

export const formatearJSON = () => {
  const input = $('#json-input').value.trim();
  const result = $('#json-result');
  if (!input) return;
  try {
    result.textContent = JSON.stringify(JSON.parse(input), null, 2);
    result.style.color = 'var(--neon-green)';
  } catch {
    result.textContent = 'JSON Inválido.'; result.style.color = 'var(--danger)';
  }
};

export const probarRegex = () => {
  const pattern = $('#regex-pattern').value;
  const text = $('#regex-text').value;
  const result = $('#regex-result');
  if (!pattern) return;
  try {
    if (new RegExp(pattern).test(text)) { result.textContent = '✅ Coincide.'; result.style.color = 'var(--neon-green)'; }
    else { result.textContent = '❌ No coincide.'; result.style.color = 'var(--neon-gold)'; }
  } catch { result.textContent = 'Regex inválido.'; result.style.color = 'var(--danger)'; }
};

export const convertirFechaATimestamp = () => {
  const val = $('#ts-date-input').value;
  if (!val) return;
  $('#ts-result').textContent = `Unix: ${Math.floor(new Date(val).getTime() / 1000)}`;
  $('#ts-result').style.color = 'var(--neon-green)';
};

export const convertirTimestampAFecha = () => {
  const val = $('#ts-input').value;
  if (!val) return;
  $('#ts-result').textContent = `Fecha: ${new Date(val * 1000).toLocaleString()}`;
  $('#ts-result').style.color = 'var(--neon-green)';
};

export const analizarUA = () => {
  const result = $('#ua-result');
  result.innerHTML = `<strong>User Agent:</strong><br><span style="word-break: break-all; color: var(--neon-blue);">${navigator.userAgent}</span>`;
  result.style.color = 'var(--text-main)';
};

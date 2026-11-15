import { mostrarToast } from '../core/toast.js';
import { $ } from '../core/dom.js';
import { logHerramienta } from '../core/logger.js';

export function initDevTools() {
  window.formatearJSON = () => {
    const input = $('#json-input').value.trim();
    const result = $('#json-result');
    if (!input) return;

    try {
      const obj = JSON.parse(input);
      result.textContent = JSON.stringify(obj, null, 2);
      result.style.color = 'var(--neon-green)';
      logHerramienta('Formateador JSON', 'Formatear', 'Input', 'OK');
    } catch {
      result.textContent = 'JSON Inválido. Revisa la sintaxis.';
      result.style.color = 'var(--danger)';
    }
  };

  window.probarRegex = () => {
    const pattern = $('#regex-pattern').value;
    const text = $('#regex-text').value;
    const result = $('#regex-result');
    
    if (!pattern) return;

    try {
      const regex = new RegExp(pattern);
      if (regex.test(text)) {
        result.textContent = '✅ Coincidencia encontrada.';
        result.style.color = 'var(--neon-green)';
      } else {
        result.textContent = '❌ No hay coincidencias.';
        result.style.color = 'var(--neon-gold)';
      }
    } catch {
      result.textContent = 'Expresión regular inválida.';
      result.style.color = 'var(--danger)';
    }
  };

  window.convertirFechaATimestamp = () => {
    const val = $('#ts-date-input').value;
    if (!val) return;
    const ts = new Date(val).getTime() / 1000;
    const result = $('#ts-result');
    result.textContent = `Timestamp Unix: ${Math.floor(ts)}`;
    result.style.color = 'var(--neon-green)';
    logHerramienta('Conversor Timestamp', 'Fecha a TS', val, ts.toString());
  };

  window.convertirTimestampAFecha = () => {
    const val = $('#ts-input').value;
    if (!val) return;
    const date = new Date(val * 1000);
    const result = $('#ts-result');
    result.textContent = `Fecha local: ${date.toLocaleString()}`;
    result.style.color = 'var(--neon-green)';
    logHerramienta('Conversor Timestamp', 'TS a Fecha', val, date.toLocaleString());
  };

  window.analizarUA = () => {
    const result = $('#ua-result');
    result.innerHTML = `
      <strong>User Agent:</strong> <br><span style="word-break: break-all; color: var(--neon-blue);">${navigator.userAgent}</span><br><br>
      <strong>Plataforma:</strong> ${navigator.platform}<br>
      <strong>Idioma:</strong> ${navigator.language}
    `;
    result.style.color = 'var(--text-main)';
    logHerramienta('Analizador User-Agent', 'Ver', '', navigator.userAgent);
  };
}

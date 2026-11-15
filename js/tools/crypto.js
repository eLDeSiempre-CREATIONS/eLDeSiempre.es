import { mostrarToast } from '../core/toast.js';
import { $ } from '../core/dom.js';
import { logHerramienta } from '../core/logger.js';

export function initCrypto() {
  window.generarPassword = () => {
    const length = parseInt($('#slider-longitud').value);
    const mayus = $('#chk-mayus').checked;
    const minus = $('#chk-minus').checked;
    const nums = $('#chk-nums').checked;
    const syms = $('#chk-symbols').checked;
    const result = $('#resultado-password');

    let chars = '';
    if (mayus) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (minus) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (nums) chars += '0123456789';
    if (syms) chars += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (!chars) {
      result.innerHTML = 'Selecciona al menos un tipo de carácter.';
      result.style.color = 'var(--danger)';
      return;
    }

    let password = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      password += chars[array[i] % chars.length];
    }

    result.innerHTML = password;
    result.style.color = 'var(--neon-green)';
    logHerramienta('Generador de Contraseñas', 'Generar', length.toString(), '***');
  };

  window.limpiarPassword = () => {
    $('#resultado-password').innerHTML = '';
    logHerramienta('Generador de Contraseñas', 'Limpiar');
  };

  window.analizarHash = () => {
    const hash = $('#input-hash').value.trim();
    const result = $('#resultado-hash');
    if (!hash) return mostrarToast("Pega un hash", "error");

    let type = 'Desconocido';
    if (/^[a-f0-9]{32}$/i.test(hash)) type = 'MD5';
    else if (/^[a-f0-9]{40}$/i.test(hash)) type = 'SHA-1';
    else if (/^[a-f0-9]{64}$/i.test(hash)) type = 'SHA-256';
    else if (/^[a-f0-9]{128}$/i.test(hash)) type = 'SHA-512';

    result.innerHTML = `Algoritmo probable: <strong>${type}</strong>`;
    result.style.color = type !== 'Desconocido' ? 'var(--neon-green)' : 'var(--danger)';
    logHerramienta('Analizador de Hash', 'Analizar', hash.substring(0, 10) + '...', type);
  };

  window.limpiarHash = () => {
    $('#input-hash').value = '';
    $('#resultado-hash').innerHTML = '';
    logHerramienta('Analizador de Hash', 'Limpiar');
  };

  window.procesarBase64 = (accion) => {
    const input = $('#base64-input').value;
    const result = $('#base64-result');
    if (!input) return;

    try {
      if (accion === 'codificar') {
        result.textContent = btoa(input);
      } else {
        result.textContent = atob(input);
      }
      result.style.color = 'var(--neon-green)';
      logHerramienta('Base64', accion, input.substring(0, 20), result.textContent.substring(0, 20));
    } catch {
      result.textContent = 'Error: El texto no es válido para esta operación.';
      result.style.color = 'var(--danger)';
    }
  };

  window.analizarJWT = () => {
    const token = $('#jwt-input').value.trim();
    const result = $('#jwt-result');
    if (!token) return mostrarToast("Pega un token JWT", "error");

    const parts = token.split('.');
    if (parts.length !== 3) {
      result.textContent = 'El token no tiene el formato JWT correcto (Header.Payload.Signature).';
      result.style.color = 'var(--danger)';
      return;
    }

    try {
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      result.innerHTML = `<strong>Header:</strong><br><pre>${JSON.stringify(header, null, 2)}</pre><br><strong>Payload:</strong><br><pre>${JSON.stringify(payload, null, 2)}</pre>`;
      result.style.color = 'var(--neon-green)';
      logHerramienta('Analizador JWT', 'Analizar', token.substring(0, 15), 'Decodificado');
    } catch {
      result.textContent = 'Error al decodificar el token.';
      result.style.color = 'var(--danger)';
    }
  };

  window.generarUUID = () => {
    const uuid = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    const result = $('#uuid-result');
    result.textContent = uuid;
    result.style.color = 'var(--neon-green)';
    logHerramienta('Generador UUID', 'Generar', '', uuid);
  };

  window.auditarPassword = () => {
    const pass = $('#pass-audit-input').value;
    const result = $('#pass-audit-result');
    
    if (!pass) {
      result.innerHTML = '';
      return;
    }

    let score = 0;
    if (pass.length > 8) score++;
    if (pass.length > 12) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    let color = 'var(--danger)';
    let text = 'Muy débil';
    if (score >= 3) { color = 'var(--neon-gold)'; text = 'Aceptable'; }
    if (score >= 5) { color = 'var(--neon-green)'; text = 'Muy fuerte'; }

    result.innerHTML = `Seguridad: <strong style="color:${color}">${text}</strong> (${score}/5)`;
  };
}

import { mostrarToast } from '../core/toast.js';
import { $ } from '../core/dom.js';
import { logHerramienta } from '../core/logger.js';

function decodeBase64Url(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  if (pad) {
    base64 += '='.repeat(4 - pad);
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

function encodeUtf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decodeBase64ToUtf8(b64) {
  const binary = atob(b64.trim());
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export const generarPassword = () => {
  const length = parseInt($('#slider-longitud').value, 10);
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
    result.textContent = 'Selecciona al menos un tipo de carácter.';
    result.style.color = 'var(--danger)';
    return;
  }

  let password = '';
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    password += chars[array[i] % chars.length];
  }

  result.textContent = password;
  result.style.color = 'var(--neon-green)';
  logHerramienta('Generador de Contraseñas', 'Generar', String(length), '***');
};

export const limpiarPassword = () => {
  $('#resultado-password').textContent = '';
  logHerramienta('Generador de Contraseñas', 'Limpiar');
};

export const analizarHash = () => {
  const hash = $('#input-hash').value.trim();
  const result = $('#resultado-hash');
  if (!hash) return mostrarToast('Pega un hash', 'error');

  let type = 'Desconocido';
  if (/^[a-f0-9]{32}$/i.test(hash)) type = 'MD5';
  else if (/^[a-f0-9]{40}$/i.test(hash)) type = 'SHA-1';
  else if (/^[a-f0-9]{64}$/i.test(hash)) type = 'SHA-256';
  else if (/^[a-f0-9]{128}$/i.test(hash)) type = 'SHA-512';

  result.textContent = `Algoritmo probable: ${type}`;
  result.style.color = type !== 'Desconocido' ? 'var(--neon-green)' : 'var(--danger)';
  logHerramienta('Analizador de Hash', 'Analizar', hash.substring(0, 10) + '...', type);
};

export const limpiarHash = () => {
  $('#input-hash').value = '';
  $('#resultado-hash').textContent = '';
  logHerramienta('Analizador de Hash', 'Limpiar');
};

export const procesarBase64 = (accion) => {
  const input = $('#base64-input').value;
  const result = $('#base64-result');
  if (!input) return;

  try {
    if (accion === 'codificar') {
      result.textContent = encodeUtf8ToBase64(input);
    } else {
      result.textContent = decodeBase64ToUtf8(input);
    }
    result.style.color = 'var(--neon-green)';
    logHerramienta('Base64', accion, input.substring(0, 20), result.textContent.substring(0, 20));
  } catch {
    result.textContent = 'Error: El texto no es válido para esta operación.';
    result.style.color = 'var(--danger)';
  }
};

export const analizarJWT = () => {
  const token = $('#jwt-input').value.trim();
  const result = $('#jwt-result');
  if (!token) return mostrarToast('Pega un token JWT', 'error');

  const parts = token.split('.');
  if (parts.length !== 3) {
    result.textContent = 'El token no tiene el formato JWT correcto.';
    result.style.color = 'var(--danger)';
    return;
  }

  try {
    const header = JSON.stringify(JSON.parse(decodeBase64Url(parts[0])), null, 2);
    const payload = JSON.stringify(JSON.parse(decodeBase64Url(parts[1])), null, 2);
    result.innerHTML = '';
    const hTitle = document.createElement('strong');
    hTitle.textContent = 'Header:';
    const hPre = document.createElement('pre');
    hPre.textContent = header;
    const pTitle = document.createElement('strong');
    pTitle.textContent = 'Payload:';
    const pPre = document.createElement('pre');
    pPre.textContent = payload;
    result.append(hTitle, document.createElement('br'), hPre, document.createElement('br'), pTitle, document.createElement('br'), pPre);
    result.style.color = 'var(--neon-green)';
  } catch {
    result.textContent = 'Error al decodificar el token.';
    result.style.color = 'var(--danger)';
  }
};

export const generarUUID = () => {
  const uuid = crypto.randomUUID();
  const result = $('#uuid-result');
  result.textContent = uuid;
  result.style.color = 'var(--neon-green)';
};

export const auditarPassword = () => {
  const pass = $('#pass-audit-input').value;
  const result = $('#pass-audit-result');
  if (!pass) {
    result.textContent = '';
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
  if (score >= 3) {
    color = 'var(--neon-gold)';
    text = 'Aceptable';
  }
  if (score >= 5) {
    color = 'var(--neon-green)';
    text = 'Muy fuerte';
  }

  result.innerHTML = '';
  const span = document.createElement('span');
  span.textContent = 'Seguridad: ';
  const strong = document.createElement('strong');
  strong.style.color = color;
  strong.textContent = `${text} (${score}/5)`;
  result.append(span, strong);
};

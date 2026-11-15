import { mostrarToast } from '../core/toast.js';
import { $ } from '../core/dom.js';

export const analizarHeaders = async () => {
  const url = $('#header-url').value.trim();
  const result = $('#header-result');
  if (!url) return mostrarToast("Introduce una URL", "error");
  result.innerHTML = 'Analizando...';
  try {
    const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    result.innerHTML = `<strong>Estado:</strong> ${data.status.http_code}`;
    result.style.color = 'var(--neon-gold)';
  } catch { result.innerHTML = 'Error.'; result.style.color = 'var(--danger)'; }
};

export const analizarSSL = () => {
  const url = $('#ssl-url').value.trim();
  const result = $('#ssl-result');
  if (!url) return mostrarToast("Introduce una URL", "error");
  if (url.startsWith('https://')) { result.innerHTML = 'Usa HTTPS.'; result.style.color = 'var(--neon-green)'; }
  else { result.innerHTML = 'No usa HTTPS.'; result.style.color = 'var(--danger)'; }
};

export const analizarRobots = async () => {
  const url = $('#robots-url').value.trim();
  const result = $('#robots-result');
  if (!url) return mostrarToast("Introduce una URL", "error");
  let finalUrl = (url.startsWith('http') ? url : `https://${url}`).replace(/\/$/, '') + '/robots.txt';
  result.textContent = 'Buscando...';
  try {
    const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(finalUrl)}`);
    if (res.ok) { result.textContent = await res.text(); result.style.color = 'var(--neon-green)'; }
    else { result.textContent = 'No encontrado.'; result.style.color = 'var(--danger)'; }
  } catch { result.textContent = 'Error.'; result.style.color = 'var(--danger)'; }
};

export const analizarWifi = () => {
  const result = $('#wifi-result');
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!conn) { result.innerHTML = 'No soportado.'; result.style.color = 'var(--danger)'; return; }
  result.innerHTML = `<strong>Bajada:</strong> ${conn.downlink ? conn.downlink + ' Mbps' : '?'}<br><strong>Latencia:</strong> ${conn.rtt ? conn.rtt + ' ms' : '?'}`;
  result.style.color = 'var(--neon-green)';
};

export const analizarDNS = async () => {
  const result = $('#dns-result');
  result.innerHTML = 'Analizando...';
  try {
    const res = await fetch('https://ipwho.is/');
    const data = await res.json();
    result.innerHTML = `<strong>IP:</strong> ${data.ip}<br><strong>ISP:</strong> ${data.connection.isp}`;
    result.style.color = 'var(--neon-green)';
  } catch { result.innerHTML = 'Error.'; result.style.color = 'var(--danger)'; }
};

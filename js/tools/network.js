import { mostrarToast } from '../core/toast.js';
import { $ } from '../core/dom.js';

export const analizarHeaders = async () => {
  const url = $('#header-url')?.value.trim() || '';
  const result = $('#header-result');
  if (!result) return;
  if (!url) return mostrarToast('Introduce una URL', 'error');

  result.textContent = 'Analizando...';
  try {
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    const status = data?.status?.http_code;
    result.textContent = status ? `Estado HTTP: ${Number(status)}` : 'No se pudo obtener el estado.';
    result.style.color = status ? 'var(--neon-gold)' : 'var(--danger)';
  } catch {
    result.textContent = 'Error.';
    result.style.color = 'var(--danger)';
  }
};

export const analizarSSL = () => {
  const url = $('#ssl-url')?.value.trim() || '';
  const result = $('#ssl-result');
  if (!result) return;
  if (!url) return mostrarToast('Introduce una URL', 'error');

  if (url.toLowerCase().startsWith('https://')) {
    result.textContent = 'La URL usa HTTPS.';
    result.style.color = 'var(--neon-green)';
  } else {
    result.textContent = 'La URL no usa HTTPS.';
    result.style.color = 'var(--danger)';
  }
};

export const analizarRobots = async () => {
  const url = $('#robots-url')?.value.trim() || '';
  const result = $('#robots-result');
  if (!result) return;
  if (!url) return mostrarToast('Introduce una URL', 'error');

  const normalized = (url.startsWith('http') ? url : `https://${url}`).replace(/\/$/, '');
  result.textContent = 'Buscando...';
  try {
    const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(`${normalized}/robots.txt`)}`);
    if (response.ok) {
      result.textContent = await response.text();
      result.style.color = 'var(--neon-green)';
    } else {
      result.textContent = 'No encontrado.';
      result.style.color = 'var(--danger)';
    }
  } catch {
    result.textContent = 'Error.';
    result.style.color = 'var(--danger)';
  }
};

export const analizarWifi = () => {
  const result = $('#wifi-result');
  if (!result) return;

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!connection) {
    result.textContent = 'La API de red no está disponible en este navegador.';
    result.style.color = 'var(--danger)';
    return;
  }

  const downlink = connection.downlink ? `${connection.downlink} Mbps` : 'desconocido';
  const rtt = connection.rtt ? `${connection.rtt} ms` : 'desconocido';
  const tipo = connection.effectiveType || 'desconocido';
  result.textContent = `Bajada estimada: ${downlink}\nLatencia: ${rtt}\nTipo efectivo: ${tipo}`;
  result.style.color = 'var(--neon-green)';
};

export const analizarDNS = async () => {
  const result = $('#dns-result');
  if (!result) return;

  result.textContent = 'Analizando...';
  try {
    const response = await fetch('https://ipwho.is/');
    const data = await response.json();
    if (!data.success) throw new Error('Sin datos');
    result.textContent = `IP pública: ${data.ip}\nISP: ${data.connection?.isp || 'Desconocido'}`;
    result.style.color = 'var(--neon-green)';
  } catch {
    result.textContent = 'Error.';
    result.style.color = 'var(--danger)';
  }
};

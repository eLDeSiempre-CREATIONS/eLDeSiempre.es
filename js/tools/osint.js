import { mostrarToast } from '../core/toast.js';
import { $, escapeHTML } from '../core/dom.js';

export const generarDork = () => {
  const url = $('#dork-input')?.value.trim() || '';
  const type = $('#dork-type')?.value || 'pdf';
  const extra = $('#dork-extra')?.value || '';
  const result = $('#dork-result');
  if (!result) return;
  if (!url) return mostrarToast('Introduce un dominio', 'error');

  let query = `site:${url} filetype:${type}`;
  if (extra) query += ` ${extra}`;

  result.innerHTML = '';
  const link = document.createElement('a');
  link.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  link.target = '_blank';
  link.rel = 'noopener noreferrer nofollow';
  link.textContent = query;
  result.appendChild(link);
  result.style.color = 'var(--text-main)';
};

export const limpiarDorks = () => {
  const input = $('#dork-input');
  const result = $('#dork-result');
  if (input) input.value = '';
  if (result) result.textContent = '';
};

export const buscarIP = async () => {
  const ip = $('#ip-input')?.value.trim() || '';
  const result = $('#resultado-ip');
  if (!result) return;
  if (!ip) return mostrarToast('Introduce una IP', 'error');

  result.textContent = 'Analizando...';
  try {
    const response = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`);
    const data = await response.json();
    if (data.success) {
      result.innerHTML = `<strong>IP:</strong> ${escapeHTML(data.ip)}<br><strong>País:</strong> ${escapeHTML(data.country)}<br><strong>ISP:</strong> ${escapeHTML(data.connection?.isp || 'Desconocido')}`;
      result.style.color = 'var(--neon-green)';
    } else {
      result.textContent = 'IP no válida.';
      result.style.color = 'var(--danger)';
    }
  } catch {
    result.textContent = 'Error.';
    result.style.color = 'var(--danger)';
  }
};

export const limpiarIP = () => {
  const input = $('#ip-input');
  const result = $('#resultado-ip');
  if (input) input.value = '';
  if (result) result.textContent = '';
};

export const analizarDominio = async () => {
  const domain = $('#domain-input')?.value.trim() || '';
  const result = $('#domain-result');
  if (!result) return;
  if (!domain) return mostrarToast('Introduce un dominio', 'error');

  result.textContent = 'Analizando...';
  try {
    const response = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`);
    const data = await response.json();
    const addresses = Array.isArray(data.Answer) ? data.Answer.filter((answer) => answer.type === 1) : [];

    if (addresses.length) {
      result.innerHTML = `<strong>IPs:</strong><br>${addresses.map((answer) => `- ${escapeHTML(answer.data)}`).join('<br>')}`;
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

export const validarEmail = () => {
  const email = $('#email-input')?.value.trim() || '';
  const result = $('#email-result');
  if (!result) return;
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  result.textContent = valid ? 'Formato válido.' : 'Formato inválido.';
  result.style.color = valid ? 'var(--neon-green)' : 'var(--danger)';
};

export const analizarMAC = async () => {
  const mac = $('#mac-input')?.value.trim() || '';
  const result = $('#mac-result');
  if (!result) return;
  if (!mac) return mostrarToast('Introduce una MAC', 'error');

  result.textContent = 'Buscando...';
  try {
    const response = await fetch(`https://api.macvendors.com/${encodeURIComponent(mac)}`);
    if (response.ok) {
      const vendor = await response.text();
      result.textContent = `Fabricante: ${vendor}`;
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

import { mostrarToast } from '../core/toast.js';
import { $ } from '../core/dom.js';
import { logHerramienta } from '../core/logger.js';

export const generarDork = () => {
  const url = $('#dork-input').value.trim();
  const type = $('#dork-type').value;
  const extra = $('#dork-extra').value;
  const result = $('#dork-result');
  if (!url) return mostrarToast("Introduce un dominio", "error");
  let query = `site:${url} filetype:${type}`;
  if (extra) query += ` ${extra}`;
  result.innerHTML = `<a href="https://www.google.com/search?q=${encodeURIComponent(query)}" target="_blank" style="color:var(--neon-blue); text-decoration:underline;">${query}</a>`;
  result.style.color = 'var(--text-main)';
};

export const limpiarDorks = () => {
  $('#dork-input').value = '';
  $('#dork-result').innerHTML = '';
};

export const buscarIP = async () => {
  const ip = $('#ip-input').value.trim();
  const result = $('#resultado-ip');
  if (!ip) return mostrarToast("Introduce una IP", "error");
  result.innerHTML = 'Analizando...';
  try {
    const res = await fetch(`https://ipwho.is/${ip}`);
    const data = await res.json();
    if (data.success) {
      result.innerHTML = `<strong>IP:</strong> ${data.ip}<br><strong>País:</strong> ${data.country}<br><strong>ISP:</strong> ${data.connection.isp}`;
      result.style.color = 'var(--neon-green)';
    } else {
      result.innerHTML = 'IP no válida.'; result.style.color = 'var(--danger)';
    }
  } catch { result.innerHTML = 'Error.'; result.style.color = 'var(--danger)'; }
};

export const limpiarIP = () => {
  $('#ip-input').value = ''; $('#resultado-ip').innerHTML = '';
};

export const analizarDominio = async () => {
  const domain = $('#domain-input').value.trim();
  const result = $('#domain-result');
  if (!domain) return mostrarToast("Introduce un dominio", "error");
  result.innerHTML = 'Analizando...';
  try {
    const res = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
    const data = await res.json();
    if (data.Answer) {
      let html = '<strong>IPs:</strong><br>';
      data.Answer.forEach(a => { if (a.type === 1) html += `- ${a.data}<br>`; });
      result.innerHTML = html; result.style.color = 'var(--neon-green)';
    } else { result.innerHTML = 'No encontrado.'; result.style.color = 'var(--danger)'; }
  } catch { result.innerHTML = 'Error.'; result.style.color = 'var(--danger)'; }
};

export const validarEmail = () => {
  const email = $('#email-input').value.trim();
  const result = $('#email-result');
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (regex.test(email)) { result.innerHTML = 'Válido.'; result.style.color = 'var(--neon-green)'; }
  else { result.innerHTML = 'Inválido.'; result.style.color = 'var(--danger)'; }
};

export const analizarMAC = async () => {
  const mac = $('#mac-input').value.trim();
  const result = $('#mac-result');
  if (!mac) return mostrarToast("Introduce una MAC", "error");
  result.innerHTML = 'Buscando...';
  try {
    const res = await fetch(`https://api.macvendors.com/${mac}`);
    if (res.ok) { const vendor = await res.text(); result.innerHTML = `<strong>Fabricante:</strong> ${vendor}`; result.style.color = 'var(--neon-green)'; }
    else { result.innerHTML = 'No encontrado.'; result.style.color = 'var(--danger)'; }
  } catch { result.innerHTML = 'Error.'; result.style.color = 'var(--danger)'; }
};

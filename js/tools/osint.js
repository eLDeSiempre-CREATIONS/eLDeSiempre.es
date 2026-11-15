import { mostrarToast } from '../core/toast.js';
import { $ } from '../core/dom.js';
import { logHerramienta } from '../core/logger.js';

export function initOSINT() {
  window.generarDork = () => {
    const url = $('#dork-input').value.trim();
    const type = $('#dork-type').value;
    const extra = $('#dork-extra').value;
    const result = $('#dork-result');
    if (!url) return mostrarToast("Introduce un dominio", "error");

    let query = `site:${url} filetype:${type}`;
    if (extra) query += ` ${extra}`;

    result.innerHTML = `<a href="https://www.google.com/search?q=${encodeURIComponent(query)}" target="_blank" style="color:var(--neon-blue); text-decoration:underline;">${query}</a>`;
    result.style.color = 'var(--text-main)';
    logHerramienta('Generador de Dorks', 'Generar', url, query);
  };

  window.limpiarDorks = () => {
    $('#dork-input').value = '';
    $('#dork-result').innerHTML = '';
    logHerramienta('Generador de Dorks', 'Limpiar');
  };

  window.buscarIP = async () => {
    const ip = $('#ip-input').value.trim();
    const result = $('#resultado-ip');
    if (!ip) return mostrarToast("Introduce una IP", "error");

    result.innerHTML = 'Analizando...';
    result.style.color = 'var(--text-main)';

    try {
      const res = await fetch(`https://ipwho.is/${ip}`);
      const data = await res.json();
      if (data.success) {
        result.innerHTML = `
          <strong>IP:</strong> ${data.ip}<br>
          <strong>País:</strong> ${data.country} (${data.country_code})<br>
          <strong>Región:</strong> ${data.region}<br>
          <strong>Ciudad:</strong> ${data.city}<br>
          <strong>ISP:</strong> ${data.connection.isp}<br>
          <strong>Org:</strong> ${data.connection.org}
        `;
        result.style.color = 'var(--neon-green)';
        logHerramienta('Buscador de IP', 'Analizar', ip, JSON.stringify(data));
      } else {
        result.innerHTML = 'IP no válida o no encontrada.';
        result.style.color = 'var(--danger)';
      }
    } catch {
      result.innerHTML = 'Error de conexión.';
      result.style.color = 'var(--danger)';
    }
  };

  window.limpiarIP = () => {
    $('#ip-input').value = '';
    $('#resultado-ip').innerHTML = '';
    logHerramienta('Buscador de IP', 'Limpiar');
  };

  window.analizarDominio = async () => {
    const domain = $('#domain-input').value.trim();
    const result = $('#domain-result');
    if (!domain) return mostrarToast("Introduce un dominio", "error");

    result.innerHTML = 'Analizando...';
    result.style.color = 'var(--text-main)';

    try {
      const res = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
      const data = await res.json();
      if (data.Answer) {
        let html = '<strong>Direcciones IP:</strong><br>';
        data.Answer.forEach(a => { if (a.type === 1) html += `- ${a.data}<br>`; });
        result.innerHTML = html;
        result.style.color = 'var(--neon-green)';
        logHerramienta('Reconocimiento de Dominio', 'Analizar', domain, JSON.stringify(data.Answer));
      } else {
        result.innerHTML = 'No se encontraron registros A.';
        result.style.color = 'var(--danger)';
      }
    } catch {
      result.innerHTML = 'Error al analizar el dominio.';
      result.style.color = 'var(--danger)';
    }
  };

  window.validarEmail = () => {
    const email = $('#email-input').value.trim();
    const result = $('#email-result');
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (regex.test(email)) {
      result.innerHTML = 'El formato del correo es válido.';
      result.style.color = 'var(--neon-green)';
    } else {
      result.innerHTML = 'Formato de correo inválido.';
      result.style.color = 'var(--danger)';
    }
    logHerramienta('Validador de Correo', 'Validar', email, result.innerText);
  };

  window.analizarMAC = async () => {
    const mac = $('#mac-input').value.trim();
    const result = $('#mac-result');
    if (!mac) return mostrarToast("Introduce una MAC", "error");

    result.innerHTML = 'Buscando...';
    result.style.color = 'var(--text-main)';

    try {
      const res = await fetch(`https://api.macvendors.com/${mac}`);
      if (res.ok) {
        const vendor = await res.text();
        result.innerHTML = `<strong>Fabricante:</strong> ${vendor}`;
        result.style.color = 'var(--neon-green)';
        logHerramienta('Buscador de MAC', 'Analizar', mac, vendor);
      } else {
        result.innerHTML = 'Fabricante no encontrado.';
        result.style.color = 'var(--danger)';
      }
    } catch {
      result.innerHTML = 'Error de conexión.';
      result.style.color = 'var(--danger)';
    }
  };
}

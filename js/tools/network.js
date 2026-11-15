import { mostrarToast } from '../core/toast.js';
import { $ } from '../core/dom.js';
import { logHerramienta } from '../core/logger.js';

export function initNetwork() {
  window.analizarHeaders = async () => {
    const url = $('#header-url').value.trim();
    const result = $('#header-result');
    if (!url) return mostrarToast("Introduce una URL", "error");

    result.innerHTML = 'Analizando...';
    result.style.color = 'var(--text-main)';

    try {
      const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      
      result.innerHTML = `
        <strong>Estado:</strong> ${data.status.http_code}<br>
        <strong>Tipo de contenido:</strong> ${data.status.content_type}<br>
        <em>(No se pueden leer las cabeceras de seguridad directamente por CORS del navegador. Esta herramienta requiere un backend proxy dedicado para máxima precisión)</em>
      `;
      result.style.color = 'var(--neon-gold)';
      logHerramienta('Inspector Cabeceras', 'Analizar', url, '200');
    } catch {
      result.innerHTML = 'Error al conectar con la URL.';
      result.style.color = 'var(--danger)';
    }
  };

  window.analizarSSL = () => {
    const url = $('#ssl-url').value.trim();
    const result = $('#ssl-result');
    if (!url) return mostrarToast("Introduce una URL", "error");

    if (url.startsWith('https://')) {
      result.innerHTML = 'El sitio usa HTTPS. Para ver los detalles del certificado, abre las herramientas de desarrollador (F12) > Seguridad.';
      result.style.color = 'var(--neon-green)';
    } else {
      result.innerHTML = 'El sitio NO usa HTTPS o no has incluido el protocolo.';
      result.style.color = 'var(--danger)';
    }
  };

  window.analizarRobots = async () => {
    const url = $('#robots-url').value.trim();
    const result = $('#robots-result');
    if (!url) return mostrarToast("Introduce una URL", "error");

    let finalUrl = url.startsWith('http') ? url : `https://${url}`;
    finalUrl = finalUrl.replace(/\/$/, '') + '/robots.txt';

    result.textContent = 'Buscando...';
    result.style.color = 'var(--text-main)';

    try {
      const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(finalUrl)}`);
      if (res.ok) {
        const text = await res.text();
        result.textContent = text.substring(0, 2000);
        result.style.color = 'var(--neon-green)';
        logHerramienta('Analizador Robots.txt', 'Analizar', finalUrl, 'OK');
      } else {
        result.textContent = 'No se encontró robots.txt o no es accesible.';
        result.style.color = 'var(--danger)';
      }
    } catch {
      result.textContent = 'Error de conexión.';
      result.style.color = 'var(--danger)';
    }
  };

  window.analizarWifi = () => {
    const result = $('#wifi-result');
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (!connection) {
      result.innerHTML = 'Tu navegador no soporta el análisis de red.';
      result.style.color = 'var(--danger)';
      return;
    }

    result.innerHTML = `
      <strong>Tipo de conexión:</strong> ${connection.effectiveType || 'Desconocido'}<br>
      <strong>Velocidad de bajada:</strong> ${connection.downlink ? connection.downlink + ' Mbps' : 'Desconocida'}<br>
      <strong>Latencia (RTT):</strong> ${connection.rtt ? connection.rtt + ' ms' : 'Desconocida'}
    `;
    result.style.color = 'var(--neon-green)';
    logHerramienta('Analizador Wi-Fi', 'Analizar', 'Conexión', connection.effectiveType);
  };

  window.analizarDNS = async () => {
    const result = $('#dns-result');
    result.innerHTML = 'Analizando IP pública...';
    result.style.color = 'var(--text-main)';

    try {
      const res = await fetch('https://ipwho.is/');
      const data = await res.json();
      
      result.innerHTML = `
        <strong>IP Pública:</strong> ${data.ip}<br>
        <strong>ISP:</strong> ${data.connection.isp}<br>
        <em>Si estás usando una VPN, el ISP debería ser diferente al de tu proveedor de internet habitual.</em>
      `;
      result.style.color = 'var(--neon-green)';
    } catch {
      result.innerHTML = 'Error al obtener la IP.';
      result.style.color = 'var(--danger)';
    }
  };
}

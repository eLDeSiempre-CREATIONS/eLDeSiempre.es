import { $ } from '../core/dom.js';
import { mostrarToast } from '../core/toast.js';
import { logHerramienta } from '../core/logger.js';

const MAX_BYTES = 20 * 1024 * 1024;

function renderPre(result, text) {
  result.innerHTML = '';
  const pre = document.createElement('pre');
  pre.className = 'tool-pre';
  pre.textContent = text;
  result.appendChild(pre);
}

export const generarComandosRed = () => {
  const result = $('#iot-result');
  const select = $('#iot-os');
  if (!result) return;

  const detected = /win/i.test(navigator.userAgent) ? 'windows' : (/mac/i.test(navigator.userAgent) ? 'macos' : 'linux');
  const os = select?.value && select.value !== 'auto' ? select.value : detected;
  const commands = {
    linux: [
      'ip -brief addr',
      'ip route',
      'arp -a',
      'nmap -sn 192.168.1.0/24',
    ],
    windows: [
      'ipconfig /all',
      'route print',
      'arp -a',
      'nmap -sn 192.168.1.0/24',
    ],
    macos: [
      'ifconfig',
      'netstat -rn',
      'arp -a',
      'nmap -sn 192.168.1.0/24',
    ],
  };

  const selected = commands[os] || commands.linux;
  renderPre(result, `# Sistema detectado: ${os}\n# Ejecuta estos comandos en tu terminal local:\n\n${selected.join('\n')}`);
  result.style.color = 'var(--neon-green)';
  logHerramienta('Comandos de Red Local', 'Generar', os, selected.join(' | '));
};

export const analizarFirmware = async () => {
  const input = $('#firmware-input');
  const result = $('#firmware-result');
  const file = input?.files?.[0];
  if (!file || !result) return mostrarToast('Selecciona un archivo de firmware.', 'error');

  if (file.size > MAX_BYTES) {
    result.textContent = 'El archivo supera el límite de 20 MB.';
    result.style.color = 'var(--danger)';
    return;
  }

  result.textContent = 'Extrayendo cadenas...';
  result.style.color = 'var(--text-muted)';

  try {
    const buffer = await file.arrayBuffer();
    const text = new TextDecoder('latin1').decode(new Uint8Array(buffer));
    const matches = text.match(/[\x20-\x7E]{4,}/g) || [];
    const unique = [...new Set(matches.slice(0, 20000))];
    const urls = unique.filter((value) => /https?:\/\/|www\./i.test(value)).slice(0, 40);
    const emails = unique.filter((value) => /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(value)).slice(0, 20);
    const credentials = unique.filter((value) => /pass(word)?|secret|token|api[_-]?key|admin/i.test(value)).slice(0, 30);
    const preview = unique.slice(0, 120);

    result.innerHTML = '';
    const summary = document.createElement('p');
    summary.textContent = `Cadenas: ${matches.length} (mostrando ${unique.length}) · URLs: ${urls.length} · Correos: ${emails.length} · Posibles credenciales: ${credentials.length}`;
    result.appendChild(summary);

    const blocks = [
      ['URLs', urls],
      ['Correos', emails],
      ['Posibles credenciales', credentials],
      ['Primeras cadenas', preview],
    ];

    blocks.forEach(([title, values]) => {
      if (!values.length) return;
      const heading = document.createElement('h4');
      heading.textContent = title;
      result.appendChild(heading);
      const pre = document.createElement('pre');
      pre.className = 'tool-pre';
      pre.textContent = values.join('\n');
      result.appendChild(pre);
    });

    result.style.color = 'var(--neon-green)';
    logHerramienta('Analizador de Firmware', 'Analizar', file.name, `${unique.length} cadenas`);
  } catch {
    result.textContent = 'No se pudo leer el archivo.';
    result.style.color = 'var(--danger)';
  }
};

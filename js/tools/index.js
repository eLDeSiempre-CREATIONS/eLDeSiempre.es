import * as OSINT from './osint.js';
import * as Crypto from './crypto.js';
import * as Network from './network.js';
import * as Dev from './dev.js';
import * as Payloads from './payloads.js';
import * as IoT from './iot.js';
import { initExif } from './exif.js';

const actions = {
  generarDork: OSINT.generarDork,
  limpiarDorks: OSINT.limpiarDorks,
  buscarIP: OSINT.buscarIP,
  limpiarIP: OSINT.limpiarIP,
  analizarDominio: OSINT.analizarDominio,
  validarEmail: OSINT.validarEmail,
  analizarMAC: OSINT.analizarMAC,

  generarPassword: Crypto.generarPassword,
  limpiarPassword: Crypto.limpiarPassword,
  analizarHash: Crypto.analizarHash,
  limpiarHash: Crypto.limpiarHash,
  procesarBase64: Crypto.procesarBase64,
  analizarJWT: Crypto.analizarJWT,
  generarUUID: Crypto.generarUUID,
  auditarPassword: Crypto.auditarPassword,

  analizarHeaders: Network.analizarHeaders,
  analizarSSL: Network.analizarSSL,
  analizarRobots: Network.analizarRobots,
  analizarWifi: Network.analizarWifi,
  analizarDNS: Network.analizarDNS,

  formatearJSON: Dev.formatearJSON,
  probarRegex: Dev.probarRegex,
  convertirFechaATimestamp: Dev.convertirFechaATimestamp,
  convertirTimestampAFecha: Dev.convertirTimestampAFecha,
  analizarUA: Dev.analizarUA,

  generarPayload: Payloads.generarPayload,
  abrirCanarytoken: Payloads.abrirCanarytoken,
  buscarCVE: Payloads.buscarCVE,

  generarComandosRed: IoT.generarComandosRed,
  analizarFirmware: IoT.analizarFirmware,
};

let initialized = false;

function readArguments(element) {
  const raw = element.getAttribute('data-tool-args');
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [];
    }
  }
  const single = element.getAttribute('data-tool-arg');
  return single === null ? [] : [single];
}

function runAction(name, element) {
  const action = actions[name];
  if (typeof action !== 'function') {
    console.warn(`Acción de herramienta no registrada: ${name}`);
    return;
  }
  action(...readArguments(element));
}

export function initAllTools() {
  if (initialized) return;
  initialized = true;

  initExif();

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('[data-tool-action]') : null;
    if (!target) return;
    event.preventDefault();
    runAction(target.getAttribute('data-tool-action'), target);
  });

  document.addEventListener('input', (event) => {
    const target = event.target instanceof Element ? event.target.closest('[data-tool-input]') : null;
    if (target) runAction(target.getAttribute('data-tool-input'), target);

    const range = event.target instanceof Element ? event.target.closest('[data-range-output]') : null;
    if (range) {
      const output = document.getElementById(range.getAttribute('data-range-output'));
      if (output) output.textContent = range.value;
    }
  });

  document.addEventListener('modal:open', (event) => {
    const modal = document.getElementById(event.detail?.id || '');
    if (!modal) return;
    modal.querySelectorAll('[data-tool-onopen]').forEach((element) => {
      runAction(element.getAttribute('data-tool-onopen'), element);
    });
  });
}

export { actions as toolActions };

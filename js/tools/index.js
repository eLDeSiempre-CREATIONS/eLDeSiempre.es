import { delegate } from '../core/dom.js';
import * as OSINT from './osint.js';
import * as Crypto from './crypto.js';
import * as Network from './network.js';
import * as Dev from './dev.js';
import * as Payloads from './payloads.js';
import { initExif } from './exif.js';

export function initAllTools() {
  // 1. Inicializamos las que necesitan escuchar eventos (como EXIF)
  initExif();

  // 2. Mapeamos los nombres de las funciones a sus ejecuciones
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
    buscarCVE: Payloads.buscarCVE
  };

  // 3. Escuchamos clics en cualquier parte del documento
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button, a');
    if (!btn) return;

    // Extraemos el nombre de la función del atributo onclick (ej: "generarPassword()")
    const onclickAttr = btn.getAttribute('onclick');
    if (!onclickAttr) return;

    const match = onclickAttr.match(/^([a-zA-Z0-9_]+)\((.*)\)$/);
    if (match) {
      const funcName = match[1];
      const argsStr = match[2];

      if (actions[funcName]) {
        e.preventDefault(); // Evitamos que el navegador intente buscar la función en window
        
        // Evaluamos los argumentos si los hay (ej: 'codificar' o un evento)
        let args = [];
        if (argsStr) {
          try {
            // Convertimos 'codificar' en string, o (event) en el evento real
            args = argsStr.split(',').map(arg => {
               arg = arg.trim();
               if (arg === 'event') return e;
               if (arg.startsWith("'") || arg.startsWith('"')) return arg.slice(1, -1);
               return arg;
            });
          } catch (err) {}
        }
        
        // Ejecutamos la función real
        actions[funcName](...args);
      }
    }
  });
}

import { CONFIG } from './config.js';
import { http } from './http.js';

export function logHerramienta(herramienta, accion, input = "", output = "") {
  if (accion === 'Limpiar') return;
  
  http.post(CONFIG.ENDPOINTS.logHerramienta, {
    herramienta,
    accion,
    input: String(input).substring(0, 500),
    output: String(output).substring(0, 500)
  }).catch(() => console.log("Error log"));
}

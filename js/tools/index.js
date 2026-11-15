import { initOSINT } from './osint.js';
import { initCrypto } from './crypto.js';
import { initNetwork } from './network.js';
import { initDevTools } from './dev.js';
import { initPayloads } from './payloads.js';
import { initExif } from './exif.js';

export function initAllTools() {
  initOSINT();
  initCrypto();
  initNetwork();
  initDevTools();
  initPayloads();
  initExif();
}

import { $, escapeHTML } from '../core/dom.js';
import { logHerramienta } from '../core/logger.js';

export function initExif() {
  const input = $('#exif-input');
  const result = $('#exif-result');
  if (!input || !result) return;

  input.addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    result.textContent = 'Analizando imagen...';
    result.style.color = 'var(--text-main)';

    if (typeof EXIF === 'undefined') {
      result.textContent = 'La librería EXIF no está cargada.';
      result.style.color = 'var(--danger)';
      return;
    }

    EXIF.getData(file, function onData() {
      const metadata = EXIF.getAllTags(this);
      if (!metadata || Object.keys(metadata).length === 0) {
        result.textContent = 'No se encontraron metadatos EXIF en esta imagen.';
        result.style.color = 'var(--neon-gold)';
        return;
      }

      const lines = Object.entries(metadata)
        .filter(([key]) => key !== 'MakerNote' && key !== 'UserComment')
        .map(([key, value]) => `<strong>${escapeHTML(key)}:</strong> ${escapeHTML(String(value))}`)
        .join('<br>');

      result.innerHTML = lines;
      result.style.color = 'var(--neon-green)';
      logHerramienta('Analizador EXIF', 'Analizar', file.name, 'Metadatos extraídos');
    });
  });
}

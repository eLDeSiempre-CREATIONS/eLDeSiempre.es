import { $ } from '../core/dom.js';
import { mostrarToast } from '../core/toast.js';
import { logHerramienta } from '../core/logger.js';

export function initExif() {
  const input = $('#exif-input');
  const result = $('#exif-result');
  
  if (input) {
    input.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;

      result.innerHTML = 'Analizando imagen...';
      result.style.color = 'var(--text-main)';

      if (typeof EXIF === 'undefined') {
        result.innerHTML = 'La librería EXIF no está cargada.';
        result.style.color = 'var(--danger)';
        return;
      }

      EXIF.getData(file, function() {
        const allMetaData = EXIF.getAllTags(this);
        if (Object.keys(allMetaData).length === 0) {
          result.innerHTML = 'No se encontraron metadatos EXIF en esta imagen.';
          result.style.color = 'var(--neon-gold)';
          return;
        }

        let html = '';
        for (const [key, value] of Object.entries(allMetaData)) {
          if (key === 'MakerNote' || key === 'UserComment') continue;
          html += `<strong>${key}:</strong> ${value}<br>`;
        }
        result.innerHTML = html;
        result.style.color = 'var(--neon-green)';
        logHerramienta('Analizador EXIF', 'Analizar', file.name, 'Metadatos extraídos');
      });
    });
  }
}

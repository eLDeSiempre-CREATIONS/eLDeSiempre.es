import { $ } from '../core/dom.js';

export function renderHome(contenedor) {
  let html = `<h2>Biblioteca de Ciberseguridad</h2><p style="margin-bottom: 30px; color: var(--text-muted);">Elige qué quieres explorar hoy.</p>`;
  html += `
  <div class="folder-grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
      <a href="biblioteca.html?tipo=herramientas" class="folder" style="border-color: var(--neon-blue);">
          <div class="folder-icon" style="font-size: 3rem;">🛠️</div>
          <h3>Laboratorio de Herramientas</h3>
          <p>Utilidades interactivas y generadores para realizar análisis, pruebas y conversiones en tiempo real.</p>
          <span class="folder-badge" style="background: var(--neon-blue); color: var(--bg-color);">Abrir Laboratorio</span>
      </a>
      <a href="biblioteca.html?tipo=recursos" class="folder" style="border-color: var(--neon-green);">
          <div class="folder-icon" style="font-size: 3rem;">📚</div>
          <h3>Directorio de Recursos</h3>
          <p>Enlaces seleccionados a plataformas de formación, bibliografía, laboratorios y referentes del sector.</p>
          <span class="folder-badge" style="background: var(--neon-green); color: var(--bg-color);">Ver Directorio</span>
      </a>
      <a href="biblioteca.html?tipo=cve" class="folder" style="border-color: var(--neon-gold);">
          <div class="folder-icon" style="font-size: 3rem;">🚨</div>
          <h3>CVE en Tiempo Real</h3>
          <p>Últimas vulnerabilidades y publicaciones oficiales de seguridad actualizadas automáticamente.</p>
          <span class="folder-badge" style="background: var(--neon-gold); color: var(--bg-color);">Ver Alertas</span>
      </a>
  </div>`;
  contenedor.innerHTML = html;
}

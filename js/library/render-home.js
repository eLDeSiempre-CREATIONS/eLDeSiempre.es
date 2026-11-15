export function renderHome(contenedor) {
  let html = `<h2>Biblioteca de Ciberseguridad</h2><p style="margin-bottom: 30px; color: var(--text-muted);">Elige qué quieres explorar hoy.</p>`;
  html += `
  <div class="folder-grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
      <a href="biblioteca.html?tipo=recursos" class="folder" style="border-color: var(--neon-green);">
          <div class="folder-icon" style="font-size: 3rem;">📚</div>
          <h3>Directorio Unificado</h3>
          <p>Todo en un mismo lugar: recursos, plataformas, herramientas interactivas, libros y más.</p>
          <span class="folder-badge" style="background: var(--neon-green); color: var(--bg-color);">Explorar Directorio</span>
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

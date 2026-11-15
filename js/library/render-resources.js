import { CONFIG } from '../core/config.js';
import { http } from '../core/http.js';
import { estructuraRecursos } from '../data/resources-registry.js';
import { estructuraHerramientas } from '../data/tools-registry.js';
import { getBadgeClass } from '../core/badges.js';
import { votarRecurso } from './votes.js';

export function renderResourcesHome(contenedor) {
  let html = `<div class="breadcrumb"><a href="biblioteca.html">Biblioteca</a> / <span>Directorio</span></div>
              <h2>Directorio de Recursos y Herramientas</h2>
              <p style="margin-bottom: 20px; color: var(--text-muted);">Explora la mayor base de conocimiento de ciberseguridad en español.</p>
              <div class="folder-grid">`;
  
  for (const [slug, data] of Object.entries(estructuraRecursos)) {
      // Contar elementos (si es custom view, contamos las herramientas, si no, los ids)
      let count = 0;
      if (data.customView === 'tools') {
          count = estructuraHerramientas[data.catFilter]?.herramientas.length || 0;
      } else {
          count = data.ids.length;
      }
      
      const badgeText = count > 0 ? `${count} enlaces` : 'Nuevo';

      html += `
          <a href="biblioteca.html?tipo=recursos&cat=${slug}" class="folder">
              <div class="folder-icon">${data.icon}</div>
              <h3>${data.titulo}</h3>
              <p>${data.desc}</p>
              <span class="folder-badge">${badgeText}</span>
          </a>
      `;
  }
  html += `</div>`;
  contenedor.innerHTML = html;
}

export async function renderResourcesCategory(contenedor, categoriaActual) {
  const dataCat = estructuraRecursos[categoriaActual];
  if (!dataCat) { 
    contenedor.innerHTML = "<p>Categoría no encontrada.</p>"; 
    return; 
  }

  // Si la categoría es una vista de herramientas personalizada
  if (dataCat.customView === 'tools') {
    const toolCatData = estructuraHerramientas[dataCat.catFilter];
    if (!toolCatData) return;

    let html = `
        <div class="breadcrumb">
            <a href="biblioteca.html">Biblioteca</a> / <a href="biblioteca.html?tipo=recursos">Directorio</a> / <span>${dataCat.titulo}</span>
        </div>
        <div class="category-header">
            <h2>${dataCat.icon} ${dataCat.titulo}</h2>
            <p>${dataCat.desc}</p>
            <input type="text" id="buscador-herramientas" class="tool-input" placeholder="🔍 Buscar herramienta..." oninput="filtrarHerramientas()">
        </div>
        <div class="grid-cards" id="lista-herramientas">
    `;

    toolCatData.herramientas.forEach(h => {
        html += `
            <div class="card" data-titulo="${h.titulo.toLowerCase()}" onclick="abrirModal('modal-${h.id}')">
                <h3>${h.titulo}</h3>
                <p>${h.desc}</p>
                <p style="color: var(--neon-gold); font-size: 0.85rem; font-weight: bold; margin-top: auto;">Ideal para: ${h.ideal}</p>
            </div>
        `;
    });

    html += `</div>`;
    contenedor.innerHTML = html;

    window.filtrarHerramientas = () => {
      const input = document.getElementById('buscador-herramientas').value.toLowerCase();
      const items = document.querySelectorAll('#lista-herramientas .card');
      items.forEach(item => {
          const titulo = item.getAttribute('data-titulo');
          item.style.display = titulo.includes(input) ? 'flex' : 'none';
      });
    };
    return;
  }

  // Renderizado normal para recursos
  if (categoriaActual === 'flipperzero') {
    let html = `
        <div class="breadcrumb">
            <a href="biblioteca.html">Biblioteca</a> / <a href="biblioteca.html?tipo=recursos">Directorio</a> / <span>Flipper Zero</span>
        </div>
        <div class="category-header">
            <h2>🐬 Flipper Zero</h2>
            <p>Suite de herramientas BadUSB y scripts organizados para tu Flipper Zero.</p>
        </div>
        <div class="flipper-tree" style="font-family: monospace; background: var(--bg-color); padding: 20px; border-radius: 8px; border: 1px solid var(--border); color: var(--text-main); line-height: 1.8;">
            <div>📁 payload/</div>
            <div style="margin-left: 20px;">├── 📁 ascii/ <span style="color: var(--text-muted);">(ASCII art)</span></div>
            <div style="margin-left: 20px;">├── 📁 pranks-win/ <span style="color: var(--text-muted);">(Pranks Windows)</span></div>
            <div style="margin-left: 20px;">├── 📁 pranks-mac/ <span style="color: var(--text-muted);">(Pranks macOS)</span></div>
            <div style="margin-left: 20px;">├── 📁 goodusb-mac/ <span style="color: var(--text-muted);">(Utilidades macOS)</span></div>
            <div style="margin-left: 20px;">├── 📁 recon-local-mac/ <span style="color: var(--text-muted);">(Recon local macOS)</span></div>
            <div style="margin-left: 20px;">└── 📁 chromeos/ <span style="color: var(--text-muted);">(ChromeOS)</span></div>
        </div>
        <div style="margin-top: 20px; text-align: center;">
            <p style="color: var(--text-muted); font-size: 0.9rem;">Copia la carpeta <code>payload/</code> a la SD del Flipper (<code>BadUSB/</code>) y ejecuta los scripts desde el menú.</p>
        </div>
    `;
    contenedor.innerHTML = html;
    return;
  }

  contenedor.innerHTML = `<p style="text-align: center; color: var(--text-muted);">Cargando recursos...</p>`;

  try {
    const result = await http.get(CONFIG.ENDPOINTS.obtenerRecursos);
    
    if (result.success) {
      const recursosCat = result.data.filter(r => r.categoria_slug === categoriaActual);

      let html = `
          <div class="breadcrumb">
              <a href="biblioteca.html">Biblioteca</a> / <a href="biblioteca.html?tipo=recursos">Directorio</a> / <span>${dataCat.titulo}</span>
          </div>
          <div class="category-header">
              <h2>${dataCat.icon} ${dataCat.titulo}</h2>
              <p>${dataCat.desc}</p>
              <input type="text" id="buscador-recursos" class="tool-input" placeholder="🔍 Buscar en esta categoría..." oninput="filtrarRecursos()">
          </div>
          <ul class="resource-list" id="lista-recursos">
      `;

      recursosCat.forEach(r => {
          const badgeClass = getBadgeClass(r.tipo);
          const badge = r.tipo ? `<span class="badge ${badgeClass}">${r.tipo}</span>` : '';
          const userVoted = result.votos && result.votos.includes(r.id) ? 'votado' : '';
          html += `
              <li class="resource-item" data-titulo="${r.titulo.toLowerCase()}">
                  <div class="resource-header">
                      <span class="resource-title">${r.titulo}</span>
                      ${badge}
                  </div>
                  <div class="resource-desc">${r.descripcion}</div>
                  <div class="resource-meta">
                      <span class="resource-ideal">Ideal para: ${r.ideal_para || 'Aprender y practicar'}</span>
                  </div>
                  <div class="resource-actions">
                      <a href="${r.url}" target="_blank" rel="noopener noreferrer" class="btn-link">[Ir al recurso]</a>
                      <button class="btn-voto ${userVoted}" onclick="votarRecurso(${r.id}, this)">⭐ <span>${r.votos || 0}</span></button>
                  </div>
              </li>
          `;
      });

      if (recursosCat.length === 0) {
          html += `<li style="text-align:center; padding: 20px;">No hay recursos disponibles en esta categoría.</li>`;
      }

      html += `</ul>`;
      contenedor.innerHTML = html;

      window.filtrarRecursos = () => {
        const input = document.getElementById('buscador-recursos').value.toLowerCase();
        const items = document.querySelectorAll('#lista-recursos .resource-item');
        items.forEach(item => {
            const titulo = item.getAttribute('data-titulo');
            item.style.display = titulo.includes(input) ? 'flex' : 'none';
        });
      };
    }
  } catch (error) {
    contenedor.innerHTML = "<p style='color: var(--danger);'>Error al cargar los recursos. Asegúrate de tener sesión iniciada.</p>";
  }
}

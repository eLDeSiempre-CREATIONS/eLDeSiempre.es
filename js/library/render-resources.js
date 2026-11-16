import { CONFIG } from '../core/config.js';
import { http } from '../core/http.js';
import { estructuraRecursos } from '../data/resources-registry.js';
import { estructuraHerramientas } from '../data/tools-registry.js';
import { getBadgeClass } from '../core/badges.js';
import { votarRecurso } from './votes.js';

export function renderResourcesHome(contenedor) {
  let html = `
      <div class="terminal-container">
          <div class="terminal-header">
              <div class="terminal-dot dot-red"></div>
              <div class="terminal-dot dot-yellow"></div>
              <div class="terminal-dot dot-green"></div>
          </div>
          <div class="terminal-prompt">user@eldesiempre:~$ <span>ls -la ./directorio</span></div>
          <h2 style="border: none; margin-top: 20px;">Directorio de Recursos</h2>
          <p style="margin-bottom: 20px; color: var(--text-muted);">Explora la base de conocimiento. Selecciona una categoría:</p>
          
          <div class="folder-grid">
  `;
  
  for (const [slug, data] of Object.entries(estructuraRecursos)) {
      html += `
          <a href="biblioteca.html?tipo=recursos&cat=${slug}" class="folder">
              <div class="folder-icon">${data.icon}</div>
              <h3>${data.titulo}</h3>
              <p>${data.desc}</p>
              <span class="folder-badge">Explorar</span>
          </a>
      `;
  }
  html += `</div></div>`;
  contenedor.innerHTML = html;
}

export async function renderResourcesCategory(contenedor, categoriaActual) {
  const dataCat = estructuraRecursos[categoriaActual];
  if (!dataCat) { 
    contenedor.innerHTML = "<p>Categoría no encontrada.</p>"; 
    return; 
  }

  const urlParams = new URLSearchParams(window.location.search);
  const subcatActual = urlParams.get('subcat');

  let backUrl = 'biblioteca.html?tipo=recursos';
  let backText = 'cd ../directorio';
  if (subcatActual) {
    backUrl = `biblioteca.html?tipo=recursos&cat=${categoriaActual}`;
    backText = 'cd ..';
  }

  let html = `
      <button class="btn-back" onclick="window.location.href='${backUrl}'">
          <span>←</span> ${backText}
      </button>
      <div class="terminal-container">
          <div class="terminal-header">
              <div class="terminal-dot dot-red"></div>
              <div class="terminal-dot dot-yellow"></div>
              <div class="terminal-dot dot-green"></div>
          </div>
          <div class="terminal-prompt">root@eldesiempre:/biblioteca# <span>cat ${categoriaActual}.txt</span></div>
          <h2 style="border: none; margin-top: 20px;">${dataCat.icon} ${dataCat.titulo}</h2>
          <p style="margin-bottom: 20px; color: var(--text-muted);">${dataCat.desc}</p>
  `;

  if (!subcatActual) {
    html += `<p style="color: var(--neon-blue); margin-bottom: 10px;">Selecciona un subdirectorio:</p>`;
    html += `<ul class="dir-tree">`;
    dataCat.subcats.forEach(sub => {
      html += `
          <li class="dir-item">
              <a href="biblioteca.html?tipo=recursos&cat=${categoriaActual}&subcat=${sub.slug}" class="dir-link">
                  ${sub.titulo}/
              </a>
              <span class="dir-desc">${sub.desc}</span>
          </li>
      `;
    });
    html += `</ul></div>`;
    contenedor.innerHTML = html;
    return;
  }

  const subcatData = dataCat.subcats.find(s => s.slug === subcatActual);
  if (!subcatData) {
    contenedor.innerHTML = "<p>Subcategoría no encontrada.</p>";
    return;
  }

  html = `
      <button class="btn-back" onclick="window.location.href='${backUrl}'">
          <span>←</span> ${backText}
      </button>
      <div class="terminal-container">
          <div class="terminal-header">
              <div class="terminal-dot dot-red"></div>
              <div class="terminal-dot dot-yellow"></div>
              <div class="terminal-dot dot-green"></div>
          </div>
          <div class="terminal-prompt">root@eldesiempre:/biblioteca/${categoriaActual}# <span>ls ./${subcatActual}</span></div>
          <h2 style="border: none; margin-top: 20px;">${subcatData.icon} ${subcatData.titulo}</h2>
          <p style="margin-bottom: 20px; color: var(--text-muted);">${subcatData.desc}</p>
  `;

  if (subcatData.customView === 'tools') {
    const toolCatData = estructuraHerramientas[subcatData.catFilter];
    if (!toolCatData) return;

    html += `
        <input type="text" id="buscador-herramientas" class="tool-input" placeholder="grep 'herramienta'..." oninput="filtrarHerramientas()">
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
    html += `</div></div>`;
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

  if (subcatData.customView === 'flipper') {
    html += `
        <div class="flipper-tree" style="font-family: monospace; background: #000; padding: 20px; border-radius: 8px; border: 1px solid var(--border); color: var(--neon-green); line-height: 1.8;">
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
    </div>`;
    contenedor.innerHTML = html;
    return;
  }

  html += `<p style="text-align: center; color: var(--neon-green);">[+] Buscando recursos en la base de datos...</p></div>`;
  contenedor.innerHTML = html;

  try {
    const queryUrl = `${CONFIG.ENDPOINTS.obtenerRecursos}?slug=${subcatData.slug}`;
    const result = await http.get(queryUrl);
    
    if (result.success) {
      const recursosCat = result.data;

      let htmlRecursos = `
          <input type="text" id="buscador-recursos" class="tool-input" placeholder="grep 'recurso'..." oninput="filtrarRecursos()">
          <ul class="resource-list" id="lista-recursos">
      `;

      recursosCat.forEach(r => {
          const badgeClass = getBadgeClass(r.tipo);
          const badge = r.tipo ? `<span class="badge ${badgeClass}">${r.tipo}</span>` : '';
          const userVoted = result.votos && result.votos.includes(r.id) ? 'votado' : '';
          
          let pasoAPaso = r.paso_a_paso || `
            <h4>¿Cómo empezar?</h4>
            <ul>
              <li>Accede al enlace oficial haciendo clic en "Ir al recurso".</li>
              <li>Regístrate si es necesario para guardar tu progreso.</li>
              <li>Consulta la documentación o realiza los laboratorios disponibles.</li>
            </ul>
          `;

          htmlRecursos += `
              <li class="resource-item" data-titulo="${r.titulo.toLowerCase()}">
                  <div class="resource-header">
                      <span class="resource-title">&gt; ${r.titulo}</span>
                      ${badge}
                  </div>
                  <div class="resource-desc">${r.descripcion}</div>
                  
                  <div class="resource-details">
                      <p style="font-size: 0.85rem; color: var(--neon-gold);"><strong>Ideal para:</strong> ${r.ideal_para || 'Aprender y practicar'}</p>
                      ${pasoAPaso}
                  </div>

                  <div class="resource-actions">
                      <a href="${r.url}" target="_blank" rel="noopener noreferrer" class="btn-link">[Ir al recurso]</a>
                      <button class="btn-voto ${userVoted}" onclick="votarRecurso(${r.id}, this)">⭐ <span>${r.votos || 0}</span></button>
                  </div>
              </li>
          `;
      });

      if (recursosCat.length === 0) {
          htmlRecursos += `<li style="text-align:center; padding: 20px; color: var(--danger);">[!] No hay recursos en este directorio.</li>`;
      }

      htmlRecursos += `</ul>`;
      
      const terminalContainer = contenedor.querySelector('.terminal-container');
      if (terminalContainer) {
        terminalContainer.innerHTML += htmlRecursos;
      } else {
        contenedor.innerHTML += htmlRecursos;
      }

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
    contenedor.innerHTML += `<p style='color: var(--danger); text-align:center; padding: 20px;'>
      [!] Error al cargar los recursos: ${error.message}
    </p>`;
  }
}

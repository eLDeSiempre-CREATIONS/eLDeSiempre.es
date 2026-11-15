import { abrirModal, cerrarModal } from '../core/modal.js';
import { $, on } from '../core/dom.js';

export function initGlobalSearch() {
  const modal = $('#modal-global-search');
  if (!modal) return;

  on(document, 'keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      abrirModal('modal-global-search');
      $('#global-search-input').focus();
    }
  });

  const input = $('#global-search-input');
  if (input) {
    input.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const results = $('#global-search-results');
      
      if (query.length < 2) {
        results.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Escribe al menos 2 letras...</p>';
        return;
      }

      const index = [
        { title: 'Generador de Contraseñas', url: 'biblioteca.html?tipo=recursos&cat=utilidades-web', type: 'Herramienta' },
        { title: 'Buscador de IP / OSINT', url: 'biblioteca.html?tipo=recursos&cat=osint-tools', type: 'Herramienta' },
        { title: 'Analizador de Hash', url: 'biblioteca.html?tipo=recursos&cat=utilidades-web', type: 'Herramienta' },
        { title: 'Generador de Dorks', url: 'biblioteca.html?tipo=recursos&cat=utilidades-web', type: 'Herramienta' },
        { title: 'Introducción a la Ciberseguridad', url: 'guia.html?id=introduccion-ciberseguridad', type: 'Guía' },
        { title: '¿Qué es Internet?', url: 'guia.html?id=introduccion-internet', type: 'Guía' },
        { title: 'Supervivencia en Linux', url: 'guia.html?id=comandos-linux', type: 'Guía' },
        { title: 'El Modelo OSI', url: 'guia.html?id=modelo-osi-redes', type: 'Guía' },
        { title: 'Formación y Certificaciones', url: 'biblioteca.html?tipo=recursos&cat=formacion', type: 'Recurso' }
      ];

      const filtered = index.filter(item => item.title.toLowerCase().includes(query));

      if (filtered.length > 0) {
        results.innerHTML = filtered.map(item => `
          <a href="${item.url}" onclick="cerrarModal('modal-global-search')" style="display: block; padding: 10px; border-bottom: 1px solid var(--border); text-decoration: none;">
            <div style="color: var(--text-bright); font-weight: bold;">${item.title}</div>
            <div style="font-size: 0.8rem; color: var(--neon-blue);">${item.type}</div>
          </a>
        `).join('');
      } else {
        results.innerHTML = '<p style="color: var(--danger); text-align: center;">No se encontraron resultados.</p>';
      }
    });
  }
}

import { escapeHTML } from '../../core/dom.js';

function renderTree(segments) {
  return segments.map((item, index) => {
    const last = index === segments.length - 1;
    const label = `${escapeHTML(item.label)}${last ? '' : '/'}`;
    const content = last
      ? `<span class="terminal-tree-current" aria-current="location">${label}</span>`
      : `<a href="${escapeHTML(item.href)}">${label}</a>`;
    return `<li class="${last ? 'is-current' : ''}">${content}</li>`;
  }).join('');
}

export function renderTerminal(route) {
  const hasParent = Boolean(route.parent);
  const up = hasParent
    ? `<a class="btn-back btn-back--compact" id="btn-cd-up" href="${escapeHTML(route.parent)}">← cd ..</a>`
    : '<span class="btn-back btn-back--compact is-disabled" id="btn-cd-up" aria-disabled="true">← cd ..</span>';

  return `
    <nav class="terminal-nav" aria-label="Navegación terminal">
    <div class="terminal-nav-top">
      <span class="terminal-nav-dots" aria-hidden="true">
        <span class="terminal-dot dot-red"></span>
        <span class="terminal-dot dot-yellow"></span>
        <span class="terminal-dot dot-green"></span>
      </span>
      <span class="terminal-nav-prompt">root@eldesiempre:<span class="terminal-cwd" id="terminal-cwd">${escapeHTML(route.cwd)}</span># <span class="terminal-command" id="terminal-command">${escapeHTML(route.command)}</span></span>
      <span class="terminal-nav-actions">
        <a class="terminal-home" href="index.html" title="Volver al inicio (cd ~)">cd ~</a>
        ${up}
      </span>
    </div>
    <ol class="terminal-tree" id="terminal-tree" aria-label="Árbol de directorios">${renderTree(route.segments)}</ol>
    </nav>
  `;
}

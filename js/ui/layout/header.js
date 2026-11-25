import { NAV_ITEMS } from '../../data/navigation.js';

export function renderHeader() {
  const links = NAV_ITEMS.map((item) => (
    `<a class="nav-btn" href="${item.href}" data-nav="${item.id}" title="${item.description}">${item.label}</a>`
  )).join('');

  return `
    <a class="logo-container" href="index.html" aria-label="eLDeSiempre.es, ir al inicio">
      <img src="assets/logo.png" alt="" class="logo-img" width="30" height="30" data-logo>
      <span class="logo-text">eLDeSiempre<span>.es</span></span>
    </a>
    <nav class="site-nav" id="site-nav" aria-label="Navegación principal">
      ${links}
      <button class="nav-btn nav-icon-btn" id="nav-search-btn" type="button" aria-label="Buscar en el sitio (Ctrl+K)" title="Buscar (Ctrl+K)">🔍</button>
      <a class="nav-btn btn-login" id="nav-login-btn" href="login.html">Acceder</a>
      <a class="nav-btn" id="nav-perfil-btn" href="perfil.html" hidden>Mi Perfil</a>
      <button class="nav-btn" id="nav-logout-btn" type="button" hidden>Salir</button>
      <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Cambiar tema">🌙</button>
    </nav>
  `;
}

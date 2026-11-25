import { CONFIG } from '../core/config.js';
import { http } from '../core/http.js';
import { escapeHTML, safeUrl } from '../core/dom.js';
import { mostrarToast } from '../core/toast.js';
import { syncBodyLock } from '../core/modal.js';

const API_ADMIN = CONFIG.ENDPOINTS.admin;
let timeoutBusqueda = null;

function setCurtain(message) {
  const curtain = document.getElementById('curtain');
  if (curtain) curtain.textContent = `> ${message}`;
}

function showAdmin() {
  const curtain = document.getElementById('curtain');
  const main = document.getElementById('admin-main');
  if (curtain) curtain.hidden = true;
  if (main) main.hidden = false;
  syncBodyLock();
}

async function comprobarAdmin() {
  try {
    await http.get(`${API_ADMIN}?action=obtener_categorias`);
    return true;
  } catch (error) {
    setCurtain(`Acceso denegado: ${error.message}`);
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 3000);
    return false;
  }
}

async function obtenerCategorias() {
  const select = document.getElementById('rec-cat');
  if (!select) return;
  try {
    const result = await http.get(`${API_ADMIN}?action=obtener_categorias`);
    if (!result.success) return;
    select.innerHTML = '<option value="">Selecciona categoría...</option>';
    result.data.forEach((categoria) => {
      const option = document.createElement('option');
      option.value = categoria.id;
      option.textContent = `${categoria.parent_id ? '└── ' : ''}${categoria.icono || ''} ${categoria.nombre}`;
      select.appendChild(option);
    });
  } catch (error) {
    mostrarToast(error.message, 'error');
  }
}

async function cargarRecursos(search = '') {
  try {
    const result = await http.get(`${API_ADMIN}?action=obtener_recursos&search=${encodeURIComponent(search)}`);
    if (!result.success) return;

    const rows = result.data.map((recurso) => {
      const url = safeUrl(recurso.url);
      return `
        <tr>
          <td>${Number(recurso.id)}</td>
          <td>${escapeHTML(recurso.titulo)}</td>
          <td>${escapeHTML(recurso.categoria_nombre || '')}</td>
          <td>${url === '#' ? '—' : `<a href="${url}" target="_blank" rel="noopener noreferrer nofollow">Link</a>`}</td>
          <td>
            <button class="btn-secondary btn-compact btn-blue" type="button" data-admin-action="editar-recurso" data-id="${Number(recurso.id)}">Editar</button>
            <button class="btn-secondary btn-compact btn-danger" type="button" data-admin-action="eliminar-recurso" data-id="${Number(recurso.id)}">Borrar</button>
          </td>
        </tr>
      `;
    }).join('');

    const list = document.getElementById('lista-recursos');
    if (list) list.innerHTML = `<table class="admin-table"><thead><tr><th>ID</th><th>Título</th><th>Categoría</th><th>URL</th><th>Acciones</th></tr></thead><tbody>${rows}</tbody></table>`;
  } catch (error) {
    mostrarToast(error.message, 'error');
  }
}

async function cargarUsuarios() {
  try {
    const result = await http.get(`${API_ADMIN}?action=obtener_usuarios`);
    if (!result.success) return;

    const rows = result.data.map((usuario) => `
      <tr>
        <td>${Number(usuario.id)}</td>
        <td>@${escapeHTML(usuario.usuario)}</td>
        <td>${escapeHTML(usuario.correo)}</td>
        <td><span class="badge ${Number(usuario.es_admin) === 1 ? 'badge-curso' : 'badge-default'}">${Number(usuario.es_admin) === 1 ? 'SÍ' : 'NO'}</span></td>
        <td>
          <button class="btn-secondary btn-compact btn-gold" type="button" data-admin-action="toggle-admin" data-id="${Number(usuario.id)}">Toggle admin</button>
          <button class="btn-secondary btn-compact btn-danger" type="button" data-admin-action="eliminar-usuario" data-id="${Number(usuario.id)}">Borrar</button>
        </td>
      </tr>
    `).join('');

    const list = document.getElementById('lista-usuarios');
    if (list) list.innerHTML = `<table class="admin-table"><thead><tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Admin</th><th>Acciones</th></tr></thead><tbody>${rows}</tbody></table>`;
  } catch (error) {
    mostrarToast(error.message, 'error');
  }
}

async function cargarGuias() {
  try {
    const result = await http.get(`${API_ADMIN}?action=obtener_guias`);
    if (!result.success) return;

    const rows = result.data.map((guia) => `
      <tr>
        <td>${Number(guia.id)}</td>
        <td>${escapeHTML(guia.titulo)}</td>
        <td>${escapeHTML(guia.nivel)}</td>
        <td>${Number(guia.requiere_login) === 1 ? 'Sí' : 'No'}</td>
        <td>
          <button class="btn-secondary btn-compact btn-blue" type="button" data-admin-action="editar-guia" data-id="${Number(guia.id)}">Editar</button>
          <button class="btn-secondary btn-compact btn-danger" type="button" data-admin-action="eliminar-guia" data-id="${Number(guia.id)}">Borrar</button>
        </td>
      </tr>
    `).join('');

    const list = document.getElementById('lista-guias');
    if (list) list.innerHTML = `<table class="admin-table"><thead><tr><th>ID</th><th>Título</th><th>Nivel</th><th>Login</th><th>Acciones</th></tr></thead><tbody>${rows}</tbody></table>`;
  } catch (error) {
    mostrarToast(error.message, 'error');
  }
}

async function cargarLogs() {
  try {
    const result = await http.get(`${API_ADMIN}?action=obtener_logs`);
    if (!result.success) return;

    const rows = result.data.map((log) => `
      <tr>
        <td>${Number(log.id)}</td>
        <td>${Number(log.usuario_id) > 0 ? Number(log.usuario_id) : 'Anón'}</td>
        <td>${escapeHTML(log.ip)}</td>
        <td>${escapeHTML(log.herramienta)}</td>
        <td>${escapeHTML(String(log.input_data || '').slice(0, 40))}</td>
        <td>${escapeHTML(log.fecha)}</td>
      </tr>
    `).join('');

    const list = document.getElementById('lista-logs');
    if (list) list.innerHTML = `<table class="admin-table"><thead><tr><th>ID</th><th>Usuario</th><th>IP</th><th>Herramienta</th><th>Input</th><th>Fecha</th></tr></thead><tbody>${rows}</tbody></table>`;
  } catch (error) {
    mostrarToast(error.message, 'error');
  }
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach((button) => {
    const active = button.getAttribute('data-tab') === tabId;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  document.querySelectorAll('.tab-content').forEach((content) => {
    content.classList.toggle('active', content.id === `tab-${tabId}`);
  });
}

async function editarRecurso(id) {
  try {
    const result = await http.get(`${API_ADMIN}?action=obtener_recurso&id=${id}`);
    if (!result.success) return;
    const recurso = result.data;
    document.getElementById('rec-id').value = recurso.id;
    document.getElementById('rec-cat').value = recurso.categoria_id;
    document.getElementById('rec-titulo').value = recurso.titulo;
    document.getElementById('rec-url').value = recurso.url;
    document.getElementById('rec-desc').value = recurso.descripcion;
    document.getElementById('rec-tipo').value = recurso.tipo;
    document.getElementById('rec-ideal').value = recurso.ideal_para;
    document.getElementById('form-rec-titulo').textContent = 'Editar Recurso';
    document.getElementById('btn-guardar-rec').textContent = 'Actualizar Recurso';
    document.getElementById('btn-cancelar-rec').hidden = false;
    window.scrollTo(0, 0);
  } catch (error) {
    mostrarToast(error.message, 'error');
  }
}

function cancelarEdicionRecurso() {
  document.getElementById('form-recurso')?.reset();
  document.getElementById('rec-id').value = '';
  document.getElementById('form-rec-titulo').textContent = 'Añadir Nuevo Recurso';
  document.getElementById('btn-guardar-rec').textContent = 'Guardar Recurso';
  document.getElementById('btn-cancelar-rec').hidden = true;
}

async function editarGuia(id) {
  try {
    const result = await http.get(`${API_ADMIN}?action=obtener_guia&id=${id}`);
    if (!result.success) return;
    const guia = result.data;
    document.getElementById('guia-id').value = guia.id;
    document.getElementById('guia-slug').value = guia.slug;
    document.getElementById('guia-titulo').value = guia.titulo;
    document.getElementById('guia-nivel').value = guia.nivel;
    document.getElementById('guia-login').value = guia.requiere_login;
    document.getElementById('guia-contenido').value = guia.contenido;
    document.getElementById('form-guia-titulo').textContent = 'Editar Guía';
    document.getElementById('btn-guardar-guia').textContent = 'Actualizar Guía';
    document.getElementById('btn-cancelar-guia').hidden = false;
    window.scrollTo(0, 0);
  } catch (error) {
    mostrarToast(error.message, 'error');
  }
}

function cancelarEdicionGuia() {
  document.getElementById('form-guia')?.reset();
  document.getElementById('guia-id').value = '';
  document.getElementById('form-guia-titulo').textContent = 'Añadir Nueva Guía';
  document.getElementById('btn-guardar-guia').textContent = 'Guardar Guía';
  document.getElementById('btn-cancelar-guia').hidden = true;
}

async function guardarRecurso(event) {
  event.preventDefault();
  const id = document.getElementById('rec-id').value;
  const payload = {
    accion: id ? 'editar_recurso' : 'crear_recurso',
    id: id ? Number(id) : undefined,
    categoria_id: document.getElementById('rec-cat').value,
    titulo: document.getElementById('rec-titulo').value,
    url: document.getElementById('rec-url').value,
    descripcion: document.getElementById('rec-desc').value,
    tipo: document.getElementById('rec-tipo').value,
    ideal_para: document.getElementById('rec-ideal').value,
  };

  try {
    const result = await http.post(API_ADMIN, payload);
    if (result.success) {
      mostrarToast(id ? 'Recurso actualizado' : 'Recurso guardado', 'success');
      cancelarEdicionRecurso();
      cargarRecursos(document.getElementById('search-recursos')?.value || '');
    } else {
      mostrarToast(result.message, 'error');
    }
  } catch (error) {
    mostrarToast(error.message, 'error');
  }
}

async function guardarGuia(event) {
  event.preventDefault();
  const id = document.getElementById('guia-id').value;
  const payload = {
    accion: id ? 'editar_guia' : 'crear_guia',
    id: id ? Number(id) : undefined,
    slug: document.getElementById('guia-slug').value,
    titulo: document.getElementById('guia-titulo').value,
    nivel: document.getElementById('guia-nivel').value,
    requiere_login: document.getElementById('guia-login').value,
    contenido: document.getElementById('guia-contenido').value,
  };

  try {
    const result = await http.post(API_ADMIN, payload);
    if (result.success) {
      mostrarToast(id ? 'Guía actualizada' : 'Guía guardada', 'success');
      cancelarEdicionGuia();
      cargarGuias();
    } else {
      mostrarToast(result.message, 'error');
    }
  } catch (error) {
    mostrarToast(error.message, 'error');
  }
}

async function eliminarRecurso(id) {
  if (!confirm('¿Borrar recurso?')) return;
  try {
    await http.post(API_ADMIN, { accion: 'eliminar_recurso', id });
    cargarRecursos(document.getElementById('search-recursos')?.value || '');
  } catch (error) {
    mostrarToast(error.message, 'error');
  }
}

async function eliminarUsuario(id) {
  if (!confirm('¿Borrar usuario?')) return;
  try {
    await http.post(API_ADMIN, { accion: 'eliminar_usuario', id });
    cargarUsuarios();
  } catch (error) {
    mostrarToast(error.message, 'error');
  }
}

async function toggleAdmin(id) {
  try {
    await http.post(API_ADMIN, { accion: 'toggle_admin', id });
    cargarUsuarios();
  } catch (error) {
    mostrarToast(error.message, 'error');
  }
}

async function eliminarGuia(id) {
  if (!confirm('¿Borrar guía?')) return;
  try {
    await http.post(API_ADMIN, { accion: 'eliminar_guia', id });
    cargarGuias();
  } catch (error) {
    mostrarToast(error.message, 'error');
  }
}

function bindAdminActions() {
  const main = document.getElementById('admin-main');
  if (!main) return;

  main.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('[data-admin-action]') : null;
    if (!target) return;
    const action = target.getAttribute('data-admin-action');
    const id = Number(target.getAttribute('data-id'));

    if (action === 'editar-recurso') editarRecurso(id);
    else if (action === 'eliminar-recurso') eliminarRecurso(id);
    else if (action === 'editar-guia') editarGuia(id);
    else if (action === 'eliminar-guia') eliminarGuia(id);
    else if (action === 'eliminar-usuario') eliminarUsuario(id);
    else if (action === 'toggle-admin') toggleAdmin(id);
    else if (action === 'cancelar-recurso') cancelarEdicionRecurso();
    else if (action === 'cancelar-guia') cancelarEdicionGuia();
  });

  main.querySelectorAll('[data-tab]').forEach((button) => {
    button.addEventListener('click', () => switchTab(button.getAttribute('data-tab')));
  });
}

export async function initAdmin() {
  const admin = await comprobarAdmin();
  if (!admin) return;

  showAdmin();
  bindAdminActions();
  await obtenerCategorias();
  await Promise.all([cargarRecursos(), cargarUsuarios(), cargarGuias(), cargarLogs()]);

  document.getElementById('form-recurso')?.addEventListener('submit', guardarRecurso);
  document.getElementById('form-guia')?.addEventListener('submit', guardarGuia);

  const search = document.getElementById('search-recursos');
  if (search) {
    search.addEventListener('input', () => {
      clearTimeout(timeoutBusqueda);
      timeoutBusqueda = setTimeout(() => cargarRecursos(search.value), 400);
    });
  }
}

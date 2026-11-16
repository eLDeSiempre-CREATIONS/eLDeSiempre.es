import { CONFIG } from '../core/config.js';
import { http } from '../core/http.js';
import { $ } from '../core/dom.js';
import { mostrarToast } from '../core/toast.js';
import { comprobarSesion } from '../auth/session.js';

const API_ADMIN = `${CONFIG.API_URL}/admin_api.php`;

window.addEventListener('DOMContentLoaded', async () => {
  const usuario = await comprobarSesion();
  if (!usuario) { window.location.href = 'login.html'; return; }

  try {
    const res = await http.get(`${API_ADMIN}?action=obtener_categorias`);
    if (!res.success) throw new Error('No admin');
    
    document.getElementById('admin-curtain').style.display = 'none';
    document.getElementById('admin-main').style.display = 'block';
    
    cargarSelectCategorias(res.data);
    cargarRecursos();
    cargarUsuarios();
    cargarGuias();
    cargarLogs();
  } catch (error) {
    window.location.href = 'index.html';
  }
});

window.switchTab = (tabId) => {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector(`.tab-btn[onclick="switchTab('${tabId}')"]`).classList.add('active');
  document.getElementById(`tab-${tabId}`).classList.add('active');
};

function cargarSelectCategorias(cats) {
  const select = $('#rec-cat');
  select.innerHTML = '<option value="">Selecciona categoría...</option>';
  cats.forEach(c => {
    select.innerHTML += `<option value="${c.id}">${c.parent_id ? '└── ' : ''}${c.icono} ${c.nombre}</option>`;
  });
}

async function cargarRecursos() {
  const res = await http.get(`${API_ADMIN}?action=obtener_recursos`);
  let html = `<table class="admin-table"><tr><th>ID</th><th>Título</th><th>Categoría</th><th>URL</th><th>Acciones</th></tr>`;
  res.data.forEach(r => {
    html += `<tr><td>${r.id}</td><td>${r.titulo}</td><td>${r.categoria_nombre}</td><td><a href="${r.url}" target="_blank" style="color:var(--neon-blue)">Link</a></td>
    <td><button class="btn-secondary" style="padding:5px;color:var(--danger);border-color:var(--danger);" onclick="eliminarRecurso(${r.id})">Borrar</button></td></tr>`;
  });
  html += `</table>`;
  $('#lista-recursos').innerHTML = html;
}

async function cargarUsuarios() {
  const res = await http.get(`${API_ADMIN}?action=obtener_usuarios`);
  let html = `<table class="admin-table"><tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Admin</th><th>Acciones</th></tr>`;
  res.data.forEach(u => {
    html += `<tr><td>${u.id}</td><td>@${u.usuario}</td><td>${u.correo}</td>
    <td><span class="badge ${u.es_admin ? 'badge-curso' : 'badge-default'}">${u.es_admin ? 'SÍ' : 'NO'}</span></td>
    <td>
      <button class="btn-secondary" style="padding:5px;color:var(--neon-gold);border-color:var(--neon-gold);" onclick="toggleAdmin(${u.id})">Toggle Admin</button>
      <button class="btn-secondary" style="padding:5px;color:var(--danger);border-color:var(--danger);" onclick="eliminarUsuario(${u.id})">Borrar</button>
    </td></tr>`;
  });
  html += `</table>`;
  $('#lista-usuarios').innerHTML = html;
}

async function cargarGuias() {
  const res = await http.get(`${API_ADMIN}?action=obtener_guias`);
  let html = `<table class="admin-table"><tr><th>ID</th><th>Título</th><th>Nivel</th><th>Login</th><th>Acciones</th></tr>`;
  res.data.forEach(g => {
    html += `<tr><td>${g.id}</td><td>${g.titulo}</td><td>${g.nivel}</td><td>${g.requiere_login ? 'Sí' : 'No'}</td>
    <td><button class="btn-secondary" style="padding:5px;color:var(--danger);border-color:var(--danger);" onclick="eliminarGuia(${g.id})">Borrar</button></td></tr>`;
  });
  html += `</table>`;
  $('#lista-guias').innerHTML = html;
}

async function cargarLogs() {
  const res = await http.get(`${API_ADMIN}?action=obtener_logs`);
  let html = `<table class="admin-table"><tr><th>ID</th><th>User ID</th><th>IP</th><th>Herramienta</th><th>Input</th><th>Fecha</th></tr>`;
  res.data.forEach(l => {
    html += `<tr><td>${l.id}</td><td>${l.usuario_id || 'Anón'}</td><td>${l.ip}</td><td>${l.herramienta}</td><td>${l.input_data ? l.input_data.substring(0,20)+'...' : ''}</td><td>${l.fecha}</td></tr>`;
  });
  html += `</table>`;
  $('#lista-logs').innerHTML = html;
}

$('#form-recurso').addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    accion: 'crear_recurso',
    categoria_id: $('#rec-cat').value,
    titulo: $('#rec-titulo').value,
    url: $('#rec-url').value,
    descripcion: $('#rec-desc').value,
    tipo: $('#rec-tipo').value,
    ideal_para: $('#rec-ideal').value
  };
  const res = await http.post(API_ADMIN, payload);
  if(res.success) { mostrarToast('Recurso guardado', 'success'); e.target.reset(); cargarRecursos(); }
});

$('#form-guia').addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    accion: 'crear_guia',
    slug: $('#guia-slug').value,
    titulo: $('#guia-titulo').value,
    nivel: $('#guia-nivel').value,
    requiere_login: $('#guia-login').value,
    contenido: $('#guia-contenido').value
  };
  const res = await http.post(API_ADMIN, payload);
  if(res.success) { mostrarToast('Guía guardada', 'success'); e.target.reset(); cargarGuias(); }
});

window.eliminarRecurso = async (id) => { if(confirm('¿Borrar recurso?')) { await http.post(API_ADMIN, {accion:'eliminar_recurso', id}); cargarRecursos(); } };
window.eliminarUsuario = async (id) => { if(confirm('¿Borrar usuario?')) { await http.post(API_ADMIN, {accion:'eliminar_usuario', id}); cargarUsuarios(); } };
window.toggleAdmin = async (id) => { await http.post(API_ADMIN, {accion:'toggle_admin', id}); cargarUsuarios(); };
window.eliminarGuia = async (id) => { if(confirm('¿Borrar guía?')) { await http.post(API_ADMIN, {accion:'eliminar_guia', id}); cargarGuias(); } };

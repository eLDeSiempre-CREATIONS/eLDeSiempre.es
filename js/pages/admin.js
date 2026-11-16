import { CONFIG } from '../core/config.js';
import { http } from '../core/http.js';
import { $ } from '../core/dom.js';
import { mostrarToast } from '../core/toast.js';
import { comprobarSesion } from '../auth/session.js';

const API_ADMIN = `${CONFIG.API_URL}/admin_api.php`;
let timeoutBusqueda;

window.addEventListener('DOMContentLoaded', async () => {
  const curtain = document.getElementById('admin-curtain');
  try {
    const usuario = await comprobarSesion();
    if (!usuario) {
      curtain.innerHTML = "&gt; No hay sesión activa. Redirigiendo al login...";
      setTimeout(() => window.location.href = 'login.html', 1500);
      return;
    }
    const res = await http.get(`${API_ADMIN}?action=obtener_categorias`);
    if (!res.success) {
      curtain.innerHTML = `&gt; Acceso Denegado: ${res.message}`;
      setTimeout(() => window.location.href = 'index.html', 3000);
      return;
    }
    curtain.style.display = 'none';
    document.body.classList.remove('locked');
    document.getElementById('admin-main').style.display = 'block';
    
    cargarSelectCategorias(res.data);
    cargarRecursos();
    cargarUsuarios();
    cargarGuias();
    cargarLogs();
  } catch (error) {
    curtain.innerHTML = `&gt; Error de conexión: ${error.message}`;
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
  if (!select) return;
  select.innerHTML = '<option value="">Selecciona categoría...</option>';
  cats.forEach(c => {
    select.innerHTML += `<option value="${c.id}">${c.parent_id ? '└── ' : ''}${c.icono} ${c.nombre}</option>`;
  });
}

window.buscarRecursos = () => {
  clearTimeout(timeoutBusqueda);
  timeoutBusqueda = setTimeout(() => cargarRecursos($('#search-recursos').value), 500);
};

async function cargarRecursos(search = '') {
  const res = await http.get(`${API_ADMIN}?action=obtener_recursos&search=${encodeURIComponent(search)}`);
  if (!res.success) return;
  let html = `<table class="admin-table"><tr><th>ID</th><th>Título</th><th>Categoría</th><th>URL</th><th>Acciones</th></tr>`;
  res.data.forEach(r => {
    html += `<tr><td>${r.id}</td><td>${r.titulo}</td><td>${r.categoria_nombre}</td><td><a href="${r.url}" target="_blank" style="color:var(--neon-blue)">Link</a></td>
    <td>
      <button class="btn-secondary" style="padding:5px;color:var(--neon-blue);border-color:var(--neon-blue);" onclick="editarRecurso(${r.id})">Editar</button>
      <button class="btn-secondary" style="padding:5px;color:var(--danger);border-color:var(--danger);" onclick="eliminarRecurso(${r.id})">Borrar</button>
    </td></tr>`;
  });
  html += `</table>`;
  $('#lista-recursos').innerHTML = html;
}

window.editarRecurso = async (id) => {
  const res = await http.get(`${API_ADMIN}?action=obtener_recurso&id=${id}`);
  if(!res.success) return;
  const r = res.data;
  $('#rec-id').value = r.id;
  $('#rec-cat').value = r.categoria_id;
  $('#rec-titulo').value = r.titulo;
  $('#rec-url').value = r.url;
  $('#rec-desc').value = r.descripcion;
  $('#rec-tipo').value = r.tipo;
  $('#rec-ideal').value = r.ideal_para;
  $('#form-rec-titulo').innerText = "Editar Recurso";
  $('#btn-guardar-rec').innerText = "Actualizar Recurso";
  $('#btn-cancelar-rec').style.display = 'block';
  window.scrollTo(0, 0);
};

window.cancelarEdicionRecurso = () => {
  $('#form-recurso').reset();
  $('#rec-id').value = '';
  $('#form-rec-titulo').innerText = "Añadir Nuevo Recurso";
  $('#btn-guardar-rec').innerText = "Guardar Recurso";
  $('#btn-cancelar-rec').style.display = 'none';
};

$('#form-recurso').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = $('#rec-id').value;
  const payload = {
    accion: id ? 'editar_recurso' : 'crear_recurso',
    id: id ? parseInt(id) : undefined,
    categoria_id: $('#rec-cat').value,
    titulo: $('#rec-titulo').value,
    url: $('#rec-url').value,
    descripcion: $('#rec-desc').value,
    tipo: $('#rec-tipo').value,
    ideal_para: $('#rec-ideal').value
  };
  const res = await http.post(API_ADMIN, payload);
  if(res.success) { 
    mostrarToast(id ? 'Recurso actualizado' : 'Recurso guardado', 'success'); 
    cancelarEdicionRecurso(); 
    cargarRecursos($('#search-recursos').value); 
  }
});

async function cargarUsuarios() {
  const res = await http.get(`${API_ADMIN}?action=obtener_usuarios`);
  if (!res.success) return;
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
  if (!res.success) return;
  let html = `<table class="admin-table"><tr><th>ID</th><th>Título</th><th>Nivel</th><th>Login</th><th>Acciones</th></tr>`;
  res.data.forEach(g => {
    html += `<tr><td>${g.id}</td><td>${g.titulo}</td><td>${g.nivel}</td><td>${g.requiere_login ? 'Sí' : 'No'}</td>
    <td>
      <button class="btn-secondary" style="padding:5px;color:var(--neon-blue);border-color:var(--neon-blue);" onclick="editarGuia(${g.id})">Editar</button>
      <button class="btn-secondary" style="padding:5px;color:var(--danger);border-color:var(--danger);" onclick="eliminarGuia(${g.id})">Borrar</button>
    </td></tr>`;
  });
  html += `</table>`;
  $('#lista-guias').innerHTML = html;
}

window.editarGuia = async (id) => {
  const res = await http.get(`${API_ADMIN}?action=obtener_guia&id=${id}`);
  if(!res.success) return;
  const g = res.data;
  $('#guia-id').value = g.id;
  $('#guia-slug').value = g.slug;
  $('#guia-titulo').value = g.titulo;
  $('#guia-nivel').value = g.nivel;
  $('#guia-login').value = g.requiere_login;
  $('#guia-contenido').value = g.contenido;
  $('#form-guia-titulo').innerText = "Editar Guía";
  $('#btn-guardar-guia').innerText = "Actualizar Guía";
  $('#btn-cancelar-guia').style.display = 'block';
  window.scrollTo(0, 0);
};

window.cancelarEdicionGuia = () => {
  $('#form-guia').reset();
  $('#guia-id').value = '';
  $('#form-guia-titulo').innerText = "Añadir Nueva Guía";
  $('#btn-guardar-guia').innerText = "Guardar Guía";
  $('#btn-cancelar-guia').style.display = 'none';
};

$('#form-guia').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = $('#guia-id').value;
  const payload = {
    accion: id ? 'editar_guia' : 'crear_guia',
    id: id ? parseInt(id) : undefined,
    slug: $('#guia-slug').value,
    titulo: $('#guia-titulo').value,
    nivel: $('#guia-nivel').value,
    requiere_login: $('#guia-login').value,
    contenido: $('#guia-contenido').value
  };
  const res = await http.post(API_ADMIN, payload);
  if(res.success) { 
    mostrarToast(id ? 'Guía actualizada' : 'Guía guardada', 'success'); 
    cancelarEdicionGuia(); 
    cargarGuias(); 
  }
});

async function cargarLogs() {
  const res = await http.get(`${API_ADMIN}?action=obtener_logs`);
  if (!res.success) return;
  let html = `<table class="admin-table"><tr><th>ID</th><th>User ID</th><th>IP</th><th>Herramienta</th><th>Input</th><th>Fecha</th></tr>`;
  res.data.forEach(l => {
    html += `<tr><td>${l.id}</td><td>${l.usuario_id || 'Anón'}</td><td>${l.ip}</td><td>${l.herramienta}</td><td>${l.input_data ? l.input_data.substring(0,20)+'...' : ''}</td><td>${l.fecha}</td></tr>`;
  });
  html += `</table>`;
  $('#lista-logs').innerHTML = html;
}

window.eliminarRecurso = async (id) => { if(confirm('¿Borrar recurso?')) { await http.post(API_ADMIN, {accion:'eliminar_recurso', id}); cargarRecursos($('#search-recursos').value); } };
window.eliminarUsuario = async (id) => { if(confirm('¿Borrar usuario?')) { await http.post(API_ADMIN, {accion:'eliminar_usuario', id}); cargarUsuarios(); } };
window.toggleAdmin = async (id) => { await http.post(API_ADMIN, {accion:'toggle_admin', id}); cargarUsuarios(); };
window.eliminarGuia = async (id) => { if(confirm('¿Borrar guía?')) { await http.post(API_ADMIN, {accion:'eliminar_guia', id}); cargarGuias(); } };

const API_URL = 'https://api.eldesiempre.es';
const API_ADMIN = `${API_URL}/admin_api.php`;
let timeoutBusqueda;

function escapeText(val) {
  return String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeUrl(url) {
  try {
    const parsed = new URL(String(url ?? ''));
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href;
    }
  } catch {}
  return '#';
}

async function comprobarAdmin() {
  try {
    const response = await fetch(`${API_URL}/comprobar_sesion.php`, { method: 'GET', credentials: 'include' });
    const result = await response.json();

    if (!result.logueado) {
      document.getElementById('admin-curtain').innerHTML = '&gt; No hay sesión activa. Redirigiendo al login...';
      setTimeout(() => { window.location.href = 'login.html'; }, 1500);
      return null;
    }

    const adminCheck = await fetch(`${API_ADMIN}?action=obtener_categorias`, { credentials: 'include' });
    const adminResult = await adminCheck.json();

    if (!adminResult.success) {
      document.getElementById('admin-curtain').innerHTML = `&gt; Acceso Denegado: ${escapeText(adminResult.message)}`;
      setTimeout(() => { window.location.href = 'index.html'; }, 3000);
      return null;
    }

    return result;
  } catch (error) {
    document.getElementById('admin-curtain').innerHTML = `&gt; Error de conexión: ${escapeText(error.message)}`;
    return null;
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  const curtain = document.getElementById('admin-curtain');
  const usuario = await comprobarAdmin();

  if (!usuario) return;

  curtain.style.display = 'none';
  document.body.classList.remove('locked');
  document.getElementById('admin-main').style.display = 'block';

  cargarSelectCategorias();
  cargarRecursos();
  cargarUsuarios();
  cargarGuias();
  cargarLogs();
});

window.switchTab = (tabId) => {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  const activeBtn = document.querySelector(`.tab-btn[onclick="switchTab('${tabId}')"]`);
  const activeTab = document.getElementById(`tab-${tabId}`);
  if (activeBtn) activeBtn.classList.add('active');
  if (activeTab) activeTab.classList.add('active');
};

async function cargarSelectCategorias() {
  const select = document.getElementById('rec-cat');
  if (!select) return;
  try {
    const response = await fetch(`${API_ADMIN}?action=obtener_categorias`, { credentials: 'include' });
    const result = await response.json();
    if (result.success) {
      select.innerHTML = '<option value="">Selecciona categoría...</option>';
      result.data.forEach(c => {
        const id = parseInt(c.id, 10);
        const prefix = c.parent_id ? '└── ' : '';
        const label = `${prefix}${c.icono || ''} ${c.nombre}`;
        select.innerHTML += `<option value="${id}">${escapeText(label)}</option>`;
      });
    }
  } catch (e) { console.error(e); }
}

window.buscarRecursos = () => {
  clearTimeout(timeoutBusqueda);
  timeoutBusqueda = setTimeout(() => cargarRecursos(document.getElementById('search-recursos').value), 500);
};

async function cargarRecursos(search = '') {
  try {
    const response = await fetch(`${API_ADMIN}?action=obtener_recursos&search=${encodeURIComponent(search)}`, { credentials: 'include' });
    const result = await response.json();
    if (!result.success) return;

    let html = `<table class="admin-table"><tr><th>ID</th><th>Título</th><th>Categoría</th><th>URL</th><th>Acciones</th></tr>`;
    result.data.forEach(r => {
      const id = parseInt(r.id, 10);
      const href = safeUrl(r.url);
      html += `<tr><td>${id}</td><td>${escapeText(r.titulo)}</td><td>${escapeText(r.categoria_nombre || '')}</td><td><a href="${escapeText(href)}" target="_blank" rel="noopener noreferrer" style="color:var(--neon-blue)">Link</a></td>
      <td>
        <button class="btn-secondary" style="padding:5px;color:var(--neon-blue);border-color:var(--neon-blue);" onclick="editarRecurso(${id})">Editar</button>
        <button class="btn-secondary" style="padding:5px;color:var(--danger);border-color:var(--danger);" onclick="eliminarRecurso(${id})">Borrar</button>
      </td></tr>`;
    });
    html += `</table>`;
    document.getElementById('lista-recursos').innerHTML = html;
  } catch (e) { console.error(e); }
}

window.editarRecurso = async (id) => {
  try {
    const response = await fetch(`${API_ADMIN}?action=obtener_recurso&id=${encodeURIComponent(id)}`, { credentials: 'include' });
    const result = await response.json();
    if (!result.success || !result.data) return;
    const r = result.data;
    document.getElementById('rec-id').value = r.id;
    document.getElementById('rec-cat').value = r.categoria_id;
    document.getElementById('rec-titulo').value = r.titulo;
    document.getElementById('rec-url').value = r.url;
    document.getElementById('rec-desc').value = r.descripcion;
    document.getElementById('rec-tipo').value = r.tipo;
    document.getElementById('rec-ideal').value = r.ideal_para;
    document.getElementById('form-rec-titulo').innerText = 'Editar Recurso';
    document.getElementById('btn-guardar-rec').innerText = 'Actualizar Recurso';
    document.getElementById('btn-cancelar-rec').style.display = 'block';
    window.scrollTo(0, 0);
  } catch (e) { console.error(e); }
};

window.cancelarEdicionRecurso = () => {
  document.getElementById('form-recurso').reset();
  document.getElementById('rec-id').value = '';
  document.getElementById('form-rec-titulo').innerText = 'Añadir Nuevo Recurso';
  document.getElementById('btn-guardar-rec').innerText = 'Guardar Recurso';
  document.getElementById('btn-cancelar-rec').style.display = 'none';
};

document.getElementById('form-recurso')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('rec-id').value;
  const payload = {
    accion: id ? 'editar_recurso' : 'crear_recurso',
    id: id ? parseInt(id, 10) : undefined,
    categoria_id: parseInt(document.getElementById('rec-cat').value, 10),
    titulo: document.getElementById('rec-titulo').value,
    url: document.getElementById('rec-url').value,
    descripcion: document.getElementById('rec-desc').value,
    tipo: document.getElementById('rec-tipo').value,
    ideal_para: document.getElementById('rec-ideal').value
  };

  try {
    const response = await fetch(API_ADMIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include'
    });
    const result = await response.json();
    if (response.ok && result.success) {
      mostrarToast(id ? 'Recurso actualizado' : 'Recurso guardado', 'success');
      cancelarEdicionRecurso();
      cargarRecursos(document.getElementById('search-recursos').value);
    } else {
      mostrarToast(result.message || 'Error al guardar', 'error');
    }
  } catch (e) { mostrarToast('Error de conexión', 'error'); }
});

async function cargarUsuarios() {
  try {
    const response = await fetch(`${API_ADMIN}?action=obtener_usuarios`, { credentials: 'include' });
    const result = await response.json();
    if (!result.success) return;

    let html = `<table class="admin-table"><tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Admin</th><th>Acciones</th></tr>`;
    result.data.forEach(u => {
      const id = parseInt(u.id, 10);
      const isAdmin = Number(u.es_admin) === 1;
      html += `<tr><td>${id}</td><td>@${escapeText(u.usuario)}</td><td>${escapeText(u.correo)}</td>
      <td><span class="badge ${isAdmin ? 'badge-curso' : 'badge-default'}">${isAdmin ? 'SÍ' : 'NO'}</span></td>
      <td>
        <button class="btn-secondary" style="padding:5px;color:var(--neon-gold);border-color:var(--neon-gold);" onclick="toggleAdmin(${id})">Toggle Admin</button>
        <button class="btn-secondary" style="padding:5px;color:var(--danger);border-color:var(--danger);" onclick="eliminarUsuario(${id})">Borrar</button>
      </td></tr>`;
    });
    html += `</table>`;
    document.getElementById('lista-usuarios').innerHTML = html;
  } catch (e) { console.error(e); }
}

async function cargarGuias() {
  try {
    const response = await fetch(`${API_ADMIN}?action=obtener_guias`, { credentials: 'include' });
    const result = await response.json();
    if (!result.success) return;

    let html = `<table class="admin-table"><tr><th>ID</th><th>Título</th><th>Nivel</th><th>Login</th><th>Acciones</th></tr>`;
    result.data.forEach(g => {
      const id = parseInt(g.id, 10);
      html += `<tr><td>${id}</td><td>${escapeText(g.titulo)}</td><td>${escapeText(g.nivel)}</td><td>${Number(g.requiere_login) === 1 ? 'Sí' : 'No'}</td>
      <td>
        <button class="btn-secondary" style="padding:5px;color:var(--neon-blue);border-color:var(--neon-blue);" onclick="editarGuia(${id})">Editar</button>
        <button class="btn-secondary" style="padding:5px;color:var(--danger);border-color:var(--danger);" onclick="eliminarGuia(${id})">Borrar</button>
      </td></tr>`;
    });
    html += `</table>`;
    document.getElementById('lista-guias').innerHTML = html;
  } catch (e) { console.error(e); }
}

window.editarGuia = async (id) => {
  try {
    const response = await fetch(`${API_ADMIN}?action=obtener_guia&id=${encodeURIComponent(id)}`, { credentials: 'include' });
    const result = await response.json();
    if (!result.success || !result.data) return;
    const g = result.data;
    document.getElementById('guia-id').value = g.id;
    document.getElementById('guia-slug').value = g.slug;
    document.getElementById('guia-titulo').value = g.titulo;
    document.getElementById('guia-nivel').value = g.nivel;
    document.getElementById('guia-login').value = g.requiere_login;
    document.getElementById('guia-contenido').value = g.contenido;
    document.getElementById('form-guia-titulo').innerText = 'Editar Guía';
    document.getElementById('btn-guardar-guia').innerText = 'Actualizar Guía';
    document.getElementById('btn-cancelar-guia').style.display = 'block';
    window.scrollTo(0, 0);
  } catch (e) { console.error(e); }
};

window.cancelarEdicionGuia = () => {
  document.getElementById('form-guia').reset();
  document.getElementById('guia-id').value = '';
  document.getElementById('form-guia-titulo').innerText = 'Añadir Nueva Guía';
  document.getElementById('btn-guardar-guia').innerText = 'Guardar Guía';
  document.getElementById('btn-cancelar-guia').style.display = 'none';
};

document.getElementById('form-guia')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('guia-id').value;
  const payload = {
    accion: id ? 'editar_guia' : 'crear_guia',
    id: id ? parseInt(id, 10) : undefined,
    slug: document.getElementById('guia-slug').value,
    titulo: document.getElementById('guia-titulo').value,
    nivel: document.getElementById('guia-nivel').value,
    requiere_login: parseInt(document.getElementById('guia-login').value, 10),
    contenido: document.getElementById('guia-contenido').value
  };

  try {
    const response = await fetch(API_ADMIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include'
    });
    const result = await response.json();
    if (response.ok && result.success) {
      mostrarToast(id ? 'Guía actualizada' : 'Guía guardada', 'success');
      cancelarEdicionGuia();
      cargarGuias();
    } else {
      mostrarToast(result.message || 'Error al guardar', 'error');
    }
  } catch (e) { mostrarToast('Error de conexión', 'error'); }
});

async function cargarLogs() {
  try {
    const response = await fetch(`${API_ADMIN}?action=obtener_logs`, { credentials: 'include' });
    const result = await response.json();
    if (!result.success) return;

    let html = `<table class="admin-table"><tr><th>ID</th><th>User ID</th><th>IP</th><th>Herramienta</th><th>Input</th><th>Fecha</th></tr>`;
    result.data.forEach(l => {
      const id = parseInt(l.id, 10);
      const userId = l.usuario_id ? parseInt(l.usuario_id, 10) : 'Anón';
      const inputPreview = l.input_data ? String(l.input_data).substring(0, 20) + '...' : '';
      html += `<tr><td>${id}</td><td>${escapeText(userId)}</td><td>${escapeText(l.ip)}</td><td>${escapeText(l.herramienta)}</td><td>${escapeText(inputPreview)}</td><td>${escapeText(l.fecha)}</td></tr>`;
    });
    html += `</table>`;
    document.getElementById('lista-logs').innerHTML = html;
  } catch (e) { console.error(e); }
}

window.eliminarRecurso = async (id) => {
  if (!confirm('¿Borrar recurso?')) return;
  try {
    const res = await fetch(API_ADMIN, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accion: 'eliminar_recurso', id }), credentials: 'include' });
    const data = await res.json();
    if (res.ok && data.success) {
      mostrarToast('Recurso eliminado', 'success');
      cargarRecursos(document.getElementById('search-recursos').value);
    } else {
      mostrarToast(data.message || 'Error al borrar', 'error');
    }
  } catch (e) { mostrarToast('Error de conexión', 'error'); }
};

window.eliminarUsuario = async (id) => {
  if (!confirm('¿Borrar usuario?')) return;
  try {
    const res = await fetch(API_ADMIN, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accion: 'eliminar_usuario', id }), credentials: 'include' });
    const data = await res.json();
    if (res.ok && data.success) {
      mostrarToast('Usuario eliminado', 'success');
      cargarUsuarios();
    } else {
      mostrarToast(data.message || 'Error al borrar', 'error');
    }
  } catch (e) { mostrarToast('Error de conexión', 'error'); }
};

window.toggleAdmin = async (id) => {
  try {
    const res = await fetch(API_ADMIN, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accion: 'toggle_admin', id }), credentials: 'include' });
    const data = await res.json();
    if (res.ok && data.success) {
      mostrarToast('Permisos actualizados', 'success');
      cargarUsuarios();
    } else {
      mostrarToast(data.message || 'Error al actualizar permisos', 'error');
    }
  } catch (e) { mostrarToast('Error de conexión', 'error'); }
};

window.eliminarGuia = async (id) => {
  if (!confirm('¿Borrar guía?')) return;
  try {
    const res = await fetch(API_ADMIN, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accion: 'eliminar_guia', id }), credentials: 'include' });
    const data = await res.json();
    if (res.ok && data.success) {
      mostrarToast('Guía eliminada', 'success');
      cargarGuias();
    } else {
      mostrarToast(data.message || 'Error al borrar', 'error');
    }
  } catch (e) { mostrarToast('Error de conexión', 'error'); }
};

function mostrarToast(mensaje, tipo = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast ' + tipo;
  toast.textContent = mensaje;
  container.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 4000);
}

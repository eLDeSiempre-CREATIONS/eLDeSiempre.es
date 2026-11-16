const API_URL = 'https://api.eldesiempre.es';
const API_ADMIN = `${API_URL}/admin_api.php`;
let timeoutBusqueda;

async function comprobarAdmin() {
    try {
        const response = await fetch(`${API_URL}/comprobar_sesion.php`, { method: 'GET', credentials: 'include' });
        const result = await response.json();
        
        if (!result.logueado) {
            document.getElementById('admin-curtain').innerHTML = "&gt; No hay sesión activa. Redirigiendo al login...";
            setTimeout(() => window.location.href = 'login.html', 1500);
            return null;
        }
        
        const adminCheck = await fetch(`${API_ADMIN}?action=obtener_categorias`, { credentials: 'include' });
        const adminResult = await adminCheck.json();
        
        if (!adminResult.success) {
            document.getElementById('admin-curtain').innerHTML = `&gt; Acceso Denegado: ${adminResult.message}`;
            setTimeout(() => window.location.href = 'index.html', 3000);
            return null;
        }
        
        return result;
    } catch (error) {
        document.getElementById('admin-curtain').innerHTML = `&gt; Error de conexión: ${error.message}`;
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
    document.querySelector(`.tab-btn[onclick="switchTab('${tabId}')"]`).classList.add('active');
    document.getElementById(`tab-${tabId}`).classList.add('active');
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
                select.innerHTML += `<option value="${c.id}">${c.parent_id ? '└── ' : ''}${c.icono || ''} ${c.nombre}</option>`;
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
            html += `<tr><td>${r.id}</td><td>${r.titulo}</td><td>${r.categoria_nombre || ''}</td><td><a href="${r.url}" target="_blank" style="color:var(--neon-blue)">Link</a></td>
            <td>
                <button class="btn-secondary" style="padding:5px;color:var(--neon-blue);border-color:var(--neon-blue);" onclick="editarRecurso(${r.id})">Editar</button>
                <button class="btn-secondary" style="padding:5px;color:var(--danger);border-color:var(--danger);" onclick="eliminarRecurso(${r.id})">Borrar</button>
            </td></tr>`;
        });
        html += `</table>`;
        document.getElementById('lista-recursos').innerHTML = html;
    } catch (e) { console.error(e); }
}

window.editarRecurso = async (id) => {
    try {
        const response = await fetch(`${API_ADMIN}?action=obtener_recurso&id=${id}`, { credentials: 'include' });
        const result = await response.json();
        if (!result.success) return;
        const r = result.data;
        document.getElementById('rec-id').value = r.id;
        document.getElementById('rec-cat').value = r.categoria_id;
        document.getElementById('rec-titulo').value = r.titulo;
        document.getElementById('rec-url').value = r.url;
        document.getElementById('rec-desc').value = r.descripcion;
        document.getElementById('rec-tipo').value = r.tipo;
        document.getElementById('rec-ideal').value = r.ideal_para;
        document.getElementById('form-rec-titulo').innerText = "Editar Recurso";
        document.getElementById('btn-guardar-rec').innerText = "Actualizar Recurso";
        document.getElementById('btn-cancelar-rec').style.display = 'block';
        window.scrollTo(0, 0);
    } catch (e) { console.error(e); }
};

window.cancelarEdicionRecurso = () => {
    document.getElementById('form-recurso').reset();
    document.getElementById('rec-id').value = '';
    document.getElementById('form-rec-titulo').innerText = "Añadir Nuevo Recurso";
    document.getElementById('btn-guardar-rec').innerText = "Guardar Recurso";
    document.getElementById('btn-cancelar-rec').style.display = 'none';
};

document.getElementById('form-recurso')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('rec-id').value;
    const payload = {
        accion: id ? 'editar_recurso' : 'crear_recurso',
        id: id ? parseInt(id) : undefined,
        categoria_id: document.getElementById('rec-cat').value,
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
        if (result.success) {
            mostrarToast(id ? 'Recurso actualizado' : 'Recurso guardado', 'success');
            cancelarEdicionRecurso();
            cargarRecursos(document.getElementById('search-recursos').value);
        } else {
            mostrarToast(result.message, 'error');
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
            html += `<tr><td>${u.id}</td><td>@${u.usuario}</td><td>${u.correo}</td>
            <td><span class="badge ${u.es_admin ? 'badge-curso' : 'badge-default'}">${u.es_admin ? 'SÍ' : 'NO'}</span></td>
            <td>
                <button class="btn-secondary" style="padding:5px;color:var(--neon-gold);border-color:var(--neon-gold);" onclick="toggleAdmin(${u.id})">Toggle Admin</button>
                <button class="btn-secondary" style="padding:5px;color:var(--danger);border-color:var(--danger);" onclick="eliminarUsuario(${u.id})">Borrar</button>
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
            html += `<tr><td>${g.id}</td><td>${g.titulo}</td><td>${g.nivel}</td><td>${g.requiere_login ? 'Sí' : 'No'}</td>
            <td>
                <button class="btn-secondary" style="padding:5px;color:var(--neon-blue);border-color:var(--neon-blue);" onclick="editarGuia(${g.id})">Editar</button>
                <button class="btn-secondary" style="padding:5px;color:var(--danger);border-color:var(--danger);" onclick="eliminarGuia(${g.id})">Borrar</button>
            </td></tr>`;
        });
        html += `</table>`;
        document.getElementById('lista-guias').innerHTML = html;
    } catch (e) { console.error(e); }
}

window.editarGuia = async (id) => {
    try {
        const response = await fetch(`${API_ADMIN}?action=obtener_guia&id=${id}`, { credentials: 'include' });
        const result = await response.json();
        if (!result.success) return;
        const g = result.data;
        document.getElementById('guia-id').value = g.id;
        document.getElementById('guia-slug').value = g.slug;
        document.getElementById('guia-titulo').value = g.titulo;
        document.getElementById('guia-nivel').value = g.nivel;
        document.getElementById('guia-login').value = g.requiere_login;
        document.getElementById('guia-contenido').value = g.contenido;
        document.getElementById('form-guia-titulo').innerText = "Editar Guía";
        document.getElementById('btn-guardar-guia').innerText = "Actualizar Guía";
        document.getElementById('btn-cancelar-guia').style.display = 'block';
        window.scrollTo(0, 0);
    } catch (e) { console.error(e); }
};

window.cancelarEdicionGuia = () => {
    document.getElementById('form-guia').reset();
    document.getElementById('guia-id').value = '';
    document.getElementById('form-guia-titulo').innerText = "Añadir Nueva Guía";
    document.getElementById('btn-guardar-guia').innerText = "Guardar Guía";
    document.getElementById('btn-cancelar-guia').style.display = 'none';
};

document.getElementById('form-guia')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('guia-id').value;
    const payload = {
        accion: id ? 'editar_guia' : 'crear_guia',
        id: id ? parseInt(id) : undefined,
        slug: document.getElementById('guia-slug').value,
        titulo: document.getElementById('guia-titulo').value,
        nivel: document.getElementById('guia-nivel').value,
        requiere_login: document.getElementById('guia-login').value,
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
        if (result.success) {
            mostrarToast(id ? 'Guía actualizada' : 'Guía guardada', 'success');
            cancelarEdicionGuia();
            cargarGuias();
        } else {
            mostrarToast(result.message, 'error');
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
            html += `<tr><td>${l.id}</td><td>${l.usuario_id || 'Anón'}</td><td>${l.ip}</td><td>${l.herramienta}</td><td>${l.input_data ? l.input_data.substring(0, 20) + '...' : ''}</td><td>${l.fecha}</td></tr>`;
        });
        html += `</table>`;
        document.getElementById('lista-logs').innerHTML = html;
    } catch (e) { console.error(e); }
}

window.eliminarRecurso = async (id) => {
    if (!confirm('¿Borrar recurso?')) return;
    try {
        await fetch(API_ADMIN, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accion: 'eliminar_recurso', id }), credentials: 'include' });
        cargarRecursos(document.getElementById('search-recursos').value);
    } catch (e) { console.error(e); }
};

window.eliminarUsuario = async (id) => {
    if (!confirm('¿Borrar usuario?')) return;
    try {
        await fetch(API_ADMIN, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accion: 'eliminar_usuario', id }), credentials: 'include' });
        cargarUsuarios();
    } catch (e) { console.error(e); }
};

window.toggleAdmin = async (id) => {
    try {
        await fetch(API_ADMIN, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accion: 'toggle_admin', id }), credentials: 'include' });
        cargarUsuarios();
    } catch (e) { console.error(e); }
};

window.eliminarGuia = async (id) => {
    if (!confirm('¿Borrar guía?')) return;
    try {
        await fetch(API_ADMIN, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accion: 'eliminar_guia', id }), credentials: 'include' });
        cargarGuias();
    } catch (e) { console.error(e); }
};

function mostrarToast(mensaje, tipo = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast ' + tipo;
    toast.innerText = mensaje;
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 4000);
}

import { CONFIG } from '../core/config.js';
import { http } from '../core/http.js';
import { $ } from '../core/dom.js';
import { mostrarToast } from '../core/toast.js';
import { comprobarSesion } from '../auth/session.js';

window.addEventListener('DOMContentLoaded', async () => {
  const usuario = await comprobarSesion();
  if (!usuario) {
    window.location.href = 'login.html';
    return;
  }

  const API_ADMIN = `${CONFIG.API_URL}/admin_api.php`;

  // Cargar categorías
  try {
    const res = await http.get(`${API_ADMIN}?action=obtener_categorias`);
    const select = $('#admin-categoria');
    select.innerHTML = '<option value="">Selecciona una categoría...</option>';
    
    res.data.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = `${cat.parent_id ? '└── ' : ''}${cat.icono} ${cat.nombre}`;
      select.appendChild(option);
    });
  } catch (error) {
    mostrarToast("Error al cargar categorías. ¿Eres admin?", "error");
  }

  // Enviar formulario
  $('#form-admin').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
      accion: 'crear_recurso',
      categoria_id: $('#admin-categoria').value,
      titulo: $('#admin-titulo').value,
      url: $('#admin-url').value,
      descripcion: $('#admin-descripcion').value,
      tipo: $('#admin-tipo').value,
      ideal_para: $('#admin-ideal').value,
      paso_a_paso: $('#admin-pasos').value
    };

    try {
      const res = await fetch(API_ADMIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      const result = await res.json();
      
      if (result.success) {
        mostrarToast('Recurso guardado con éxito', 'success');
        $('#form-admin').reset();
      } else {
        mostrarToast(result.message, 'error');
      }
    } catch (err) {
      mostrarToast('Error de conexión', 'error');
    }
  });
});

import { CONFIG } from '../core/config.js';
import { http } from '../core/http.js';

let categoriesPromise = null;

export async function loadCategoryTree() {
  if (!categoriesPromise) {
    categoriesPromise = http.get(CONFIG.ENDPOINTS.obtenerCategorias, { credentials: 'omit' })
      .then((result) => {
        if (!result.success || !Array.isArray(result.data)) {
          throw new Error('La API devolvió una lista de categorías no válida.');
        }

        return buildCategoryTree(result.data);
      })
      .catch((error) => {
        categoriesPromise = null;
        throw error;
      });
  }

  return categoriesPromise;
}

export function buildCategoryTree(rows) {
  if (!Array.isArray(rows)) {
    throw new TypeError('La lista de categorías debe ser un array.');
  }

  const categories = rows.map((row) => {
    const id = Number(row.id);
    const parentId = row.parent_id === null ? null : Number(row.parent_id);

    if (!Number.isInteger(id) || id <= 0 || (parentId !== null && !Number.isInteger(parentId))) {
      throw new Error('La API devolvió una categoría con identificadores no válidos.');
    }

    return {
      ...row,
      id,
      parent_id: parentId,
      nombre: String(row.nombre || ''),
      slug: String(row.slug || ''),
      icono: String(row.icono || ''),
      descripcion: String(row.descripcion || ''),
      orden: Number(row.orden) || 0,
      total_recursos: Number(row.total_recursos) || 0,
      children: [],
    };
  });

  const byId = new Map();
  const bySlug = new Set();
  for (const category of categories) {
    if (!category.nombre || !category.slug || byId.has(category.id) || bySlug.has(category.slug)) {
      throw new Error('La API devolvió categorías duplicadas o incompletas.');
    }

    byId.set(category.id, category);
    bySlug.add(category.slug);
  }

  const roots = [];
  for (const category of categories) {
    if (category.parent_id === null) {
      roots.push(category);
      continue;
    }

    const parent = byId.get(category.parent_id);
    if (!parent || parent.id === category.id) {
      throw new Error(`La categoría "${category.slug}" tiene una jerarquía no válida.`);
    }
    parent.children.push(category);
  }

  const visited = new Set();
  const visit = (category) => {
    if (visited.has(category.id)) {
      throw new Error('La jerarquía de categorías contiene un ciclo.');
    }

    visited.add(category.id);
    category.children.sort((a, b) => a.orden - b.orden || a.nombre.localeCompare(b.nombre, 'es'));
    category.children.forEach(visit);
  };
  roots.forEach(visit);

  if (visited.size !== categories.length) {
    throw new Error('La jerarquía contiene categorías huérfanas.');
  }

  roots.sort((a, b) => a.orden - b.orden || a.nombre.localeCompare(b.nombre, 'es'));
  return roots;
}

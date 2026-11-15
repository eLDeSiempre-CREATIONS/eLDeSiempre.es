export function getBadgeClass(tipo) {
  if (!tipo) return 'badge-default';
  const t = String(tipo).toLowerCase();
  if (t.includes('curso')) return 'badge-curso';
  if (t.includes('herramienta')) return 'badge-herramienta';
  if (t.includes('libro')) return 'badge-libro';
  if (t.includes('hacker')) return 'badge-hacker';
  if (t.includes('sistema')) return 'badge-sistema';
  if (t.includes('noticia') || t.includes('comunidad')) return 'badge-noticia';
  if (t.includes('documentación')) return 'badge-doc';
  if (t.includes('laboratorio')) return 'badge-lab';
  return 'badge-default';
}

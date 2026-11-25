export function bindTextFilter(input, items, attribute = 'data-search') {
  if (!input) return () => {};

  const apply = () => {
    const query = String(input.value || '').trim().toLowerCase();
    items().forEach((item) => {
      const haystack = String(item.getAttribute(attribute) || '').toLowerCase();
      item.hidden = query.length > 0 && !haystack.includes(query);
    });
  };

  input.addEventListener('input', apply);
  apply();
  return apply;
}

export function bindLevelFilter(buttons, items, attribute = 'data-nivel') {
  if (!buttons.length) return () => {};

  const apply = (level) => {
    items().forEach((item) => {
      item.hidden = level !== 'todos' && item.getAttribute(attribute) !== level;
    });
    buttons.forEach((button) => {
      const active = button.getAttribute('data-level') === level;
      button.classList.toggle('active-filter', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => apply(button.getAttribute('data-level') || 'todos'));
  });

  apply('todos');
  return apply;
}

export const $  = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export function on(el, event, handler, opts) {
  if (!el) return () => {};
  el.addEventListener(event, handler, opts);
  return () => el.removeEventListener(event, handler, opts);
}

export function delegate(root, selector, event, handler) {
  return on(root, event, (e) => {
    const target = e.target.closest(selector);
    if (target && root.contains(target)) handler(e, target);
  });
}

export function escapeHTML(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function show(el) { if (el) el.style.display = ''; }
export function hide(el) { if (el) el.style.display = 'none'; }
export function toggleClass(el, cls, force) {
  if (!el) return;
  force === undefined ? el.classList.toggle(cls) : el.classList.toggle(cls, force);
}

export async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;left:-9999px';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  const ok = document.execCommand('copy');
  ta.remove();
  return ok;
}

const BLOCKED_TAGS = new Set([
  'script', 'iframe', 'object', 'embed', 'base', 'meta', 'link',
  'form', 'input', 'button', 'textarea', 'select', 'style',
]);

const URL_ATTRIBUTES = new Set(['href', 'src', 'poster', 'action', 'formaction', 'xlink:href']);

function isSafeUrl(value, attribute) {
  const raw = String(value ?? '').trim();
  if (!raw || raw.startsWith('#')) return true;

  try {
    const url = new URL(raw, window.location.href);
    if (url.protocol === 'http:' || url.protocol === 'https:') return true;
    if (attribute === 'href' && (url.protocol === 'mailto:' || url.protocol === 'tel:')) return true;
    if (attribute === 'src' && /^data:image\/(png|jpe?g|gif|webp);base64,/i.test(raw)) return true;
  } catch {
    return false;
  }
  return false;
}

export function sanitizeHTML(html) {
  const source = String(html ?? '');
  if (!source) return '';

  const doc = new DOMParser().parseFromString(`<div id="sanitize-root">${source}</div>`, 'text/html');
  const root = doc.getElementById('sanitize-root');
  if (!root) return '';

  root.querySelectorAll('*').forEach((element) => {
    if (BLOCKED_TAGS.has(element.tagName.toLowerCase())) {
      element.remove();
      return;
    }

    Array.from(element.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      if (name.startsWith('on') || name === 'srcdoc' || name === 'ping' || name === 'srcset' || name === 'imagesrcset') {
        element.removeAttribute(attribute.name);
        return;
      }
      if (URL_ATTRIBUTES.has(name) && !isSafeUrl(attribute.value, name)) {
        element.removeAttribute(attribute.name);
      }
    });

    if (element.getAttribute('target') === '_blank') {
      element.setAttribute('rel', 'noopener noreferrer nofollow');
    }
  });

  return root.innerHTML;
}

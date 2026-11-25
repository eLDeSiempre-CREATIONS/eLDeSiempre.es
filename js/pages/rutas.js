import { initPage } from '../core/page.js';
import { CONFIG } from '../core/config.js';
import { http } from '../core/http.js';
import { $, escapeHTML } from '../core/dom.js';
import { sanitizeHTML } from '../core/sanitize.js';
import { mostrarToast } from '../core/toast.js';
import { refreshTerminal } from '../ui/layout/index.js';

const container = $('#learning-content');

function renderError(message, href = 'rutas.html', label = 'Volver a las rutas') {
  container.innerHTML = `
    <div class="learning-message">
      <p class="empty-state">${escapeHTML(message)}</p>
      <a class="btn-secondary" href="${escapeHTML(href)}">${escapeHTML(label)}</a>
    </div>
  `;
}

function statusLabel(status) {
  if (status === 'completed') return 'Completada';
  if (status === 'available') return 'Disponible';
  return 'Bloqueada';
}

function routeUrl(pathSlug) {
  return `rutas.html?ruta=${encodeURIComponent(pathSlug)}`;
}

function lessonUrl(pathSlug, lessonSlug) {
  return `${routeUrl(pathSlug)}&leccion=${encodeURIComponent(lessonSlug)}`;
}

function renderPathCards(paths) {
  if (!paths.length) {
    renderError('Todavía no hay rutas publicadas. Vuelve a intentarlo más tarde.');
    return;
  }

  container.innerHTML = `
    <div class="learning-path-grid">
      ${paths.map((path) => {
        const percentage = path.total ? Math.round((path.completed / path.total) * 100) : 0;
        return `
          <a class="card learning-path-card" href="${routeUrl(path.slug)}">
            <span class="learning-card-kicker">RUTA FORMATIVA</span>
            <h2>${escapeHTML(path.title)}</h2>
            <p>${escapeHTML(path.description)}</p>
            <span class="learning-progress-label">${path.completed} de ${path.total} lecciones completadas</span>
            <progress class="learning-progress" value="${percentage}" max="100" aria-label="Progreso en ${escapeHTML(path.title)}: ${percentage}%"></progress>
            <span class="guia-cta">Explorar ruta →</span>
          </a>
        `;
      }).join('')}
    </div>
  `;
}

function renderPath(path, loggedIn) {
  if (!path) {
    renderError('No se encontró esa ruta.');
    return;
  }

  const lessons = path.lessons.map((lesson, index) => {
    const available = lesson.status !== 'locked';
    const status = statusLabel(lesson.status);
    const lessonContent = `
      <span class="learning-step-number">${index + 1}</span>
      <span class="learning-step-copy">
        <span class="learning-step-title">${escapeHTML(lesson.title)}</span>
        <span class="learning-step-summary">${escapeHTML(lesson.summary)}</span>
        <span class="learning-step-meta">${escapeHTML(lesson.level)} · ${lesson.minutes} min · ${status}</span>
      </span>
      <span class="learning-step-icon" aria-hidden="true">${lesson.status === 'completed' ? '✓' : (available ? '→' : '🔒')}</span>
    `;

    return available
      ? `<li class="learning-step-item"><a class="learning-step learning-step--${lesson.status}" href="${lessonUrl(path.slug, lesson.slug)}">${lessonContent}</a></li>`
      : `<li class="learning-step-item learning-step--locked"><div class="learning-step" aria-disabled="true">${lessonContent}</div></li>`;
  }).join('');

  container.innerHTML = `
    <a class="btn-back" href="rutas.html">← Todas las rutas</a>
    <section class="learning-route-detail" aria-labelledby="learning-route-title">
      <header class="learning-route-header">
        <span class="learning-card-kicker">RUTA FORMATIVA · ${path.completed}/${path.total} COMPLETADAS</span>
        <h2 id="learning-route-title">${escapeHTML(path.title)}</h2>
        <p>${escapeHTML(path.description)}</p>
      </header>
      ${!loggedIn ? '<p class="learning-account-note">Puedes empezar por la primera lección. Inicia sesión para marcarla como completada y guardar el avance que desbloquea las siguientes.</p>' : ''}
      <ol class="learning-steps">${lessons}</ol>
    </section>
  `;
}

function renderLesson(lesson) {
  const returnUrl = lessonUrl(lesson.path_slug, lesson.slug);
  const completionAction = lesson.completed
    ? '<p class="learning-completed-note" role="status">✓ Lección completada. La siguiente lección de esta ruta ya está desbloqueada.</p>'
    : lesson.logged_in
      ? '<button class="btn-primary" id="complete-lesson" type="button">Marcar como completada</button>'
      : `<a class="btn-primary" href="login.html?redirect=${encodeURIComponent(returnUrl)}">Inicia sesión para guardar y continuar</a>`;

  container.innerHTML = `
    <a class="btn-back" href="${routeUrl(lesson.path_slug)}">← ${escapeHTML(lesson.path_title)}</a>
    <article class="guide-article learning-lesson">
      <p class="terminal-eyebrow">${escapeHTML(lesson.path_title)} <span>· ${escapeHTML(lesson.level)} · ${lesson.minutes} min</span></p>
      <h2 class="guide-title">${escapeHTML(lesson.title)}</h2>
      <p class="learning-lesson-summary">${escapeHTML(lesson.summary)}</p>
      <div class="guide-content">${sanitizeHTML(lesson.content)}</div>
      <div class="learning-completion">${completionAction}</div>
    </article>
    <div class="page-actions"><a class="btn-secondary" href="biblioteca.html">Explorar recursos por categorías</a></div>
  `;

  const completeButton = $('#complete-lesson', container);
  if (completeButton) {
    completeButton.addEventListener('click', async () => {
      completeButton.disabled = true;
      try {
        const result = await http.post(CONFIG.ENDPOINTS.completarLeccionAprendizaje, { slug: lesson.slug });
        if (!result.success) throw new Error(result.message || 'No se pudo guardar el progreso.');
        mostrarToast('Progreso guardado. La siguiente lección ya está desbloqueada.', 'success');
        window.history.replaceState({}, document.title, routeUrl(lesson.path_slug));
        refreshTerminal();
        await renderLearningPage();
      } catch (error) {
        if (error.status === 401) {
          window.location.href = `login.html?redirect=${encodeURIComponent(returnUrl)}`;
          return;
        }
        mostrarToast(error.message || 'No se pudo guardar el progreso.', 'error');
        completeButton.disabled = false;
      }
    });
  }
}

async function fetchLearningPaths() {
  const result = await http.get(CONFIG.ENDPOINTS.obtenerRutasAprendizaje);
  if (!result.success || !result.data) {
    throw new Error(result.message || 'No se pudieron cargar las rutas.');
  }
  return result.data;
}

async function renderLearningPage() {
  const params = new URLSearchParams(window.location.search);
  const requestedLesson = params.get('leccion');

  if (requestedLesson) {
    try {
      const result = await http.get(
        `${CONFIG.ENDPOINTS.obtenerLeccionAprendizaje}?slug=${encodeURIComponent(requestedLesson)}`
      );
      if (!result.success || !result.data) throw new Error(result.message || 'No se pudo cargar la lección.');
      renderLesson(result.data);
    } catch (error) {
      const returnUrl = params.get('ruta') ? routeUrl(params.get('ruta')) : 'rutas.html';
      const loginHref = error.status === 401
        ? `login.html?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`
        : returnUrl;
      const loginLabel = error.status === 401 ? 'Iniciar sesión' : 'Volver a la ruta';
      renderError(error.message || 'No se pudo cargar la lección.', loginHref, loginLabel);
    }
    return;
  }

  try {
    const data = await fetchLearningPaths();
    const requestedPath = params.get('ruta');
    if (!requestedPath) {
      renderPathCards(data.paths || []);
      return;
    }
    renderPath((data.paths || []).find((path) => path.slug === requestedPath), data.logged_in);
  } catch (error) {
    renderError(error.message || 'No se pudieron cargar las rutas.');
  }
}

initPage({
  page: 'rutas',
  onReady: renderLearningPage,
});

export function renderGlobalModals() {
  return `
    <div class="modal-overlay" id="disclaimer-modal" role="dialog" aria-modal="true" aria-labelledby="disclaimer-title">
      <div class="modal-content" style="text-align: left;">
        <h2 id="disclaimer-title">⚠️ Descargo de Responsabilidad</h2>
        <p class="modal-lead">Bienvenido a <strong>eLDeSiempre.es</strong>. Antes de continuar, es obligatorio que lea y acepte las siguientes condiciones:</p>
        <ul class="modal-list">
          <li>Este sitio web tiene fines <strong>exclusivamente educativos e informativos</strong> sobre ciberseguridad y hacking ético.</li>
          <li>El uso de las herramientas y técnicas aquí mostradas para atacar sistemas sin el consentimiento explícito del propietario es <strong>ilegal</strong> y está penado por la ley.</li>
          <li>El administrador de eLDeSiempre.es no se hace responsable del mal uso que los usuarios puedan dar a la información proporcionada.</li>
          <li>Al hacer clic en "Acepto", usted confirma que es mayor de edad y asume toda la responsabilidad legal sobre sus acciones.</li>
        </ul>
        <button class="btn-primary" type="button" style="width: 100%;" data-action="aceptar-disclaimer">Acepto y entro</button>
      </div>
    </div>

    <div id="cookie-banner" role="region" aria-label="Aviso de cookies" hidden>
      <p>Utilizamos cookies propias y de terceros (Matomo) para analizar el tráfico. Puedes aceptarlas o rechazarlas. <a href="#" data-open-modal="modal-legal">Más información</a>.</p>
      <div class="cookie-actions">
        <button class="btn-secondary" type="button" data-action="rechazar-cookies">Rechazar</button>
        <button class="btn-primary" type="button" data-action="aceptar-cookies">Aceptar</button>
      </div>
    </div>

    <div class="modal-overlay" id="modal-legal" role="dialog" aria-modal="true" aria-labelledby="legal-title">
      <div class="modal-content">
        <button class="close-btn" type="button" data-close-modal="modal-legal" aria-label="Cerrar">×</button>
        <h2 id="legal-title">Información Legal y RGPD</h2>
        <div class="legal-block">
          <h3>1. Aviso Legal</h3>
          <p>Este sitio web es un proyecto personal sin ánimo de lucro. El titular es el administrador de eLDeSiempre.es. El contenido es meramente educativo.</p>
          <h3>2. Política de Privacidad (RGPD)</h3>
          <p>Los datos del formulario de contacto se usan exclusivamente para responderte. Los datos de registro se usan para gestionar tu cuenta. Puedes ejercer tus derechos enviando un correo a <strong>contacto@eldesiempre.es</strong>.</p>
          <h3>3. Política de Cookies</h3>
          <p>Esta web utiliza cookies técnicas (para el inicio de sesión) y cookies analíticas (proporcionadas por Matomo, alojado en nuestros propios servidores). Puedes rechazar las analíticas sin que afecte al funcionamiento.</p>
          <h3>4. Auditoría de Uso Interno</h3>
          <p>Para garantizar la seguridad, registramos el uso de las herramientas y formularios públicos. Estos registros incluyen IP, fecha/hora y acción realizada. Los registros se envían a un canal privado de Discord y no se comparten con terceros. Conservación máxima: 90 días.</p>
        </div>
      </div>
    </div>

    <div class="modal-overlay" id="modal-global-search" role="dialog" aria-modal="true" aria-labelledby="global-search-title">
      <div class="modal-content modal-content--search">
        <div class="search-box">
          <span class="search-box-icon" aria-hidden="true">🔍</span>
          <h2 class="sr-only" id="global-search-title">Buscar en eLDeSiempre</h2>
          <input type="search" id="global-search-input" placeholder="Buscar herramientas, guías o recursos... (ESC para cerrar)" autocomplete="off">
          <button class="close-btn close-btn--inline" type="button" data-close-modal="modal-global-search" aria-label="Cerrar">×</button>
        </div>
        <div id="global-search-results" class="search-results" aria-live="polite">
          <p class="search-hint">Escribe al menos 2 letras...</p>
        </div>
      </div>
    </div>
  `;
}

export function renderCurtain(message = 'Verificando sesión...') {
  return `<div id="curtain" class="curtain" hidden>&gt; ${message}</div>`;
}

# Arquitectura frontend y guía de mantenimiento

Documento de la refactorización de eLDeSiempre.es. Describe el problema detectado, la solución aplicada, el árbol final, las tareas por prioridad, los cambios por archivo y la checklist de verificación.

## 1. Diagnóstico de partida

Las páginas compartían colores y tipografía, pero no estructura. Los problemas concretos encontrados en el código local fueron:

1. `index.html` era la única página con footer completo, disclaimer, banner de cookies, buscador global y modal legal. `contacto.html`, `login.html`, `perfil.html`, `reset.html` y `guia.html` no tenían footer ni navegación terminal.
2. `biblioteca.html` duplicaba 27 modales de herramientas en su HTML y, además, existía `modales.html` como fragmento huérfano: ninguna página lo importaba.
3. `admin.html` era la única página con un `<style>` inline, cargaba `js/pages/admin.js` como script clásico, no tenía `#toast-container` y usaba `cerrarSesion()` sin que existiera en esa página.
4. El buscador global (`js/ui/search.js`) tenía un índice escrito a mano con rutas inexistentes: `cat=utilidades-web` no existe en el registro y `cat=osint-tools` es una subcategoría, no una categoría.
5. `index.html` llamaba a `copiarAlPortapapeles()` en los botones de criptomonedas, pero esa función no estaba definida en ningún módulo.
6. Las herramientas `iot-scan` y `firmware` estaban en el registro sin modal ni implementación; `canary` no existía en el registro aunque sus modales sí estaban en el HTML; `analizarUA` estaba registrado en el orquestador pero ningún control lo invocaba.
7. `biblioteca.html` exigía login para todo, incluidas las herramientas interactivas, aunque el propio README las describe como públicas.
8. Varias páginas construían HTML con datos de la API sin escapar (`render-resources.js`, `render-cve.js`, `admin.js`, `exif.js`). Las guías se inyectaban con `innerHTML` sin sanear.
9. El index tenía 10 guías hardcodeadas. No existía endpoint para listar guías, así que el catálogo no se pintaba desde la API.
10. La CSP estaba duplicada con ligeras diferencias entre páginas y no incluía `frame-src`, `object-src` ni `base-uri`.
11. `js/pages/admin.js` tenía la URL `https://api.eldesiempre.es/admin_api.php` duplicada fuera de `js/core/config.js`.
12. El dashboard admin y el perfil usaban `innerText`/`innerHTML` de forma inconsistente, y el QR de 2FA se insertaba como HTML con `src` sin validar.

## 2. Solución: capa de layout común

Todas las páginas comparten ahora el mismo esqueleto:

```html
<body data-page="pagina">
  <a href="#main-content" class="skip-link">Saltar al contenido principal</a>
  <div id="curtain" class="curtain" hidden>...</div>
  <header id="site-header" class="site-header"></header>
  <div id="site-terminal" class="site-terminal"></div>
  <main id="main-content" class="container page-main">...</main>
  <footer id="site-footer" class="site-footer"></footer>
  <div id="site-modals"></div>
  <div id="toast-container" role="status" aria-live="polite"></div>
  <script type="module" src="js/pages/pagina.js"></script>
</body>
```

`data-page` es el contrato de la página. `js/data/navigation.js` traduce ese valor a:

- entrada activa del menú (`index`, `biblioteca`, `herramientas`, `guias`, `contacto`);
- ruta del prompt (`root@eldesiempre:/biblioteca/recursos/formacion#`);
- migas del árbol de directorios;
- destino del botón `cd ..`.

### Módulos nuevos

| Archivo | Responsabilidad |
| --- | --- |
| `js/ui/layout/header.js` | Cabecera única: logo, menú principal, buscador, autenticación y tema. |
| `js/ui/layout/terminal.js` | Prompt, árbol de directorios y botón `cd ..`. |
| `js/ui/layout/footer.js` | Footer único: directorio, proyecto, donaciones, legal y redes. |
| `js/ui/layout/modals.js` | Modales globales: disclaimer, cookies, legal y buscador. |
| `js/ui/layout/index.js` | Monta el layout, carga `partials/modales-herramientas.html` bajo demanda. |
| `js/core/page.js` | Bootstrap común: layout, tema, disclaimer, sesión, buscador, tools y cortina. |
| `js/data/navigation.js` | Fuente única de secciones, rutas y migas. |
| `js/data/categories.js` | Carga y valida el árbol jerárquico de categorías desde la API. |

Punto de entrada de una página:

```js
import { initPage } from '../core/page.js';
import { initLibraryRouter } from '../library/router.js';

initPage({
  page: 'biblioteca',
  requireAuth: true,
  onReady: () => initLibraryRouter(),
});
```

`initPage` está en `js/core/page.js:25` y monta el layout en `js/ui/layout/index.js:27`.

### Herramientas

- `herramientas.html` es la página pública del laboratorio. No exige login.
- `partials/modales-herramientas.html` es la única copia de los 27 modales.
- `js/tools/index.js:72` registra las acciones y usa delegación de eventos (`data-tool-action`, `data-tool-input`, `data-tool-onopen`). Ya no se evalúan atributos `onclick`.
- Cada tarjeta de herramienta es un enlace real a `herramientas.html?cat=...&tool=...`; el modal se abre desde la página, por lo que el enlace funciona incluso sin JavaScript de apertura.
- `js/tools/iot.js` implementa las dos herramientas que antes eran humo: generador de comandos de red local y analizador de cadenas de firmware en el navegador.

## 3. Árbol final del directorio web

```
web/
├── .nojekyll
├── admin.html
├── biblioteca.html
├── contacto.html
├── guia.html
├── herramientas.html
├── index.html
├── login.html
├── perfil.html
├── reset.html
├── rutas.html
├── robots.txt
├── sitemap.xml
├── styles.css
├── CNAME
├── README.md
├── SECURITY.md
├── assets/
│   ├── logo.png
│   └── portada.jpg
├── docs/
│   ├── reto-osint.pdf
│   └── ARQUITECTURA-FRONTEND.md
├── partials/
│   └── modales-herramientas.html
├── js/
│   ├── auth/
│   │   ├── login.js
│   │   └── session.js
│   ├── contact/
│   │   └── contact.js
│   ├── core/
│   │   ├── badges.js
│   │   ├── config.js
│   │   ├── dom.js
│   │   ├── http.js
│   │   ├── logger.js
│   │   ├── modal.js
│   │   ├── page.js
│   │   ├── sanitize.js
│   │   ├── state.js
│   │   ├── theme.js
│   │   └── toast.js
│   ├── data/
│   │   ├── navigation.js
│   │   ├── categories.js
│   │   └── tools-registry.js
│   ├── library/
│   │   ├── filter.js
│   │   ├── render-cve.js
│   │   ├── render-guides.js
│   │   ├── render-home.js
│   │   ├── render-resources.js
│   │   ├── render-tools.js
│   │   ├── router.js
│   │   ├── tool-cards.js
│   │   └── votes.js
│   ├── pages/
│   │   ├── admin-page.js
│   │   ├── admin.js
│   │   ├── biblioteca.js
│   │   ├── contacto.js
│   │   ├── guia.js
│   │   ├── herramientas.js
│   │   ├── index.js
│   │   ├── login.js
│   │   ├── perfil.js
│   │   ├── reset.js
│   │   └── rutas.js
│   ├── profile/
│   │   └── profile.js
│   ├── tools/
│   │   ├── crypto.js
│   │   ├── dev.js
│   │   ├── exif.js
│   │   ├── index.js
│   │   ├── iot.js
│   │   ├── network.js
│   │   ├── osint.js
│   │   └── payloads.js
│   └── ui/
│       ├── disclaimer.js
│       ├── nav.js
│       ├── search.js
│       └── layout/
│           ├── footer.js
│           ├── header.js
│           ├── index.js
│           ├── modals.js
│           └── terminal.js
├── FlipperZero/payload/...
└── payload/texto.txt
```

Fuera de `web/`, en el VPS:

```
vps/api/
├── obtener_categorias.php (nuevo, jerarquía pública del catálogo)
├── obtener_guias.php      (nuevo, listado público de guías)
├── obtener_rutas_aprendizaje.php
├── obtener_leccion_aprendizaje.php
├── completar_leccion_aprendizaje.php
├── rate_limit.php         (nuevo, helper compartido)
├── contacto.php           (rate limiting + límites)
├── herramientas.php       (POST + rate limiting + límites)
└── ...
vps/migrations/
└── 2026_01_rutas_aprendizaje.sql
```

## 4. Tareas por prioridad

### P0 — imprescindible para que el sitio sea homogéneo

| Estado | Tarea | Archivos |
| --- | --- | --- |
| Hecho | Crear layout común, prompt, árbol y `cd ..`. | `js/ui/layout/*`, `js/data/navigation.js` |
| Hecho | Reescribir las 9 páginas sobre el mismo esqueleto. | `*.html` |
| Hecho | Crear laboratorio público y mover los 27 modales a un partial. | `herramientas.html`, `partials/modales-herramientas.html` |
| Hecho | Enlazar recursos y herramientas desde index, biblioteca, herramientas y footer. | `render-home.js`, `render-resources.js`, `render-tools.js`, `footer.js` |
| Hecho | Unificar CSS y eliminar estilos de admin y duplicados de cabecera/footer. | `styles.css` |
| Hecho | CSP y metadatos homogéneos en todas las páginas. | `*.html` |
| Hecho | Endpoint de listado de guías y render desde API. | `vps/api/obtener_guias.php`, `render-guides.js`, `config.js` |
| Hecho | Leer la jerarquía de categorías desde MySQL y usarla en directorio y búsqueda. | `obtener_categorias.php`, `js/data/categories.js`, `render-resources.js`, `search.js` |
| Hecho | Relacionar las familias de herramientas con subcategorías existentes. | `js/data/tools-registry.js` |

### P1 — accesibilidad, seguridad y mantenimiento

| Estado | Tarea | Archivos |
| --- | --- | --- |
| Hecho | Buscador global generado desde registros + guías de la API. | `js/ui/search.js` |
| Hecho | Escapado y saneado de datos de API, CVE, EXIF, admin y guías. | `js/core/sanitize.js`, `dom.js`, renderers, tools, `admin.js` |
| Hecho | Admin como módulo, sin estilos inline, con toasts y acciones delegadas. | `admin.html`, `js/pages/admin.js`, `admin-page.js` |
| Hecho | Botones de copia de cripto y `cd ~` funcionales. | `footer.js`, `nav.js`, `terminal.js` |
| Hecho | Redirección tras login con retorno seguro a la página pedida. | `page.js`, `auth/login.js` |
| Hecho | Rate limiting de contacto y de logs de herramientas. | `rate_limit.php`, `contacto.php`, `herramientas.php` |
| Hecho | Modales accesibles (`aria-hidden`, foco, Escape, overlay). | `core/modal.js` |

### P2 — limpieza y siguientes pasos

| Estado | Tarea | Archivos |
| --- | --- | --- |
| Hecho | Actualizar `robots.txt`, `sitemap.xml` y retirar el fragmento huérfano. | `robots.txt`, `sitemap.xml`, `modales.html` |
| Hecho | Documentar arquitectura, cambios y checklist. | este documento |
| Pendiente | Migrar la CSP a cabeceras HTTP reales en Nginx/GitHub Pages y retirar `'unsafe-inline'` de `style-src` (`script-src` ya no lo usa). | infraestructura |
| Hecho | Eliminar el registro duplicado de categorías; la base de datos es la fuente del árbol y los slugs. | `js/data/categories.js`, `obtener_categorias.php` |
| Pendiente | Añadir token CSRF explícito a `admin_api.php` (hoy se apoya en JSON + CORS + SameSite). | `admin_api.php`, `admin.js` |
| Pendiente | Mover `logout.php` a POST y añadir `SameSite`/CSRF al cierre de sesión. | `logout.php`, `session.js` |

## 5. Cambios por archivo

### Creados

| Archivo | Contenido |
| --- | --- |
| `web/herramientas.html` | Laboratorio público de herramientas. |
| `web/partials/modales-herramientas.html` | 27 modales únicos, sin `onclick`. |
| `web/js/core/page.js` | Bootstrap común de página. |
| `web/js/core/sanitize.js` | Saneado de HTML de guías. |
| `web/js/data/navigation.js` | Secciones, rutas y migas. |
| `web/js/ui/layout/header.js` | Cabecera común. |
| `web/js/ui/layout/terminal.js` | Prompt y árbol terminal. |
| `web/js/ui/layout/footer.js` | Footer común. |
| `web/js/ui/layout/modals.js` | Modales globales. |
| `web/js/ui/layout/index.js` | Montaje del layout. |
| `web/js/library/filter.js` | Filtros de texto y nivel. |
| `web/js/library/render-guides.js` | Catálogo de guías desde API. |
| `web/js/data/categories.js` | Carga y valida el árbol jerárquico del catálogo desde la API. |
| `web/js/library/tool-cards.js` | Tarjeta de herramienta reutilizable. |
| `web/js/pages/herramientas.js` | Router del laboratorio y apertura de modales. |
| `web/js/pages/admin-page.js` | Entrada module del admin. |
| `web/js/tools/iot.js` | Comandos de red local y analizador de firmware. |
| `vps/api/obtener_guias.php` | Listado público de guías. |
| `vps/api/obtener_categorias.php` | Árbol público con conteo de recursos, cacheado durante cinco minutos. |
| `vps/api/rate_limit.php` | Helper de rate limiting. |

### Modificados

| Archivo | Cambio |
| --- | --- |
| `web/*.html` | Esqueleto común, CSP única, metadatos, footer/nav, carga module. |
| `web/styles.css` | Layout, terminal, tarjetas, auth, admin, buscador, responsive. |
| `web/js/core/config.js` | Endpoints de categorías y guías, además de `admin`, centralizados. |
| `web/js/core/dom.js` | `safeUrl`, `setVisible`, `debounce`, `hidden`. |
| `web/js/core/modal.js` | Bloqueo de scroll, eventos `modal:open/close`, delegación. |
| `web/js/core/badges.js` | Badge por nivel de guía. |
| `web/js/auth/session.js` | Timeout de sesión y visibilidad por `hidden`. |
| `web/js/auth/login.js` | Formularios por `hidden`, redirect seguro, doble submit. |
| `web/js/ui/nav.js` | Navegación activa por `data-nav`, copia, logout. |
| `web/js/ui/search.js` | Índice desde herramientas, categorías y guías API. |
| `web/js/data/tools-registry.js` | Asociación de familias de herramientas a ramas y subcategorías del catálogo. |
| `web/js/ui/disclaimer.js` | Acciones delegadas y sincronía de bloqueo. |
| `web/js/library/render-*.js` | Enlaces, escape, filtros, tarjetas y estado vacío. |
| `web/js/library/router.js` | `tipo` inferido, rutas válidas. |
| `web/js/library/votes.js` | Delegación `data-vote-id`. |
| `web/js/pages/*.js` | Uso de `initPage`, sin `DOMContentLoaded` duplicado. |
| `web/js/pages/admin.js` | Module, API centralizada, escape, acciones delegadas, toasts. |
| `web/js/profile/profile.js` | `textContent` y validación del QR. |
| `web/js/tools/*.js` | Salidas seguras, acciones por `data-*`, IoT. |
| `web/robots.txt`, `sitemap.xml` | Rutas públicas y bloqueo de partials. |
| `vps/api/contacto.php` | Límites y rate limiting. |
| `vps/api/herramientas.php` | POST, límites y rate limiting. |

### Movidos / eliminados

| Archivo | Acción |
| --- | --- |
| `web/modales.html` | Eliminado. Su contenido pasa a `web/partials/modales-herramientas.html`. |
| `web/js/pages/admin.js` | Sigue existiendo como módulo, pero el entry point es `admin-page.js`. |

## 6. Contrato de navegación y plantillas

### Añadir una página

1. Copiar el esqueleto de `docs/ARQUITECTURA-FRONTEND.md` o de `reset.html`.
2. Añadir la página a `PAGE_CONFIG` en `js/data/navigation.js` con `nav`, `label`, `parent` y `command`.
3. Crear `js/pages/<pagina>.js` con `initPage({ page: '<pagina>', onReady })`.
4. Añadir el enlace en `NAV_ITEMS` solo si es una sección principal.

### Añadir una herramienta

1. Añadir la entrada en `js/data/tools-registry.js` con `id`, `titulo`, `desc` e `ideal`.
2. Añadir su modal en `web/partials/modales-herramientas.html` con `id="modal-<id>"`.
3. Implementar la acción en `js/tools/<modulo>.js`.
4. Registrarla en `actions` de `js/tools/index.js`.
5. Usar `data-tool-action` o `data-tool-input`; no usar `onclick`.
6. Comprobar que el `id` tiene modal, que la acción está registrada y que la tarjeta aparece en su categoría.

### Añadir una categoría de recursos

1. Añadir una fila a `categorias_recursos`; para una subcategoría, usar como `parent_id` el ID de la rama correspondiente.
2. Elegir un `slug` estable, ya que las rutas y el filtrado de recursos lo usan.
3. Si una familia de herramientas pertenece a esa subcategoría, asignar su `ramaSlug` y `categorySlug` en `js/data/tools-registry.js`.
4. No mantener una copia del árbol en el frontend: `render-resources.js` y `search.js` leen la API pública `obtener_categorias.php`.

### Añadir una guía

Solo hay que crearla en la tabla `guias` mediante el admin. `obtener_guias.php` la publica y el index la pinta. No se hardcodea en HTML.

## 7. Endpoints usados

La base está en `js/core/config.js:2`:

```
https://api.eldesiempre.es
```

| Acción | Endpoint | Uso |
| --- | --- | --- |
| Login | `/login.php` | `auth/login.js` |
| Logout | `/logout.php` | `auth/session.js` |
| Registro | `/registro.php` | `auth/login.js` |
| Sesión | `/comprobar_sesion.php` | `auth/session.js` |
| 2FA login | `/verificar_2fa_login.php` | `auth/login.js` |
| Reset | `/solicitar_reset.php`, `/reset_password.php` | `auth/login.js`, `pages/reset.js` |
| 2FA email/TOTP | `/activar_2fa_email.php`, `/generar_2fa_totp.php`, `/confirmar_2fa_totp.php` | `profile/profile.js` |
| Perfil | `/obtener_perfil.php`, `/actualizar_perfil.php` | `profile/profile.js` |
| Recursos | `/obtener_recursos.php` | `render-resources.js` |
| Guía | `/obtener_guia.php` | `pages/guia.js` |
| Guías (nuevo) | `/obtener_guias.php` | `render-guides.js`, `search.js` |
| Categorías (nuevo) | `/obtener_categorias.php` | `data/categories.js`, `render-resources.js`, `ui/search.js` |
| Votos | `/votar.php` | `library/votes.js` |
| Logs de tools | `/herramientas.php` | `core/logger.js` |
| Contacto | `/contacto.php` | `contact/contact.js` |
| Admin | `/admin_api.php` | `pages/admin.js` |

No se ha inventado ninguna URL. `admin_api.php` ya existía en el código de admin y ahora está en `CONFIG.ENDPOINTS.admin`.

## 8. Seguridad aplicada

- Se mantiene PDO con prepared statements, `password_hash`, sesión `HttpOnly/Secure/SameSite=Strict` y CORS restringido.
- Se añade saneado de HTML de guías (`sanitizeHTML`) y escapado de todos los datos de API que se pintan.
- Se validan URLs con `safeUrl` antes de usarlas en `href`.
- Se añade rate limiting a contacto (3/hora por IP) y a logs de herramientas (120/hora por IP) reutilizando `rate_limits`.
- Se añaden límites de longitud a los campos de contacto y de logs.
- Los formularios usan `hidden` y `disabled` durante el envío para evitar dobles peticiones.
- El redirect posterior al login solo acepta mismo origen y rutas `.html`.
- La CSP incorpora `object-src 'none'`, `base-uri 'self'`, `form-action 'self'` y `frame-src` explícito.
- No se ha cambiado ningún color, tipografía ni variable visual.

## 9. Checklist de verificación

### Automática ejecutada en local

| Comprobación | Resultado |
| --- | --- |
| Las 9 páginas cargan con el layout común (jsdom + módulos reales, API simulada) | 10/10 estados sin errores JS |
| IDs duplicados por página | 0 |
| Enlaces internos `href`/`src` de las 9 páginas | 0 roto |
| Herramientas registradas ↔ modales | 27 ↔ 27 |
| Acción de herramienta por delegación (`generarDork`) | OK, genera enlace |
| Acciones del orquestador usadas/registradas | 0 desconocidas, 0 sin uso |
| Categorías `catFilter` ↔ registro de tools | 0 faltantes |
| Categorías del directorio y del buscador leídas desde la misma jerarquía de MySQL | Pendiente de verificar con la API desplegada |
| Guía con `<script>` y `javascript:` | eliminados; `window.__xss` falso |
| Páginas y assets por HTTP local | 200 |
| `admin` con API simulada | tablas, tabs y cortina OK |
| `perfil` con API simulada | bio y usuario OK |
| `biblioteca` con sesión simulada | 9 carpetas, recursos y votos OK |

### Manual antes de publicar

- [ ] Abrir `index.html` en escritorio y móvil: cabecera, prompt, árbol, `cd ..`, footer y cookies.
- [ ] Abrir `biblioteca.html` sin sesión: debe mostrar cortina y redirigir a `login.html?redirect=...`.
- [ ] Iniciar sesión y comprobar que vuelve a `biblioteca.html`.
- [ ] Recorrer las 7 ramas y sus subcategorías; comprobar que `cd ..` vuelve al nivel anterior.
- [ ] Abrir una subcategoría de herramientas y verificar que lleva a `herramientas.html?cat=...`.
- [ ] Abrir `herramientas.html`, probar una herramienta de cada categoría y cerrar con Escape y con overlay.
- [ ] Probar `?tool=dorks` directo y recargar.
- [ ] Comprobar que `Ctrl+K` busca herramientas, recursos y guías.
- [ ] Abrir una guía pública y una protegida sin sesión (403).
- [ ] En rutas, comprobar que un invitado solo abre el primer fundamento y no puede guardar progreso.
- [ ] Con una cuenta de prueba, completar una lección y comprobar que la siguiente se desbloquea; abrir directamente una lección posterior debe devolver 403.
- [ ] Enviar contacto y comprobar rate limit tras 3 envíos.
- [ ] Entrar en `admin.html` con un usuario no admin: debe denegar y redirigir.
- [ ] Entrar con admin: tabs, tablas, editar/crear/borrar y toasts.
- [ ] Revisar consola sin errores 404/500 y sin warnings de CSP.
- [ ] Revisar que el layout no tenga scroll horizontal a 390 px.
- [ ] Abrir cada rama y confirmar que las subcategorías y herramientas coinciden con `categorias_recursos`.
- [ ] Verificar que `obtener_categorias.php` responde con los 27 registros esperados y CORS desde `https://eldesiempre.es`.
- [ ] Ejecutar `php -l` en los PHP modificados antes de desplegar.

## 10. Despliegue

1. Subir `web/` a GitHub Pages (rama principal; `CNAME` intacto).
2. Ejecutar una vez `vps/migrations/2026_01_rutas_aprendizaje.sql` en la base MySQL antes de publicar las APIs de rutas.
3. Subir `vps/api/obtener_categorias.php`, `vps/api/obtener_guias.php`, `vps/api/obtener_rutas_aprendizaje.php`, `vps/api/obtener_leccion_aprendizaje.php`, `vps/api/completar_leccion_aprendizaje.php` y `vps/api/rate_limit.php` al VPS.
4. Reemplazar `contacto.php` y `herramientas.php` por las versiones nuevas.
5. Comprobar que la tabla `rate_limits` tiene índice único en `ip` (la usa el login desde antes).
6. Purga de caché de GitHub Pages y del CDN si aplica.
7. Probar login, biblioteca, rutas, guías y admin en producción.

## 11. Notas de compatibilidad

- Las URLs antiguas siguen funcionando: `biblioteca.html?tipo=recursos`, `?tipo=herramientas`, `?tipo=cve`, `?cat=...`, `?subcat=...` y `guia.html?id=...`.
- `admin.html` sigue usando los mismos IDs de formulario y las mismas acciones de `admin_api.php`.
- Los endpoints existentes no cambian de nombre ni de contrato.
- `modales.html` desaparece como URL pública; su contenido vive en `partials/modales-herramientas.html` y se carga solo en `herramientas.html`.
- El backend PHP no depende de los nuevos módulos JS; los cambios son aditivos salvo los límites de contacto/logs.
- `vps/api/.htaccess` es de Apache. Como el entorno declarado es Nginx, hay que replicar allí `Options -Indexes`, el bloqueo de `vendor/`, `.env`, `.json`, `.lock` y las cabeceras de seguridad. No se ha inventado una configuración Nginx nueva.

## 12. Rutas de aprendizaje

- `rutas.html` muestra los fundamentos comunes y las ramas de programación, sistemas, hardware, redes y ensamblador.
- La migración `vps/migrations/2026_01_rutas_aprendizaje.sql` crea tablas nuevas y carga las lecciones iniciales de forma no destructiva; no modifica `guias` ni el progreso existente.
- La primera lección de fundamentos se puede leer sin cuenta. Guardar una lección como completada requiere iniciar sesión; el progreso queda asociado a la cuenta.
- `obtener_rutas_aprendizaje.php` devuelve el estado de cada lección, `obtener_leccion_aprendizaje.php` vuelve a comprobar sus prerrequisitos antes de entregar contenido y `completar_leccion_aprendizaje.php` vuelve a comprobarlos al guardar progreso.
- Para añadir contenido, crea una lección con slug único en `lecciones_aprendizaje` y añade sus dependencias en `requisitos_lecciones`. Mantén las dependencias acíclicas y apunta la primera lección de una rama al último fundamento común.
- No existe una acción de reinicio de progreso ni una interfaz administrativa de rutas en esta fase. El contenido inicial se carga con la migración.
- La biblioteca muestra herramientas externas bajo las subcategorías existentes desde `js/data/tools-registry.js`. Son enlaces a terceros, no servicios operados por eLDeSiempre.

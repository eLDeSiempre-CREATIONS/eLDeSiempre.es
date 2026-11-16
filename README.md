# eLDeSiempre.es 🛡️

**Donde la seguridad y el conocimiento se encuentran.**

**eLDeSiempre.es** es el directorio de referencia absoluto en español para el conocimiento técnico, la cultura hacker y el código abierto. No somos una academia; somos un repositorio masivo, curado y estructurado de los mejores recursos gratuitos (y de pago seleccionados), documentación, libros, herramientas y proyectos. 

Nuestro objetivo es centralizar y organizar el conocimiento (estilo *Wikipedia* o *Archive.org*) para ahorrar horas de búsqueda a programadores, entusiastas de la electrónica, hackers y estudiantes de habla hispana.

---

### 🚀 Características Principales

*   **Directorio Unificado y Jerárquico (Privado):** Un árbol de conocimiento profundo que abarca múltiples disciplinas. Los recursos están estructurados por niveles (Categoría > Subcategoría > Recurso) para una navegación intuitiva:
    *   **Formación:** Plataformas gratuitas, cursos, certificaciones (Microsoft Learn, Cisco).
    *   **Programación:** Documentación oficial, repositorios y guías de desarrollo seguro.
    *   **Ciberseguridad:** Red Team, Blue Team, OSINT, laboratorios vulnerables (HTB, TryHackMe) y herramientas (Nmap, Burp Suite, Exploit-DB).
    *   **Electrónica y Hardware:** Datasheets, proyectos DIY, microcontroladores (Arduino, ESP32) y hardware de hacking (Proxmark3, Flipper Zero).
    *   **Sistemas y Redes:** Distribuciones Linux, protocolos y manuales de administración.
    *   **Documentación y Libros:** RFCs, estándares (W3C, ISO), bibliotecas y referentes hispanos.
    *   *Sistema de votaciones (Upvotes) integrado para destacar los mejores recursos.*
*   **Navegación tipo Terminal:** Interfaz inmersiva que simula una consola Linux. Árbol de directorios visual (`├──`), prompts de comandos y botón de retorno (`cd ..`) para evitar que el usuario se pierda.
*   **Laboratorio de Herramientas (Público):** Más de 25 utilidades funcionales interactivas (OSINT, Redes, Criptografía, Análisis). Todas las acciones se registran de forma anónima en Discord para auditoría de seguridad.
*   **Buscador Global (Ctrl+K):** Sistema de búsqueda rápida estilo *Spotlight* para encontrar cualquier recurso o herramienta al instante.
*   **Sistema de Usuarios Completo:** Registro y login con verificación por correo, sesiones protegidas, perfiles personalizables (bio, habilidades, GitHub) y Autenticación en Dos Pasos (2FA por Email o App).
*   **Diseño Adaptable:** Interfaz responsive con **Modo Oscuro (terminal)** y **Modo Claro (limpio)**, guardando la preferencia del usuario.

---

### 🛠️ Arquitectura Técnica

El proyecto está construido priorizando el rendimiento extremo, la seguridad y la simplicidad, sin depender de frameworks pesados:

*   **Frontend:** HTML5, CSS3 (Variables CSS para temas) y **Vanilla JavaScript (Módulos ES6)**. Alojado en GitHub Pages.
*   **Backend:** API RESTful desarrollada en **PHP 8.5** (Nginx + PHP 8.5-FPM) alojada en un VPS propio. Respuestas JSON estrictas.
*   **Base de Datos:** MySQL, utilizando **PDO con Prepared Statements** y un diseño relacional jerárquico (Categorías con `parent_id`).
*   **App Móvil:** WebView nativo de Android (Kotlin) con pantalla completa inmersiva (En desarrollo).
*   **Analítica:** Matomo autoalojado en Docker, garantizando el 100% de privacidad.
*   **Control:** Alertas y notificaciones centralizadas en un canal privado de Discord mediante Webhooks.

#### 🔒 Medidas de Seguridad Implementadas
*   Credenciales de base de datos y correo aisladas en un archivo `.env` externo (bloqueado por Nginx).
*   Control estricto de CORS y sesiones (`HttpOnly`, `Secure`, `SameSite=Strict`) desde PHP.
*   Hashing de contraseñas mediante `password_hash` (Bcrypt) y `session_regenerate_id`.
*   Protección de rutas privadas en el frontend (cortina JS) y validación obligatoria en el backend (PHP).
*   Carga dinámica de recursos protegidos: el contenido solo viaja al cliente si hay una sesión válida.
*   Rate Limiting contra ataques de fuerza bruta en login y anti-spam (Honeypot) en el formulario de contacto.
*   Manejo global de excepciones (`set_exception_handler`) para no filtrar errores de SQL al frontend.

---

### 💰 Apoya el Proyecto

Este es un proyecto 100% gratuito y sin ánimo de lucro. Si te ha sido de ayuda y quieres contribuir a mantener los servidores (VPS, dominio y correos) y el desarrollo continuo, puedes hacerlo a través de:

*   **PayPal:** [Donar con PayPal](https://www.paypal.biz/ldesiem)
*   **Bitcoin (BTC):** `bc1qncwax6ehsrhhphgsvdypy0nhpa2848mjkth320`
*   **Ethereum (ETH):** `0x671233AE15A16ff6424e831504CB6C749345B08D`
*   **Solana (SOL):** `7iVeci47L9mLKouKEQB9siiSdG3QCESDrPnQgrD7xMx`

---

### 🔗 Enlaces Oficiales

*   **Sitio Web:** [https://eldesiempre.es](https://eldesiempre.es)
*   **Discord:** [Únete a la comunidad](https://discord.gg/EakygHQwUu)
*   **Twitter/X:** [@eLDeSiempre_TTV](https://x.com/eLDeSiempre_TTV)
*   **Twitch:** [eldesiempre](https://www.twitch.tv/eldesiempre)
*   **YouTube:** [eLDeSiempreOfficial](https://www.youtube.com/@eLDeSiempreOfficial)
*   **Instagram:** [@__eldesiempre__](https://www.instagram.com/__eldesiempre__/)
*   **TikTok:** [@eldesiempre_ttv](https://www.tiktok.com/@eldesiempre_ttv)

---
*Hecho con 🖤, mucho ☕ y código por eLDeSiempre.*

# Security Policy

## Supported Versions

Dado que **eLDeSiempre.es** es una plataforma web en constante actualización y despliegue continuo, siempre aplicamos parches de seguridad directamente en la rama principal (`main`). No mantenemos versiones antiguas del código en producción.

La siguiente tabla indica el estado actual de seguridad de los diferentes módulos del proyecto:

| Módulo | Estado | Notas |
| :--- | :---: | :--- |
| **Frontend (GitHub Pages)** | ✅ | Actualizado y protegido con CSP estricto. |
| **Backend API (PHP 8.5)** | ✅ | Última versión con PDO y Rate Limiting. |
| **Base de Datos (MySQL)** | ✅ | Uso exclusivo de Prepared Statements. |
| **App Móvil (Android)** | ⏳ | En desarrollo. |

## Reporting a Vulnerability

La seguridad de nuestros usuarios y de la plataforma es una prioridad absoluta. Si has descubierto una vulnerabilidad en eLDeSiempre.es, te agradecemos enormemente que nos lo comuniques de forma responsable.

**Por favor, NO crees un Issue público en GitHub para reportar un fallo de seguridad.**

Para reportar una vulnerabilidad, utiliza cualquiera de estos canales privados:

1. **Correo Electrónico:** Envía un correo detallado a **contacto@eldesiempre.es** con el asunto `[SECURITY] - Breve descripción del fallo`.
2. **Discord:** Si ya formas parte de nuestra comunidad, puedes abrir un ticket privado o enviar un mensaje directo al administrador a través de nuestro servidor.

### ¿Qué debes incluir en tu reporte?
Para que podamos reproducir y solucionar el problema lo más rápido posible, incluye:
*   Una descripción clara de la vulnerabilidad.
*   Los pasos exactos para reproducirla (Proof of Concept).
*   El impacto potencial (ej. robo de sesión, XSS, SQLi).
*   Si lo deseas, sugerencias para solucionarlo.

### ¿Qué puedes esperar de nosotros?
*   **Confirmación:** Te responderemos en un plazo máximo de **48 horas** confirmando la recepción de tu reporte.
*   **Actualizaciones:** Te mantendremos informado sobre el progreso de la investigación y la solución.
*   **Resolución:** Trabajaremos para desplegar un parche en el menor tiempo posible (normalmente en menos de 7 días dependiendo de la gravedad).
*   **Créditos:** Si el reporte es válido y así lo deseas, te daremos crédito público en nuestras redes sociales o en la sección de agradecimientos del proyecto.

*Gracias por ayudar a mantener eLDeSiempre.es un lugar seguro para la comunidad hispanohablante.*

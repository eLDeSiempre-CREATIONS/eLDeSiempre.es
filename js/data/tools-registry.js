export const estructuraHerramientas = {
  "red-team": {
    titulo: "Red Team & Pentesting",
    icon: "⚔️",
    desc: "Herramientas para simular ataques, encontrar vulnerabilidades y explotar sistemas.",
    herramientas: [
      { id: 'dorks', titulo: 'Generador de Dorks', desc: 'Crea consultas avanzadas para Google que revelan archivos ocultos, paneles de administración o contraseñas expuestas en un dominio.', ideal: 'Encontrar documentos filtrados.' },
      { id: 'payloads', titulo: 'Generador de Payloads', desc: 'Genera código malicioso básico para probar si tu aplicación web es vulnerable a inyecciones SQL o scripts cruzados (XSS).', ideal: 'Pruebas de concepto rápidas.' },
      { id: 'cve', titulo: 'Buscador de CVEs', desc: 'Consulta la base de datos oficial de vulnerabilidades conocidas. Introduce el nombre de un software para ver sus fallos de seguridad.', ideal: 'Investigar fallos de seguridad.' }
    ]
  },
  "blue-team": {
    titulo: "Blue Team & Forense",
    icon: "🛡️",
    desc: "Herramientas para defensa, análisis de malware y respuesta a incidentes.",
    herramientas: [
      { id: 'hash', titulo: 'Analizador de Hash', desc: 'Pega un hash para identificar qué algoritmo se usó (MD5, SHA-1, SHA-256). Útil para verificar la integridad de archivos descargados.', ideal: 'Análisis de integridad.' },
      { id: 'ssl', titulo: 'Analizador SSL/TLS', desc: 'Comprueba si el certificado de seguridad de un sitio web es válido y está correctamente configurado.', ideal: 'Auditar seguridad de servidores.' },
      { id: 'http-headers', titulo: 'Inspector de Cabeceras HTTP', desc: 'Analiza las cabeceras de seguridad que envía un servidor web. Detecta si faltan protecciones contra ataques comunes.', ideal: 'Auditar configuraciones web.' }
    ]
  },
  "osint": {
    titulo: "OSINT e Inteligencia",
    icon: "🕵️",
    desc: "Recopila información de fuentes abiertas para investigaciones.",
    herramientas: [
      { id: 'osint', titulo: 'OSINT Framework', desc: 'Un mapa visual de herramientas y fuentes de información pública. Ideal para saber por dónde empezar una investigación.', ideal: 'Investigar antecedentes.' },
      { id: 'ip', titulo: 'Buscador de IP / OSINT', desc: 'Introduce una dirección IP para descubrir su ubicación geográfica aproximada, el proveedor de internet y la organización a la que pertenece.', ideal: 'Rastrear origen de una visita.' },
      { id: 'domain', titulo: 'Reconocimiento de Dominio', desc: 'Analiza un dominio para obtener su dirección IP, los servidores de correo (MX) y otra información de infraestructura.', ideal: 'OSINT de infraestructura.' },
      { id: 'mac', titulo: 'Buscador de Fabricante (MAC)', desc: 'Introduce una dirección MAC para saber qué empresa fabricó el dispositivo (Apple, Samsung, Intel, etc.).', ideal: 'Análisis de redes locales.' },
      { id: 'email', titulo: 'Validador de Correo', desc: 'Verifica si una dirección de correo tiene un formato válido y si el dominio al que pertenece existe realmente.', ideal: 'Limpieza de bases de datos.' }
    ]
  },
  "utilidades": {
    titulo: "Utilidades y Análisis",
    icon: "🧰",
    desc: "Herramientas para análisis de datos, criptografía y conversión.",
    herramientas: [
      { id: 'exif', titulo: 'Analizador EXIF', desc: 'Sube una foto para extraer los metadatos ocultos: fecha, modelo de cámara, y coordenadas GPS de donde se tomó.', ideal: 'Saber si una foto revela tu ubicación.' },
      { id: 'pass', titulo: 'Generador de Contraseñas', desc: 'Crea contraseñas aleatorias y seguras con la longitud y los caracteres que elijas.', ideal: 'Proteger tus cuentas.' },
      { id: 'pass-strength', titulo: 'Auditor de Contraseñas', desc: 'Escribe una contraseña para saber cuánto tiempo tardaría un atacante en descifrarla mediante fuerza bruta.', ideal: 'Mejorar tu seguridad personal.' },
      { id: 'base64', titulo: 'Codificador Base64', desc: 'Convierte texto plano a Base64 y viceversa. Es un formato común para transmitir datos en la web.', ideal: 'Depurar peticiones web.' },
      { id: 'jwt', titulo: 'Inspector de JWT', desc: 'Pega un token JWT para ver su contenido decodificado (cabecera y payload) sin necesidad de una clave secreta.', ideal: 'Entender autenticación moderna.' },
      { id: 'json', titulo: 'Formateador JSON', desc: 'Pega un texto JSON desordenado para que se muestre con formato legible y validar si tiene errores de sintaxis.', ideal: 'Análisis de APIs y logs.' },
      { id: 'regex', titulo: 'Probador de Regex', desc: 'Escribe un patrón de expresión regular y un texto para ver si coinciden en tiempo real.', ideal: 'Programación y filtrado de datos.' },
      { id: 'timestamp', titulo: 'Conversor de Timestamp', desc: 'Convierte fechas normales a formato Unix (segundos desde 1970) y viceversa.', ideal: 'Análisis forense y logs.' },
      { id: 'uuid', titulo: 'Generador de UUID', desc: 'Genera identificadores únicos universales (v4) para tus pruebas de APIs.', ideal: 'Desarrollo de software seguro.' }
    ]
  },
  "redes": {
    titulo: "Redes y Comunicaciones",
    icon: "🌐",
    desc: "Analiza la seguridad de tu conexión y protocolos de red.",
    herramientas: [
      { id: 'wifi', titulo: 'Analizador de Red Wi-Fi', desc: 'Analiza la calidad y seguridad de tu conexión actual, detecta si usas WPA2 o WPA3 y comprueba tu velocidad.', ideal: 'Saber si tu red doméstica es segura.' },
      { id: 'dns', titulo: 'Fuga de DNS (DNS Leak)', desc: 'Comprueba si tu proveedor de internet está filtrando tu tráfico real o si tu VPN está funcionando correctamente.', ideal: 'Verificar privacidad de VPN.' },
      { id: 'robots', titulo: 'Analizador de Robots.txt', desc: 'Descubre qué directorios y archivos está intentando ocultar un sitio web a los motores de búsqueda.', ideal: 'Reconocimiento web (OSINT).' },
      { id: 'ua', titulo: 'Analizador User-Agent', desc: 'Descubre qué sistema operativo, navegador y motor está usando tu dispositivo.', ideal: 'Pruebas de compatibilidad web.' }
    ]
  },
  "iot": {
    titulo: "IoT y Hardware",
    icon: "🔌",
    desc: "Herramientas para el análisis de dispositivos conectados y hardware.",
    herramientas: [
      { id: 'iot-scan', titulo: 'Escáner de Dispositivos IoT', desc: 'Busca dispositivos conectados a tu red local y muestra su IP, MAC y fabricante.', ideal: 'Descubrir dispositivos en tu red.' },
      { id: 'firmware', titulo: 'Analizador de Firmware', desc: 'Sube un archivo de firmware para extraer cadenas de texto y buscar credenciales o URLs ocultas.', ideal: 'Análisis de seguridad de dispositivos.' }
    ]
  }
};

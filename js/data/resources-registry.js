export const estructuraRecursos = {
  "formacion": { 
    titulo: "Formación y Certificaciones", 
    icon: "🎓", 
    desc: "Cursos, plataformas y certificaciones.", 
    subcats: [
      { slug: "plataformas", titulo: "Plataformas de Práctica", icon: "🎯", desc: "Entornos seguros para practicar (CTFs, Wargames).", ids: [1, 4, 5, 6, 7, 12, 13, 14, 15, 19, 20, 21] },
      { slug: "certificaciones", titulo: "Certificaciones", icon: "📜", desc: "Certificaciones oficiales del sector.", ids: [] }
    ]
  },
  "red-team": { 
    titulo: "Red Team & Pentesting", 
    icon: "⚔️", 
    desc: "Herramientas y documentación para pruebas de penetración.", 
    subcats: [
      { slug: "herramientas-pentesting", titulo: "Herramientas Interactivas", icon: "🔧", desc: "Utilidades de hacking en tiempo real.", customView: "tools", catFilter: "red-team" },
      { slug: "labs-vulnerables", titulo: "Laboratorios Vulnerables", icon: "🧪", desc: "Máquinas virtuales para practicar.", ids: [2, 23, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34] }
    ]
  },
  "blue-team": { 
    titulo: "Blue Team & Forense", 
    icon: "🛡️", 
    desc: "Defensa, análisis forense y respuesta a incidentes.", 
    subcats: [
      { slug: "herramientas-defensa", titulo: "Herramientas Interactivas", icon: "🔧", desc: "Utilidades de defensa en tiempo real.", customView: "tools", catFilter: "blue-team" },
      { slug: "recursos-blue", titulo: "Documentación y Recursos", icon: "📚", desc: "Herramientas para análisis forense.", ids: [3, 35, 36, 37, 38, 39, 40] }
    ]
  },
  "osint": { 
    titulo: "OSINT e Inteligencia", 
    icon: "🕵️", 
    desc: "Inteligencia de fuentes abiertas para investigar.", 
    subcats: [
      { slug: "osint-tools", titulo: "Herramientas Interactivas", icon: "🔍", desc: "Utilidades OSINT en tiempo real.", customView: "tools", catFilter: "osint" },
      { slug: "busqueda-personas", titulo: "Recursos y Búsqueda", icon: "👤", desc: "Enlaces para investigar identidades.", ids: [41, 42, 44, 45, 46, 47, 48, 49, 50] }
    ]
  },
  "sistemas-dev": { 
    titulo: "Sistemas y Desarrollo", 
    icon: "💻", 
    desc: "Sistemas operativos, programación y desarrollo seguro.", 
    subcats: [
      { slug: "distros", titulo: "Distribuciones Linux", icon: "🐧", desc: "Sistemas operativos enfocados en seguridad.", ids: [58, 59, 60, 61, 62, 63, 64, 65] },
      { slug: "dev-tools", titulo: "Herramientas Interactivas", icon: "🧰", desc: "Utilidades de desarrollo en tiempo real.", customView: "tools", catFilter: "utilidades" }
    ]
  },
  "hardware-redes": { 
    titulo: "Hardware y Redes", 
    icon: "🛠️", 
    desc: "Hacking de hardware, IoT y protocolos de red.", 
    subcats: [
      { slug: "redes-tools", titulo: "Herramientas de Red", icon: "📡", desc: "Utilidades interactivas para analizar conexiones.", customView: "tools", catFilter: "redes" },
      { slug: "hardware-hacking", titulo: "Hardware Hacking e IoT", icon: "🔌", desc: "Internet de las Cosas y análisis de firmware.", ids: [104, 105, 106, 116, 117, 118, 119] },
      { slug: "flipper-zero", titulo: "Flipper Zero", icon: "🐬", desc: "Scripts y payloads para Flipper Zero.", customView: "flipper" }
    ]
  },
  "cultura": { 
    titulo: "Cultura y Bibliografía", 
    icon: "📚", 
    desc: "Libros, referentes hispanos, noticias y comunidad.", 
    subcats: [
      { slug: "referentes", titulo: "Referentes Hispanos", icon: "🗣️", desc: "Hackers y divulgadores en español.", ids: [71, 72, 73, 74, 75, 76] },
      { slug: "libros", titulo: "Bibliografía Esencial", icon: "📖", desc: "Los mejores libros de ciberseguridad.", ids: [84, 85, 86, 9, 77, 78, 79, 80, 81, 82, 83, 87, 88] },
      { slug: "metodos", titulo: "Metodologías", icon: "📋", desc: "Metodologías de auditoría y pentesting.", ids: [101, 102, 103] }
    ]
  }
};

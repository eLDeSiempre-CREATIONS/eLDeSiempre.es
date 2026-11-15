export const estructuraRecursos = {
  "formacion": { 
    titulo: "Formación y Certificaciones", 
    icon: "🎓", 
    desc: "Cursos, plataformas y certificaciones.", 
    subcats: [
      { slug: "plataformas", catId: 10, titulo: "Plataformas de Práctica", icon: "🎯", desc: "Entornos seguros para practicar." },
      { slug: "certificaciones", catId: 11, titulo: "Certificaciones", icon: "📜", desc: "Certificaciones oficiales." }
    ]
  },
  "red-team": { 
    titulo: "Red Team & Pentesting", 
    icon: "⚔️", 
    desc: "Herramientas y documentación para pruebas de penetración.", 
    subcats: [
      { slug: "herramientas-pentesting", titulo: "Herramientas Interactivas", icon: "🔧", desc: "Utilidades de hacking en tiempo real.", customView: "tools", catFilter: "red-team" },
      { slug: "labs-vulnerables", catId: 21, titulo: "Laboratorios Vulnerables", icon: "🧪", desc: "Máquinas virtuales para practicar." }
    ]
  },
  "blue-team": { 
    titulo: "Blue Team & Forense", 
    icon: "🛡️", 
    desc: "Defensa y respuesta a incidentes.", 
    subcats: [
      { slug: "herramientas-defensa", titulo: "Herramientas Interactivas", icon: "🔧", desc: "Utilidades en tiempo real.", customView: "tools", catFilter: "blue-team" },
      { slug: "recursos-blue", catId: 30, titulo: "Documentación y Recursos", icon: "📚", desc: "Herramientas para análisis forense." }
    ]
  },
  "osint": { 
    titulo: "OSINT e Inteligencia", 
    icon: "🕵️", 
    desc: "Inteligencia de fuentes abiertas.", 
    subcats: [
      { slug: "osint-tools", titulo: "Herramientas Interactivas", icon: "🔍", desc: "Utilidades OSINT en tiempo real.", customView: "tools", catFilter: "osint" },
      { slug: "busqueda-personas", catId: 40, titulo: "Recursos y Búsqueda", icon: "👤", desc: "Enlaces para investigar identidades." }
    ]
  },
  "sistemas-dev": { 
    titulo: "Sistemas y Desarrollo", 
    icon: "💻", 
    desc: "Sistemas operativos y programación.", 
    subcats: [
      { slug: "distros", catId: 50, titulo: "Distribuciones Linux", icon: "🐧", desc: "Sistemas operativos." },
      { slug: "dev-tools", titulo: "Herramientas Interactivas", icon: "🧰", desc: "Utilidades en tiempo real.", customView: "tools", catFilter: "utilidades" }
    ]
  },
  "hardware-redes": { 
    titulo: "Hardware y Redes", 
    icon: "🛠️", 
    desc: "Hacking de hardware, IoT y redes.", 
    subcats: [
      { slug: "redes-tools", titulo: "Herramientas de Red", icon: "📡", desc: "Utilidades para conexiones.", customView: "tools", catFilter: "redes" },
      { slug: "hardware-hacking", catId: 60, titulo: "Hardware Hacking e IoT", icon: "🔌", desc: "Análisis de firmware." },
      { slug: "flipper-zero", titulo: "Flipper Zero", icon: "🐬", desc: "Scripts para Flipper Zero.", customView: "flipper" }
    ]
  },
  "cultura": { 
    titulo: "Cultura y Bibliografía", 
    icon: "📚", 
    desc: "Libros, referentes y comunidad.", 
    subcats: [
      { slug: "referentes", catId: 70, titulo: "Referentes Hispanos", icon: "🗣️", desc: "Hackers y divulgadores." },
      { slug: "libros", catId: 71, titulo: "Bibliografía Esencial", icon: "📖", desc: "Los mejores libros." },
      { slug: "metodos", catId: 101, titulo: "Metodologías", icon: "📋", desc: "Metodologías de pentesting." }
    ]
  }
};

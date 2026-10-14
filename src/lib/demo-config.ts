// ============================================================
// ARCHIVO PRINCIPAL DE CONFIGURACIÓN DE LA DEMO
// Editá solo este archivo para personalizar toda la demo.
// ============================================================

export const demoConfig = {

  // ── Información del negocio ──────────────────────────────
  business: {
    name: 'Torneo Imperial',
    tagline: 'Coronado de Gloria. Juguemos.',
    // phone vacío a propósito (no mostrar un número inventado en pantalla) y
    // whatsapp con placeholder: reemplazar por el número real antes de publicar.
    phone: '',
    email: 'torneoimperial@hotmail.com',
    address: 'Colectora Variante Juárez Celman 500, Córdoba',
    whatsapp: '5493510000000',
    instagram: '@torneoimperial',
    facebook: '',
  },

  // ── Acción principal del negocio ─────────────────────────
  // Un solo lugar que sincroniza Navbar + Hero + botón flotante de WhatsApp.
  cta: {
    label: 'Inscribí a tu equipo',
    whatsappMessage: 'Hola! Quiero anotar a mi equipo en el Torneo Imperial.',
  },

  // ── Sitemap real ──────────────────────────────────────────
  // Rutas propias además del home: Navbar y Footer las renderizan como links reales.
  sitemap: [
    { label: 'Posiciones', href: '/posiciones' },
    { label: 'Fixture',    href: '/fixture' },
    { label: 'Equipos',    href: '/equipos' },
    { label: 'Campeones',  href: '/campeones' },
    { label: 'Sanciones',  href: '/sanciones' },
  ],

  // ── Identidad visual (tokens semánticos) ─────────────────
  // Paleta del escudo real (logo-mark.png): teal #0494a4 + dorado #f3a21c. El fondo
  // oscuro (#062f36) es un teal profundo derivado del logo, para que el escudo se lea.
  brand: {
    background:   '#ffffff',
    surface:      '#eef6f7',
    surfaceAlt:   '#ffffff',
    heading:      '#062f36',
    text:         '#1f3a40',
    muted:        '#5b7479',
    border:       '#d9e8ea',
    accent:       '#f3a21c',
    onAccent:     '#062f36',
    structural:   '#062f36',
    onStructural: '#ffffff',
    // Par de fuentes: Oswald (condensada, ya usada en la marca real del torneo) para
    // títulos + Montserrat para el cuerpo — el mismo par que usan los clubes de
    // referencia (Gymbox, Third Space) para su tipografía institucional.
    headingFont: 'Oswald',
    bodyFont: 'Montserrat',
  },

  // ── Lenguaje visual ──────────────────────────────────────
  // Radio filoso + cards con borde (no sombra difusa): look de tabla/scoreboard
  // oficial, no de landing corporativa genérica — dirección tomada de clubes
  // deportivos premium (Gymbox, Third Space, Brooklyn Fitboxing).
  style: {
    theme:  'light' as 'light' | 'dark',
    radius: 'round' as 'sharp' | 'soft' | 'round',
    cards:  'shadow' as 'shadow' | 'border' | 'glass',
  },

  // ── Imágenes ─────────────────────────────────────────────
  // Fotos reales de fútbol (Pexels, uso libre) — el sitio actual no tiene
  // fotos propias descargables (mirror solo HTML, sin wp-content/uploads).
  images: {
    hero:    '/images/hero.jpg',
    about:   '/images/about.jpg',
    gallery: [
      '/images/gallery-1.jpg',
      '/images/gallery-2.jpg',
      '/images/gallery-3.jpg',
      '/images/gallery-4.jpg',
      '/images/gallery-5.jpg',
      '/images/gallery-6.jpg',
    ],
  },

  // ── Secciones activas ────────────────────────────────────
  sections: {
    hero:         true,
    stats:        true,
    about:        true,
    gallery:      true,
    appShowcase:  false,
    schedule:     false,
    pricing:      false,
    testimonials: false,
    team:         false,
    faq:          true,
    cta:          true,
    contact:      false,
  },

  // ── Contenido editable ───────────────────────────────────
  content: {

    about: {
      eyebrow: 'Quiénes somos',
      title: 'Un complejo a la altura de un club profesional',
      body: 'Queremos que vivas una experiencia diferente, que disfrutes cada fecha en el mejor lugar. Construimos un espacio a la altura de un complejo profesional: canchas de césped natural con riego artificial, vestuarios completos y todo lo necesario para disfrutar el tercer tiempo después del partido.',
      bullets: [
        'Canchas de césped natural con riego artificial',
        'Vestuarios, estacionamiento y asadores propios',
        'Categorías Libre, +30, +35, +40, +45 y Femenino',
      ],
    },

    cta: {
      title: '¿Tu equipo ya tiene lugar en la próxima fecha?',
      subtitle: 'Anotate en Torneo Imperial y sumate a la mejor competencia amateur de Córdoba.',
    },

    testimonials: [
      {
        name: 'Diego R.',
        role: 'Capitán, Deportivo San Martín +40',
        text: 'Jugamos en un montón de torneos y este es de los mejor organizados: canchas impecables y fixture siempre al día.',
        rating: 5,
        avatar: '',
      },
      {
        name: 'Marcela T.',
        role: 'Capitana, Las Imperiales FEM',
        text: 'El femenino creció un montón desde que empezamos a jugar acá. Se nota que quieren que la categoría siga sumando equipos.',
        rating: 5,
        avatar: '',
      },
      {
        name: 'Sergio P.',
        role: 'Jugador, El Tala +35',
        text: 'El tercer tiempo con el asador después de cada fecha ya es una tradición del equipo. Volvemos siempre.',
        rating: 5,
        avatar: '',
      },
    ],

    faq: [
      {
        question: '¿Cómo me anoto con mi equipo?',
        answer: 'Escribinos por WhatsApp o Instagram con el nombre del equipo y la categoría (Libre, +30, +35, +40, +45 o Femenino). Se abona una seña como parte de la inscripción y se completa la lista de buena fe (hasta 25 jugadores) antes de la segunda fecha.',
      },
      {
        question: '¿Cómo se define el campeón de cada categoría?',
        answer: 'Fase regular todos contra todos: 3 puntos por partido ganado, 1 por empate. Los primeros de cada zona clasifican a Copa de Oro (los siguientes a Copa de Plata y Bronce, según la categoría) y se define por eliminación directa. En caso de igualdad en la tabla desempata: diferencia de gol, goles a favor, resultado entre sí y sorteo.',
      },
      {
        question: '¿Qué pasa con las tarjetas y las expulsiones?',
        answer: 'Un jugador expulsado por doble amarilla se pierde la fecha siguiente; una roja directa suma más fechas según la gravedad de la falta. 5 amarillas acumuladas en el torneo son 1 fecha de suspensión y, al llegar a 10, se suman 2 fechas más — se limpian al terminar la fase regular.',
      },
      {
        question: '¿Hay arbitraje en todos los partidos?',
        answer: 'Sí, cada partido de cada categoría tiene árbitro y veedor de la organización, que controla la planilla, la identidad de los jugadores y el cumplimiento del reglamento.',
      },
      {
        question: '¿Tienen estacionamiento y asador?',
        answer: 'Sí, el complejo cuenta con estacionamiento propio, asadores y cantina para disfrutar el tercer tiempo después de cada partido.',
      },
    ],

    stats: [
      { value: '6',  label: 'Categorías' },
      { value: '40+', label: 'Equipos compitiendo' },
      { value: '4',  label: 'Canchas de césped natural' },
      { value: '5+', label: 'Años de trayectoria' },
    ],

    team: [] as { name: string; role: string; photo: string; instagram: string }[],
    pricing: [] as { name: string; price: string; description: string; features: string[]; highlighted: boolean }[],

  },
}

export type DemoConfig = typeof demoConfig

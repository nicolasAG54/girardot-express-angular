import { SITE_CONTENT } from './site-content';

export interface ChatbotAction {
  readonly label: string;
  readonly href: string;
  readonly external?: boolean;
}

export interface ChatbotReply {
  readonly answer: string;
  readonly actions?: readonly ChatbotAction[];
}

export interface ChatbotQuickAction {
  readonly label: string;
  readonly prompt: string;
}

interface ChatbotIntent extends ChatbotReply {
  readonly question: string;
  readonly keywords: readonly string[];
  readonly shortQueries?: readonly string[];
}

function advisorFor(message: string, label = 'Hablar con un asesor'): ChatbotAction {
  return {
    label,
    href: `${SITE_CONTENT.whatsappUrl}?text=${encodeURIComponent(message)}`,
    external: true,
  };
}

const advisorAction = advisorFor('Hola, quisiera recibir orientación sobre Girardot Express.');

const mapAction: ChatbotAction = {
  label: 'Ver ubicación',
  href: SITE_CONTENT.mapsUrl,
  external: true,
};

const commercialAction: ChatbotAction = {
  label: 'Solicitar información comercial',
  href: '/proyecto#contacto-comercial',
};

const portfolioAction = advisorFor(
  'Hola, quisiera solicitar el portafolio comercial de Girardot Express.',
  'Solicitar portafolio comercial',
);

const instagramAction: ChatbotAction = {
  label: `Instagram ${SITE_CONTENT.socialHandle}`,
  href: SITE_CONTENT.social.instagram,
  external: true,
};

// Las 21 preguntas del documento del cliente. Los datos comerciales se consultan con un asesor.
const chatbotIntents: readonly ChatbotIntent[] = [
  {
    question: '¿Qué es Girardot Express?',
    keywords: ['sobre girardot express', 'que es el proyecto', 'que tipo de centro comercial'],
    shortQueries: ['girardot express', 'centro comercial', 'mall de conveniencia'],
    answer:
      'Girardot Express es un nuevo mall de conveniencia que integra compras, servicios, gastronomía, bienestar y experiencias en un entorno abierto, cómodo y funcional, diseñado para que encuentres todo lo que necesitas en un solo lugar.',
    actions: [{ label: 'Conocer el proyecto', href: '/proyecto' }],
  },
  {
    question: '¿Dónde está ubicado Girardot Express?',
    keywords: [
      'ubicacion', 'direccion', 'donde queda', 'donde esta ubicado', 'como llegar',
      'via narino', 'la colina',
    ],
    shortQueries: ['mapa', 'sector'],
    answer: `Girardot Express está ubicado en ${SITE_CONTENT.address}, sobre la Vía Nariño, en el sector de La Colina. Está en una zona de expansión de la ciudad, con conexión a transporte público y cercanía a escenarios deportivos. Puedes abrir el mapa para consultar cómo llegar.`,
    actions: [mapAction],
  },
  {
    question: '¿Hay locales disponibles?',
    keywords: [
      'locales disponibles', 'local disponible', 'hay locales', 'disponibilidad de locales',
      'disponibilidad de espacios', 'locales en arriendo', 'arrendar un local',
      'alquilar un local', 'rentar un local', 'busco un local',
    ],
    shortQueries: ['disponibilidad', 'arrendar', 'alquiler', 'rentar'],
    answer:
      'Sí. Girardot Express se encuentra en etapa de construcción y comercialización. Puedes consultar los espacios disponibles con nuestro equipo comercial, que te orientará según el tipo de negocio, formato y necesidades de operación.',
    actions: [advisorFor('Hola, quisiera consultar los locales disponibles en Girardot Express.')],
  },
  {
    question: '¿Cuánto cuesta un local?',
    keywords: [
      'precio de un local', 'precios de locales', 'valor de un local', 'costo de un local',
      'cuanto vale un local', 'cuanto cuesta el arriendo', 'valor del arriendo',
      'precio del arriendo', 'canon de arrendamiento', 'canon de arriendo',
    ],
    shortQueries: ['precio', 'precios', 'valor', 'costo', 'canon', 'arriendo', 'cuanto cuesta'],
    answer:
      'Las condiciones comerciales dependen del espacio, su ubicación dentro del proyecto, el área requerida y las características de cada operación. Puedes hablar con nuestro equipo comercial para solicitar una propuesta ajustada a tu marca.',
    actions: [advisorFor('Hola, quisiera consultar las condiciones y el precio de un local en Girardot Express.')],
  },
  {
    question: '¿Qué tamaños de locales tienen disponibles?',
    keywords: [
      'tamano de local', 'tamanos de locales', 'metros cuadrados', 'cuantos metros',
      'area de un local', 'areas de locales', 'local grande', 'local pequeno', 'm2',
    ],
    shortQueries: ['tamano', 'tamanos', 'area', 'areas', 'formatos', 'islas', 'oficinas'],
    answer:
      'Girardot Express contará con distintos formatos de espacios comerciales para comercios, franquicias, servicios y operadores. Nuestro equipo comercial puede ampliar la información sobre las áreas y ubicaciones disponibles según las necesidades de tu negocio.',
    actions: [advisorFor('Hola, quisiera conocer los tamaños y formatos de locales disponibles en Girardot Express.')],
  },
  {
    question: 'Tengo un negocio y estoy interesado en un local',
    keywords: [
      'tengo un negocio', 'tengo una marca', 'llevar mi marca', 'quiero un local',
      'interesado en un local', 'expandir mi negocio', 'mi empresa', 'mi franquicia',
    ],
    answer:
      '¡Nos encantará conocer tu negocio! Girardot Express busca reunir conceptos atractivos y útiles para la comunidad. Puedes hablar con nuestro equipo para conocer el proyecto, las oportunidades disponibles, las características de los espacios y las condiciones comerciales.',
    actions: [advisorFor('Hola, tengo un negocio y estoy interesado en un local en Girardot Express.')],
  },
  {
    question: '¿Cómo puedo separar o reservar un local?',
    keywords: [
      'separar un local', 'reservar un local', 'apartar un local', 'reserva de local',
      'proceso de arriendo', 'proceso de negociacion',
    ],
    shortQueries: ['separar', 'reservar', 'reserva', 'apartar'],
    answer:
      'Para iniciar el proceso puedes comunicarte con nuestro equipo comercial. Un asesor podrá conocer tu marca, revisar la disponibilidad y ayudarte a seleccionar un espacio; también te explicará las condiciones y los pasos para avanzar con la reserva o vinculación.',
    actions: [advisorFor('Hola, quisiera conocer el proceso para reservar un local en Girardot Express.')],
  },
  {
    question: '¿Qué marcas estarán en Girardot Express?',
    keywords: ['que marcas', 'marcas confirmadas', 'que tiendas', 'que negocios', 'quienes estaran', 'mezcla comercial'],
    shortQueries: ['marcas', 'tiendas', 'negocios'],
    answer:
      'Tendremos una mezcla comercial pensada para nuestra población, con marcas y conceptos de compras, gastronomía, servicios, bienestar y experiencias. Nuestro equipo comercial puede ampliar la información sobre las marcas y el proyecto.',
    actions: [advisorFor('Hola, quisiera conocer más sobre las marcas y la mezcla comercial de Girardot Express.')],
  },
  {
    question: '¿Cuándo abre Girardot Express?',
    keywords: ['cuando abre', 'apertura', 'inauguracion', 'fecha de apertura', 'cuando van a abrir'],
    shortQueries: ['abrir', 'fecha', '2026'],
    answer: `${SITE_CONTENT.openingLabel}. La fecha exacta de inauguración se anunciará en la página web y las redes sociales del centro comercial. Síguenos como ${SITE_CONTENT.socialHandle} para conocer las novedades y avances.`,
    actions: [instagramAction],
  },
  {
    question: '¿Puedo conocer el proyecto antes de adquirir un local?',
    keywords: ['conocer el proyecto', 'visitar el proyecto', 'visita comercial', 'coordinar una reunion', 'presentacion del proyecto', 'antes de adquirir'],
    shortQueries: ['visita', 'visitar', 'reunion', 'presentacion', 'render'],
    answer:
      'Sí. Puedes solicitar información comercial y coordinar una reunión con nuestro equipo para conocer mejor el proyecto y las oportunidades disponibles para tu negocio.',
    actions: [commercialAction],
  },
  {
    question: '¿Girardot Express tendrá restaurantes o plazoleta de comidas?',
    keywords: ['restaurantes', 'restaurante', 'gastronomia', 'plazoleta', 'comida', 'comidas', 'comer', 'cafe'],
    answer:
      'Sí. La gastronomía hará parte de la experiencia de Girardot Express. El proyecto contempla islas, plazoleta de comidas y espacios para diferentes conceptos gastronómicos, pensados para compartir, hacer una pausa y disfrutar con quienes quieras.',
  },
  {
    question: '¿Girardot Express tendrá parqueaderos?',
    keywords: ['parqueaderos', 'parqueadero', 'parqueo', 'estacionamiento', 'estacionar'],
    answer:
      'Sí. Girardot Express contará con zonas de parqueo para motos, bicicletas, carros y personas con movilidad reducida. El proyecto también contempla infraestructura para movilidad eléctrica.',
  },
  {
    question: '¿Dónde puedo ver los planos o encontrar información de los espacios disponibles?',
    keywords: ['planos', 'distribucion de espacios', 'distribucion comercial', 'portafolio comercial', 'portafolio'],
    answer:
      'Puedes solicitar el portafolio comercial y coordinar una reunión con nuestro equipo para conocer mejor el proyecto, su distribución y las alternativas disponibles según tu tipo de negocio. Usa estas opciones para iniciar la consulta con el equipo comercial.',
    actions: [portfolioAction, commercialAction],
  },
  {
    question: '¿Cómo puedo comunicarme con Girardot Express?',
    keywords: ['contacto', 'telefono', 'whatsapp', 'correo', 'asesor', 'comunicarme', 'redes sociales'],
    answer: `Puedes comunicarte directamente por WhatsApp al ${SITE_CONTENT.whatsappLabel} o escribir a ${SITE_CONTENT.email}. También puedes seguir las novedades del proyecto en Instagram como ${SITE_CONTENT.socialHandle}.`,
    actions: [advisorAction, { label: 'Enviar correo', href: `mailto:${SITE_CONTENT.email}` }, instagramAction],
  },
  {
    question: 'Quiero recibir más información de Girardot Express',
    keywords: ['mas informacion', 'quiero informacion', 'recibir informacion', 'estoy interesado'],
    shortQueries: ['informacion', 'novedades'],
    answer:
      '¡Claro! Puedo orientarte sobre ubicación, espacios comerciales, gastronomía, servicios, zonas comunes y otros aspectos de Girardot Express. Indícame qué deseas conocer o usa el botón para hablar con nuestro equipo comercial.',
    actions: [advisorAction],
  },
  {
    question: '¿Qué servicios tendrá Girardot Express?',
    keywords: ['servicios', 'zonas comunes', 'amenidades', 'coworking', 'parque infantil', 'vigilancia', 'seguridad'],
    answer:
      'Girardot Express contará con plazoleta de comidas, espacios de coworking, parque infantil, zona para mascotas y facilidades de parqueo. También tendrá ascensores, escaleras eléctricas, rampas peatonales, vigilancia, circuito cerrado de televisión y sistemas de respaldo y seguridad.',
  },
  {
    question: '¿Girardot Express será pet friendly?',
    keywords: ['mascotas', 'perros', 'pet friendly', 'animales'],
    answer:
      'El proyecto contempla un espacio para mascotas. Las condiciones de ingreso y uso de estos espacios serán informadas oficialmente antes de la apertura.',
  },
  {
    question: '¿Habrá puntos de carga para vehículos eléctricos?',
    keywords: ['electrolinera', 'carga electrica', 'carga para vehiculos', 'carro electrico', 'vehiculo electrico', 'vehiculos electricos', 'cargador ev', 'cargadores'],
    answer:
      'Sí. Girardot Express contempla infraestructura de carga para vehículos eléctricos como parte de sus servicios y de su enfoque hacia una movilidad más sostenible.',
  },
  {
    question: '¿El proyecto tendrá facilidades de accesibilidad y movilidad?',
    keywords: ['accesibilidad', 'movilidad reducida', 'rampas', 'ascensores', 'escaleras electricas', 'discapacidad', 'silla de ruedas'],
    answer:
      'Sí. El diseño contempla facilidades de circulación y acceso, como rampas peatonales, ascensores y escaleras eléctricas, para hacer más cómodo el recorrido entre los diferentes espacios del mall.',
  },
  {
    question: '¿Girardot Express es un proyecto sostenible con el medio ambiente?',
    keywords: ['sostenibilidad', 'sostenible', 'iluminacion natural', 'ventilacion', 'ecoeficiente', 'medio ambiente'],
    answer:
      'Girardot Express ha sido concebido con un enfoque de funcionalidad y sostenibilidad. Su propuesta incorpora iluminación natural, ventilación cruzada, áreas abiertas y materiales ecoeficientes, buscando mayor confort y una mejor integración con el entorno.',
  },
  {
    question: '¿Por qué Girardot Express es una oportunidad para mi negocio?',
    keywords: ['oportunidad para mi negocio', 'oportunidad comercial', 'por que alquilar', 'por que arrendar', 'por que invertir en el proyecto', 'expansion de mi negocio', 'via nacional'],
    shortQueries: ['oportunidad', 'expansion'],
    answer: `Girardot Express es una oportunidad para posicionar tu negocio donde la ciudad está creciendo. Su ubicación en una zona de expansión, sobre una vía nacional de alto tráfico, su fácil acceso, cercanía con Bogotá y amplia fachada ofrecen exposición para nuevos formatos comerciales. Reunirá compras, gastronomía, servicios, bienestar y experiencias para residentes y visitantes. ${SITE_CONTENT.openingLabel}.`,
    actions: [portfolioAction],
  },
  {
    // La opción de inversión necesita orientación comercial; no implica venta ni rentabilidad.
    question: 'Inversión en el Proyecto',
    keywords: ['quiero invertir', 'invertir en girardot express', 'comprar un local', 'venta de locales', 'retorno de inversion', 'rentabilidad', 'inversion'],
    answer:
      'Si te interesa invertir en el proyecto o consultar la posibilidad de adquirir un espacio, habla con nuestro equipo comercial. Un asesor podrá explicarte las alternativas y condiciones vigentes según tu interés.',
    actions: [advisorFor('Hola, quisiera consultar las alternativas y condiciones de inversión en Girardot Express.')],
  },
];

export const CHATBOT_QUICK_ACTIONS: readonly ChatbotQuickAction[] = [
  { label: 'Locales en Arriendo', prompt: '¿Hay locales disponibles?' },
  { label: 'Portafolio Comercial', prompt: 'Portafolio Comercial' },
  { label: 'Ubicación', prompt: '¿Dónde está ubicado Girardot Express?' },
  { label: 'Sobre Girardot Express', prompt: '¿Qué es Girardot Express?' },
  { label: 'Inversión en el Proyecto', prompt: 'Inversión en el Proyecto' },
  { label: 'Hablar con un asesor', prompt: '¿Cómo puedo comunicarme con un asesor?' },
];

export const CHATBOT_FALLBACK_REPLY: ChatbotReply = {
  answer:
    'No encontré una respuesta clara para tu consulta. Puedes preguntarme por locales disponibles, precios, ubicación, servicios, marcas, apertura o contacto. Si necesitas varios temas, pregúntame uno a la vez; también puedes hablar con un asesor.',
  actions: [advisorAction],
};

function normalize(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const linkingWords = new Set([
  'a', 'al', 'antes', 'como', 'con', 'cual', 'cuales', 'de', 'del', 'donde', 'el', 'en',
  'es', 'esta', 'estaran', 'este', 'express', 'girardot', 'habra', 'hay', 'la', 'las',
  'lo', 'los', 'mi', 'o', 'para', 'por', 'puedo', 'que', 'quiero', 'se', 'sera', 'sobre',
  'su', 'sus', 'tendra', 'tengo', 'tiene', 'tienen', 'tu', 'un', 'una', 'y',
]);

function keywordScore(input: string, keyword: string): number {
  const normalizedKeyword = normalize(keyword);
  if (input === normalizedKeyword) return 1000;

  const keywordWords = normalizedKeyword.split(' ').filter((word) => !linkingWords.has(word));

  // Los límites de palabra evitan que «comer» coincida dentro de «comercial».
  if (` ${input} `.includes(` ${normalizedKeyword} `)) return 40 + keywordWords.length * 8;

  const inputWords = new Set(input.split(' '));
  return keywordWords.length >= 2 && keywordWords.every((word) => inputWords.has(word))
    ? 24 + keywordWords.length * 8
    : 0;
}

function matchIntent(input: string): { intent?: ChatbotIntent; score: number } {
  let bestIntent: ChatbotIntent | undefined;
  let bestScore = 0;
  let tied = false;

  for (const intent of chatbotIntents) {
    const score = intent.shortQueries?.some((phrase) => input === normalize(phrase))
      ? 1000
      : Math.max(...[intent.question, ...intent.keywords].map((phrase) => keywordScore(input, phrase)));

    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent;
      tied = false;
    } else if (score > 0 && score === bestScore) {
      tied = true;
    }
  }

  return { intent: tied ? undefined : bestIntent, score: bestScore };
}

export function findChatbotReply(query: string): ChatbotReply {
  const input = normalize(query);
  if (!input) return CHATBOT_FALLBACK_REPLY;

  const match = matchIntent(input);
  if (!match.intent) return CHATBOT_FALLBACK_REPLY;

  // Una pregunta canónica puede contener «y» u «o» dentro de un solo tema.
  // En las demás, reconocer temas distintos evita responder solo a la mitad de la consulta.
  if (match.score < 1000) {
    const subjects = new Set(
      input.split(/\s+(?:y|o)\s+/)
        .map((clause) => matchIntent(clause).intent)
        .filter((intent) => intent !== undefined),
    );
    if (subjects.size > 1) return CHATBOT_FALLBACK_REPLY;
  }

  return match.intent;
}

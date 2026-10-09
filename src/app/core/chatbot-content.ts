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
  readonly audience?: FaqAudience;
  readonly question: string;
  readonly relatedQuestions?: readonly string[];
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

export type FaqAudience = 'visitor' | 'commercial';

// Ocho respuestas compartidas por la página y el asistente. Conservamos las
// 21 preguntas originales como alias para que sigan siendo fáciles de encontrar.
export const FAQ_ITEMS: readonly ChatbotIntent[] = [
  {
    question: '¿Qué es Girardot Express y cuándo abre?',
    relatedQuestions: ['¿Qué es Girardot Express?', '¿Cuándo abre Girardot Express?'],
    keywords: [
      'sobre girardot express', 'que es el proyecto', 'que tipo de centro comercial',
      'cuando abre', 'apertura', 'inauguracion', 'fecha de apertura', 'cuando van a abrir',
    ],
    shortQueries: ['girardot express', 'centro comercial', 'mall de conveniencia', 'abrir', 'fecha', '2026'],
    answer: `Girardot Express es un nuevo mall de conveniencia que reunirá compras, servicios, gastronomía, bienestar y experiencias en un entorno abierto. ${SITE_CONTENT.openingLabel}. La fecha exacta de inauguración se anunciará en esta página y en nuestras redes sociales.`,
    actions: [instagramAction],
  },
  {
    question: '¿Dónde está ubicado y cómo llego?',
    relatedQuestions: ['¿Dónde está ubicado Girardot Express?'],
    keywords: [
      'ubicacion', 'direccion', 'donde queda', 'donde esta ubicado', 'como llegar',
      'via narino', 'la colina',
    ],
    shortQueries: ['mapa', 'sector'],
    answer: `Estamos en ${SITE_CONTENT.address}, sobre la Vía Nariño, en el sector de La Colina. Es una zona de expansión con conexión a transporte público y cercana a escenarios deportivos. Abre el mapa para consultar la ruta.`,
    actions: [mapAction],
  },
  {
    question: '¿Qué tiendas y restaurantes tendrá?',
    audience: 'visitor',
    relatedQuestions: [
      '¿Qué marcas estarán en Girardot Express?',
      '¿Girardot Express tendrá restaurantes o plazoleta de comidas?',
    ],
    keywords: [
      'que marcas', 'marcas confirmadas', 'que tiendas', 'que negocios', 'quienes estaran',
      'mezcla comercial', 'restaurantes', 'restaurante', 'gastronomia', 'plazoleta',
      'comida', 'comidas', 'comer', 'cafe',
    ],
    shortQueries: ['marcas', 'tiendas', 'negocios'],
    answer:
      'El proyecto contempla una mezcla comercial de compras, servicios, bienestar y experiencias, con plazoleta de comidas, islas y espacios para diferentes conceptos gastronómicos. Las marcas y los operadores están por confirmar; el directorio se publicará cuando estén confirmados.',
  },
  {
    question: '¿Qué servicios tendrá para mi visita?',
    audience: 'visitor',
    relatedQuestions: [
      '¿Qué servicios tendrá Girardot Express?',
      '¿Girardot Express tendrá parqueaderos?',
      '¿Girardot Express será pet friendly?',
      '¿Habrá puntos de carga para vehículos eléctricos?',
      '¿El proyecto tendrá facilidades de accesibilidad y movilidad?',
    ],
    keywords: [
      'servicios', 'zonas comunes', 'amenidades', 'coworking', 'parque infantil', 'vigilancia',
      'seguridad', 'parqueaderos', 'parqueadero', 'parqueo', 'estacionamiento', 'estacionar',
      'mascotas', 'perros', 'pet friendly', 'animales', 'electrolinera', 'carga electrica',
      'carga para vehiculos', 'carro electrico', 'vehiculo electrico', 'vehiculos electricos',
      'cargador ev', 'cargadores', 'accesibilidad', 'movilidad reducida', 'rampas',
      'ascensores', 'escaleras electricas', 'discapacidad', 'silla de ruedas',
    ],
    answer:
      'Se proyectan coworking, parque infantil, zona para mascotas y parqueo para motos, bicicletas, carros y personas con movilidad reducida. Las facilidades de circulación previstas incluyen rampas, ascensores y escaleras eléctricas, junto con vigilancia, circuito cerrado de televisión y sistemas de respaldo y seguridad. La infraestructura de carga eléctrica está prevista; su alcance y fecha de operación están por confirmar. Las condiciones de ingreso de mascotas y uso de su zona serán informadas oficialmente antes de la apertura.',
  },
  {
    question: '¿Cómo integra el proyecto la sostenibilidad?',
    relatedQuestions: ['¿Girardot Express es un proyecto sostenible con el medio ambiente?'],
    keywords: ['sostenibilidad', 'sostenible', 'iluminacion natural', 'ventilacion', 'ecoeficiente', 'medio ambiente'],
    answer:
      'El diseño incorpora iluminación natural, ventilación cruzada, áreas abiertas y materiales ecoeficientes para mejorar el confort y la integración con el entorno.',
  },
  {
    question: '¿Cómo consulto precios, tamaños y reserva de locales?',
    audience: 'commercial',
    relatedQuestions: [
      '¿Hay locales disponibles?',
      '¿Cuánto cuesta un local?',
      '¿Qué tamaños de locales tienen disponibles?',
      'Tengo un negocio y estoy interesado en un local',
      '¿Cómo puedo separar o reservar un local?',
    ],
    keywords: [
      'locales disponibles', 'local disponible', 'hay locales', 'disponibilidad de locales',
      'disponibilidad de espacios', 'locales en arriendo', 'arrendar un local', 'alquilar un local',
      'rentar un local', 'busco un local', 'precio de un local', 'precios de locales',
      'valor de un local', 'costo de un local', 'cuanto vale un local', 'cuanto cuesta el arriendo',
      'valor del arriendo', 'precio del arriendo', 'canon de arrendamiento', 'canon de arriendo',
      'tamano de local', 'tamanos de locales', 'metros cuadrados', 'cuantos metros',
      'area de un local', 'areas de locales', 'local grande', 'local pequeno', 'm2',
      'tengo un negocio', 'tengo una marca', 'llevar mi marca', 'quiero un local',
      'interesado en un local', 'expandir mi negocio', 'mi empresa', 'mi franquicia',
      'separar un local', 'reservar un local', 'apartar un local', 'reserva de local',
      'proceso de arriendo', 'proceso de negociacion',
    ],
    shortQueries: [
      'disponibilidad', 'arrendar', 'alquiler', 'rentar', 'precio', 'precios', 'valor', 'costo',
      'canon', 'arriendo', 'cuanto cuesta', 'tamano', 'tamanos', 'area', 'areas', 'formatos',
      'islas', 'oficinas', 'separar', 'reservar', 'reserva', 'apartar',
    ],
    answer:
      'Estamos en etapa de construcción y comercialización, con distintos formatos para comercios, franquicias, servicios y operadores. Las condiciones comerciales dependen del área, la ubicación y las necesidades de tu operación. Comparte tu tipo de negocio con un asesor para revisar disponibilidad, tamaños y una propuesta para tu marca. El equipo también te explicará los pasos para la reserva o vinculación.',
    actions: [advisorFor('Hola, quisiera consultar disponibilidad, tamaños, precios y reserva de locales en Girardot Express.', 'Consultar locales disponibles')],
  },
  {
    question: '¿Cómo conozco los planos y las oportunidades para mi negocio?',
    audience: 'commercial',
    relatedQuestions: [
      '¿Puedo conocer el proyecto antes de adquirir un local?',
      '¿Dónde puedo ver los planos o encontrar información de los espacios disponibles?',
      '¿Por qué Girardot Express es una oportunidad para mi negocio?',
    ],
    keywords: [
      'conocer el proyecto', 'visitar el proyecto', 'visita comercial', 'coordinar una reunion',
      'presentacion del proyecto', 'antes de adquirir', 'planos', 'distribucion de espacios',
      'distribucion comercial', 'portafolio comercial', 'portafolio', 'oportunidad para mi negocio',
      'oportunidad comercial', 'por que alquilar', 'por que arrendar', 'por que invertir en el proyecto',
      'expansion de mi negocio', 'via nacional',
    ],
    shortQueries: ['visita', 'visitar', 'reunion', 'presentacion', 'render', 'oportunidad', 'expansion'],
    answer:
      'Puedes solicitar el portafolio comercial y coordinar una reunión para conocer los planos, la distribución y las oportunidades para tu negocio. El equipo te orientará sobre los espacios disponibles y las características del proyecto según tu marca.',
    actions: [portfolioAction, commercialAction],
  },
  {
    question: '¿Cómo me comunico con el equipo?',
    relatedQuestions: [
      '¿Cómo puedo comunicarme con Girardot Express?',
      'Quiero recibir más información de Girardot Express',
    ],
    keywords: [
      'contacto', 'telefono', 'whatsapp', 'correo', 'asesor', 'comunicarme', 'redes sociales',
      'mas informacion', 'quiero informacion', 'recibir informacion', 'estoy interesado',
    ],
    shortQueries: ['informacion', 'novedades'],
    answer: `Escríbenos por WhatsApp al ${SITE_CONTENT.whatsappLabel}${SITE_CONTENT.email ? ` o al correo ${SITE_CONTENT.email}` : ''} para recibir orientación. Las novedades del proyecto también están en Instagram como ${SITE_CONTENT.socialHandle}.`,
    actions: [advisorAction, ...(SITE_CONTENT.email ? [{ label: 'Enviar correo', href: `mailto:${SITE_CONTENT.email}` }] : [])],
  },
];

const chatbotIntents: readonly ChatbotIntent[] = [
  ...FAQ_ITEMS,
  {
    // La opción de inversión necesita orientación comercial; no implica venta ni rentabilidad.
    question: 'Inversión en el Proyecto',
    audience: 'commercial',
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

export function searchFaq(query: string, audience: FaqAudience | 'all' = 'all') {
  const words = normalize(query).split(' ').filter(Boolean);
  return FAQ_ITEMS.filter(item => {
    const content = normalize([
      item.question, item.answer, ...(item.relatedQuestions ?? []),
      ...item.keywords, ...(item.shortQueries ?? []),
    ].join(' '));
    return (audience === 'all' || !item.audience || item.audience === audience)
      && words.every(word => content.includes(word));
  });
}

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
      : Math.max(...[intent.question, ...(intent.relatedQuestions ?? []), ...intent.keywords]
        .map((phrase) => keywordScore(input, phrase)));

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

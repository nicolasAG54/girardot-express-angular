import {
  CHATBOT_FALLBACK_REPLY,
  CHATBOT_QUICK_ACTIONS,
  findChatbotReply,
} from './chatbot-content';
import { SITE_CONTENT } from './site-content';

describe('chatbot content', () => {
  const documentQuestions = [
    ['¿Qué es Girardot Express?', 'nuevo mall de conveniencia'],
    ['¿Dónde está ubicado Girardot Express?', 'Diagonal 9 # 23–31'],
    ['¿Hay locales disponibles?', 'construcción y comercialización'],
    ['¿Cuánto cuesta un local?', 'condiciones comerciales dependen'],
    ['¿Qué tamaños de locales tienen disponibles?', 'distintos formatos'],
    ['Tengo un negocio y estoy interesado en un local', 'Nos encantará conocer tu negocio'],
    ['¿Cómo puedo separar o reservar un local?', 'reserva o vinculación'],
    ['¿Qué marcas estarán en Girardot Express?', 'mezcla comercial pensada'],
    ['¿Cuándo abre Girardot Express?', SITE_CONTENT.openingLabel],
    ['¿Puedo conocer el proyecto antes de adquirir un local?', 'coordinar una reunión'],
    ['¿Girardot Express tendrá restaurantes o plazoleta de comidas?', 'conceptos gastronómicos'],
    ['¿Girardot Express tendrá parqueaderos?', 'parqueo para motos, bicicletas, carros'],
    ['¿Dónde puedo ver los planos o encontrar información de los espacios disponibles?', 'solicitar el portafolio comercial'],
    ['¿Cómo puedo comunicarme con Girardot Express?', SITE_CONTENT.whatsappLabel],
    ['Quiero recibir más información de Girardot Express', 'Indícame qué deseas conocer'],
    ['¿Qué servicios tendrá Girardot Express?', 'coworking'],
    ['¿Girardot Express será pet friendly?', 'condiciones de ingreso'],
    ['¿Habrá puntos de carga para vehículos eléctricos?', 'infraestructura de carga'],
    ['¿El proyecto tendrá facilidades de accesibilidad y movilidad?', 'facilidades de circulación'],
    ['¿Girardot Express es un proyecto sostenible con el medio ambiente?', 'ventilación cruzada'],
    ['¿Por qué Girardot Express es una oportunidad para mi negocio?', 'posicionar tu negocio'],
  ];

  it.each(documentQuestions)('answers the client question: %s', (question, expected) => {
    expect(findChatbotReply(question).answer).toContain(expected);
  });

  it.each([
    ['¿DÓNDE está la UBICACIÓN?', 'Diagonal 9 # 23–31'],
    ['TAMANO de un LOCAL en m²', 'distintos formatos'],
    ['Que tamanos tienen los locales?', 'distintos formatos'],
    ['¿Cuánto vale el local?', 'condiciones comerciales dependen'],
    ['Quiero conocer qué marcas tendrán locales', 'mezcla comercial pensada'],
    ['Necesito carga para mi vehículo eléctrico', 'infraestructura de carga'],
    ['¿Puedo ingresar con mi perro? ¿Es pet friendly?', 'condiciones de ingreso'],
    ['¿Hay rampas para una silla de ruedas?', 'facilidades de circulación'],
    ['¿Qué servicios tendrá el centro comercial?', 'coworking'],
    ['Locales en arriendo', 'construcción y comercialización'],
    ['Quiero COMER algo', 'conceptos gastronómicos'],
  ])('recognizes a natural variation: %s', (question, expected) => {
    expect(findChatbotReply(question).answer).toContain(expected);
  });

  it('provides the six requested quick actions and routes each to its subject', () => {
    expect(CHATBOT_QUICK_ACTIONS.map((action) => action.label)).toEqual([
      'Locales en Arriendo',
      'Portafolio Comercial',
      'Ubicación',
      'Sobre Girardot Express',
      'Inversión en el Proyecto',
      'Hablar con un asesor',
    ]);

    const expectedAnswers = [
      'construcción y comercialización',
      'solicitar el portafolio comercial',
      'Diagonal 9 # 23–31',
      'nuevo mall de conveniencia',
      'alternativas y condiciones vigentes',
      SITE_CONTENT.whatsappLabel,
    ];

    CHATBOT_QUICK_ACTIONS.forEach((action, index) => {
      expect(findChatbotReply(action.prompt).answer).toContain(expectedAnswers[index]);
      expect(findChatbotReply(action.label).answer).toContain(expectedAnswers[index]);
    });
  });

  it('requests a portfolio through WhatsApp instead of matching food or offering a download', () => {
    const reply = findChatbotReply('Necesito el portafolio comercial');
    const action = reply.actions?.find((item) => item.label === 'Solicitar portafolio comercial');

    expect(reply.answer).toContain('solicitar el portafolio comercial');
    expect(reply.answer).not.toContain('gastronomía');
    expect(action?.external).toBe(true);
    expect(action?.href).toContain(SITE_CONTENT.whatsappUrl);
    expect(decodeURIComponent(action!.href)).toContain('solicitar el portafolio comercial');
    expect(reply.answer).not.toMatch(/descargar|adjunto|enviado/);
  });

  it.each(['Inversión en el Proyecto', 'Quiero comprar un local', '¿Qué rentabilidad ofrecen?'])(
    'routes investment questions to an advisor without inventing an offer: %s',
    (question) => {
      const reply = findChatbotReply(question);

      expect(reply.answer).toContain('alternativas y condiciones vigentes');
      expect(reply.answer).not.toMatch(/garantiz|rentabilidad del|retorno del|locales en venta/i);
      expect(reply.actions?.[0].label).toBe('Hablar con un asesor');
      expect(decodeURIComponent(reply.actions![0].href)).toContain('inversión');
    },
  );

  it('preserves conditional opening and pet information', () => {
    expect(findChatbotReply('apertura').answer).toContain('Primera etapa: apertura prevista');
    expect(findChatbotReply('apertura').answer).toContain('finales de 2026');
    expect(findChatbotReply('pet friendly').answer).toContain('serán informadas oficialmente');
  });

  it('uses one consistent location and approved contact details', () => {
    const mapAction = findChatbotReply('ubicacion').actions![0];
    expect(new URL(mapAction.href).searchParams.get('query')).toBe('4.299272,-74.819122');
    expect(new URL(SITE_CONTENT.wazeUrl).searchParams.get('ll')).toBe('4.299272,-74.819122');
    expect(new URL(SITE_CONTENT.mapEmbedUrl).searchParams.get('marker')).toBe('4.299272,-74.819122');

    const contact = findChatbotReply('contacto');
    expect(contact.answer).toContain('+57 313 887 0580');
    expect(contact.answer).toContain('comercial@girardotexpress.com');
    expect(contact.answer).toContain('@girardotexpresscc');
    expect(contact.actions?.[0].href).toMatch(/^https:\/\/wa\.me\/573138870580\?text=/);
    expect(SITE_CONTENT.social.facebook).toBeNull();
  });

  it.each([
    '',
    '   ¿?   ',
    'Comercial',
    'No me comería ese cuento',
    'Quiero saber el precio de una pizza',
    'Necesito reservar un hotel',
    '¿Qué clima hará mañana?',
    'Resuelve esta operación matemática',
    'Necesito resolver algo completamente distinto',
    'precio y ubicación',
    'precios y restaurantes',
    '¿Hay mascotas o restaurantes?',
  ])('falls back for unsupported, substring-only or ambiguous input: %s', (query) => {
    expect(findChatbotReply(query)).toBe(CHATBOT_FALLBACK_REPLY);
    expect(CHATBOT_FALLBACK_REPLY.actions?.[0].label).toBe('Hablar con un asesor');
  });

  it.each(documentQuestions)('keeps the response and actions honest for: %s', (question) => {
    const reply = findChatbotReply(question);
    expect(reply.answer).not.toMatch(/te contactaremos|datos (guardados|enviados)|solicitud (enviada|registrada)|Respuesta sugerida|Acción sugerida|Se nombran las redes/);
    for (const action of reply.actions ?? []) {
      if (action.external) expect(action.href).toMatch(/^https:\/\//);
      else expect(action.href).toMatch(/^\/proyecto(?:#contacto-comercial)?$|^mailto:/);
    }
  });
});

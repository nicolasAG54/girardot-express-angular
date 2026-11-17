import { CHATBOT_FALLBACK_REPLY, FAQ_ITEMS, findChatbotReply, searchFaq } from './chatbot-content';

describe('public FAQ', () => {
  it('consolidates the 21 client questions into eight shared answers', () => {
    expect(FAQ_ITEMS).toHaveLength(8);
    expect(FAQ_ITEMS.flatMap(item => item.relatedQuestions ?? [])).toHaveLength(21);
    for (const item of FAQ_ITEMS) expect(findChatbotReply(item.question).answer).toBe(item.answer);
  });

  it('keeps every original question searchable and answers service details directly in chat', () => {
    for (const item of FAQ_ITEMS) {
      for (const question of item.relatedQuestions ?? []) {
        expect(searchFaq(question)).toContain(item);
        const reply = findChatbotReply(question);
        expect(reply).not.toBe(CHATBOT_FALLBACK_REPLY);
        if (!item.topics) {
          expect(reply.answer).toBe(item.answer);
          expect(reply.actions).toBe(item.actions);
        } else {
          expect(reply.answer).toMatch(/proyect|previst|apertura/);
        }
      }
    }
  });

  it('searches without accents and separates business from visitor topics', () => {
    expect(searchFaq('gastronomia', 'visitor').length).toBeGreaterThan(0);
    expect(searchFaq('cuesta un local', 'visitor')).toHaveLength(0);
    expect(searchFaq('cuesta un local', 'commercial').map(item => item.question)).toContain('¿Cómo consulto precios, tamaños y reserva de locales?');
    expect(searchFaq('zzzinexistente')).toHaveLength(0);
  });
});

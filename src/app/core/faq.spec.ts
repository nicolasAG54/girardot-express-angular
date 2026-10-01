import { FAQ_ITEMS, findChatbotReply, searchFaq } from './chatbot-content';

describe('public FAQ', () => {
  it('consolidates the 21 client questions into eight shared answers', () => {
    expect(FAQ_ITEMS).toHaveLength(8);
    expect(FAQ_ITEMS.flatMap(item => item.relatedQuestions ?? [])).toHaveLength(21);
    for (const item of FAQ_ITEMS) expect(findChatbotReply(item.question).answer).toBe(item.answer);
  });

  it('keeps every original question searchable and mapped to its consolidated answer', () => {
    for (const item of FAQ_ITEMS) {
      for (const question of item.relatedQuestions ?? []) {
        expect(searchFaq(question)).toContain(item);
        expect(findChatbotReply(question).answer).toBe(item.answer);
        expect(findChatbotReply(question).actions).toBe(item.actions);
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

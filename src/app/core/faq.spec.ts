import { FAQ_ITEMS, findChatbotReply, searchFaq } from './chatbot-content';

describe('public FAQ', () => {
  it('publishes the 21 client questions with the same answers as the assistant', () => {
    expect(FAQ_ITEMS).toHaveLength(21);
    for (const item of FAQ_ITEMS) expect(findChatbotReply(item.question).answer).toBe(item.answer);
  });
  it('searches without accents and separates business from visitor topics', () => {
    expect(searchFaq('gastronomia', 'visitor').length).toBeGreaterThan(0);
    expect(searchFaq('cuesta un local', 'visitor')).toHaveLength(0);
    expect(searchFaq('cuesta un local', 'commercial').map(item => item.question)).toContain('¿Cuánto cuesta un local?');
    expect(searchFaq('zzzinexistente')).toHaveLength(0);
  });
});

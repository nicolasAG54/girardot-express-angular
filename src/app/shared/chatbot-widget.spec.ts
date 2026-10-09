import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ChatbotWidget } from './chatbot-widget';

describe('Local chatbot privacy', () => {
  it('clears both audiences and their saved drafts, then allows a new conversation', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(ChatbotWidget);
    const element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    element.querySelector<HTMLButtonElement>('.chatbot-launcher')!.click();
    fixture.detectChanges();
    const fill = (value: string) => {
      const input = element.querySelector<HTMLInputElement>('#chatbot-message')!;
      input.value = value; input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    };
    const choose = (index: number) => {
      element.querySelectorAll<HTMLButtonElement>('.chatbot-audience button')[index].click();
      fixture.detectChanges();
    };
    const ask = () => {
      element.querySelector<HTMLButtonElement>('.chatbot-quick-actions button')!.click();
      fixture.detectChanges();
    };
    ask(); fill('Borrador de visitante'); choose(1);
    ask(); fill('Borrador de marca'); choose(0);
    expect(element.querySelectorAll('.chatbot-message')).toHaveLength(3);
    expect(element.querySelector<HTMLInputElement>('#chatbot-message')!.value).toBe('Borrador de visitante');
    element.querySelector<HTMLButtonElement>('.chatbot-tools button')!.click();
    fixture.detectChanges();
    for (const audience of [0, 1, 0]) {
      choose(audience);
      expect(element.querySelectorAll('.chatbot-message')).toHaveLength(1);
      expect(element.querySelector<HTMLInputElement>('#chatbot-message')!.value).toBe('');
    }
    expect(element.querySelector('.chatbot-clear-status')?.textContent).toContain('borrados');
    ask();
    expect(element.querySelectorAll('.chatbot-message')).toHaveLength(3);
    expect(element.querySelector('.chatbot-clear-status')?.textContent).toBe('');
    fixture.destroy();
  });
});

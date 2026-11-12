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

describe('Chat keyboard and viewport', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

  function setup(width = 390, coarse = true) {
    vi.stubGlobal('innerWidth', width);
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: coarse })));
    const viewport = Object.assign(new EventTarget(), { height: 800, offsetTop: 0 });
    vi.stubGlobal('visualViewport', viewport);
    const fixture = TestBed.createComponent(ChatbotWidget);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const open = () => {
      element.querySelector<HTMLButtonElement>('.chatbot-launcher')!.click();
      fixture.detectChanges(); vi.advanceTimersByTime(1);
    };
    return { fixture, element, viewport, open };
  }

  it('opens touch screens without focusing the text field or opening the keyboard', () => {
    const { fixture, element, open } = setup(); open();
    expect(document.activeElement).toBe(element.querySelector('[aria-label="Cerrar asistente"]'));
    expect(document.activeElement).not.toBe(element.querySelector('#chatbot-message'));
    expect(document.body.style.overflow).toBe('hidden');
    fixture.destroy(); expect(document.body.style.overflow).toBe('');
  });

  it('retains input focus on desktop and does not lock the page', () => {
    const { fixture, element, open } = setup(1280, false); open();
    expect(document.activeElement).toBe(element.querySelector('#chatbot-message'));
    expect(document.body.style.overflow).not.toBe('hidden'); fixture.destroy();
  });

  it('tracks keyboard height and panning without losing a draft, and expands again', () => {
    const { fixture, element, viewport, open } = setup(); open();
    const input = element.querySelector<HTMLInputElement>('#chatbot-message')!;
    input.focus(); input.value = 'Mi consulta'; input.dispatchEvent(new Event('input'));
    viewport.height = 340; viewport.offsetTop = 90; viewport.dispatchEvent(new Event('resize'));
    fixture.detectChanges();
    expect(element.style.getPropertyValue('--chat-viewport-height')).toBe('340px');
    expect(element.style.getPropertyValue('--chat-viewport-top')).toBe('90px');
    expect(element.querySelector('.chatbot-panel')!.classList.contains('is-compact')).toBe(true);
    expect(input.value).toBe('Mi consulta'); expect(document.activeElement).toBe(input);
    viewport.height = 800; viewport.offsetTop = 0; viewport.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();
    expect(element.querySelector('.chatbot-panel')!.classList.contains('is-compact')).toBe(false);
    expect(element.style.getPropertyValue('--chat-viewport-top')).toBe('0px'); fixture.destroy();
  });

  it('restores prior page scrolling and removes listeners when closed or destroyed', () => {
    document.body.style.overflow = 'auto';
    const { fixture, element, viewport, open } = setup(); open();
    element.querySelector<HTMLButtonElement>('[aria-label="Cerrar asistente"]')!.click();
    fixture.detectChanges(); vi.advanceTimersByTime(1);
    expect(document.body.style.overflow).toBe('auto');
    expect(document.activeElement).toBe(element.querySelector('.chatbot-launcher'));
    viewport.height = 300; viewport.dispatchEvent(new Event('resize'));
    expect(element.style.getPropertyValue('--chat-viewport-height')).toBe('');
    open(); fixture.destroy();
    viewport.dispatchEvent(new Event('scroll'));
    expect(element.style.getPropertyValue('--chat-viewport-height')).toBe('');
    expect(document.body.style.overflow).toBe('auto'); document.body.style.overflow = '';
  });
});

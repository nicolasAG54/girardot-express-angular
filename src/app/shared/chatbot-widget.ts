import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  HostListener,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';

import {
  CHATBOT_QUICK_ACTIONS,
  ChatbotAction,
  ChatbotQuickAction,
  findChatbotReply,
  FaqAudience,
} from '../core/chatbot-content';
import { SITE_CONTENT } from '../core/site-content';

interface ChatMessage {
  readonly id: number;
  readonly role: 'assistant' | 'user';
  readonly text: string;
  readonly actions?: readonly ChatbotAction[];
}

@Component({
  selector: 'app-chatbot-widget',
  templateUrl: './chatbot-widget.html',
  styleUrl: './chatbot-widget.scss',
})
export class ChatbotWidget {
  @ViewChild('launcher') private launcher?: ElementRef<HTMLButtonElement>;
  @ViewChild('messageInput') private messageInput?: ElementRef<HTMLInputElement>;
  @ViewChild('conversation') private conversation?: ElementRef<HTMLElement>;

  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private focusTimer: ReturnType<typeof setTimeout> | undefined;
  private scrollTimer: ReturnType<typeof setTimeout> | undefined;
  private nextMessageId = 2;

  protected readonly isOpen = signal(false);
  protected readonly draft = signal('');
  protected readonly audience = signal<FaqAudience>('visitor');
  private hasChosenAudience = false;
  private readonly histories = signal<Record<FaqAudience, readonly ChatMessage[]>>({
    visitor: [{ id: 0, role: 'assistant', text: 'Hola. Te ayudo a conocer la apertura, los servicios y cómo llegar a Girardot Express.' }],
    commercial: [{ id: 1, role: 'assistant', text: 'Hola. Conversemos sobre tu marca: formatos, espacios disponibles y contacto con el equipo comercial.' }],
  });
  private readonly drafts = { visitor: '', commercial: '' };
  protected readonly messages = computed(() => this.histories()[this.audience()]);
  protected readonly quickActions = computed<readonly ChatbotQuickAction[]>(() => this.audience() === 'commercial'
    ? CHATBOT_QUICK_ACTIONS
    : [
      { label: 'Apertura', prompt: '¿Cuándo abre Girardot Express?' },
      { label: 'Cómo llegar', prompt: '¿Dónde está ubicado Girardot Express?' },
      { label: 'Servicios', prompt: '¿Qué servicios tendrá Girardot Express?' },
      { label: 'Marcas', prompt: '¿Qué marcas estarán en Girardot Express?' },
      { label: 'Mascotas', prompt: '¿Girardot Express será pet friendly?' },
    ]);

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.focusTimer !== undefined) clearTimeout(this.focusTimer);
      if (this.scrollTimer !== undefined) clearTimeout(this.scrollTimer);
    });
  }

  protected togglePanel(): void {
    if (this.isOpen()) {
      this.closePanel();
      return;
    }

    if (!this.hasChosenAudience) {
      this.audience.set(this.router.url.split(/[?#]/)[0] === '/proyecto' ? 'commercial' : 'visitor');
      this.hasChosenAudience = true;
    }
    this.isOpen.set(true);
    this.scheduleInputFocus();
  }

  protected closePanel(returnFocus = true): void {
    if (!this.isOpen()) return;

    this.isOpen.set(false);
    if (returnFocus) {
      this.focusTimer = setTimeout(() => this.launcher?.nativeElement.focus(), 0);
    }
  }

  protected updateDraft(event: Event): void {
    this.draft.set((event.target as HTMLInputElement).value);
  }

  protected submitMessage(event: Event): void {
    event.preventDefault();
    this.sendQuestion(this.draft());
  }

  protected selectQuickAction(action: ChatbotQuickAction): void {
    this.sendQuestion(action.prompt);
  }

  protected chooseAudience(audience: FaqAudience): void {
    this.drafts[this.audience()] = this.draft();
    this.audience.set(audience);
    this.draft.set(this.drafts[audience]);
    this.hasChosenAudience = true;
    this.scheduleConversationScroll();
  }

  protected openFaq(event: MouseEvent): void {
    this.handleAction({ label: 'Preguntas frecuentes', href: '/preguntas-frecuentes' }, event);
  }

  protected handleAction(action: ChatbotAction, event: MouseEvent): void {
    if (action.external || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    this.closePanel(false);
    void this.router.navigateByUrl(action.href);
  }

  @HostListener('document:keydown.escape')
  protected closeWithEscape(): void {
    this.closePanel();
  }

  private sendQuestion(rawQuestion: string): void {
    const question = rawQuestion.trim();
    if (!question) return;

    const reply = findChatbotReply(question);
    const audience = this.audience();
    const actions = reply.actions?.map(action => {
      if (!action.href.startsWith(SITE_CONTENT.whatsappUrl)) return action;
      const url = new URL(action.href);
      const context = audience === 'commercial' ? 'Consulta de una marca o negocio.' : 'Consulta de un visitante.';
      url.searchParams.set('text', `${context}\n${url.searchParams.get('text') ?? ''}`);
      return { ...action, href: url.toString() };
    });
    this.histories.update((histories) => ({ ...histories, [audience]: [
      ...histories[audience],
      { id: this.nextMessageId++, role: 'user', text: question },
      {
        id: this.nextMessageId++,
        role: 'assistant',
        text: reply.answer,
        actions,
      },
    ] }));
    this.draft.set('');
    this.scheduleConversationScroll();
  }

  private scheduleInputFocus(): void {
    if (this.focusTimer !== undefined) clearTimeout(this.focusTimer);
    this.focusTimer = setTimeout(() => {
      this.messageInput?.nativeElement.focus();
      this.focusTimer = undefined;
    }, 0);
  }

  private scheduleConversationScroll(): void {
    if (this.scrollTimer !== undefined) clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => {
      const conversation = this.conversation?.nativeElement;
      if (conversation) conversation.scrollTop = conversation.scrollHeight;
      this.scrollTimer = undefined;
    }, 0);
  }
}

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
import { DOCUMENT } from '@angular/common';

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
  readonly suggestions?: readonly ChatbotQuickAction[];
}

const INITIAL_MESSAGES: Record<FaqAudience, readonly ChatMessage[]> = {
  visitor: [{ id: 0, role: 'assistant', text: 'Hola. Te ayudo a conocer la apertura, los servicios y cómo llegar a Girardot Express.' }],
  commercial: [{ id: 1, role: 'assistant', text: 'Hola. Conversemos sobre tu marca: formatos, espacios disponibles y contacto con el equipo comercial.' }],
};

@Component({
  selector: 'app-chatbot-widget',
  templateUrl: './chatbot-widget.html',
  styleUrl: './chatbot-widget.scss',
})
export class ChatbotWidget {
  @ViewChild('launcher') private launcher?: ElementRef<HTMLButtonElement>;
  @ViewChild('messageInput') private messageInput?: ElementRef<HTMLInputElement>;
  @ViewChild('conversation') private conversation?: ElementRef<HTMLElement>;
  @ViewChild('closeButton') private closeButton?: ElementRef<HTMLButtonElement>;

  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef);
  private viewportCleanup?: () => void;
  private previousBodyOverflow?: string;
  private focusTimer: ReturnType<typeof setTimeout> | undefined;
  private scrollTimer: ReturnType<typeof setTimeout> | undefined;
  private replyTimer: ReturnType<typeof setTimeout> | undefined;
  private pendingReply?: () => void;
  private nextMessageId = 2;

  protected readonly isOpen = signal(false);
  protected readonly compactViewport = signal(false);
  protected readonly isReplying = signal(false);
  protected readonly draft = signal('');
  protected readonly cleared = signal(false);
  protected readonly audience = signal<FaqAudience>('visitor');
  private hasChosenAudience = false;
  private readonly histories = signal<Record<FaqAudience, readonly ChatMessage[]>>(INITIAL_MESSAGES);
  private readonly drafts = { visitor: '', commercial: '' };
  protected readonly messages = computed(() => this.histories()[this.audience()]);
  protected readonly followUps = computed(() => this.messages().at(-1)?.suggestions ?? []);
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
      this.cancelPendingReply();
      this.stopViewportTracking();
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
    this.startViewportTracking();
    this.schedulePanelFocus();
  }

  protected closePanel(returnFocus = true): void {
    if (!this.isOpen()) return;

    if (this.focusTimer !== undefined) clearTimeout(this.focusTimer);
    this.stopViewportTracking();
    this.isOpen.set(false);
    if (returnFocus) {
      this.focusTimer = setTimeout(() => {
        this.launcher?.nativeElement.focus({ preventScroll: true });
        this.focusTimer = undefined;
      }, 0);
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
    this.finishPendingReply();
    this.drafts[this.audience()] = this.draft();
    this.audience.set(audience);
    this.draft.set(this.drafts[audience]);
    this.hasChosenAudience = true;
    this.scheduleConversationScroll();
  }

  protected clearConversation(): void {
    this.cancelPendingReply();
    this.histories.set(INITIAL_MESSAGES);
    this.drafts.visitor = '';
    this.drafts.commercial = '';
    this.draft.set('');
    this.nextMessageId = 2;
    this.cleared.set(true);
    this.schedulePanelFocus();
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
    if (!question || this.isReplying()) return;

    this.cleared.set(false);

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
    ] }));
    this.pendingReply = () => {
      this.histories.update((histories) => ({ ...histories, [audience]: [...histories[audience], {
        id: this.nextMessageId++,
        role: 'assistant',
        text: reply.answer,
        actions,
        suggestions: reply.suggestions,
      }] }));
      this.scheduleConversationScroll();
    };
    this.isReplying.set(true);
    this.replyTimer = setTimeout(() => this.finishPendingReply(), Math.min(1100, 550 + reply.answer.length * 1.5));
    this.draft.set('');
    this.scheduleConversationScroll();
  }

  private finishPendingReply(): void {
    if (this.replyTimer !== undefined) clearTimeout(this.replyTimer);
    this.replyTimer = undefined;
    const complete = this.pendingReply;
    this.pendingReply = undefined;
    this.isReplying.set(false);
    complete?.();
  }

  private cancelPendingReply(): void {
    if (this.replyTimer !== undefined) clearTimeout(this.replyTimer);
    this.replyTimer = undefined;
    this.pendingReply = undefined;
    this.isReplying.set(false);
  }

  private isTouchLayout(view: Window): boolean {
    return view.innerWidth <= 560 || !!view.matchMedia?.('(pointer: coarse)').matches;
  }

  private startViewportTracking(): void {
    const view = this.document.defaultView;
    if (!view) return;
    const viewport = view.visualViewport;
    const update = () => {
      const height = viewport?.height ?? view.innerHeight;
      const top = viewport?.offsetTop ?? 0;
      const style = this.hostElement.nativeElement.style;
      style.setProperty('--chat-viewport-height', `${Math.max(0, height)}px`);
      style.setProperty('--chat-viewport-top', `${Math.max(0, top)}px`);
      this.compactViewport.set(height < 480);
      if (this.isTouchLayout(view)) {
        if (this.previousBodyOverflow === undefined) this.previousBodyOverflow = this.document.body.style.overflow;
        this.document.body.style.overflow = 'hidden';
      } else {
        this.restorePageOverflow();
      }
    };
    update();
    viewport?.addEventListener('resize', update);
    viewport?.addEventListener('scroll', update);
    view.addEventListener('resize', update);
    this.viewportCleanup = () => {
      viewport?.removeEventListener('resize', update);
      viewport?.removeEventListener('scroll', update);
      view.removeEventListener('resize', update);
    };
  }

  private restorePageOverflow(): void {
    if (this.previousBodyOverflow === undefined) return;
    this.document.body.style.overflow = this.previousBodyOverflow;
    this.previousBodyOverflow = undefined;
  }

  private stopViewportTracking(): void {
    this.viewportCleanup?.();
    this.viewportCleanup = undefined;
    this.restorePageOverflow();
    this.compactViewport.set(false);
    this.hostElement.nativeElement.style.removeProperty('--chat-viewport-height');
    this.hostElement.nativeElement.style.removeProperty('--chat-viewport-top');
  }

  private schedulePanelFocus(): void {
    if (this.focusTimer !== undefined) clearTimeout(this.focusTimer);
    this.focusTimer = setTimeout(() => {
      if (!this.isOpen()) return;
      const view = this.document.defaultView;
      const target = view && this.isTouchLayout(view) ? this.closeButton : this.messageInput;
      target?.nativeElement.focus({ preventScroll: true });
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

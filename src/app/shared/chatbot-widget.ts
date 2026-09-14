import {
  Component,
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
} from '../core/chatbot-content';

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
  protected readonly quickActions = CHATBOT_QUICK_ACTIONS;
  protected readonly messages = signal<readonly ChatMessage[]>([
    {
      id: 1,
      role: 'assistant',
      text: 'Hola. Puedo orientarte sobre Girardot Express, su ubicación y los espacios comerciales.',
    },
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
    this.messages.update((messages) => [
      ...messages,
      { id: this.nextMessageId++, role: 'user', text: question },
      {
        id: this.nextMessageId++,
        role: 'assistant',
        text: reply.answer,
        actions: reply.actions,
      },
    ]);
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

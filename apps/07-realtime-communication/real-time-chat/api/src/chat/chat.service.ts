import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

export type ChatMessage = {
  id: string;
  room: string;
  kind: 'user' | 'system';
  username: string;
  text: string;
  sentAt: string;
};

const HISTORY_LIMIT = 20;

@Injectable()
export class ChatService {
  private history = new Map<string, ChatMessage[]>();

  addMessage(room: string, username: string, text: string): ChatMessage {
    return this.record({ room, kind: 'user', username, text });
  }

  addSystemMessage(room: string, username: string, text: string): ChatMessage {
    return this.record({ room, kind: 'system', username, text });
  }

  historyFor(room: string): ChatMessage[] {
    return this.history.get(room) ?? [];
  }

  private record(fields: Omit<ChatMessage, 'id' | 'sentAt'>): ChatMessage {
    const message: ChatMessage = {
      ...fields,
      id: randomUUID(),
      sentAt: new Date().toISOString(),
    };
    const messages = [...this.historyFor(message.room), message];
    this.history.set(message.room, messages.slice(-HISTORY_LIMIT));
    return message;
  }
}

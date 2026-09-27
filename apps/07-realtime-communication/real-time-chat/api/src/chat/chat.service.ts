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

@Injectable()
export class ChatService {
  addMessage(room: string, username: string, text: string): ChatMessage {
    return this.record({ room, kind: 'user', username, text });
  }

  addSystemMessage(room: string, username: string, text: string): ChatMessage {
    return this.record({ room, kind: 'system', username, text });
  }

  private record(fields: Omit<ChatMessage, 'id' | 'sentAt'>): ChatMessage {
    return { ...fields, id: randomUUID(), sentAt: new Date().toISOString() };
  }
}

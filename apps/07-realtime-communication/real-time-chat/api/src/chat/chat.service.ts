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
    return {
      id: randomUUID(),
      room,
      kind: 'user',
      username,
      text,
      sentAt: new Date().toISOString(),
    };
  }
}

import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { PresenceService } from './presence.service';

@Module({
  providers: [ChatGateway, ChatService, PresenceService],
})
export class ChatModule {}

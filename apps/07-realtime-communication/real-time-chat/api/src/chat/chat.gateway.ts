import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { DefaultEventsMap, Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { PresenceService } from './presence.service';

type SocketData = { username: string };
type ChatServer = Server<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  SocketData
>;
type ChatSocket = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  SocketData
>;

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: ChatServer;

  constructor(
    private readonly chatService: ChatService,
    private readonly presenceService: PresenceService,
  ) {}

  handleConnection(socket: ChatSocket) {
    const username: unknown = socket.handshake.auth['username'];
    socket.data.username =
      typeof username === 'string' ? username : 'anonymous';
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() socket: ChatSocket,
  ) {
    const { username } = socket.data;
    const previous = this.presenceService.join(socket.id, username, room);
    if (previous && previous !== room) {
      await socket.leave(previous);
      this.announceLeave(previous, username);
    }

    await socket.join(room);
    if (previous !== room) {
      this.emitSystemMessage(room, username, `${username} joined`);
    }
    this.emitPresence(room);
  }

  private announceLeave(room: string, username: string) {
    this.emitSystemMessage(room, username, `${username} left`);
    this.emitPresence(room);
  }

  private emitSystemMessage(room: string, username: string, text: string) {
    const message = this.chatService.addSystemMessage(room, username, text);
    this.server.to(room).emit('message', message);
  }

  private emitPresence(room: string) {
    this.server
      .to(room)
      .emit('presence', { room, users: this.presenceService.usersIn(room) });
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(
    @MessageBody() data: { room: string; text: string },
    @ConnectedSocket() socket: ChatSocket,
  ) {
    if (!socket.rooms.has(data.room)) {
      return { ok: false, reason: 'Join the room before sending' };
    }
    const text = typeof data.text === 'string' ? data.text.trim() : '';
    if (!text || text.length > 500) {
      return { ok: false, reason: 'Messages must be 1–500 characters' };
    }

    const message = this.chatService.addMessage(
      data.room,
      socket.data.username,
      text,
    );
    this.server.to(data.room).emit('message', message);
    return { ok: true };
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { room: string; isTyping: boolean },
    @ConnectedSocket() socket: ChatSocket,
  ) {
    if (!socket.rooms.has(data.room)) return;
    socket.to(data.room).emit('typing', {
      room: data.room,
      username: socket.data.username,
      isTyping: data.isTyping,
    });
  }
}

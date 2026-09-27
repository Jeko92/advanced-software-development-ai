import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
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

const USERNAME_PATTERN = /^[\w-]{2,20}$/;
const PRIVATE_ROOM_PREFIX = 'dm:';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: ChatServer;

  constructor(
    private readonly chatService: ChatService,
    private readonly presenceService: PresenceService,
  ) {}

  afterInit(server: ChatServer) {
    server.use((socket, next) => {
      const username: unknown = socket.handshake.auth['username'];
      if (typeof username !== 'string' || !USERNAME_PATTERN.test(username)) {
        next(new Error('Username must be 2–20 letters, digits, _ or -'));
        return;
      }
      socket.data.username = username;
      next();
    });
  }

  async handleConnection(socket: ChatSocket) {
    await socket.join(`user:${socket.data.username}`);
  }

  handleDisconnect(socket: ChatSocket) {
    const member = this.presenceService.leave(socket.id);
    if (member) this.announceLeave(member.room, member.username);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() socket: ChatSocket,
  ) {
    const { username } = socket.data;
    if (!this.canJoin(room, username)) {
      return { ok: false, reason: "You can't join that room" };
    }
    const previous = this.presenceService.join(socket.id, username, room);
    if (previous && previous !== room) {
      await socket.leave(previous);
      this.announceLeave(previous, username);
    }

    await socket.join(room);
    socket.emit('history', {
      room,
      messages: this.chatService.historyFor(room),
    });

    if (previous !== room) {
      this.emitSystemMessage(room, username, `${username} joined`);
    }
    this.emitPresence(room);
    return { ok: true };
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

  private canJoin(room: unknown, username: string): boolean {
    if (typeof room !== 'string' || !room) return false;
    if (!room.startsWith(PRIVATE_ROOM_PREFIX)) return true;
    return room.slice(PRIVATE_ROOM_PREFIX.length).split(':').includes(username);
  }

  private privateRoomPartner(room: string, username: string) {
    if (!room.startsWith(PRIVATE_ROOM_PREFIX)) return undefined;
    return room
      .slice(PRIVATE_ROOM_PREFIX.length)
      .split(':')
      .find((name) => name !== username);
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

    const { username } = socket.data;
    const message = this.chatService.addMessage(data.room, username, text);
    this.server.to(data.room).emit('message', message);

    const recipient = this.privateRoomPartner(data.room, username);
    if (recipient) {
      this.server
        .to(`user:${recipient}`)
        .emit('privateRoom', { room: data.room, from: username });
    }
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

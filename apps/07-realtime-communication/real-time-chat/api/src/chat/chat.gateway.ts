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

  constructor(private readonly chatService: ChatService) {}

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
    for (const joined of socket.rooms) {
      if (joined !== socket.id) await socket.leave(joined);
    }
    await socket.join(room);
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
}

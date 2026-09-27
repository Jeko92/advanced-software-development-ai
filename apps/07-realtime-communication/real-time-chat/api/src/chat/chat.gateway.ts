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

  @SubscribeMessage('sendMessage')
  handleSendMessage(
    @MessageBody() data: { room: string; text: string },
    @ConnectedSocket() socket: ChatSocket,
  ) {
    const message = this.chatService.addMessage(
      data.room,
      socket.data.username,
      data.text,
    );
    this.server.emit('message', message);
  }
}

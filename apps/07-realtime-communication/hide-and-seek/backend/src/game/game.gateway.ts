import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly gameService: GameService) {}

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    await this.joinMatchmaking(client);
  }

  private async joinMatchmaking(client: Socket) {
    const assignment = this.gameService.assignToRoom(client.id);
    await client.join(assignment.roomId);
    client.emit('role', { role: assignment.role });
    const match = this.gameService.getMatch(assignment.roomId);
    this.server.to(assignment.roomId).emit('matchState', match);

    if (match?.status === 'running') {
      this.gameService.startTimer(assignment.roomId, (m) => {
        this.server.to(assignment.roomId).emit('matchState', m);
      });
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const match = this.gameService.handleDisconnect(client.id);
    if (match) {
      this.server.to(match.roomId).emit('matchState', match);
    }
  }

  @SubscribeMessage('ping')
  handlePing(
    @MessageBody() payload: unknown,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('received ping:', payload);
    client.emit('pong', { receivedAt: Date.now() });
  }

  @SubscribeMessage('move')
  handleMove(
    @MessageBody() body: { direction: string },
    @ConnectedSocket() client: Socket,
  ) {
    const match = this.gameService.applyMove(client.id, body.direction);
    if (match) {
      this.server.to(match.roomId).emit('matchState', match);
    }
  }

  @SubscribeMessage('playAgain')
  async handlePlayAgain(@ConnectedSocket() client: Socket) {
    const abandonedRoomId = this.gameService.leaveAbandonedMatch(client.id);
    if (abandonedRoomId) {
      await client.leave(abandonedRoomId);
      await this.joinMatchmaking(client);
      return;
    }

    const match = this.gameService.resetMatch(client.id);
    if (match) {
      this.server.to(match.roomId).emit('matchState', match);
      this.gameService.startTimer(match.roomId, (m) => {
        this.server.to(match.roomId).emit('matchState', m);
      });
    }
  }
}

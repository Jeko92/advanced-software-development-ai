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
import { ClientRole, GameStatus, MatchState, RoomError } from './game.types';

const LOBBY = 'lobby';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private listedStatus = new Map<string, GameStatus>();

  constructor(private readonly gameService: GameService) {}

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    await client.join(LOBBY);
    client.emit('roomList', this.gameService.listRooms());
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    await this.leaveCurrentRoom(client);
  }

  @SubscribeMessage('createRoom')
  async handleCreateRoom(
    @MessageBody()
    body: { roomName: string; worldSize: string; difficulty: string },
    @ConnectedSocket() client: Socket,
  ) {
    const result = this.gameService.createRoom(client.id, body ?? {});
    await this.enterRoom(client, result);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() body: { roomName: string },
    @ConnectedSocket() client: Socket,
  ) {
    const result = this.gameService.joinRoom(client.id, body?.roomName);
    await this.enterRoom(client, result);
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(@ConnectedSocket() client: Socket) {
    await this.leaveCurrentRoom(client);
  }

  private async enterRoom(
    client: Socket,
    result: { roomId: string; role: ClientRole } | { error: RoomError },
  ) {
    if ('error' in result) {
      client.emit('roomError', { reason: result.error });
      return;
    }
    await client.leave(LOBBY);
    await client.join(result.roomId);
    client.emit('role', { role: result.role });

    const match = this.gameService.getMatch(result.roomId)!;
    this.publish(match);
    this.broadcastRoomList();
  }

  private async leaveCurrentRoom(client: Socket) {
    const result = this.gameService.leaveRoom(client.id);
    if (!result) return;

    if (result.kind === 'observer-left') {
      await client.leave(result.match.roomId);
      this.publish(result.match);
    } else {
      await client.leave(result.roomId);
      this.server
        .to(result.roomId)
        .emit('roomClosed', { reason: 'player-left' });
      this.server.in(result.roomId).socketsJoin(LOBBY);
      this.server.in(result.roomId).socketsLeave(result.roomId);
      this.listedStatus.delete(result.roomId);
    }
    if (client.connected) await client.join(LOBBY);
    this.broadcastRoomList();
  }

  private publish(match: MatchState) {
    this.server.to(match.roomId).emit('matchState', match);
    if (this.listedStatus.get(match.roomId) !== match.status) {
      this.listedStatus.set(match.roomId, match.status);
      this.broadcastRoomList();
    }
  }

  private broadcastRoomList() {
    this.server.to(LOBBY).emit('roomList', this.gameService.listRooms());
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
    if (match) this.publish(match);
  }

  @SubscribeMessage('ready')
  handleReady(@ConnectedSocket() client: Socket) {
    const match = this.gameService.setReady(client.id);
    if (!match) return;
    if (match.ready.seeker && match.ready.hider) {
      this.gameService.startCountdown(match.roomId, (m) => this.publish(m));
    }
    this.publish(match);
  }

  @SubscribeMessage('requestSwap')
  handleRequestSwap(@ConnectedSocket() client: Socket) {
    const match = this.gameService.requestSwap(client.id);
    if (match) this.publish(match);
  }

  @SubscribeMessage('respondToSwap')
  handleRespondToSwap(
    @MessageBody() body: { accepted: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    const match = this.gameService.respondToSwap(
      client.id,
      body?.accepted === true,
    );
    if (!match) return;
    this.server
      .to(match.players.seeker!.socketId)
      .emit('role', { role: 'seeker' });
    this.server
      .to(match.players.hider!.socketId)
      .emit('role', { role: 'hider' });
    this.publish(match);
  }
}

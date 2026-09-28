import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { randomUUID } from 'node:crypto';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import {
  CHAT_MESSAGE_MAX_LENGTH,
  CHEER_EMOJIS,
  ChatMessage,
  Cheer,
  CheerEmoji,
  ClientRole,
  GameStatus,
  MatchState,
  RoomError,
} from './game.types';

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
  private lastCheerAt = new Map<string, number>();

  constructor(private readonly gameService: GameService) {}

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    await client.join(LOBBY);
    client.emit('roomList', this.gameService.listRooms());
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.lastCheerAt.delete(client.id);
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
    @MessageBody() body: { roomName: string; nickname?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const result = this.gameService.joinRoom(
      client.id,
      body?.roomName,
      body?.nickname,
    );
    await this.enterRoom(client, result);
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(@ConnectedSocket() client: Socket) {
    await this.leaveCurrentRoom(client);
  }

  private async enterRoom(
    client: Socket,
    result:
      | { roomId: string; role: ClientRole; name?: string }
      | { error: RoomError },
  ) {
    if ('error' in result) {
      client.emit('roomError', { reason: result.error });
      return;
    }
    await client.leave(LOBBY);
    await client.join(result.roomId);
    client.emit('role', { role: result.role, name: result.name ?? null });

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
    for (const role of ['seeker', 'hider'] as const) {
      const player = match.players[role];
      if (player) {
        this.server
          .to(player.socketId)
          .emit('matchState', this.gameService.viewFor(match, role));
      }
    }
    for (const socketId of this.gameService.observerIds(match.roomId)) {
      this.server.to(socketId).emit('matchState', match);
    }
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

  @SubscribeMessage('chatMessage')
  handleChatMessage(
    @MessageBody() body: { text: string },
    @ConnectedSocket() client: Socket,
  ) {
    const text = String(body?.text ?? '')
      .trim()
      .slice(0, CHAT_MESSAGE_MAX_LENGTH);
    if (text === '') return;

    const assignment = this.gameService.getAssignment(client.id);
    if (assignment) {
      const message: ChatMessage = {
        from: assignment.role,
        name: null,
        text,
        sentAt: Date.now(),
        audience: 'all',
      };
      this.server.to(assignment.roomId).emit('chatMessage', message);
      return;
    }

    const observer = this.gameService.getObserver(client.id);
    const match = observer && this.gameService.getMatch(observer.roomId);
    if (!observer || !match) return;

    const roundLive = ['countdown', 'running', 'paused'].includes(match.status);
    const message: ChatMessage = {
      from: 'observer',
      name: observer.name,
      text,
      sentAt: Date.now(),
      audience: roundLive ? 'spectators' : 'all',
    };
    if (roundLive) {
      for (const socketId of this.gameService.observerIds(observer.roomId)) {
        this.server.to(socketId).emit('chatMessage', message);
      }
    } else {
      this.server.to(observer.roomId).emit('chatMessage', message);
    }
  }

  @SubscribeMessage('cheer')
  handleCheer(
    @MessageBody() body: { emoji: string },
    @ConnectedSocket() client: Socket,
  ) {
    const observer = this.gameService.getObserver(client.id);
    const emoji = body?.emoji as CheerEmoji;
    if (!observer || !CHEER_EMOJIS.includes(emoji)) return;

    const now = Date.now();
    if (now - (this.lastCheerAt.get(client.id) ?? 0) < 700) return;
    this.lastCheerAt.set(client.id, now);

    const cheer: Cheer = { id: randomUUID(), emoji, name: observer.name };
    this.server.to(observer.roomId).emit('cheer', cheer);
  }

  @SubscribeMessage('requestPause')
  handleRequestPause(@ConnectedSocket() client: Socket) {
    const match = this.gameService.requestPause(client.id);
    if (match) this.publish(match);
  }

  @SubscribeMessage('respondToPause')
  handleRespondToPause(
    @MessageBody() body: { accepted: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    const match = this.gameService.respondToPause(
      client.id,
      body?.accepted === true,
    );
    if (match) this.publish(match);
  }

  @SubscribeMessage('resumeMatch')
  handleResumeMatch(@ConnectedSocket() client: Socket) {
    const match = this.gameService.resume(client.id);
    if (!match) return;
    this.gameService.startCountdown(
      match.roomId,
      (m) => this.publish(m),
      'resume',
    );
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

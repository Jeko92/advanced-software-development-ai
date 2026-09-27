import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { DefaultEventsMap, Server, Socket } from 'socket.io';
import { PollService } from './poll.service';

type SocketData = { user: string };
type PollServer = Server<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  SocketData
>;
type PollSocket = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  SocketData
>;

// A stand-in for real authentication: token -> user name.
const USERS_BY_TOKEN: Record<string, string> = {
  'token-alice': 'alice',
  'token-bob': 'bob',
  'token-carol': 'carol',
};

@WebSocketGateway({ cors: { origin: '*' } })
export class PollGateway implements OnGatewayInit {
  @WebSocketServer()
  server!: PollServer;

  constructor(private readonly pollService: PollService) {}

  afterInit(server: PollServer) {
    server.use((socket, next) => {
      const token: unknown = socket.handshake.auth['token'];
      const user =
        typeof token === 'string' ? USERS_BY_TOKEN[token] : undefined;

      if (!user) {
        next(new Error('unauthorized'));
        return;
      }

      socket.data.user = user;
      next();
    });
  }

  @SubscribeMessage('joinPoll')
  async handleJoin(
    @MessageBody() pollId: string,
    @ConnectedSocket() socket: PollSocket,
  ) {
    await socket.join(pollId);
    socket.emit('results', this.pollService.getResults(pollId));
  }

  @SubscribeMessage('vote')
  handleVote(
    @MessageBody() data: { pollId: string; option: string },
    @ConnectedSocket() socket: PollSocket,
  ) {
    const outcome = this.pollService.addVote(
      data.pollId,
      data.option,
      socket.data.user,
    );
    if (!outcome.ok) {
      return { ok: false, reason: outcome.reason };
    }

    this.server.to(data.pollId).emit('results', outcome.results);
    socket.to(data.pollId).emit('someoneVoted', data.option);
    return { ok: true };
  }
}

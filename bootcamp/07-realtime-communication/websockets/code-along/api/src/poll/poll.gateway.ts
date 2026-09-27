import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PollService } from './poll.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class PollGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly pollService: PollService) {}

  @SubscribeMessage('joinPoll')
  async handleJoin(
    @MessageBody() pollId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    await socket.join(pollId);
  }

  @SubscribeMessage('vote')
  handleVote(
    @MessageBody() data: { pollId: string; option: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const results = this.pollService.addVote(data.pollId, data.option);
    this.server.to(data.pollId).emit('results', results);
    socket.to(data.pollId).emit('someoneVoted', data.option);
  }
}

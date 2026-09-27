import { Module } from '@nestjs/common';
import { PollGateway } from './poll.gateway';
import { PollService } from './poll.service';

@Module({
  providers: [PollGateway, PollService],
})
export class PollModule {}

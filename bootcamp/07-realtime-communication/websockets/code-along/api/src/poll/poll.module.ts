import { Module } from '@nestjs/common';
import { PollGateway } from './poll.gateway';
import { PollService } from './poll.service';
import { PresenceService } from './presence.service';

@Module({
  providers: [PollGateway, PollService, PresenceService],
})
export class PollModule {}

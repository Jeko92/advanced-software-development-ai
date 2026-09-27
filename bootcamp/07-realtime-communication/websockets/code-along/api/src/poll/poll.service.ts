import { Injectable } from '@nestjs/common';

@Injectable()
export class PollService {
  private tallies: Record<string, Record<string, number>> = {};

  addVote(pollId: string, option: string) {
    const tally = (this.tallies[pollId] ??= {});
    tally[option] = (tally[option] ?? 0) + 1;
    return tally;
  }
}

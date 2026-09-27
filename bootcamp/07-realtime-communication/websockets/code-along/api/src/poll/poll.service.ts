import { Injectable } from '@nestjs/common';

export const POLL_OPTIONS: readonly string[] = ['pizza', 'pasta'];

export type PollResults = Record<string, number>;

export type VoteOutcome =
  { ok: true; results: PollResults } | { ok: false; reason: string };

@Injectable()
export class PollService {
  private tallies: Record<string, PollResults> = {};

  addVote(pollId: string, option: string): VoteOutcome {
    if (!POLL_OPTIONS.includes(option)) {
      return { ok: false, reason: `"${option}" is not an option` };
    }

    const tally = (this.tallies[pollId] ??= {});
    tally[option] = (tally[option] ?? 0) + 1;
    return { ok: true, results: tally };
  }
}

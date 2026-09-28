import { Injectable } from '@nestjs/common';

export const POLL_OPTIONS: readonly string[] = ['pizza', 'pasta'];

export type PollResults = Record<string, number>;

export type VoteOutcome =
  { ok: true; results: PollResults } | { ok: false; reason: string };

@Injectable()
export class PollService {
  private tallies: Record<string, PollResults> = {};
  private voters: Record<string, Set<string>> = {};

  getResults(pollId: string): PollResults {
    return this.tallies[pollId] ?? {};
  }

  addVote(pollId: string, option: string, user: string): VoteOutcome {
    if (!POLL_OPTIONS.includes(option)) {
      return { ok: false, reason: `"${option}" is not an option` };
    }

    const voters = (this.voters[pollId] ??= new Set());
    if (voters.has(user)) {
      return { ok: false, reason: `${user} already voted in #${pollId}` };
    }
    voters.add(user);

    const tally = (this.tallies[pollId] ??= {});
    tally[option] = (tally[option] ?? 0) + 1;
    return { ok: true, results: tally };
  }
}

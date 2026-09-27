import { Injectable } from '@nestjs/common';

type Viewer = { user: string; pollId: string };

@Injectable()
export class PresenceService {
  private viewers = new Map<string, Viewer>();

  /** Records which poll a socket is watching; returns the poll it left, if any. */
  join(socketId: string, user: string, pollId: string): string | undefined {
    const previous = this.viewers.get(socketId)?.pollId;
    this.viewers.set(socketId, { user, pollId });
    return previous;
  }

  /** Forgets a socket; returns the poll it was watching, if any. */
  leave(socketId: string): string | undefined {
    const pollId = this.viewers.get(socketId)?.pollId;
    this.viewers.delete(socketId);
    return pollId;
  }

  usersIn(pollId: string): string[] {
    const users = [...this.viewers.values()]
      .filter((viewer) => viewer.pollId === pollId)
      .map((viewer) => viewer.user);
    return [...new Set(users)];
  }
}

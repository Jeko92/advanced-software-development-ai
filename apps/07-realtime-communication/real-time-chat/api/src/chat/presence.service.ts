import { Injectable } from '@nestjs/common';

type Member = { username: string; room: string };

@Injectable()
export class PresenceService {
  private members = new Map<string, Member>();

  join(socketId: string, username: string, room: string): string | undefined {
    const previous = this.members.get(socketId)?.room;
    this.members.set(socketId, { username, room });
    return previous;
  }

  leave(socketId: string): Member | undefined {
    const member = this.members.get(socketId);
    this.members.delete(socketId);
    return member;
  }

  usersIn(room: string): string[] {
    const users = [...this.members.values()]
      .filter((member) => member.room === room)
      .map((member) => member.username);
    return [...new Set(users)].sort();
  }
}

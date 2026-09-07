import { type SessionData, Store } from 'express-session';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './entities/session.entity.ts';
import type { Repository } from 'typeorm';

@Injectable()
export class TypeormSessionStore extends Store {
  @InjectRepository(Session)
  private session!: Repository<Session>;

  override set(
    sid: string,
    session: SessionData,
    callback?: ((err?: unknown) => void) | undefined,
  ) {
    const serializedData = JSON.stringify(session);

    const DEFAULT_MAX_AGE_MS = 24 * 60 * 60 * 1000;
    const maxAge = session.cookie.maxAge ?? DEFAULT_MAX_AGE_MS;
    const expiresAt = new Date(Date.now() + maxAge);

    this.session
      .save({ sid, expiresAt, data: serializedData })
      .then(() => callback?.())
      .catch((err: unknown) => callback?.(err));
  }

  override get(
    sid: string,
    callback: (err: unknown, session?: SessionData | null) => void,
  ) {
    this.session
      .findOne({ where: { sid } })
      .then((foundSession) => {
        if (!foundSession) {
          callback(null, null);
          return;
        }

        if (+foundSession.expiresAt < Date.now()) {
          callback(null, null);
          this.session.delete(sid).catch(() => undefined);
          return;
        }

        const data = JSON.parse(foundSession.data) as SessionData;
        callback(null, data);
      })
      .catch((err: unknown) => callback(err));
  }

  override destroy(
    sid: string,
    callback?: ((err?: unknown) => void) | undefined,
  ) {
    this.session
      .delete(sid)
      .then(() => callback?.())
      .catch((err: unknown) => callback?.(err));
  }
}

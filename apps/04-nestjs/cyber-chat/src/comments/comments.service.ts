import { Injectable } from '@nestjs/common';
import { type Comment, COMMENTS } from './entities/comments.entity.ts';

@Injectable()
export class CommentsService {
  private comments: Comment[] = [...COMMENTS];

  getCommentById(id: string) {
    return this.comments.find((comment) => comment.id === Number(id));
  }

  getCommentsByThreadId(threadId: number) {
    return this.comments.filter((comment) => comment.threadId === threadId);
  }

  addComment(threadId: number, body: Omit<Comment, 'id' | 'threadId'>) {
    const nextId =
      Math.max(0, ...this.comments.map((comment) => comment.id)) + 1;

    const newComment: Comment = { id: nextId, threadId, ...body };
    this.comments.push(newComment);

    return newComment;
  }

  deleteCommentsByThreadId(threadId: number) {
    this.comments = this.comments.filter(
      (comment) => comment.threadId !== threadId,
    );
  }

  deleteComment(id: string) {
    const index = this.comments.findIndex(
      (comment) => comment.id === Number(id),
    );
    if (index === -1) return false;

    this.comments[index]!.body = 'deleted';

    return true;
  }
}

import { useEffect, useRef } from 'react';
import type { ChatMessage } from '../lib/chat';
import { Avatar } from './avatar';

const timeFormat = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
});

type MessageListProps = {
  messages: ChatMessage[];
  me: string;
  roomName: string;
};

export function MessageList({ messages, me, roomName }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-slate-400">
        <p className="text-4xl">👋</p>
        <p className="text-sm">No messages in {roomName} yet — say hi!</p>
      </div>
    );
  }

  return (
    <ol className="flex-1 space-y-3 overflow-y-auto px-6 py-4">
      {messages.map((message) => {
        if (message.kind === 'system') {
          return (
            <li key={message.id} className="flex justify-center">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                {message.text}
              </span>
            </li>
          );
        }

        const mine = message.username === me;
        return (
          <li
            key={message.id}
            className={`flex items-end gap-2 ${mine ? 'flex-row-reverse' : ''}`}
          >
            {!mine && <Avatar name={message.username} />}
            <div
              className={`max-w-[70%] space-y-1 ${mine ? 'items-end text-right' : ''}`}
            >
              <p className="text-xs text-slate-400">
                {!mine && (
                  <span className="mr-2 font-semibold text-slate-600">
                    {message.username}
                  </span>
                )}
                {timeFormat.format(new Date(message.sentAt))}
              </p>
              <p
                className={`rounded-2xl px-4 py-2 text-left text-sm break-words whitespace-pre-wrap shadow-sm ${
                  mine
                    ? 'rounded-br-sm bg-indigo-600 text-white'
                    : 'rounded-bl-sm border border-slate-200 bg-white'
                }`}
              >
                {message.text}
              </p>
            </div>
          </li>
        );
      })}
      <div ref={bottomRef} />
    </ol>
  );
}

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { SendHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { initials } from '@/lib/initials';
import { cn } from '@/lib/utils';
import { useSocketStore } from '@/store/socketStore';
import {
  CHAT_MESSAGE_MAX_LENGTH,
  CHEER_EMOJIS,
  type ChatMessage,
  type ClientRole,
} from '@/types';

const SENDER_LABEL: Record<ClientRole, string> = {
  seeker: '🔍 Seeker',
  hider: '🙈 Hider',
  observer: '👀 Observer',
};

const SENDER_COLOR: Record<ClientRole, string> = {
  seeker: 'text-seeker',
  hider: 'text-hider',
  observer: 'text-observer',
};

export function ChatPanel() {
  const role = useSocketStore((s) => s.role);
  const myName = useSocketStore((s) => s.myName);
  const status = useSocketStore((s) => s.matchState?.status);
  const messages = useSocketStore((s) => s.messages);
  const sendMessage = useSocketStore((s) => s.sendMessage);
  const cheer = useSocketStore((s) => s.cheer);
  const [text, setText] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const isObserver = role === 'observer';
  const roundLive =
    status === 'countdown' || status === 'running' || status === 'paused';

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(text);
    setText('');
  };

  const sender = (m: ChatMessage) => {
    if (m.from === 'observer') {
      return isObserver && m.name === myName ? 'You' : m.name;
    }
    return m.from === role ? 'You' : SENDER_LABEL[m.from];
  };

  return (
    <Card className="flex h-[28rem] w-full flex-col">
      <CardHeader>
        <CardTitle className="text-base">Chat</CardTitle>
      </CardHeader>
      <CardContent className="min-h-0 flex-1">
        <ScrollArea className="h-full pr-3">
          <ul className="grid gap-2 text-sm">
            {messages.map((m) => (
              <li
                key={`${m.sentAt}-${m.from}-${m.name}`}
                className="flex items-start gap-2"
              >
                {m.from === 'observer' && (
                  <span
                    className="grid size-6 shrink-0 place-items-center rounded-full bg-observer/15 text-[0.65rem] font-semibold text-observer"
                    title={m.name ?? undefined}
                  >
                    {initials(m.name)}
                  </span>
                )}
                <p className="min-w-0 break-words">
                  <span className={cn('font-medium', SENDER_COLOR[m.from])}>
                    {sender(m)}
                  </span>
                  {m.audience === 'spectators' && (
                    <span className="text-xs text-muted-foreground">
                      {' '}
                      · spectators only
                    </span>
                  )}
                  : {m.text}
                </p>
              </li>
            ))}
          </ul>
          <div ref={endRef} />
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-2">
        {isObserver && (
          <div className="flex justify-between gap-1" aria-label="Cheer">
            {CHEER_EMOJIS.map((emoji) => (
              <Button
                key={emoji}
                variant="outline"
                size="icon"
                aria-label={`Cheer ${emoji}`}
                onClick={() => cheer(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        )}
        <form className="flex w-full gap-2" onSubmit={onSubmit}>
          <Input
            value={text}
            maxLength={CHAT_MESSAGE_MAX_LENGTH}
            placeholder="Say something…"
            aria-label="Chat message"
            onChange={(e) => setText(e.target.value)}
          />
          <Button type="submit" size="icon" aria-label="Send">
            <SendHorizontal />
          </Button>
        </form>
        {isObserver && roundLive && (
          <p className="text-xs text-muted-foreground">
            Players see spectator messages between rounds — cheer with emojis
            meanwhile!
          </p>
        )}
      </CardFooter>
    </Card>
  );
}

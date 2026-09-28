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
import { useSocketStore } from '@/store/socketStore';
import { CHAT_MESSAGE_MAX_LENGTH, type Role } from '@/types';

const SENDER_LABEL: Record<Role, string> = {
  seeker: '🔍 Seeker',
  hider: '🙈 Hider',
};

export function ChatPanel() {
  const role = useSocketStore((s) => s.role);
  const messages = useSocketStore((s) => s.messages);
  const sendMessage = useSocketStore((s) => s.sendMessage);
  const [text, setText] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const isPlayer = role === 'seeker' || role === 'hider';

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(text);
    setText('');
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
              <li key={`${m.sentAt}-${m.from}`}>
                <span
                  className={m.from === 'seeker' ? 'text-seeker' : 'text-hider'}
                >
                  {m.from === role ? 'You' : SENDER_LABEL[m.from]}
                </span>
                : {m.text}
              </li>
            ))}
          </ul>
          <div ref={endRef} />
        </ScrollArea>
      </CardContent>
      <CardFooter>
        {isPlayer ? (
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
        ) : (
          <p className="text-sm text-muted-foreground">
            Observers can read the chat.
          </p>
        )}
      </CardFooter>
    </Card>
  );
}

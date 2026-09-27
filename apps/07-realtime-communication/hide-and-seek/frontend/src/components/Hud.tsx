import { useState } from 'react';
import { Check, Copy, Eye, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useSocketStore } from '@/store/socketStore';
import {
  DIFFICULTIES,
  WORLD_SIZES,
  type ClientRole,
  type MatchState,
} from '@/types';

const ROLE_COPY: Record<
  ClientRole,
  { icon: string; label: string; goal: string; className: string }
> = {
  seeker: {
    icon: '🔍',
    label: 'Seeker',
    goal: 'Catch the hider',
    className: 'bg-seeker/15 text-seeker',
  },
  hider: {
    icon: '🙈',
    label: 'Hider',
    goal: 'Stay hidden until time runs out',
    className: 'bg-hider/15 text-hider',
  },
  observer: {
    icon: '👀',
    label: 'Watching',
    goal: 'You are an observer',
    className: 'bg-observer/15 text-observer',
  },
};

export function Hud({ match }: { match: MatchState }) {
  const role = useSocketStore((s) => s.role)!;
  const leaveRoom = useSocketStore((s) => s.leaveRoom);
  const copy = ROLE_COPY[role];
  const low = match.timeRemaining <= 10;

  return (
    <div className="grid w-full max-w-2xl gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className={copy.className} title={copy.goal}>
          {copy.icon} {copy.label}
        </Badge>
        <RoomNameButton roomId={match.roomId} />
        <Badge variant="outline">
          {WORLD_SIZES[match.worldSize].label} ·{' '}
          {DIFFICULTIES[match.difficulty].label}
        </Badge>
        {match.observerCount > 0 && (
          <Badge variant="outline">
            <Eye /> {match.observerCount}
          </Badge>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto"
          onClick={leaveRoom}
        >
          <LogOut /> Leave
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Progress
          value={(match.timeRemaining / match.gameLengthSeconds) * 100}
          aria-label="Time left"
          className={cn(
            'flex-1',
            low && '[&_[data-slot=progress-indicator]]:bg-destructive',
          )}
        />
        <span
          className={cn(
            'w-12 text-right text-sm tabular-nums',
            low && 'animate-pulse text-destructive',
          )}
        >
          {match.timeRemaining}s
        </span>
      </div>
    </div>
  );
}

function RoomNameButton({ roomId }: { roomId: string }) {
  const [copied, setCopied] = useState(false);

  const copyName = async () => {
    await navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={copyName}
      title="Copy room name"
    >
      Room: <strong>{roomId}</strong>
      {copied ? <Check /> : <Copy />}
    </Button>
  );
}

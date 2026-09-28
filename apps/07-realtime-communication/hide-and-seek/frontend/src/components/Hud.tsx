import { useState } from 'react';
import { Check, Copy, Eye, LogOut, Pause } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useSocketStore } from '@/store/socketStore';
import {
  DIFFICULTIES,
  WORLD_SIZES,
  type ClientRole,
  type EffectType,
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

const EFFECT_COPY: Record<EffectType, { icon: string; label: string }> = {
  speedBoost: { icon: '⚡', label: 'Speed' },
  frozen: { icon: '🥶', label: 'Frozen' },
};

export function Hud({ match }: { match: MatchState }) {
  const role = useSocketStore((s) => s.role)!;
  const leaveRoom = useSocketStore((s) => s.leaveRoom);
  const requestPause = useSocketStore((s) => s.requestPause);
  const copy = ROLE_COPY[role];
  const isPlayer = role === 'seeker' || role === 'hider';
  const pauseRequested = isPlayer && match.pauseRequestedBy === role;
  const low = match.timeRemaining !== null && match.timeRemaining <= 10;

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
        <div className="ml-auto flex gap-2">
          {isPlayer && match.status === 'running' && (
            <Button
              variant="outline"
              size="sm"
              disabled={!!match.pauseRequestedBy}
              onClick={requestPause}
            >
              <Pause /> {pauseRequested ? 'Pause requested…' : 'Pause'}
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={leaveRoom}>
            <LogOut /> Leave
          </Button>
        </div>
      </div>
      {match.timeRemaining === null || match.gameLengthSeconds === null ? (
        <Badge variant="outline" className="justify-self-start">
          ∞ Free mode — catch only
        </Badge>
      ) : (
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
      )}
      <EffectBadges match={match} role={role} />
    </div>
  );
}

function EffectBadges({
  match,
  role,
}: {
  match: MatchState;
  role: ClientRole;
}) {
  const badges = (['seeker', 'hider'] as const).flatMap((owner) => {
    const effect = match.effects[owner];
    if (!effect) return [];
    const copy = EFFECT_COPY[effect.type];
    let who = '';
    if (role === 'observer') who = owner === 'seeker' ? '🔍 ' : '🙈 ';
    else if (owner !== role) who = 'Opponent ';
    return [
      <Badge
        key={owner}
        variant={effect.type === 'frozen' ? 'destructive' : 'secondary'}
      >
        {who}
        {copy.icon} {copy.label} {effect.secondsLeft}s
      </Badge>,
    ];
  });

  if (badges.length === 0) return null;
  return <div className="flex flex-wrap gap-2">{badges}</div>;
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

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ReceivedCommentary } from '@/hooks/use-match-stream';
import type { CommentaryKind, MatchInfo } from '@/lib/types';

const ICONS: Record<CommentaryKind, string> = {
  kickoff: '▶️',
  goal: '⚽',
  'yellow-card': '🟨',
  'red-card': '🟥',
  substitution: '🔁',
  var: '📺',
  shot: '🎯',
  corner: '🚩',
  foul: '✋',
  offside: '🚫',
  period: '⏱️',
  other: '•',
};

const TAGGED: CommentaryKind[] = [
  'goal',
  'yellow-card',
  'red-card',
  'substitution',
  'shot',
  'corner',
];

const HIGHLIGHT: Partial<Record<CommentaryKind, string>> = {
  goal: 'bg-emerald-500/10',
  'red-card': 'bg-destructive/10',
  var: 'bg-sky-500/10',
};

type CommentaryFeedProps = {
  info: MatchInfo | null;
  items: ReceivedCommentary[];
};

export function CommentaryFeed({ info, items }: CommentaryFeedProps) {
  return (
    <Card className="min-h-0">
      <CardHeader>
        <CardTitle>Live commentary</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Waiting for the first event…
          </p>
        ) : (
          <ol className="flex max-h-[60vh] flex-col gap-1 overflow-y-auto pr-1">
            {items.map((item) => {
              const team =
                item.side && TAGGED.includes(item.kind)
                  ? info?.[item.side]
                  : null;
              return (
                <li
                  key={item.id}
                  className={cn(
                    'grid animate-in grid-cols-[3.5rem_1.5rem_1fr_auto] items-start gap-2 rounded-md px-2 py-1.5 text-sm duration-300 fade-in slide-in-from-top-1',
                    HIGHLIGHT[item.kind],
                  )}
                >
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {item.minute}
                  </span>
                  <span aria-hidden>{ICONS[item.kind]}</span>
                  <span className={cn(item.kind === 'goal' && 'font-medium')}>
                    {team && (
                      <span className="mr-1 text-xs font-semibold text-muted-foreground">
                        {team.abbreviation}
                      </span>
                    )}
                    {item.text}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] text-muted-foreground"
                    title="How this event reached the browser"
                  >
                    {item.via === 'named' ? 'named' : 'onmessage'}
                  </Badge>
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}

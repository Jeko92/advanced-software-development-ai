import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useSocketStore } from '@/store/socketStore';

export function DPad() {
  const role = useSocketStore((s) => s.role);
  const move = useSocketStore((s) => s.move);
  if (role !== 'seeker' && role !== 'hider') return null;

  const pad = (direction: string, label: string, icon: ReactNode) => (
    <Button
      variant="outline"
      size="icon-lg"
      className="touch-manipulation"
      aria-label={label}
      onClick={() => move(direction)}
    >
      {icon}
    </Button>
  );

  return (
    <div className="grid grid-cols-3 gap-1 pointer-fine:hidden">
      <span />
      {pad('up', 'Up', <ArrowUp />)}
      <span />
      {pad('left', 'Left', <ArrowLeft />)}
      <span />
      {pad('right', 'Right', <ArrowRight />)}
      <span />
      {pad('down', 'Down', <ArrowDown />)}
      <span />
    </div>
  );
}

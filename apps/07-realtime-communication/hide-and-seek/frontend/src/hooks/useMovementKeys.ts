import { useEffect } from 'react';
import { useSocketStore } from '@/store/socketStore';

const KEY_TO_DIRECTION: Record<string, string> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};

export function useMovementKeys() {
  const move = useSocketStore((s) => s.move);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLButtonElement
      ) {
        return;
      }
      const direction = KEY_TO_DIRECTION[e.key];
      if (!direction) return;
      e.preventDefault();
      const { role, matchState } = useSocketStore.getState();
      if (role === 'observer' || matchState?.status !== 'running') return;
      move(direction);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [move]);
}

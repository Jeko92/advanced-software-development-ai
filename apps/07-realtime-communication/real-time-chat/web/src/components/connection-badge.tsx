type ConnectionBadgeProps = {
  connected: boolean;
};

export function ConnectionBadge({ connected }: ConnectionBadgeProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
        connected
          ? 'bg-emerald-100 text-emerald-800'
          : 'bg-amber-100 text-amber-800'
      }`}
    >
      <span
        className={`size-2 rounded-full ${
          connected ? 'bg-emerald-500' : 'animate-pulse bg-amber-500'
        }`}
      />
      {connected ? 'Connected' : 'Reconnecting...'}
    </span>
  );
}

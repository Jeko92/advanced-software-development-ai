type TypingIndicatorProps = {
  users: string[];
};

function describe(users: string[]) {
  if (users.length === 1) return `${users[0]} is typing`;
  if (users.length === 2) return `${users[0]} and ${users[1]} are typing`;
  return 'Several people are typing';
}

export function TypingIndicator({ users }: TypingIndicatorProps) {
  return (
    <div className="h-6 px-6 text-xs text-slate-500" aria-live="polite">
      {users.length > 0 && (
        <span className="inline-flex items-center gap-2">
          <span className="inline-flex gap-0.5">
            <span className="size-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
            <span className="size-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
            <span className="size-1.5 animate-bounce rounded-full bg-slate-400" />
          </span>
          {describe(users)}
        </span>
      )}
    </div>
  );
}

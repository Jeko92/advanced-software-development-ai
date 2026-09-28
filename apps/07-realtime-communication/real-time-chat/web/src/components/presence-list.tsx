import { Avatar } from './avatar';

type PresenceListProps = {
  users: string[];
  me: string;
  /** Optional: makes other users clickable (Bonus — private messages). */
  onSelectUser?: ((user: string) => void) | undefined;
};

export function PresenceList({ users, me, onSelectUser }: PresenceListProps) {
  return (
    <section className="space-y-2">
      <h2 className="px-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">
        In this room · {users.length}
      </h2>
      <ul className="space-y-0.5">
        {users.map((user) => {
          const clickable = onSelectUser && user !== me;
          return (
            <li key={user}>
              <button
                type="button"
                disabled={!clickable}
                onClick={() => onSelectUser?.(user)}
                title={clickable ? `Message ${user} privately` : undefined}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-sm text-slate-300 enabled:hover:bg-white/5 enabled:hover:text-white"
              >
                <span className="relative">
                  <Avatar name={user} size="sm" />
                  <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-slate-900 bg-emerald-400" />
                </span>
                <span className="truncate">
                  {user}
                  {user === me && (
                    <span className="ml-1 text-slate-500">(you)</span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

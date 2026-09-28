import { useState, type FormEvent } from 'react';
import { roomLabel } from '../lib/chat';

type RoomSidebarProps = {
  rooms: readonly string[];
  currentRoom: string;
  me: string;
  onSelectRoom: (room: string) => void;
};

export function RoomSidebar({
  rooms,
  currentRoom,
  me,
  onSelectRoom,
}: RoomSidebarProps) {
  const [draft, setDraft] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const room = draft
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    if (!room) return;
    onSelectRoom(room);
    setDraft('');
  };

  return (
    <section className="space-y-2">
      <h2 className="px-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">
        Rooms
      </h2>
      <ul className="space-y-0.5">
        {rooms.map((room) => (
          <li key={room}>
            <button
              type="button"
              onClick={() => onSelectRoom(room)}
              className={`w-full truncate rounded-md px-2 py-1.5 text-left text-sm ${
                room === currentRoom
                  ? 'bg-indigo-500/20 font-semibold text-white'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {roomLabel(room, me)}
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit} className="px-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="+ join or create room"
          className="w-full rounded-md bg-white/5 px-2 py-1.5 text-sm text-white placeholder:text-slate-500 focus:bg-white/10 focus:outline-none"
        />
      </form>
    </section>
  );
}

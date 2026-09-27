import { useState, type FormEvent } from 'react';
import { PRESET_ROOMS, type Session } from '../lib/chat';

type JoinScreenProps = {
  onJoin: (session: Session) => void;
  /** A reason the server refused the connection, e.g. an invalid username. */
  error?: string | null;
};

export function JoinScreen({ onJoin, error }: JoinScreenProps) {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState<string>(PRESET_ROOMS[0]);

  const trimmed = username.trim();
  const valid = trimmed.length >= 2 && trimmed.length <= 20;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (valid) onJoin({ username: trimmed, room });
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-50 to-sky-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-indigo-100"
      >
        <div className="space-y-1 text-center">
          <p className="text-4xl">💬</p>
          <h1 className="text-2xl font-bold">Real-time chat</h1>
          <p className="text-sm text-slate-500">
            Pick a name and a room. Open a second tab to chat with yourself.
          </p>
        </div>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Username</span>
          <input
            autoFocus
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="e.g. alice"
            maxLength={20}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          <span className="text-xs text-slate-400">2–20 characters</span>
        </label>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-slate-700">Room</legend>
          <div className="flex gap-2">
            {PRESET_ROOMS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setRoom(preset)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${
                  preset === room
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                #{preset}
              </button>
            ))}
          </div>
        </fieldset>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!valid}
          className="w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Join chat
        </button>
      </form>
    </main>
  );
}

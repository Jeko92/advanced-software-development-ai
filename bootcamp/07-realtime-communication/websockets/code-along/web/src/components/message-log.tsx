import { useState, type FormEvent } from 'react';

type MessageLogProps = {
  messages: string[];
  onSend: (text: string) => void;
};

export function MessageLog({ messages, onSend }: MessageLogProps) {
  const [draft, setDraft] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.trim()) return;
    onSend(draft);
    setDraft('');
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Send
        </button>
      </form>

      <ol className="h-64 space-y-1 overflow-y-auto rounded-md bg-slate-900 p-3 font-mono text-xs text-slate-100">
        {messages.map((message, index) => (
          <li key={index}>received: {message}</li>
        ))}
      </ol>
    </div>
  );
}

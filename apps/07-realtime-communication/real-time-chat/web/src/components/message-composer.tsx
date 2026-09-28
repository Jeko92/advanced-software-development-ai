import { useEffect, useRef, useState, type FormEvent } from 'react';

/** How long after the last keystroke a user counts as "stopped typing". */
const TYPING_IDLE_MS = 2000;

type MessageComposerProps = {
  placeholder: string;
  disabled?: boolean;
  onSend: (text: string) => void;
  /** Called with `true` when typing starts and `false` once it stops or the message is sent. */
  onTyping: (isTyping: boolean) => void;
};

export function MessageComposer({
  placeholder,
  disabled = false,
  onSend,
  onTyping,
}: MessageComposerProps) {
  const [draft, setDraft] = useState('');
  const typingRef = useRef(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const stopTyping = () => {
    clearTimeout(idleTimerRef.current);
    if (typingRef.current) {
      typingRef.current = false;
      onTyping(false);
    }
  };

  // Clear the idle timer when the composer unmounts.
  useEffect(() => () => clearTimeout(idleTimerRef.current), []);

  const handleChange = (value: string) => {
    setDraft(value);
    if (!value) {
      stopTyping();
      return;
    }
    if (!typingRef.current) {
      typingRef.current = true;
      onTyping(true);
    }
    clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(stopTyping, TYPING_IDLE_MS);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || disabled) return;
    onSend(text);
    setDraft('');
    stopTyping();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 border-t border-slate-200 bg-white px-6 py-4"
    >
      <input
        value={draft}
        onChange={(event) => handleChange(event.target.value)}
        placeholder={disabled ? 'Waiting for connection...' : placeholder}
        disabled={disabled}
        maxLength={500}
        className="flex-1 rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={disabled || !draft.trim()}
        className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
}

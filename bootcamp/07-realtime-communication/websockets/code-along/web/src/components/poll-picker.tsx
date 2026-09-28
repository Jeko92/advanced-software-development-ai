import { POLL_IDS } from '../lib/config';

type PollPickerProps = {
  value: string;
  onChange: (pollId: string) => void;
};

export function PollPicker({ value, onChange }: PollPickerProps) {
  return (
    <div className="mb-4 flex gap-2">
      {POLL_IDS.map((pollId) => (
        <button
          key={pollId}
          type="button"
          onClick={() => onChange(pollId)}
          className={`rounded-md px-3 py-1 text-sm font-medium ${
            pollId === value
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          #{pollId}
        </button>
      ))}
    </div>
  );
}

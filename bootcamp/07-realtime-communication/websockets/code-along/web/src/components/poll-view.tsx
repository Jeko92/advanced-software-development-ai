import type { PollResults } from '../lib/config';

type PollViewProps = {
  options: readonly string[];
  results: PollResults;
  onVote: (option: string) => void;
};

export function PollView({ options, results, onVote }: PollViewProps) {
  const total = Object.values(results).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onVote(option)}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white capitalize hover:bg-indigo-500"
          >
            {option}
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {Object.entries(results).map(([option, count]) => (
          <li key={option}>
            <div className="flex justify-between text-sm">
              <span className="capitalize">{option}</span>
              <span className="tabular-nums">{count}</span>
            </div>
            <div className="h-2 overflow-hidden rounded bg-slate-100">
              <div
                className="h-full bg-indigo-500 transition-all"
                style={{ width: `${total ? (count / total) * 100 : 0}%` }}
              />
            </div>
          </li>
        ))}
      </ul>

      <pre className="rounded-md bg-slate-900 p-3 text-xs text-slate-100">
        {JSON.stringify(results, null, 2)}
      </pre>
    </div>
  );
}

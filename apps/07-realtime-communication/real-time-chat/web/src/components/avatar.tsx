const COLORS = [
  'bg-rose-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-sky-500',
  'bg-indigo-500',
  'bg-fuchsia-500',
  'bg-teal-500',
  'bg-orange-500',
];

function colorFor(name: string) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return COLORS[hash % COLORS.length];
}

type AvatarProps = {
  name: string;
  size?: 'sm' | 'md';
};

export function Avatar({ name, size = 'md' }: AvatarProps) {
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white uppercase ${colorFor(name)} ${
        size === 'sm' ? 'size-7 text-xs' : 'size-9 text-sm'
      }`}
    >
      {name.slice(0, 2)}
    </span>
  );
}

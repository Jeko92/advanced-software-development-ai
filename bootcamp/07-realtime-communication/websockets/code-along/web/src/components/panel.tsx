import type { ReactNode } from 'react';

type PanelProps = {
  title: string;
  description: string;
  status?: ReactNode;
  children: ReactNode;
};

export function Panel({ title, description, status, children }: PanelProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>
        {status}
      </header>
      {children}
    </section>
  );
}

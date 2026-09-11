'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { CopySnippetButton } from '@/components/CopySnippetButton';
import type { Snippet } from '@/lib/services/snippetsService';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const languageForMonaco: Record<Snippet['language'], string> = {
  CSS: 'css',
  JavaScript: 'javascript',
  TypeScript: 'typescript',
};

export const SnippetCodeViewer = ({
  code,
  language,
}: {
  code: string;
  language: Snippet['language'];
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(code);

  return (
    <div className="overflow-hidden rounded-2xl bg-code text-code-foreground">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-xs text-white/60">{language}</span>
        <div className="flex gap-2">
          <CopySnippetButton code={value} />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing((current) => !current)}
          >
            {isEditing ? 'View code' : 'Edit code'}
          </Button>
        </div>
      </div>
      {isEditing ? (
        <Editor
          height="320px"
          language={languageForMonaco[language]}
          value={value}
          onChange={(newValue) => setValue(newValue ?? '')}
          theme="vs-dark"
          options={{ minimap: { enabled: false }, fontSize: 13 }}
        />
      ) : (
        <pre className="overflow-x-auto p-4 font-mono text-sm">
          <code>{value}</code>
        </pre>
      )}
    </div>
  );
};

'use client';

import { useState } from 'react';
import { addSnippet } from '@/lib/actions/snippets';

export const CreateButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return <button onClick={() => setIsOpen(true)}>New delivery</button>;
  }

  return (
    <form
      action={async (formData: FormData) => {
        await addSnippet(formData);
        setIsOpen(false);
      }}
    >
      <input name="title" placeholder="Title" required />
      <input name="language" placeholder="Programming Language" required />
      <input name="description" placeholder="Description" required />
      <input name="code" placeholder="Code" required />
      <button type="submit">Create request</button>
      <button type="button" onClick={() => setIsOpen(false)}>
        Cancel
      </button>
    </form>
  );
};

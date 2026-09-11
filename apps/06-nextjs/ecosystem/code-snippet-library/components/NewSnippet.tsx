'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { addSnippetFromObject } from '@/lib/actions/snippets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ProgrammingLanguage } from '@/lib/generated/prisma/enums';

type FormValues = {
  title: string;
  language: ProgrammingLanguage;
  description: string;
  code: string;
};

export const CreateButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { language: 'CSS' } });

  if (!isOpen) {
    return <Button onClick={() => setIsOpen(true)}>New snippet</Button>;
  }

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);
    const result = await addSnippetFromObject(data);
    if (result.ok) {
      reset();
      setIsOpen(false);
    } else {
      setSubmitError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Title"
          {...register('title', {
            required: 'Title is required',
            minLength: {
              value: 2,
              message: 'Title must be at least 2 characters',
            },
          })}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="language">Language</Label>
        <select
          id="language"
          className="rounded-4xl border border-input bg-input/30 px-3 py-2 text-sm"
          {...register('language', { required: true })}
        >
          <option value="CSS">CSS</option>
          <option value="JAVASCRIPT">JavaScript</option>
          <option value="TYPESCRIPT">TypeScript</option>
        </select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="Description"
          {...register('description', {
            required: 'Description is required',
          })}
        />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="code">Code</Label>
        <textarea
          id="code"
          rows={6}
          className="rounded-md border p-3 font-mono text-sm"
          {...register('code', { required: 'Code is required' })}
        />
        {errors.code && (
          <p className="text-sm text-destructive">{errors.code.message}</p>
        )}
      </div>

      {submitError && <p className="text-sm text-destructive">{submitError}</p>}

      <div className="flex gap-2">
        <Button type="submit">Create snippet</Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

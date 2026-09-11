import { addSnippet } from '@/lib/actions/snippets';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

const NewSnippetPage = () => {
  return (
    <form action={addSnippet} className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" placeholder="Title" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="language">Language</Label>
        <Select name="language" defaultValue="CSS">
          <SelectTrigger id="language" className="w-full">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CSS">CSS</SelectItem>
            <SelectItem value="JAVASCRIPT">JavaScript</SelectItem>
            <SelectItem value="TYPESCRIPT">TypeScript</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          placeholder="Description"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="code">Code</Label>
        <textarea
          id="code"
          name="code"
          required
          rows={8}
          className="rounded-md border p-3 font-mono text-sm"
        />
      </div>
      <Button type="submit" className="self-start">
        Create Snippet
      </Button>
    </form>
  );
};

export default NewSnippetPage;

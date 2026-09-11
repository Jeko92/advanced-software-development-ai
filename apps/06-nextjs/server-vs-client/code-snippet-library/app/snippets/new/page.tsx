import { addSnippet } from '@/lib/actions/snippets';

const NewSnippetPage = () => {
  return (
    <form action={addSnippet}>
      <input name="title" placeholder="Title" required />
      <select name="language" required defaultValue="">
        <option value="" disabled>
          Select a language
        </option>
        <option value="CSS">CSS</option>
        <option value="JAVASCRIPT">JavaScript</option>
        <option value="TYPESCRIPT">TypeScript</option>
      </select>
      <input name="description" placeholder="Description" required />
      <textarea name="code" placeholder="Code" required />
      <button type="submit">Create Snippet</button>
    </form>
  );
};

export default NewSnippetPage;

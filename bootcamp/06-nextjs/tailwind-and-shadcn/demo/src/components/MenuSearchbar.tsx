export default function MenuSearchbar({
  currentQuery,
}: {
  currentQuery?: string | undefined;
}) {
  return (
    <form>
      <input
        type="search"
        name="query"
        defaultValue={currentQuery}
        placeholder="Search"
      />
      <button type="submit">Search</button>
    </form>
  );
}

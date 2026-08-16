-- seeddb.sql
DROP TABLE IF EXISTS posting;

DROP TABLE IF EXISTS authors;

CREATE TABLE authors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

CREATE TABLE posting (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image TEXT NOT NULL,
  author TEXT NOT NULL,
  author_id INTEGER REFERENCES authors (id),
  createdAt TIMESTAMP NOT NULL,
  teaser TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  slug TEXT NOT NULL
);

INSERT INTO
  authors (name)
VALUES
  ('Peter Parker'),
  ('Mary Jane Watson'),
  ('Harry Osborn'),
  ('Miles Morales'),
  ('Norman Osborn'),
  ('Eddie Brock');

INSERT INTO
  posting (
    image,
    author,
    author_id,
    createdAt,
    teaser,
    title,
    content,
    slug
  )
VALUES
  (
    'colorful-umbrella.jpg',
    'Peter Parker',
    1,
    1743120000,
    'Scientifically, black is not a color but rather the absence of all colors, occurring when an object absorbs nearly all light wavelengths instead of reflecting them.',
    'Black: The Absence, Not the Presence, of Color',
    '<p>When you think about the rainbow, you see a vibrant spectrum of hues. But black does not appear in that spectrum the same way red or blue does.</p><p>From a scientific perspective, black is usually the absence of visible light, not a reflected wavelength.</p>',
    'black-the-absence-not-the-presence-of-color'
  ),
  (
    'flowers.jpg',
    'Mary Jane Watson',
    2,
    1745452800,
    'Flowers inspire design with their color palettes, structure, and balance between repetition and variation.',
    'Flowers: Nature''s Muse for Design',
    '<p>Designers borrow from flowers all the time: layered composition, contrasting accents, and natural hierarchy.</p>',
    'flowers-nature-s-muse-for-design'
  ),
  (
    'sailing.jpg',
    'Harry Osborn',
    3,
    1748736000,
    'Strong design starts with one clear core idea, then adds supporting details that reinforce it.',
    'UDesign''s Harmony: Core Purpose and Supporting Details',
    '<p>A useful mental model is major and minor elements. Major elements communicate the main point, minor elements support it without stealing focus.</p>',
    'udesign-s-harmony-core-purpose-and-supporting-details'
  ),
  (
    'colorful-umbrella.jpg',
    'Guest Contributor',
    NULL,
    1750000000,
    'A post from a contributor not yet added to the authors table — shows why the JOIN in loadPostsWithAuthors() uses LEFT JOIN.',
    'A Guest Post Without a Linked Author',
    '<p>This entry intentionally has no matching row in authors, so authorName comes back null instead of the row being dropped.</p>',
    'a-guest-post-without-a-linked-author'
  ),
  (
    'colorful-umbrella.jpg',
    'Miles Morales',
    4,
    1750086400,
    'A disposable row for the Bruno API collection''s PUT/DELETE examples to mutate without touching the other seeded posts.',
    'API Playground Post',
    '<p>Safe to update or delete via the JSON API — reset with pnpm db:seed.</p>',
    'api-playground-post'
  );

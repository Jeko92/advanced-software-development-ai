// intersection / union types
// tuples
// utility types
// generics

import type { Media, mediaType } from './types.ts';

type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

type HasId = {
  id: string;
};

type DatabaseMedia = Media & Timestamped & HasId;

const pinkFloydVinyl: Media = {
  price: 120,
  stock: 1,
  type: 'mp3',
  bitrate: 320,
};

console.log('pinkFloydVinyl:', pinkFloydVinyl);

const dbMedia: DatabaseMedia = {
  ...pinkFloydVinyl,
  id: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

console.log('dbMedia:', dbMedia);

type ButtonProps = {
  as: 'button' | 'a';
  className: string;
} & (
  | {
      as: 'button';
      onClick: () => void;
    }
  | {
      as: 'a';
      href: string;
    }
);

const linkButton: ButtonProps = {
  as: 'a',
  className: 'button',
  href: '/books',
};

console.log('linkButton:', linkButton);

type Listing<T extends Media> = {
  creationDate: Date;
  data: T;
};

type MP3Listing = Listing<{
  price: number;
  stock: number;
  type: 'mp3';
  bitrate: 128;
}>;

const mp3Listing: MP3Listing = {
  creationDate: new Date(),
  data: {
    price: 120,
    stock: 1,
    type: 'mp3',
    bitrate: 128,
  },
};

console.log('mp3Listing:', mp3Listing);

type RType = Promise<Media>;
const rTypeExample: RType = Promise.resolve(pinkFloydVinyl);
console.log('rTypeExample resolves to:', await rTypeExample);

type MediaWithoutStorageData = Omit<Media, 'price' | 'stock'>;
const mediaWithoutStorageData: MediaWithoutStorageData = {
  type: 'mp3',
};

console.log('mediaWithoutStorageData:', mediaWithoutStorageData);

function test<T extends mediaType, MT extends Media & { type: T }>(
  type: T,
  second: MT,
): MT {
  console.log(`test() called for media type "${type}"`);
  return second;
}

const result = test('vinyl', {
  stock: 2,
  price: 1,
  type: 'vinyl',
  recordType: 'EP',
});

console.log('result:', result);

function pick<TObj extends Record<string, unknown>, TKey extends keyof TObj>(
  obj: TObj,
  key: TKey,
) {
  return obj[key];
}

const test2 = pick({ a: 1, b: 2, brokkoli: true }, 'brokkoli');
console.log("test2 (picked 'brokkoli'):", test2);

const obj = {
  test: 1234,
  'test 2': 1234,
  0: 1234,
};

console.log('obj:', obj);

class TimeoutError extends Error {
  readonly time = 10;
}

try {
  // cool stuff

  throw new Error('test');
} catch (rawError) {
  if (rawError instanceof TimeoutError) {
    // try fetch the data again
  }
  const error = toError(rawError);
  console.error(error.message);
}

function toError(error: unknown): Error {
  if (error instanceof TimeoutError) return new Error('waited too long');
  if (error instanceof Error) return error;
  if (error === typeof String) return new Error(error as string);
  return new Error('unknown error');
}

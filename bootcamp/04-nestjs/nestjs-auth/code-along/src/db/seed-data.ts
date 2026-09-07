import type { UserRoleType } from '../users/entities/user.entity';
import type { ConcertGenre } from '../concerts/concert-genres';

export type Quote = {
  id: number;
  quote: string;
  author: string;
};

export const quotes = [
  {
    id: 1,
    quote: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
  },
  {
    id: 2,
    quote: 'Be the change that you wish to see in the world.',
    author: 'Mahatma Gandhi',
  },
  {
    id: 3,
    quote: 'Innovation distinguishes between a leader and a follower.',
    author: 'Steve Jobs',
  },
  {
    id: 4,
    quote:
      'The future belongs to those who believe in the beauty of their dreams.',
    author: 'Eleanor Roosevelt',
  },
  {
    id: 5,
    quote: 'Strive not to be a success, but rather to be of value.',
    author: 'Albert Einstein',
  },
  {
    id: 6,
    quote: "Life is what happens when you're busy making other plans.",
    author: 'John Lennon',
  },
  {
    id: 7,
    quote: 'The only impossible journey is the one you never begin.',
    author: 'Tony Robbins',
  },
  {
    id: 8,
    quote: 'The mind is everything. What you think you become.',
    author: 'Buddha',
  },
  {
    id: 9,
    quote: "Believe you can and you're halfway there.",
    author: 'Theodore Roosevelt',
  },
  {
    id: 10,
    quote: 'The best way to predict the future is to create it.',
    author: 'Peter Drucker',
  },
];

export type SeedUser = {
  username: string;
  password: string;
  roles: UserRoleType[];
};

export const users: SeedUser[] = [
  {
    username: 'viewer',
    password: 'viewer12345',
    roles: ['viewer'],
  },
  {
    username: 'admin',
    password: 'admin12345',
    roles: ['admin'],
  },
];

export type SeedConcert = {
  title: string;
  artist: string;
  venue: string;
  date: string;
  ticketPrice: number;
  genre: ConcertGenre;
};

export const concerts: SeedConcert[] = [
  {
    title: 'This Is Not a Drill',
    artist: 'Roger Waters',
    venue: 'Olympiastadion',
    date: '2026-09-14T19:30:00.000Z',
    ticketPrice: 145,
    genre: 'rock',
  },
  {
    title: 'Celebration Day',
    artist: 'Led Zeppelin',
    venue: 'The O2 Arena',
    date: '2026-11-08T20:00:00.000Z',
    ticketPrice: 220,
    genre: 'rock',
  },
  {
    title: 'The New Abnormal Tour',
    artist: 'The Strokes',
    venue: 'Ziggo Dome',
    date: '2026-10-02T19:00:00.000Z',
    ticketPrice: 78,
    genre: 'rock',
  },
  {
    title: 'First Two Pages of Frankenstein',
    artist: 'The National',
    venue: 'Ancienne Belgique',
    date: '2026-10-25T20:00:00.000Z',
    ticketPrice: 62,
    genre: 'rock',
  },
  {
    title: 'Berlin Calling Live',
    artist: 'Paul Kalkbrenner',
    venue: 'Velodrom',
    date: '2026-09-26T22:00:00.000Z',
    ticketPrice: 68,
    genre: 'electronic',
  },
  {
    title: 'Dopamine Tour',
    artist: 'NTO',
    venue: 'Le Bataclan',
    date: '2026-11-14T22:30:00.000Z',
    ticketPrice: 45,
    genre: 'electronic',
  },
  {
    title: 'KI/KI Showcase',
    artist: 'KI/KI',
    venue: 'Kater Blau',
    date: '2026-12-06T23:00:00.000Z',
    ticketPrice: 35,
    genre: 'electronic',
  },
];

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Auction } from '../auctions/auction.entity.ts';
import { Offer } from '../offers/offer.entity.ts';

/**
 * A registered account.
 *
 * Note what is NOT stored here: the plaintext password. Only the bcrypt hash
 * ever touches the database, and `select: false` keeps even that hash out of
 * ordinary queries — you have to ask for it explicitly (see UsersService).
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false })
  passwordHash!: string;

  @CreateDateColumn({ select: false })
  createdAt!: Date;

  /** Auctions this user has listed. */
  @OneToMany(() => Auction, (auction) => auction.seller)
  auctions!: Relation<Auction>[];

  /** Bids this user has placed. */
  @OneToMany(() => Offer, (offer) => offer.bidder)
  offers!: Relation<Offer>[];
}

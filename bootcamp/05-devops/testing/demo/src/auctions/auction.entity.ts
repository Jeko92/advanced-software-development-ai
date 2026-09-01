import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from '../users/user.entity.ts';
import { Offer } from '../offers/offer.entity.ts';
import { numericTransformer } from '../common/transformers/numeric.transformer.ts';

/**
 * A listing on DarkBay.
 *
 * Two prices are tracked deliberately:
 *  - `startingPrice` is the seller's opening ask and never changes.
 *  - `currentPrice` is the highest accepted bid so far. It is seeded with
 *    `startingPrice`, so the "must beat the current price" rule is a single
 *    comparison whether or not any bids exist yet.
 *
 * The auction's lifecycle lives entirely in `endDate`: there is no `status`
 * column, because a stored status would need a scheduler to keep it honest.
 * Comparing `endDate` to "now" cannot go stale.
 */
@Entity('auctions')
export class Auction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column('text')
  description!: string;

  @Column('decimal', {
    precision: 12,
    scale: 2,
    transformer: numericTransformer,
  })
  startingPrice!: number;

  @Column('decimal', {
    precision: 12,
    scale: 2,
    transformer: numericTransformer,
  })
  currentPrice!: number;

  /** Indexed because every list request filters and sorts on it. */
  @Index()
  @Column('datetime')
  endDate!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  /**
   * The owner of the listing. Since authentication was introduced this is set
   * from the verified JWT, never from the request body.
   */
  @ManyToOne(() => User, (user) => user.auctions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  seller!: Relation<User>;

  /** The full bid history. `cascade` is intentionally off: offers are immutable facts. */
  @OneToMany(() => Offer, (offer) => offer.auction)
  offers!: Relation<Offer>[];
}

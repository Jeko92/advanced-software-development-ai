import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('sessions')
export class Session {
  @PrimaryColumn()
  sid!: string;

  @Column()
  expiresAt!: Date;

  @Column('text')
  data!: string;
}

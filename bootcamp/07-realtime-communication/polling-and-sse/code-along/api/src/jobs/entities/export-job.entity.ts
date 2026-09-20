import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum TaskStatus {
  RUNNING = 'RUNNING',
  DONE = 'DONE',
}

@Entity('ExportJob')
export class ExportJob {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'smallint',
    default: 0,
  })
  progress!: number;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.RUNNING,
  })
  status!: TaskStatus;

  @Column({
    nullable: true,
  })
  downloadUrl?: string;
}

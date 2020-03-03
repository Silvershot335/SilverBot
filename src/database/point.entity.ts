import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Point extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userID!: string;

  @Column()
  serverID!: string;

  @Column()
  timestamp!: string;

  @Column()
  points!: number;
}

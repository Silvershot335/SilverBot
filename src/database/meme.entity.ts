import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Meme extends BaseEntity {
  @Column({ primary: true })
  id!: string;

  @Column({ primary: true })
  name!: string;

  @Column()
  url!: string;

  @Column()
  width!: number;

  @Column()
  height!: number;

  @Column({ nullable: true })
  boxCount!: number;
}

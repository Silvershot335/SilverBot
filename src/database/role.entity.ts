import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Role extends BaseEntity {
  @PrimaryColumn()
  level!: number;

  @PrimaryColumn()
  role!: string;

  @PrimaryColumn()
  serverID!: string;
}

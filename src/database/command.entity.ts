import { BaseEntity, Column, Entity } from 'typeorm';

interface CommandInterface {
  type: 'link' | 'command';
  key: string;
  value: string;
}

@Entity()
export class Command extends BaseEntity {
  @Column({ primary: true })
  type!: 'link' | 'command';

  @Column({ primary: true })
  key!: string;

  @Column()
  value!: string;
}

export function saveCommand(commandData: CommandInterface) {
  Command.create(commandData).save();
}

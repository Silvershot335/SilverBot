import {
  BaseEntity,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TriviaQuestion } from './trivia-question.entity';

@Entity()
export class TriviaOption extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @PrimaryColumn()
  option!: string;

  @PrimaryColumn()
  correct!: boolean;

  @ManyToOne(() => TriviaQuestion, (question) => question.triviaOptions)
  question!: TriviaQuestion;
}

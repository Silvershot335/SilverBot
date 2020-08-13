import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { shuffle } from '../utils';
import { TriviaOption } from './trivia-options.entity';

export interface FoundQuestion {
  question: string;
  category: string;
  type: string;
  difficulty: string;
  options: string[];
  answer: string;
  answerIndex: number;
}

@Entity()
export class TriviaQuestion extends BaseEntity {
  static async findRandomOne(): Promise<FoundQuestion> {
    const res = await TriviaQuestion.createQueryBuilder('trivia_question')
      .addOrderBy('random()')
      .limit(1)
      .getOne();
    if (res) {
      return await TriviaOption.getRepository()
        .createQueryBuilder('trivia_option')
        .where('trivia_option."questionId" = :id', { id: res.id })
        .leftJoinAndSelect('trivia_option.question', 'question')
        .getMany()
        .then((opts) => {
          const options = shuffle(opts).map((option) =>
            Buffer.from(option.option, 'base64').toString()
          );
          const answer = Buffer.from(
            opts.find((option) => option.correct)?.option || '',
            'base64'
          ).toString();
          return {
            question: Buffer.from(res.question, 'base64').toString(),
            category: Buffer.from(res.category, 'base64').toString(),
            type: Buffer.from(res.type, 'base64').toString(),
            difficulty: Buffer.from(res.difficulty, 'base64').toString(),
            options,
            answer,
            answerIndex: options.indexOf(answer),
          };
        });
    } else {
      throw new Error();
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ primary: true })
  question!: string;

  @Column()
  category!: string;

  @Column()
  type!: string;

  @Column()
  difficulty!: string;

  @OneToMany(() => TriviaOption, (option) => option.option, { eager: true })
  triviaOptions!: TriviaOption[];
}

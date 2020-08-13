import fetch from 'node-fetch';
import { Connection } from 'typeorm';
import { TriviaOption } from './database/trivia-options.entity';
import { TriviaQuestion } from './database/trivia-question.entity';
import { Results, Token, TriviaItem } from './models/trivia-batch';
import { sleep } from './utils';

const tokenURL = 'https://opentdb.com/api_token.php?command=request';
const requestURL = 'https://opentdb.com/api.php?amount=10&encode=base64&token=';

export async function addQuestions(connection: Connection) {
  const questionRepository = connection.getRepository(TriviaQuestion);
  const optionRepository = connection.getRepository(TriviaOption);
  const count = await questionRepository.count();
  if (count === 0) {
    const questions = await getAllTriviaQuestions();
    for (const question of questions) {
      const questionDTO = new TriviaQuestion();
      questionDTO.question = question.question;
      questionDTO.category = question.category;
      questionDTO.difficulty = question.difficulty;
      questionDTO.type = question.type;
      questionDTO.triviaOptions = [];
      await questionRepository.save(questionDTO);

      const allOptions = [
        question.correct_answer,
        ...question.incorrect_answers,
      ];

      const options = [];
      for (const option of allOptions) {
        const optionDTO = new TriviaOption();
        optionDTO.correct = option === question.correct_answer;
        optionDTO.option = option;
        optionDTO.question = questionDTO;
        options.push(optionDTO);
      }

      await optionRepository.save(options);
    }
  }
}

async function getAllTriviaQuestions() {
  const token = await getToken();
  const allTriviaItems: TriviaItem[] = [];

  let triviaSet = await getTriviaItems(token);

  while (triviaSet.shouldContinue) {
    // add trivia items to our list
    allTriviaItems.push(...triviaSet.triviaItems);

    // wait .5 second
    await sleep(500);

    // get the next set of items
    triviaSet = await getTriviaItems(token);
  }

  allTriviaItems.push(...triviaSet.triviaItems);

  return allTriviaItems;
}

async function getTriviaItems(token: string) {
  return await fetch(requestURL + token)
    .then((res) => res.json())
    .then((response: Results) => ({
      shouldContinue: response.response_code === 0,
      triviaItems: response.results,
    }));
}

async function getToken() {
  return await fetch(tokenURL)
    .then((res) => res.json())
    .then((response: Token) => response.token);
}

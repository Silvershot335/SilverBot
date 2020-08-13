export interface Token {
  response_code: number;
  response_message: string;
  token: string;
}

export interface Results {
  response_code: number;
  results: TriviaItem[];
}

export interface TriviaItem {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

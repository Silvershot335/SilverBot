import {
  Client,
  ClientUser,
  Message,
  MessageReaction,
  RichEmbed,
} from 'discord.js';
import {
  FoundQuestion,
  TriviaQuestion,
} from './database/trivia-question.entity';
import { logger } from './logger';
import { titleCase } from './utils';

type EmojiReactionOptions = '🇹' | '🇫' | '🇦' | '🇧' | '🇨' | '🇩';

export async function showTriviaQuestion(bot: Client, message: Message) {
  const messageEmbed = new RichEmbed().setColor('#0099ff');
  try {
    const question = await TriviaQuestion.findRandomOne();
    messageEmbed.setAuthor(question.question);
    messageEmbed.setDescription(
      question.category +
        ' - ' +
        titleCase(question.difficulty) +
        ' - ' +
        typeToUI(question)
    );
    messageEmbed.setTitle(question.options.join('\n'));
    message.channel
      .send(messageEmbed)
      .then(async (sentMessage: Message | Message[]) => {
        if (!Array.isArray(sentMessage)) {
          handleReactions(question, sentMessage, messageEmbed, bot);
        }
      });
  } catch {
    message.reply('Could not find any questions!');
  }
}

function typeToUI(question: FoundQuestion) {
  return question.type === 'boolean' ? 'True / False' : 'Multiple Choice';
}

async function handleReactions(
  question: FoundQuestion,
  sentMessage: Message,
  embed: RichEmbed,
  bot: Client
) {
  if (question.type === 'boolean') {
    const options: EmojiReactionOptions[] = ['🇹', '🇫'];
    await handleCorrectAnswers(options, question, sentMessage, embed, bot);
  } else {
    const options: EmojiReactionOptions[] = ['🇦', '🇧', '🇨', '🇩'];
    await handleCorrectAnswers(options, question, sentMessage, embed, bot);
  }
}

async function handleCorrectAnswers(
  answerOptions: EmojiReactionOptions[],
  question: FoundQuestion,
  sentMessage: Message,
  embed: RichEmbed,
  bot: Client
) {
  for (const option of answerOptions) {
    await sentMessage.react(option);
  }
  const filter = (reaction: MessageReaction, user: ClientUser) => {
    const emoji = reaction.emoji.name as EmojiReactionOptions;
    return (
      answerOptions.includes(emoji) &&
      question.answerIndex === getEmojiIndex(emoji)
    );
  };

  const time = 30_000; // 30 seconds

  sentMessage
    .awaitReactions(filter, { time })
    .then((collected) => {
      const reaction = collected.first();
      if (reaction?.users?.size) {
        embed.addField(
          'Correct Respondents',
          reaction.users
            .filter((user) => user.id !== bot.user.id)
            .map((item) => item.username)
            .join('\n')
        );
      } else {
        embed.addField('Correct Respondents', 'No one 😢');
        embed.addField('The Answer', question.answer);
      }

      sentMessage.edit('', { embed });
    })
    .catch(logger.error);
}

function getEmojiIndex(emoji: EmojiReactionOptions): 0 | 1 | 2 | 3 {
  switch (emoji) {
    case '🇦':
    case '🇹':
      return 0;
    case '🇧':
    case '🇫':
      return 1;
    case '🇨':
      return 2;
    case '🇩':
      return 3;
    default:
      return 0;
  }
}

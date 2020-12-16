import { Message, RichEmbed } from 'discord.js';
import * as mysql from 'mysql';
import { FormattedInput } from './input';
import { isJudah, isSilver } from './points';

const sql = (realm: string, itemName: string) => `SELECT * FROM tblItemSummary s
  join tblDBCItem i on i.id = s.item
  join tblRealm r on s.house = r.house
  where r.region = 'US'
  and r.slug = ${mysql.escape(realm)}
  and LOWER(i.name_enus) = LOWER(${mysql.escape(itemName)})
  order by s.lastseen asc
  limit 20`;

function buildSQL(message: FormattedInput, botMessage: Message) {
  if (isSilver(botMessage)) {
    if (message.all.includes('otherrealm')) {
      return sql(message.key, message.value.replace(/otherrealm/, ''));
    }
    return sql('hyjal', message.all);
  } else if (isJudah(botMessage)) {
    if (message.all.includes('otherrealm')) {
      return sql(message.key, message.value.replace(/otherrealm/, ''));
    }
    return sql('malganis', message.all);
  } else {
    return sql(message.key, message.value);
  }
}

export function handleAH(bot: Message, message: FormattedInput) {
  if (message.key === 'help') {
    if (!isJudah(bot) && !isSilver(bot)) {
      bot.reply('@Bot ah RealmName ItemName');
    } else {
      bot.reply(
        '@Bot ah (RealmName) ItemName ("otherrealm"), parentheses are optional, otherrealm is that specific text'
      );
    }
  }
  const connection = mysql.createConnection({
    host: 'newswire.theunderminejournal.com',
    database: 'newsstand',
  });

  connection.connect((err) => {
    if (!err) {
      const sql = buildSQL(message, bot);
      connection.query(sql, (err, result) => {
        if (err || !result[0]) {
          bot.reply('Could not find item. May be deeper issue');
        } else {
          const res = result[0];
          if (res) {
            const itemName = res.name_enus;
            const date = new Date(res.lastseen).toLocaleString();
            const { quantity, price } = res;
            const copperPrice = price % 100;
            const silverPrice = Math.floor((price / 100) % 100);
            const goldPrice = Math.floor(price / 10000);
            const messageEmbed = new RichEmbed().setColor('#0099ff');
            messageEmbed.addField('Item Name:', itemName);
            messageEmbed.addField(
              'Price:',
              `${goldPrice}g, ${silverPrice}s, ${copperPrice}c`
            );
            messageEmbed.addField('Quantity:', quantity);
            messageEmbed.addField('Found at:', date);
            bot.channel.send(messageEmbed);
          }
        }
      });
    } else {
      console.error('Could not connect to DB');
    }
  });
}

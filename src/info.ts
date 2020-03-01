import { GuildMember, Message, TextChannel } from 'discord.js';
import { RichEmbed } from 'discord.js';
import { infoMessageEmbed } from './utils';

interface IMemberJoinedAt {
  member: GuildMember;
  joinedAt: Date;
}

export function generateInfoMessage(message: Message) {
  // set Username and Avatar at top
  const messageEmbed = new RichEmbed().setColor('#0099ff');
  messageEmbed.setAuthor(
    message.author.username,
    message.author.avatarURL,
    message.author.displayAvatarURL
  );
  // set created at time
  messageEmbed.addField('Created at:', message.author.createdAt);

  const asTextChannel = message.channel as TextChannel;
  // if we are in a text channel
  if (asTextChannel) {
    // get all of the members from the channel, and sort them by the time they joined
    const members: IMemberJoinedAt[] = asTextChannel.members
      .array()
      .map((member) => ({ member, joinedAt: member.joinedAt }))
      .sort(
        (a, b) => a.joinedAt.getMilliseconds() - b.joinedAt.getMilliseconds()
      );
    // find the member that sent the message
    const joinedAt = members.find(
      (member) => member.member.id === message.author.id
    )?.joinedAt;
    // if that member exists (it should always exist)
    if (joinedAt !== undefined) {
      // add when they joined
      messageEmbed.addField('Joined at:', joinedAt);
    }

    // Loop through the sorted list of members and find what rank the sender is
    // (i.e. - 1st oldest account, etc.)
    let order = -1;
    for (let i = 0; i < members.length; ++i) {
      if (members[i].member.id === message.author.id) {
        order = i;
      }
    }

    // Declare our prefixes
    const ordinals = ['th', 'st', 'nd', 'rd'];

    // Ignore the teen numbers
    const modded = order % 100;

    // If it is greater than 20, take the number in the ones digit
    // and do a lookup in the ordinals array, doing th as a backup
    // Otherwise, do a lookup, or use th as backup
    const suffix =
      ordinals[(modded - 20) % 10] || ordinals[modded] || ordinals[0];

    // Add our number + the suffix
    const resultAsString = order + suffix + ' oldest member on the server';

    // If we found what rank the member who sent the message is
    if (order !== -1) {
      // add the field to the embed
      messageEmbed.addField('Join order', resultAsString);
    }

    message.channel.send(messageEmbed);
  } else {
    message.channel.send(messageEmbed);
  }
}

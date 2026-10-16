import 'dotenv/config';
import {
  Client,
  Events,
  GatewayIntentBits,
  MessageFlags
} from 'discord.js';

const token = process.env.DISCORD_TOKEN;

if (!token) {
  throw new Error('لم يتم ضبط DISCORD_TOKEN.');
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, readyClient => {
  console.log(`البوت يعمل باسم ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  try {
    if (interaction.commandName === 'ping') {
      await interaction.reply(`Pong! تأخير واجهة Discord: ${client.ws.ping}ms`);
      return;
    }

    if (interaction.commandName === 'say') {
      const text = interaction.options.getString('text', true);

      // يمنع تحويل نص مثل @everyone إلى تنبيه جماعي.
      await interaction.reply({
        content: text,
        allowedMentions: { parse: [] }
      });
    }
  } catch (error) {
    console.error('حدث خطأ أثناء تنفيذ الأمر:', error);

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'حدث خطأ أثناء تنفيذ الأمر.',
        flags: MessageFlags.Ephemeral
      }).catch(() => {});
    } else {
      await interaction.reply({
        content: 'حدث خطأ أثناء تنفيذ الأمر.',
        flags: MessageFlags.Ephemeral
      }).catch(() => {});
    }
  }
});

client.login(token);

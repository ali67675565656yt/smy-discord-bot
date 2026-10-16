import 'dotenv/config';
import { REST, Routes, SlashCommandBuilder } from 'discord.js';

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID || !GUILD_ID) {
  throw new Error('تأكد من إعداد DISCORD_TOKEN وCLIENT_ID وGUILD_ID.');
}

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('يعرض حالة استجابة البوت'),

  new SlashCommandBuilder()
    .setName('say')
    .setDescription('يجعل البوت يرسل نصًا في القناة')
    .addStringOption(option =>
      option
        .setName('text')
        .setDescription('النص المراد إرساله')
        .setRequired(true)
        .setMaxLength(500)
    )
];

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

try {
  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    { body: commands.map(command => command.toJSON()) }
  );

  console.log('تم تسجيل أوامر الخادم التجريبي.');
} catch (error) {
  console.error('فشل تسجيل الأوامر:', error);
}

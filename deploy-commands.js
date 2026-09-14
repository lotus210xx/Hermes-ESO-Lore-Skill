require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('lore')
    .setDescription('Look up Elder Scrolls lore from UESP')
    .addStringOption((opt) =>
      opt.setName('topic').setDescription('A character, place, deity, event, faction, etc.').setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('randomlore')
    .setDescription('Get a random piece of Elder Scrolls lore'),
].map((c) => c.toJSON());

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    const target = process.env.GUILD_ID
      ? Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID)
      : Routes.applicationCommands(process.env.CLIENT_ID);

    await rest.put(target, { body: commands });
    console.log(
      process.env.GUILD_ID
        ? `Registered commands to guild ${process.env.GUILD_ID} (instant).`
        : 'Registered global commands (can take up to 1 hour to propagate).'
    );
  } catch (err) {
    console.error(err);
  }
})();

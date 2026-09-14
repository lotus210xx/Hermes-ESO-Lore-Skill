require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { lookupLore, randomLore } = require('./uesp');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const LORE_COLOR = 0x8b0000; // Daedric red, because why not

function buildEmbed(page, { title, sourceLabel } = {}) {
  const embed = new EmbedBuilder()
    .setColor(LORE_COLOR)
    .setTitle(title || page.title)
    .setURL(page.url)
    .setDescription(page.extract.length > 1024 ? page.extract.slice(0, 1021) + '...' : page.extract)
    .setFooter({ text: sourceLabel || 'Source: UESP (en.uesp.net)' });
  if (page.image) embed.setThumbnail(page.image);
  return embed;
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'lore') {
    const topic = interaction.options.getString('topic', true);
    await interaction.deferReply();
    try {
      const page = await lookupLore(topic);
      if (!page) {
        await interaction.editReply(`No lore entry found for **${topic}**. Try a different spelling or a broader term.`);
        return;
      }
      await interaction.editReply({ embeds: [buildEmbed(page)] });
    } catch (err) {
      console.error(err);
      await interaction.editReply('The UESP lore archives are unreachable right now. Try again shortly.');
    }
  }

  if (interaction.commandName === 'randomlore') {
    await interaction.deferReply();
    try {
      const page = await randomLore();
      if (!page) {
        await interaction.editReply('Could not fetch a random entry right now.');
        return;
      }
      await interaction.editReply({ embeds: [buildEmbed(page, { sourceLabel: 'Random entry — Source: UESP' })] });
    } catch (err) {
      console.error(err);
      await interaction.editReply('The UESP lore archives are unreachable right now. Try again shortly.');
    }
  }
});

client.login(process.env.DISCORD_TOKEN);

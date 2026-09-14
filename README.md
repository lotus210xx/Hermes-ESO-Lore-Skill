# ESO Lore Bot

A Discord bot that answers Elder Scrolls Online lore questions using the
[UESP](https://en.uesp.net) (Unofficial Elder Scrolls Pages) wiki API — the
most complete community-maintained Elder Scrolls lore database, with a
dedicated `Lore:` namespace covering ESO, Skyrim, Oblivion, and every other
game in the series.

There is no official lore API from ZeniMax/Bethesda; UESP's public MediaWiki
API (`https://en.uesp.net/w/api.php`) is the standard tool the ESO community
uses instead, and it's free and keyless.

## Commands

- `/lore <topic>` — searches UESP's lore namespace and replies with a summary,
  thumbnail, and link (e.g. `/lore Sheogorath`, `/lore Alliance War`, `/lore Molag Bal`).
- `/randomlore` — returns a random lore entry.

## Setup

1. Create a Discord application + bot at the
   [Discord Developer Portal](https://discord.com/developers/applications),
   copy its **Token** and **Application ID**.
2. Invite it to your server with the `bot` and `applications.commands` scopes
   (no special permissions needed beyond sending messages/embeds in a channel).
3. Install dependencies:

   ```bash
   npm install
   ```

4. Copy `.env.example` to `.env` and fill in `DISCORD_TOKEN` and `CLIENT_ID`
   (and `GUILD_ID` for instant command registration during development).
5. Register the slash commands:

   ```bash
   npm run deploy
   ```

6. Start the bot:

   ```bash
   npm start
   ```

## Files

- `uesp.js` — thin client for the UESP MediaWiki API (search, extract, image lookup).
- `index.js` — Discord bot: command handling + embed formatting.
- `deploy-commands.js` — registers the slash commands with Discord.

## Notes / extending

- Swap `srnamespace: 130` in `uesp.js` for other UESP namespaces to broaden
  scope (e.g. general gameplay pages instead of pure lore).
- For ESO gameplay data (item sets, skills, etc.) rather than lore, see
  [UESP's ESO Data API](https://esodata.uesp.net/) or the community
  [eso-sets-api](https://github.com/JimmyMcBride/eso-sets-api) — both are
  separate from the lore wiki and could be added as additional slash commands.

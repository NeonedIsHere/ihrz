const { Client, Intents, Collection, EmbedBuilder, PermissionsBitField } = require('discord.js');
const config = require('../config.json');
const fs = require("fs")
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const ms = require("ms");

module.exports = async (client, message) => {
  if (!message.guild) return;
  if (message.author.bot) return;
  async function xpFetcher() {
    if (!message.guild) return;
    if (!message.channel.type === "GUILD_TEXT") { return; }
    if (message.author.bot) return
    const randomNumber = Math.floor(Math.random() * 100) + 150;
    await db.add(`${message.guild.id}.USER.${message.author.id}.XP_LEVELING.xp`, randomNumber)
    await db.add(`${message.guild.id}.USER.${message.author.id}.XP_LEVELING.xptotal`, randomNumber)

    var level = await db.get(`${message.guild.id}.USER.${message.author.id}.XP_LEVELING.level`) || 1
    var xp = await db.get(`${message.guild.id}.USER.${message.author.id}.XP_LEVELING.xp`)
    var xpNeeded = level * 500;
    if (xpNeeded < xp) {
      await db.add(`${message.guild.id}.USER.${message.author.id}.XP_LEVELING.level`, 1)
      var newLevel = await db.get(`${message.guild.id}.USER.${message.author.id}.XP_LEVELING.level`, 1)
      await db.sub(`${message.guild.id}.USER.${message.author.id}.XP_LEVELING.xp`, xpNeeded)
      let xp_turn = await db.get(`${message.guild.id}.GUILD.XP_LEVELING.on_or_off`)
      if (xp_turn === "off") { return };
      if (!message.channel.permissionsFor(client.user).has(PermissionsBitField.Flags.SendMessages)) { return; }
      let xpChan = await db.get(`${message.guild.id}.GUILD.XP_LEVELING.xpchannels`)
      if (!xpChan) return message.channel.send({ content: `**GG**, <@` + message.author.id + `> you are +1, for xp level (Level : **${newLevel}**)` }).then((sent) => {
        setTimeout(() => {
          sent.delete();
        }, 3500);
      })
      if (xpChan === "off") return message.channel.send({ content: `**GG**, <@` + message.author.id + `> you are +1, for xp level (Level : **${newLevel}**)}` }).then((sent) => {
        setTimeout(() => {
          sent.delete();
        }, 3500);
      })
      try {
        client.channels.cache.get(xpChan).send({ content: `**GG**, <@` + message.author.id + `> you are +1, for xp level (Level : **${newLevel}**)` }).then(msg => { });
      } catch (e) { return }
    }
  }
  async function EconomyDebug() {
    if (!message.guild) return;
    if (!message.channel.type === "GUILD_TEXT") { return; }
    if (message.author.bot) return
    if (message.author.id == client.user.id) return
    d = await db.get(`${message.guild.id}.USER.${message.author.id}.ECONOMY.money`)
    if (!d) { return await db.set(`${message.guild.id}.USER.${message.author.id}.ECONOMY.money`, 1) }
  }

  async function logsMessage() {
    if (!message.guild) return;
    if (!message.channel.type === "GUILD_TEXT") { return; }
    if (message.author.bot) return
    if (message.author.id == client.user.id) return
    const now = new Date();
    const CreateFiles = fs.createWriteStream('./files/logs/message/' + message.guild.id + ".txt", {
      flags: 'a'
    })
    let i = message.guild.name + " | MESSAGE | [" + now + "]" + " \n " + message.author.id + ": " + message.content + " " + " in: #" + message.channel.name + ""
    CreateFiles.write(i.toString() + '\r\n')
  }

  async function blockSpam() {
    if (!message.guild) return;
    if (!message.channel.type === "GUILD_TEXT") { return; }
    if (message.author.bot) return
    if (message.author.id == client.user.id) return
    let type = await db.get(`${message.guild.id}.GUILD.GUILD_CONFIG.antipub`)
    if (type === "off") { return }
    if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
    if (type == "on") {
      let LOG = await db.get(`${message.guild.id}.GUILD.PUNISH`);
      let LOGfetched = await db.get(`TEMP.${message.guild.id}.PUNISH_DATA.${message.author.id}`);
      if (LOGfetched) {
        if (LOG) {
          if (LOG.amountMax == LOGfetched.flags) {
            if (LOG.state == "true") {
              switch (LOG.punishementType) {
                case 'ban':
                  const member1 = message.guild.members.cache.get(message.author.id);
                  member1.ban({ reason: "Ban by PUNISHPUB" }).catch({});
                  db.set(`TEMP.${message.guild.id}.PUNISH_DATA.${message.author.id}`, {});
                  break;
                case 'kick':
                  const member2 = message.guild.members.cache.get(message.author.id);
                  member2.kick({ reason: "Kick by PUNISHPUB" }).catch({});
                  db.set(`TEMP.${message.guild.id}.PUNISH_DATA.${message.author.id}`, {});
                  break;
                case 'mute':
                  let muterole = message.guild.roles.cache.find(role => role.name === 'muted');
                  const member3 = message.guild.members.cache.get(message.author.id);
                  await (member3.roles.add(muterole.id));
                  setTimeout(function () {
                    if (!member3.roles.cache.has(muterole.id)) { return }
                    member3.roles.remove(muterole.id);
                    db.set(`TEMP.${message.guild.id}.PUNISH_DATA.${message.author.id}`, {});
                  }, 40000);
                  break;
              }
            }
          }
        }
      }

      try {
        const blacklist = ["https://", "http://", "://", ".com", ".xyz", ".fr", "www.", ".gg", "g/", ".gg/", "youtube.be", "/?"];
        for (const word of blacklist) {
          if (message.content.toLowerCase().includes(word)) {
            var FLAGS_FETCH = await db.get(`TEMP.${message.guild.id}.PUNISH_DATA.${message.author.id}.flags`);
            if (!FLAGS_FETCH) { var FLAGS_FETCH = 0; };

            await db.set(`TEMP.${message.guild.id}.PUNISH_DATA.${message.author.id}`, {
              flags: FLAGS_FETCH + 1
            });
            await message.delete();
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

  }
  await xpFetcher(), EconomyDebug(), logsMessage(), blockSpam();
};

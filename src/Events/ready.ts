/*
・ iHorizon Discord Bot (https://github.com/ihrz/ihrz)

・ Licensed under the Attribution-NonCommercial-ShareAlike 2.0 Generic (CC BY-NC-SA 2.0)

    ・   Under the following terms:

        ・ Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.

        ・ NonCommercial — You may not use the material for commercial purposes.

        ・ ShareAlike — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.

        ・ No additional restrictions — You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.


・ Mainly developed by Kisakay (https://github.com/Kisakay)

・ Copyright © 2020-2023 iHorizon
*/

import { Client, Collection, PermissionsBitField, ActivityType, EmbedBuilder, GuildFeature } from 'discord.js';
import { PfpsManager_Init } from "../core/modules/pfpsManager.js";
import logger from "../core/logger.js";
import couleurmdr from 'colors';
import config from "../files/config.js";

import { OwnIHRZ } from "../core/modules/ownihrzManager.js";
import date from 'date-and-time';

export default async (client: Client) => {

    async function fetchInvites() {
        client.guilds.cache.forEach(async (guild) => {
            try {
                if (!guild.members.me?.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) return;
                var firstInvites = await guild.invites.fetch();
                client.invites.set(guild.id, new Collection(firstInvites.map((invite) => [invite.code, invite.uses])));

                if (guild.features.includes(GuildFeature.VanityURL)) {
                    guild.fetchVanityData().then((vanityInvite) => {
                        client.vanityInvites.set(guild.id, vanityInvite);
                    });
                }
            } catch (error: any) {
                logger.err(couleurmdr.red(`Error fetching invites for guild ${guild.id}: ${error}`));
            };
        });
    };

    async function refreshDatabaseModel() {
        await client.db.set(`GLOBAL.OWNER.${config.owner.ownerid1}`, { owner: true });
        await client.db.set(`GLOBAL.OWNER.${config.owner.ownerid2}`, { owner: true });
        await client.db.set(`TEMP`, {});
    };

    async function quotesPresence() {
        let status = [
            "Balls",
            "discord.gg/ihorizon",
            "https://ihorizon.me",
            "ElektraBots, please send feet <3",
            "YOU CAN MAKE UR OWN VERSION OF ME DONT MAKE ME INTO RYAN GOSSLING",
            "We have a goal? Wait what? Making the internet simpler WHAT!?!?!?",
            "I dont have a mother anymore",
            "250K USERS !? I AINT BEING PAID ENOUGH FOR THIS SHIT",
            "trusted by big servers 😎",
            "Never gonna give you up...BRO YOU'VE BEEN RICK ROLLED BY A BOT",
            "I will soon have an onlyfan!",
            "Youtube, twitter, onlyfan, what's next?",
            "COME SEE MY INSIDES, HERE IS MY GITHUB : https://github.com/ihrz",
            "I removed my own database (THE VOICES ARE GETTING LOUDER)",
            "PEOPLE ARE TOUCHING MY INSIDES ON GITHUB",
            "WHAT THE FRICK IS A DATABASE DO I EVEN NEED ONE???? NAHHHH MEN I'M GOOD",
            "20 bucks for my token",
            "I'm just Jack..",
            "Where I see loves he sees a friend"
        ];
        let randomStatus = quotes[Math.floor(Math.random() * status.length)];
        client.user?.setPresence({ activities: [{ name: randomStatus, type: ActivityType.Custom }] });
    };

    async function refreshSchedule() {
        let listAll = await client.db.get(`SCHEDULE`);
        let dateNow = Date.now();
        let desc: string = '';

        for (let user in listAll) {
            let member = client.users.cache.get(user);

            for (let code in listAll[user]) {
                if (listAll[user][code]?.expired <= dateNow) {
                    desc += `${date.format(new Date(listAll[user][code]?.expired), 'YYYY/MM/DD HH:mm:ss')}`;
                    desc += `\`\`\`${listAll[user][code]?.title}\`\`\``;
                    desc += `\`\`\`${listAll[user][code]?.description}\`\`\``;

                    let embed = new EmbedBuilder()
                        .setColor('#56a0d3')
                        .setTitle(`#${code} Schedule has been expired!`)
                        .setDescription(desc)
                        .setThumbnail((member?.displayAvatarURL() as string))
                        .setTimestamp()
                        .setFooter({ text: 'iHorizon', iconURL: client.user?.displayAvatarURL() });

                    member?.send({
                        content: `<@${member.id}>`,
                        embeds: [embed]
                    }).catch(() => { });

                    await client.db.delete(`SCHEDULE.${user}.${code}`);
                };
            };
        };
    };
    let iHorizon_Container = new OwnIHRZ();
    iHorizon_Container.Startup();
    iHorizon_Container.Startup_Cluster();

    setInterval(() => {
        iHorizon_Container.Refresh(client);
        iHorizon_Container.Refresh_Cluster(client)
    }, 86400000);

    setInterval(quotesPresence, 120_000), setInterval(refreshSchedule, 15_000);

    fetchInvites(), refreshDatabaseModel(), quotesPresence(), refreshSchedule();

    PfpsManager_Init(client);
};

/*
・ iHorizon Discord Bot (https://github.com/ihrz/ihrz)

・ Licensed under the Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)

    ・   Under the following terms:

        ・ Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.

        ・ NonCommercial — You may not use the material for commercial purposes.

        ・ ShareAlike — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.

        ・ No additional restrictions — You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.


・ Mainly developed by Kisakay (https://github.com/Kisakay)

・ Copyright © 2020-2024 iHorizon
*/

import {
    Client,
    EmbedBuilder,
    ChatInputCommandInteraction,
    Message,
    User,
} from 'discord.js';

import { LanguageData } from '../../../../types/languageData';
import { Command } from '../../../../types/command';
import { Option } from '../../../../types/option';
export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction<"cached"> | Message, lang: LanguageData, command: Option | Command | undefined, neededPerm: number, args?: string[]) => {


        // Guard's Typing
        if (!interaction.member || !client.user || !interaction.guild || !interaction.channel) return;

        let timeout = 86400000;
        let amount = 500;
        let daily = await client.db.get(`${interaction.guildId}.USER.${interaction.member.user.id}.ECONOMY.daily`);

        if (await client.db.get(`${interaction.guildId}.ECONOMY.disabled`) === true) {
            await client.method.interactionSend(interaction,{
                content: lang.economy_disable_msg
                    .replace('${interaction.member.user.od}', interaction.member.user.id)
            });
            return;
        };


        if (daily !== null && timeout - (Date.now() - daily) > 0) {
            let time = client.timeCalculator.to_beautiful_string(timeout - (Date.now() - daily));

            await client.method.interactionSend(interaction,{ content: lang.daily_cooldown_error.replace(/\${time}/g, time) });
            return;
        } else {
            let embed = new EmbedBuilder()
                .setAuthor({ name: lang.daily_embed_title, iconURL: (interaction.member.user as User).displayAvatarURL() })
                .setColor("#a4cb80")
                .setDescription(lang.daily_embed_description)
                .addFields({ name: lang.daily_embed_fields, value: `${amount}${client.iHorizon_Emojis.icon.Coin}` })

            await client.method.interactionSend(interaction,{ embeds: [embed] });
            await client.db.add(`${interaction.guildId}.USER.${interaction.member.user.id}.ECONOMY.money`, amount);
            await client.db.set(`${interaction.guildId}.USER.${interaction.member.user.id}.ECONOMY.daily`, Date.now());
            return;
        };
    },
};
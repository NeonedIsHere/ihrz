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
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    GuildMember,
    Message,
    User,
} from 'pwss';
import { LanguageData } from '../../../../types/languageData';
import { SubCommandArgumentValue } from '../../../core/functions/arg';

let talkedRecentlyforr = new Set();
export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction | Message, data: LanguageData, command: SubCommandArgumentValue, execTimestamp?: number, args?: string[]) => {
        // Guard's Typing
        if (!interaction.member || !client.user || !interaction.guild || !interaction.channel) return;

        if (await client.db.get(`${interaction.guildId}.ECONOMY.disabled`) === true) {
            await client.args.interactionSend(interaction, {
                content: data.economy_disable_msg
                    .replace('${interaction.user.id}', interaction.member.user.id)
            });
            return;
        };

        if (interaction instanceof ChatInputCommandInteraction) {
            var user = interaction.options.getMember("member") as GuildMember;
        } else {
            var _ = await client.args.checkCommandArgs(interaction, command, args!, data); if (!_) return;
            var user = client.args.member(interaction, args!, 0) as GuildMember;
        };

        if (talkedRecentlyforr.has(interaction.member.user.id)) {
            await client.args.interactionSend(interaction, { content: data.rob_cooldown_error });
            return;
        };

        let targetuser = await client.db.get(`${interaction.guildId}.USER.${user.id}.ECONOMY.money`);
        let author = await client.db.get(`${interaction.guildId}.USER.${interaction.member.user.id}.ECONOMY.money`);

        if (author < 250) {
            await client.args.interactionSend(interaction, { content: data.rob_dont_enought_error });
            return;
        };

        if (targetuser < 250) {
            await client.args.interactionSend(interaction, {
                content: data.rob_him_dont_enought_error
                    .replace(/\${user\.user\.username}/g, user.user.globalName as string)
            });
            return;
        };

        let random = Math.floor(Math.random() * 200) + 1;

        let embed = new EmbedBuilder()
            .setDescription(data.rob_embed_description
                .replace(/\${interaction\.user\.id}/g, interaction.member.user.id)
                .replace(/\${user\.id}/g, user.id)
                .replace(/\${random}/g, random.toString())
            )
            .setColor("#a4cb80")
            .setTimestamp()

        await client.args.interactionSend(interaction, { embeds: [embed] });

        await client.db.sub(`${interaction.guildId}.USER.${user.id}.ECONOMY.money`, random);
        await client.db.add(`${interaction.guildId}.USER.${interaction.member.user.id}.ECONOMY.money`, random);

        talkedRecentlyforr.add(interaction.member.user.id);
        setTimeout(() => {
            talkedRecentlyforr.delete(interaction.member?.user.id);
        }, 3000000);
    },
};
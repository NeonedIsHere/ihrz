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
    Message,
    User
} from 'discord.js';

import { LanguageData } from '../../../../types/languageData';
import { DatabaseStructure } from '../../../../types/database_structure';
import { SubCommandArgumentValue } from '../../../core/functions/method';
export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction | Message, data: LanguageData, command: SubCommandArgumentValue, execTimestamp?: number, args?: string[]) => {
        // Guard's Typing
        if (!interaction.member || !client.user || !interaction.guild || !interaction.channel) return;

        let dataAccount = await client.db.get(`${interaction.guildId}.USER.${interaction.member.user.id}.ECONOMY`) as DatabaseStructure.EconomyUserSchema;

        if (interaction instanceof ChatInputCommandInteraction) {
            var toWithdraw = interaction.options.getNumber('how-much') as number;
        } else {
            var _ = await client.method.checkCommandArgs(interaction, command, args!, data); if (!_) return;
            var toWithdraw = client.method.number(args!, 0) as number;
        };

        if (await client.db.get(`${interaction.guildId}.ECONOMY.disabled`) === true) {
            await client.method.interactionSend(interaction,{
                content: data.economy_disable_msg
                    .replace('${interaction.user.id}', interaction.member.user.id)
            });
            return;
        };

        if (toWithdraw && toWithdraw > dataAccount?.bank!) {
            await client.method.interactionSend(interaction,{
                content: data.withdraw_cannot_abuse.replace("${client.iHorizon_Emojis.icon.No_Logo}", client.iHorizon_Emojis.icon.No_Logo)
            });
            return;
        };

        await client.db.sub(`${interaction.guildId}.USER.${interaction.member.user.id}.ECONOMY.bank`, toWithdraw!);
        await client.db.add(`${interaction.guildId}.USER.${interaction.member.user.id}.ECONOMY.money`, toWithdraw!);

        let embed = new EmbedBuilder()
            .setAuthor({ name: data.daily_embed_title, iconURL: (interaction.member.user as User).displayAvatarURL() })
            .setColor("#a4cb80")
            .setTitle(data.withdraw_embed_title)
            .setDescription(data.withdraw_embed_desc
                .replace('${client.iHorizon_Emojis.icon.Coin}', client.iHorizon_Emojis.icon.Coin)
                .replace('${interaction.user}', interaction.member.user.toString())
                .replace('${toWithdraw}', toWithdraw.toString())
            )
            .addFields({ name: data.withdraw_embed_fields1_name, value: `${await client.db.get(`${interaction.guildId}.USER.${interaction.member.user.id}.ECONOMY.bank`)}${client.iHorizon_Emojis.icon.Coin}` })
            .setFooter(await client.method.bot.footerBuilder(interaction))
            .setTimestamp();

        await client.method.interactionSend(interaction,{
            embeds: [embed],
            files: [await client.method.bot.footerAttachmentBuilder(interaction)]
        });
        return;
    },
};
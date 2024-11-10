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
import { Command } from '../../../../types/command';
import { Option } from '../../../../types/option';
export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction<"cached"> | Message, lang: LanguageData, command: Option | Command | undefined, neededPerm: number, args?: string[]) => {

        // Guard's Typing
        if (!interaction.member || !client.user || !interaction.guild || !interaction.channel) return;

        let langAccount = await client.db.get(`${interaction.guildId}.USER.${interaction.member.user.id}.ECONOMY`) as DatabaseStructure.EconomyUserSchema;

        if (interaction instanceof ChatInputCommandInteraction) {
            var toWithdraw = interaction.options.getString('how-much') as string;
        } else {
            
            var toWithdraw = client.method.string(args!, 0) as string;
        };

        if (await client.db.get(`${interaction.guildId}.ECONOMY.disabled`) === true) {
            await client.method.interactionSend(interaction, {
                content: lang.economy_disable_msg
                    .replace('${interaction.user.id}', interaction.member.user.id)
            });
            return;
        };

        if (toWithdraw === "all") toWithdraw = langAccount.bank?.toString()!;

        if (isNaN(Number(toWithdraw))) {
            await client.method.interactionSend(interaction, {
                content: lang.temporary_voice_limit_button_not_integer
                    .replace("${interaction.client.iHorizon_Emojis.icon.No_Logo}", client.iHorizon_Emojis.icon.No_Logo)
            })
            return;
        }

        var clean_to_withdraw = parseInt(toWithdraw)

        if (toWithdraw && clean_to_withdraw > langAccount?.bank!) {
            await client.method.interactionSend(interaction, {
                content: lang.withdraw_cannot_abuse.replace("${client.iHorizon_Emojis.icon.No_Logo}", client.iHorizon_Emojis.icon.No_Logo)
            });
            return;
        };

        await client.db.sub(`${interaction.guildId}.USER.${interaction.member.user.id}.ECONOMY.bank`, parseInt(toWithdraw));
        await client.db.add(`${interaction.guildId}.USER.${interaction.member.user.id}.ECONOMY.money`, parseInt(toWithdraw));

        let embed = new EmbedBuilder()
            .setAuthor({ name: lang.daily_embed_title, iconURL: (interaction.member.user as User).displayAvatarURL() })
            .setColor(await client.db.get(`${interaction.guild?.id}.GUILD.GUILD_CONFIG.embed_color.economy`) || "#a4cb80")
            .setTitle(lang.withdraw_embed_title)
            .setDescription(lang.withdraw_embed_desc
                .replace('${client.iHorizon_Emojis.icon.Coin}', client.iHorizon_Emojis.icon.Coin)
                .replace('${interaction.user}', interaction.member.user.toString())
                .replace('${toWithdraw}', toWithdraw.toString())
            )
            .addFields({ name: lang.withdraw_embed_fields1_name, value: `${await client.db.get(`${interaction.guildId}.USER.${interaction.member.user.id}.ECONOMY.bank`)}${client.iHorizon_Emojis.icon.Coin}` })
            .setFooter(await client.method.bot.footerBuilder(interaction))
            .setTimestamp();

        await client.method.interactionSend(interaction, {
            embeds: [embed],
            files: [await client.method.bot.footerAttachmentBuilder(interaction)]
        });
        return;
    },
};
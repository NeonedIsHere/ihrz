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
} from 'pwss';
import { LanguageData } from '../../../../types/languageData';
import { SubCommandArgumentValue } from '../../../core/functions/arg';
export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction | Message, data: LanguageData, command: SubCommandArgumentValue, execTimestamp?: number, args?: string[]) => {
        // Guard's Typing
        if (!client.user || !interaction.member || !interaction.guild || !interaction.channel) return;

        let embed = new EmbedBuilder()
            .setColor('#c4afed')
            .setTitle(data.banner_guild_embed)
            .setImage(interaction.guild.bannerURL({ extension: 'png', size: 4096 }))
            .setThumbnail(interaction.guild.iconURL({ size: 4096 }) as string)
            .setFooter({ text: await client.func.displayBotName(interaction.guild.id), iconURL: "attachment://icon.png" })

        await client.args.interactionSend(interaction,{
            embeds: [embed],
            files: [{ attachment: await interaction.client.func.image64(interaction.client.user.displayAvatarURL()), name: 'icon.png' }]
        });
        return;
    },
};
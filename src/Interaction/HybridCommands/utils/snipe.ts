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
    ApplicationCommandType,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    Message,
} from 'pwss'

import { Command } from '../../../../types/command';
import { LanguageData } from '../../../../types/languageData';

export const command: Command = {
    name: 'snipe',

    description: 'Get the last message deleted in this channel!',
    description_localizations: {
        "fr": "Obtenez le dernier message supprimé sur ce cannal"
    },

    aliases: ["s", "snp"],

    category: 'utils',
    thinking: false,
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: ChatInputCommandInteraction | Message, lang: LanguageData, runningCommand: any, execTimestamp?: number, args?: string[]) => {        // Guard's Typing
        // Guard's Typing
        if (!client.user || !interaction.member || !interaction.guild || !interaction.channel) return;

        var based = await client.db.get(`${interaction.guildId}.GUILD.SNIPE.${interaction.channel.id}`);

        if (!based) {
            await client.args.interactionSend(interaction,{ content: lang.snipe_no_previous_message_deleted });
            return;
        };

        let embed = new EmbedBuilder()
            .setColor("#474749")
            .setAuthor({ name: based.snipeUserInfoTag, iconURL: based.snipeUserInfoPp })
            .setDescription(`\`\`\`${based.snipe}\`\`\``)
            .setTimestamp(based.snipeTimestamp);

        await client.args.interactionSend(interaction,{ embeds: [embed] });
        return;
    },
};
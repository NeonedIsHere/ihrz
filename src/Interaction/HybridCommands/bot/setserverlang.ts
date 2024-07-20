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
    PermissionsBitField,
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    BaseGuildTextChannel,
    ApplicationCommandType,
    Message
} from 'pwss'

import { Command } from '../../../../types/command';
import logger from '../../../core/logger.js';
import { LanguageData } from '../../../../types/languageData';

export const command: Command = {
    name: 'setserverlang',
    name_localizations: {
        "fr": "setserveurlang"
    },

    aliases: ["setsrvlang", "lang", "setlang"],

    description: 'Set the server language!',
    description_localizations: {
        "fr": "Choisir la langue du bot discord !"
    },

    options: [
        {
            name: 'language',
            name_localizations: {
                "fr": "langue"
            },

            type: ApplicationCommandOptionType.String,

            description: 'What language you want ? (soon more)',
            description_localizations: {
                "fr": "Quelle language voulez-vous mettre ?"
            },

            required: true,
            choices: [
                {
                    name: "Deutsch",
                    value: "de-DE"
                },
                {
                    name: "English",
                    value: "en-US"
                },
                {
                    name: "French",
                    value: "fr-FR"
                },
                {
                    name: "Italian",
                    value: "it-IT"
                },
                {
                    name: "Japanese",
                    value: "jp-JP"
                },
                {
                    name: "Portuguese",
                    value: "pt-PT"
                },
                {
                    name: "Rude French",
                    value: "fr-ME"
                },
                {
                    name: "Russian",
                    value: "ru-RU"
                },
                {
                    name: "Spanish",
                    value: "es-ES"
                },
            ],
        }
    ],
    thinking: false,
    category: 'bot',
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: ChatInputCommandInteraction | Message, lang: LanguageData, runningCommand: any, execTimestamp?: number, args?: string[]) => {        // Guard's Typing
        if (!client.user || !interaction.member || !interaction.guild || !interaction.channel) return;

        const permissionsArray = [PermissionsBitField.Flags.Administrator]
        const permissions = interaction instanceof ChatInputCommandInteraction ?
            interaction.memberPermissions?.has(permissionsArray)
            : interaction.member.permissions.has(permissionsArray);

        if (interaction instanceof ChatInputCommandInteraction) {
            var type = interaction.options.getString("language");
        } else {
            var _ = await client.args.checkCommandArgs(interaction, command, args!, lang); if (!_) return;
            var type = args?.[0] as string | null;
        };

        if (!permissions) {
            await client.args.interactionSend(interaction, { content: lang.setserverlang_not_admin });
            return;
        };


        let already = await client.db.get(`${interaction.guildId}.GUILD.LANG`);

        if (already?.lang === type) {
            await client.args.interactionSend(interaction, { content: lang.setserverlang_already });
            return;
        }

        await client.db.set(`${interaction.guildId}.GUILD.LANG`, { lang: type });
        lang = await client.func.getLanguageData(interaction.guildId) as LanguageData;

        try {
            let logEmbed = new EmbedBuilder()
                .setColor("#bf0bb9")
                .setTitle(lang.setserverlang_logs_embed_title_on_enable)
                .setDescription(lang.setserverlang_logs_embed_description_on_enable
                    .replace(/\${type}/g, type!)
                    .replace(/\${interaction\.user.id}/g, interaction.member.user.id)
                );

            let logchannel = interaction.guild.channels.cache.find((channel: { name: string; }) => channel.name === 'ihorizon-logs');
            if (logchannel) { (logchannel as BaseGuildTextChannel).send({ embeds: [logEmbed] }) };
        } catch (e: any) { logger.err(e) };

        await client.args.interactionSend(interaction, { content: lang.setserverlang_command_work_enable.replace(/\${type}/g, type!) });
        return;
    },
};

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
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ChatInputCommandInteraction,
    Client,
    CommandInteractionOptionResolver,
    Message,
    PermissionsBitField,
} from 'pwss'

import { Command } from '../../../../types/command';
import { LanguageData } from '../../../../types/languageData';

export const command: Command = {
    name: 'say',

    description: 'Sent a message throught the bot!',
    description_localizations: {
        "fr": "Envoyer un message via le bot!"
    },

    category: 'bot',
    options: [
        {
            name: 'content',
            name_localizations: {
                "fr": "contenu"
            },

            type: ApplicationCommandOptionType.String,

            description: 'What you want the bot to say!',
            description_localizations: {
                "fr": "Le message que le bot vas dire"
            },

            required: true
        }
    ],
    type: ApplicationCommandType.ChatInput,
    thinking: false,
    run: async (client: Client, interaction: ChatInputCommandInteraction | Message, lang: LanguageData, runningCommand: any, execTimestamp?: number, args?: string[]) => {        // Guard's Typing
        if (!client.user || !interaction.member || !interaction.guild || !interaction.channel) return;

        const permissionsArray = [PermissionsBitField.Flags.Administrator]
        const permissions = interaction instanceof ChatInputCommandInteraction ?
            interaction.memberPermissions?.has(permissionsArray)
            : interaction.member.permissions.has(permissionsArray);

        if (interaction instanceof ChatInputCommandInteraction) {
            var toSay = interaction.options.getString('content')!;
        } else {
            var _ = await client.args.checkCommandArgs(interaction, command, args!, lang); if (!_) return;
            var toSay = args?.join(" ")!;
        };

        if (!permissions) {
            await client.args.interactionSend(interaction,{ content: lang.setserverlang_not_admin });
            return;
        };

        if (interaction instanceof ChatInputCommandInteraction) await interaction.deferReply() && await interaction.deleteReply();
        await interaction.channel.send({
            content: '> ' + `${toSay}${lang.say_footer_msg.replace('${interaction.user}', interaction.member.user.toString())}`
        });
        return;
    },
};
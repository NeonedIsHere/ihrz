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
    Message,
} from 'discord.js'

import { LanguageData } from '../../../../types/languageData.js';
import { Command } from '../../../../types/command.js';
import { Option } from '../../../../types/option.js';

export const command: Command = {
    name: "bulkunban",

    aliases: ["massunban", "bunban"],

    description: "Mass action about unban",
    description_localizations: {
        "fr": "Action de masse pour débannir"
    },

    options: [
        {
            name: "ball",

            description: "Unban all member of the guild",
            description_localizations: {
                "fr": "Bannir tout le monde sur un serveur"
            },

            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: "undo",

            description: "Undo the unban all of the guild",
            description_localizations: {
                "fr": "Annuler le dé-bannissement de tout les serveurs"
            },

            type: ApplicationCommandOptionType.Subcommand
        }
    ],

    category: 'utils',
    thinking: true,
    type: ApplicationCommandType.ChatInput,

};

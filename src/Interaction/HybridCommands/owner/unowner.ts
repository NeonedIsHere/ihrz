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
    ApplicationCommandOptionType,
    User,
    ChatInputCommandInteraction,
    ApplicationCommandType,
    Message
} from 'discord.js'

import { Command } from '../../../../types/command';
import { LanguageData } from '../../../../types/languageData';

export const command: Command = {
    name: 'unowner',

    description: 'The member who wants to delete of the owner list (Only Owner of ihorizon)!',
    description_localizations: {
        "fr": "Le membre que vous souhaitez supprimer de la liste des propriétaires (uniquement pour les dev)"
    },

    options: [
        {
            name: 'member',
            type: ApplicationCommandOptionType.User,

            description: 'The member who wants to delete of the owner list',
            description_localizations: {
                "fr": "Le membre que vous souhaitez supprimer de la liste des propriétaires"
            },

            required: true
        },
    ],
    thinking: false,
    category: 'owner',
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: ChatInputCommandInteraction<"cached"> | Message, lang: LanguageData, runningCommand: any, neededPerm?: number, args?: string[]) => {


        // Guard's Typing
        if (!client.user || !interaction.member || !interaction.guild || !interaction.channel) return;

        let tableOwner = client.db.table('OWNER');

        if (await tableOwner.get(`${interaction.member.user.id}.owner`) !== true) {
            await client.method.interactionSend(interaction, { content: lang.unowner_not_owner });
            return;
        };

        if (interaction instanceof ChatInputCommandInteraction) {
            var member = interaction.options.getUser('member');
        } else {
            
            var member = await client.method.user(interaction, args!, 0);
        };

        if (client.owners.includes(member?.id!)) {
            await client.method.interactionSend(interaction, { content: lang.unowner_cant_unowner_creator });
            return;
        };

        await tableOwner.delete(`${member?.id}`);

        await client.method.interactionSend(interaction, { content: lang.unowner_command_work.replace(/\${member\.username}/g, member?.username!) });
        return;
    },
};
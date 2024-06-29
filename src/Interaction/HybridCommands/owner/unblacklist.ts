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
    ChatInputCommandInteraction,
    GuildMember,
    UserResolvable,
    ApplicationCommandType,
    Message
} from 'pwss'

import { Command } from '../../../../types/command';
import { LanguageData } from '../../../../types/languageData';

export const command: Command = {
    name: 'unblacklist',

    description: 'The user you want to unblacklist (Only Owner of ihorizon)!',
    description_localizations: {
        "fr": "Enlever un utilisateur de la liste noir.(Seulement pour les dev)"
    },

    options: [
        {
            name: 'member',
            type: ApplicationCommandOptionType.User,

            description: 'The user you want to unblacklist (Only Owner of ihorizon)',
            description_localizations: {
                "fr": "L'utilisateur que vous souhaitez supprimer de la liste noire (uniquement propriétaire d'ihorizon)"
            },

            required: true
        }
    ],
    thinking: false,
    category: 'owner',
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: ChatInputCommandInteraction | Message, execTimestamp?: number, args?: string[]) => {
        // Guard's Typing
        if (!client.user || !interaction.member || !interaction.guild || !interaction.channel) return;

        let data = await client.func.getLanguageData(interaction.guildId) as LanguageData;
        let tableOwner = client.db.table('OWNER');
        let tableBlacklist = client.db.table('BLACKLIST');

        if (!await tableOwner.get(`${interaction.member.user.id}.owner`)) {
            await client.args.interactionSend(interaction,{ content: data.unblacklist_not_owner });
            return;
        };

        if (interaction instanceof ChatInputCommandInteraction) {
            var member = interaction.options.getUser('user');
        } else {
            var _ = await client.args.checkCommandArgs(interaction, command, args!); if (!_) return;
            var member = client.args.user(interaction, 0);
        };

        let fetched = await tableBlacklist.get(`${member?.id}`);

        if (!fetched) {
            await client.args.interactionSend(interaction,{ content: data.unblacklist_not_blacklisted.replace(/\${member\.id}/g, member?.id!) });
            return;
        };

        try {
            let bannedMember = await client.users.fetch(member?.id as UserResolvable);

            if (!bannedMember) {
                await client.args.interactionSend(interaction,{ content: data.unblacklist_user_is_not_exist });
                return;
            };

            await tableBlacklist.delete(`${member?.id}`);
            await interaction.guild.members.unban(bannedMember);

            await client.args.interactionSend(interaction,{ content: data.unblacklist_command_work.replace(/\${member\.id}/g, member?.id!) });
            return;
        } catch (e) {
            await tableBlacklist.delete(`${member?.id}`);
            await client.args.interactionSend(interaction,{
                content: data.unblacklist_unblacklisted_but_can_unban_him.replace("${client.iHorizon_Emojis.icon.No_Logo}", client.iHorizon_Emojis.icon.No_Logo)
            });
            return;
        };
    },
};
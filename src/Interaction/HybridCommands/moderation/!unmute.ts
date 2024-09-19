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
    BaseGuildTextChannel,
    ChatInputCommandInteraction,
    GuildMember,
    Message,
} from 'discord.js';

import logger from '../../../core/logger.js';
import { LanguageData } from '../../../../types/languageData.js';
import { SubCommandArgumentValue } from '../../../core/functions/method.js';

export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction<"cached"> | Message, data: LanguageData, command: SubCommandArgumentValue, execTimestamp?: number, args?: string[]) => {
        let permCheck = await client.method.permission.checkCommandPermission(interaction, command.command!);
        if (!permCheck.allowed) return client.method.permission.sendErrorMessage(interaction, data, permCheck.neededPerm || 0);

        // Guard's Typing
        if (!client.user || !interaction.member || !interaction.guild || !interaction.channel) return;;

        if (interaction instanceof ChatInputCommandInteraction) {
            var tomute = interaction.options.getMember("user") as GuildMember | null;
        } else {
            var _ = await client.method.checkCommandArgs(interaction, command, args!, data); if (!_) return;
            var tomute = client.method.member(interaction, args!, 0) as GuildMember | null;
        };

        const permissionsArray = [PermissionsBitField.Flags.Administrator]
        const permissions = interaction instanceof ChatInputCommandInteraction ?
            interaction.memberPermissions?.has(permissionsArray)
            : interaction.member.permissions.has(permissionsArray);

        if (!tomute) return;

        if (!permissions && permCheck.neededPerm === 0) {
            await client.method.interactionSend(interaction, {
                content: data.unmute_dont_have_permission.replace("${client.iHorizon_Emojis.icon.No_Logo}", client.iHorizon_Emojis.icon.No_Logo)
            });
            return;;
        };

        if (!interaction.guild.members.me?.permissions.has([PermissionsBitField.Flags.ManageRoles])) {
            await client.method.interactionSend(interaction, {
                content: data.unmute_i_dont_have_permission.replace("${client.iHorizon_Emojis.icon.No_Logo}", client.iHorizon_Emojis.icon.No_Logo)
            });
            return;;
        };

        if (tomute?.id === interaction.member.user.id) {
            await client.method.interactionSend(interaction, {
                content: data.unmute_attempt_mute_your_self.replace("${client.iHorizon_Emojis.icon.No_Logo}", client.iHorizon_Emojis.icon.No_Logo)
            });
            return;;
        };

        if (!tomute?.isCommunicationDisabled() === true) {
            await client.method.interactionSend(interaction, { content: data.unmute_not_muted });
            return;;
        };

        tomute.disableCommunicationUntil(Date.now());

        await client.method.interactionSend(interaction, {
            content: data.unmute_command_work
                .replace("${tomute.id}", tomute.id)
        });

        await client.method.iHorizonLogs.send(interaction, {
            title: data.unmute_logs_embed_title,
            description: data.unmute_logs_embed_description
                .replace("${interaction.user.id}", interaction.member.user.id)
                .replace("${tomute.id}", tomute.id)
        });
    },
};
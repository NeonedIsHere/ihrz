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
    BaseGuildTextChannel,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    InteractionEditReplyOptions,
    Message,
    MessagePayload,
    MessageReplyOptions,
    PermissionsBitField,
} from 'discord.js';
import { LanguageData } from '../../../../types/languageData';
import { Command } from '../../../../types/command';
import { SubCommandArgumentValue } from '../../../core/functions/method';

export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction<"cached"> | Message, data: LanguageData, command: SubCommandArgumentValue, execTimestamp?: number, args?: string[]) => {
        let permCheck = await client.method.permission.checkCommandPermission(interaction, command.command!);
        if (!permCheck.allowed) return client.method.permission.sendErrorMessage(interaction, data, permCheck.neededPerm || 0);

        // Guard's Typing
        if (!client.user || !interaction.member || !interaction.guild || !interaction.channel) return;

        let Lockembed = new EmbedBuilder()
            .setColor(await client.db.get(`${interaction.guild?.id}.GUILD.GUILD_CONFIG.embed_color.mod-cmd`) || "#5b3475")
            .setTimestamp()
            .setDescription(data.lock_embed_message_description
                .replace(/\${interaction\.user\.id}/g, interaction.member.user.id)
            );

        const permissionsArray = [PermissionsBitField.Flags.ManageChannels]
        const permissions = interaction instanceof ChatInputCommandInteraction ?
            interaction.memberPermissions?.has(permissionsArray)
            : interaction.member.permissions.has(permissionsArray);

        if (!permissions && permCheck.neededPerm === 0) {
            await client.method.interactionSend(interaction, { content: data.lock_dont_have_permission.replace("${client.iHorizon_Emojis.icon.No_Logo}", client.iHorizon_Emojis.icon.No_Logo) });
            return;
        };

        if (interaction instanceof ChatInputCommandInteraction) {
            var role = interaction.options.getRole("role");
        } else {
            var _ = await client.method.checkCommandArgs(interaction, command, args!, data); if (!_) return;
            var role = client.method.role(interaction, args!, 0);
        };

        (interaction.channel as BaseGuildTextChannel).permissionOverwrites
            .create(role?.id || interaction.guild.roles.everyone.id, { SendMessages: false }).then(async () => {
                await client.method.interactionSend(interaction, { embeds: [Lockembed] });
            }).catch(() => { })

        await client.method.iHorizonLogs.send(interaction, {
            title: data.lock_logs_embed_title,
            description: data.lock_logs_embed_description
                .replace(/\${interaction\.user\.id}/g, interaction.member.user.id)
                .replace(/\${interaction\.channel\.id}/g, interaction.channel.id as string)
        });
    },
};
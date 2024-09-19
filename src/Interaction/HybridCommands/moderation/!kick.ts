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
    GuildMember,
    GuildMemberRoleManager,
    InteractionEditReplyOptions,
    Message,
    MessagePayload,
    MessageReplyOptions,
    PermissionsBitField,
} from 'discord.js';

import { LanguageData } from '../../../../types/languageData';
import logger from '../../../core/logger.js';
import { SubCommandArgumentValue } from '../../../core/functions/method';


export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction<"cached"> | Message, data: LanguageData, command: SubCommandArgumentValue, execTimestamp?: number, args?: string[]) => {
        let permCheck = await client.method.permission.checkCommandPermission(interaction, command.command!);
        if (!permCheck.allowed) return client.method.permission.sendErrorMessage(interaction, data, permCheck.neededPerm || 0);

        // Guard's Typing
        if (!client.user || !interaction.member || !interaction.guild || !interaction.channel) return;

        const permissionsArray = [PermissionsBitField.Flags.KickMembers]
        const permissions = interaction instanceof ChatInputCommandInteraction ?
            interaction.memberPermissions?.has(permissionsArray)
            : interaction.member.permissions.has(permissionsArray);

        if (!permissions && permCheck.neededPerm === 0) {
            await client.method.interactionSend(interaction, {
                content: data.kick_not_permission.replace("${client.iHorizon_Emojis.icon.No_Logo}", client.iHorizon_Emojis.icon.No_Logo)
            });
            return;
        };

        if (interaction instanceof ChatInputCommandInteraction) {
            var member = interaction.options.getMember("member") as GuildMember | null;
            var reason = interaction.options.getString("reason")
        } else {
            var _ = await client.method.checkCommandArgs(interaction, command, args!, data); if (!_) return;
            var member = client.method.member(interaction, args!, 0) as GuildMember | null;
            var reason = client.method.longString(args!, 1);
        };

        if (!reason) {
            reason = data.guildprofil_not_set_punishPub
        };

        if (!member) return;

        if (!interaction.guild.members.me?.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            await client.method.interactionSend(interaction, {
                content: data.kick_dont_have_permission.replace("${client.iHorizon_Emojis.icon.No_Logo}", client.iHorizon_Emojis.icon.No_Logo)
            });
            return;
        };

        if (member.id === interaction.member.user.id) {
            await client.method.interactionSend(interaction, {
                content: data.kick_attempt_kick_your_self.replace("${client.iHorizon_Emojis.icon.No_Logo}", client.iHorizon_Emojis.icon.No_Logo)
            });
            return;
        };

        if ((interaction.member.roles as GuildMemberRoleManager).highest.position < member.roles.highest.position) {
            await client.method.interactionSend(interaction, {
                content: data.kick_attempt_kick_higter_member.replace("${client.iHorizon_Emojis.icon.Stop_Logo}", client.iHorizon_Emojis.icon.Stop_Logo)
            });
            return;
        };

        member.send({
            content: data.kick_message_to_the_banned_member
                .replace(/\${interaction\.guild\.name}/g, interaction.guild.name)
                .replace(/\${interaction\.member\.user\.username}/g, interaction.member.user.username)
        }).catch(() => { });

        await member.kick(`Kicked by: ${interaction.member.user.username} | Reason: ${reason}`);

        await client.method.interactionSend(interaction, {
            embeds: [
                new EmbedBuilder()
                    .setTitle(data.setjoinroles_var_perm_kick_members)
                    .setFields({ name: data.var_member, value: member.toString(), inline: true },
                        { name: data.var_author, value: interaction.member?.toString()!, inline: true },
                        { name: data.var_reason, value: reason || data.var_no_set, inline: true }
                    )
                    .setFooter(await client.method.bot.footerBuilder(interaction))
            ],
            files: [await client.method.bot.footerAttachmentBuilder(interaction)]
        });

        await client.method.iHorizonLogs.send(interaction, {
            title: data.kick_logs_embed_title,
            description: data.kick_logs_embed_description
                .replace(/\${member\.user}/g, member.user.toString())
                .replace(/\${interaction\.user\.id}/g, interaction.member.user.id)
        });
    },
};
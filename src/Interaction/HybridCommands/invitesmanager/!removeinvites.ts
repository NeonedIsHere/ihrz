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
    InteractionEditReplyOptions,
    Message,
    MessagePayload,
    MessageReplyOptions,
    PermissionsBitField,
    User,
} from 'discord.js';
import { LanguageData } from '../../../../types/languageData';
import { Command } from '../../../../types/command';
import { SubCommandArgumentValue } from '../../../core/functions/method';

export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction<"cached"> | Message, data: LanguageData, command: SubCommandArgumentValue, execTimestamp?: number, args?: string[]) => {
        let permCheck = await client.method.permission.checkCommandPermission(interaction, command.command!);
        if (!permCheck.allowed) return client.method.permission.sendErrorMessage(interaction, data, permCheck.neededPerm || 0);

        // Guard's Typing
        if (!interaction.member || !client.user || !interaction.guild || !interaction.channel) return;

        if (interaction instanceof ChatInputCommandInteraction) {
            var user = interaction.options.getMember("member") as GuildMember;
            var amount = interaction.options.getNumber("amount")!;
        } else {
            var _ = await client.method.checkCommandArgs(interaction, command, args!, data); if (!_) return;
            var user = client.method.member(interaction, args!, 0) || interaction.member;
            var amount = client.method.number(args!, 1);
        };

        let a = new EmbedBuilder()
            .setColor(await client.db.get(`${interaction.guild?.id}.GUILD.GUILD_CONFIG.embed_color.all`) || "#FF0000")
            .setDescription(data.removeinvites_not_admin_embed_description);

        const permissionsArray = [PermissionsBitField.Flags.Administrator]
        const permissions = interaction instanceof ChatInputCommandInteraction ?
            interaction.memberPermissions?.has(permissionsArray)
            : interaction.member.permissions.has(permissionsArray);

        if (!permissions && permCheck.neededPerm === 0) {
            await client.method.interactionSend(interaction, { embeds: [a] });
            return;
        };

        let check = await client.db.get(`${interaction?.guild?.id}.USER.${user.id}.INVITES`);

        if (check) {
            await client.db.sub(`${interaction.guildId}.USER.${user.id}.INVITES.invites`, amount!);
            await client.db.sub(`${interaction.guildId}.USER.${user.id}.INVITES.bonus`, amount!);
        } else {

            await client.db.set(`${interaction?.guild?.id}.USER.${user.id}.INVITES`,
                {
                    regular: 0, bonus: 0, leaves: 0, invites: 0
                }
            );
            await client.db.sub(`${interaction.guildId}.USER.${user.id}.INVITES.invites`, amount!);
            await client.db.sub(`${interaction.guildId}.USER.${user.id}.INVITES.bonus`, amount!);
        };

        let finalEmbed = new EmbedBuilder()
            .setDescription(data.removeinvites_confirmation_embed_description
                .replace(/\${amount}/g, amount.toString())
                .replace(/\${user}/g, user.toString()!)
            )
            .setColor(await client.db.get(`${interaction.guild?.id}.GUILD.GUILD_CONFIG.embed_color.all`) || `#92A8D1`)
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL()! });

        await client.method.interactionSend(interaction, { embeds: [finalEmbed] });

        await client.method.iHorizonLogs.send(interaction, {
            title: data.removeinvites_logs_embed_title,
            description: data.removeinvites_logs_embed_description
                .replace(/\${interaction\.user\.id}/g, interaction.member.user.id)
                .replace(/\${amount}/g, amount.toString())
                .replace(/\${user\.id}/g, user.id)
        });
    },
};
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
    ActionRowBuilder,
    BaseGuildTextChannel,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    InteractionEditReplyOptions,
    Message,
    MessageReplyOptions,
    PermissionsBitField,
    SnowflakeUtil,
    TextChannel
} from 'discord.js';
import { LanguageData } from '../../../../types/languageData';
import { SubCommandArgumentValue } from '../../../core/functions/method';

export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction | Message, data: LanguageData, command: SubCommandArgumentValue, execTimestamp?: number, args?: string[]) => {
        // Guard's Typing
        if (!interaction.member || !client.user || !interaction.guild || !interaction.channel) return;

        if (interaction instanceof ChatInputCommandInteraction) {
            var channel = interaction.options.getChannel("to") as TextChannel;
            var buttonTitle = interaction.options.getString('button-title')?.substring(0, 32) || '+';
        } else {
            var _ = await client.method.checkCommandArgs(interaction, command, args!, data); if (!_) return;
            var channel = (client.method.channel(interaction, args!, 0) || interaction.channel) as TextChannel;
            var buttonTitle = client.method.string(args!, 1)?.substring(0, 32) || '+';
        };

        const permissionsArray = [PermissionsBitField.Flags.Administrator]
        const permissions = interaction instanceof ChatInputCommandInteraction ?
            interaction.memberPermissions?.has(permissionsArray)
            : interaction.member.permissions.has(permissionsArray);

        if (!permissions) {
            await client.method.interactionSend(interaction, { content: data.security_channel_not_admin });
            return;
        };

        await client.method.interactionSend(interaction, {
            content: data.confession_channel_command_work
                .replace('${channel?.toString()}', channel.toString()!)
        });

        let embed = new EmbedBuilder()
            .setColor('#ff05aa')
            .setFooter(await client.method.bot.footerBuilder(interaction))
            .setTimestamp()
            .setDescription(data.confession_channel_panel_embed_desc)
            ;

        let actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setLabel(buttonTitle)
                .setCustomId('new-confession-button')
        )

        const nonce = SnowflakeUtil.generate().toString();

        let message = await (channel as BaseGuildTextChannel).send({
            embeds: [embed],
            files: [await client.method.bot.footerAttachmentBuilder(interaction)],
            components: [actionRow],
            enforceNonce: true,
            nonce: nonce
        });

        await client.database.set(client.m.ConfessionSchema, {
            guildId: interaction.guildId,
            panel: {
                channelId: message.channelId,
                messageId: message.id
            }
        });

        await client.method.iHorizonLogs.send(interaction, {
            title: data.confession_channel_log_embed_title,
            description: data.confession_channel_log_embed_desc
                .replace('${interaction.user}', interaction.member.user.toString())
                .replace('${channel}', channel.toString())
        });

        return;
    },
};
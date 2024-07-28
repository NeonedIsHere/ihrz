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
} from 'discord.js';

import logger from '../../../core/logger.js';
import { LanguageData } from '../../../../types/languageData.js';
import { SubCommandArgumentValue } from '../../../core/functions/method.js';

export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction | Message, data: LanguageData, command: SubCommandArgumentValue, execTimestamp?: number, args?: string[]) => {
        // Guard's Typing
        if (!client.user || !interaction.member || !interaction.guild || !interaction.channel) return;

        const permissionsArray = [PermissionsBitField.Flags.ManageMessages]
        const permissions = interaction instanceof ChatInputCommandInteraction ?
            interaction.memberPermissions?.has(permissionsArray)
            : interaction.member.permissions.has(permissionsArray);

        if (!permissions) {
            await client.method.interactionSend(interaction, { content: data.tempmute_dont_have_permission.replace("${client.iHorizon_Emojis.icon.No_Logo}", client.iHorizon_Emojis.icon.No_Logo) });
            return;
        };

        if (interaction instanceof ChatInputCommandInteraction) {
            var tomute = interaction.options.getMember("user") as GuildMember | null;
            var mutetime = interaction.options.getString("time");
        } else {
            var _ = await client.method.checkCommandArgs(interaction, command, args!, data); if (!_) return;
            var tomute = client.method.member(interaction, args!, 0) as GuildMember | null;
            var mutetime = client.method.string(args!, 1) as string | null;
        };

        if (!mutetime || !tomute || !mutetime) { return; };

        let mutetimeMS = client.timeCalculator.to_ms(mutetime)!;
        let mutetimeString = client.timeCalculator.to_beautiful_string(mutetime);

        if (!interaction.guild.members.me?.permissions.has([PermissionsBitField.Flags.ManageMessages])) {
            await client.method.interactionSend(interaction, {
                content: data.tempmute_i_dont_have_permission.replace("${client.iHorizon_Emojis.icon.No_Logo}", client.iHorizon_Emojis.icon.No_Logo)
            });
            return;
        };

        if (tomute.id === interaction.member.user.id) {
            await client.method.interactionSend(interaction, {
                content: data.tempmute_cannot_mute_yourself.replace("${client.iHorizon_Emojis.icon.No_Logo}", client.iHorizon_Emojis.icon.No_Logo)
            });
            return;
        }

        if (tomute.isCommunicationDisabled() === true) {
            await client.method.interactionSend(interaction, { content: data.tempmute_already_muted });
            return;
        };

        await (tomute.timeout(mutetimeMS, data.tempmute_logs_embed_title)).catch(() => { });

        await client.method.interactionSend(interaction, data.tempmute_command_work
            .replace("${tomute.id}", tomute.id)
            .replace("${ms(ms(mutetime))}", mutetimeString)
        );

        setTimeout(async () => {
            await interaction.channel?.send({
                content: data.tempmute_unmuted_by_time.replace("${tomute.id}", tomute?.id!),
            });
        }, mutetimeMS);

        try {
            let logEmbed = new EmbedBuilder()
                .setColor(await client.db.get(`${interaction.guild.id}.GUILD.GUILD_CONFIG.embed_color.ihrz-logs`) || "#bf0bb9")
                .setTitle(data.tempmute_logs_embed_title)
                .setDescription(data.tempmute_logs_embed_description
                    .replace("${interaction.user.id}", interaction.member.user.id)
                    .replace("${tomute.id}", tomute.id)
                    .replace("${ms(ms(mutetime))}", mutetimeString)
                )

            let logchannel = interaction.guild.channels.cache.find((channel: { name: string; }) => channel.name === 'ihorizon-logs');
            if (logchannel) {
                (logchannel as BaseGuildTextChannel).send({ embeds: [logEmbed] })
            };
        } catch (e: any) {
            logger.err(e)
        };
    },
};
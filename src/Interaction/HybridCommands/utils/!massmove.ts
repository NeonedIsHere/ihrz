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
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    ChannelType,
    ApplicationCommandType,
    BaseGuildVoiceChannel,
    VoiceChannel,
    Message,
    MessagePayload,
    InteractionEditReplyOptions,
    MessageReplyOptions
} from 'discord.js';

import { LanguageData } from '../../../../types/languageData';

import { SubCommandArgumentValue, member } from '../../../core/functions/method';
export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction<"cached"> | Message, lang: LanguageData, command: SubCommandArgumentValue, execTimestamp?: number, args?: string[]) => {
        let permCheck = await client.method.permission.checkCommandPermission(interaction, command.command!);
        if (!permCheck.allowed) return client.method.permission.sendErrorMessage(interaction, lang, permCheck.neededPerm || 0);

        // Guard's Typing
        if (!client.user || !interaction.member || !interaction.guild || !interaction.channel) return;

        const allChannel = Array.from(interaction.guild.channels.cache.values()!)
            .filter(x => x.type === (ChannelType.GuildVoice || ChannelType.GuildStageVoice)) || [];

        if (interaction instanceof ChatInputCommandInteraction) {
            var fromChannel = interaction.options.getChannel('from') as BaseGuildVoiceChannel | null;
            var toChannel = interaction.options.getChannel('to')! as BaseGuildVoiceChannel | null;
            await interaction.deferReply();
        } else {
            var _ = await client.method.checkCommandArgs(interaction, command, args!, lang); if (!_) return;
            var fromChannel = client.method.voiceChannel(interaction, args!, 0);
            var toChannel = client.method.voiceChannel(interaction, args!, 1);
        };

        if (toChannel === null) return;

        const permissionsArray = [PermissionsBitField.Flags.Administrator]
        const permissions = interaction instanceof ChatInputCommandInteraction ?
            interaction.memberPermissions?.has(permissionsArray)
            : interaction.member.permissions.has(permissionsArray);

        if (!permissions && permCheck.neededPerm === 0) {
            await client.method.interactionSend(interaction, { content: lang.punishpub_not_admin });
            return;
        };

        let movedCount = 0;
        let errorCount = 0;

        if (fromChannel) {
            for (const member of (fromChannel as BaseGuildVoiceChannel).members.values()) {
                try {
                    await member.voice.setChannel((toChannel as VoiceChannel));
                    movedCount++;
                } catch (error) {
                    errorCount++;
                }
            }
        } else if (allChannel) {
            for (const channel of allChannel) {
                for (const member of (channel as BaseGuildVoiceChannel).members.values()) {
                    try {
                        await member.voice.setChannel((toChannel as VoiceChannel));
                        movedCount++;
                    } catch (error) {
                        errorCount++;
                    }
                }
            }
        }

        let embed = new EmbedBuilder()
            .setFooter(await client.method.bot.footerBuilder(interaction))
            .setColor(await client.db.get(`${interaction.guild?.id}.GUILD.GUILD_CONFIG.embed_color.all`) || "#007fff")
            .setTimestamp()
            .setThumbnail(interaction.guild.iconURL())
            .setDescription(lang.massmove_results
                .replace('${interaction.user}', interaction.member.user.toString())
                .replace('${movedCount}', movedCount.toString())
                .replace('${errorCount}', errorCount.toString())
                .replace('${fromChannel}', fromChannel?.toString() || allChannel.map(x => x.toString()).join(","))
                .replace('${toChannel}', toChannel.toString())
            );

        await client.method.interactionSend(interaction, {
            embeds: [embed],
            files: [await client.method.bot.footerAttachmentBuilder(interaction)]
        });
    },
};
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
    Guild,
    GuildMember,
    InteractionEditReplyOptions,
    Message,
    MessagePayload,
    MessageReplyOptions,
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

        if (!(interaction.member as GuildMember).voice.channel) {
            await client.method.interactionSend(interaction, {
                content: data.skip_not_in_voice_channel.replace("${client.iHorizon_Emojis.icon.Warning_Icon}", client.iHorizon_Emojis.icon.Warning_Icon)
            });
            return;
        };

        try {
            let voiceChannel = (interaction.member as GuildMember).voice.channel;
            let player = client.player.getPlayer(interaction.guildId as string);
            let oldName = player.queue.current?.info.title;
            let channel = interaction.guild.channels.cache.get(player.textChannelId as string);

            if (!player || !player.playing || !voiceChannel) {
                await client.method.interactionSend(interaction, { content: data.skip_nothing_playing });
                return;
            };

            if (player.queue.tracks.length >= 1) {
                player.skip();
            } else {
                player.stopPlaying();
            }

            (channel as BaseGuildTextChannel).send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(2829617)
                        .setDescription(data.event_mp_playerSkip
                            .replace("${client.iHorizon_Emojis.icon.Music_Icon}", client.iHorizon_Emojis.icon.Music_Icon)
                            .replace("${track.title}", oldName as string)
                        )
                ]
            });

            await client.method.interactionSend(interaction, {
                content: data.skip_command_work
                    .replace("{queue}", player.queue.current?.info.title as string),
            });

            return;
        } catch (error: any) {
            logger.err(error)
        };
    },
};
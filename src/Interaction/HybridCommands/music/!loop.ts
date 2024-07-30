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
    ChatInputCommandInteraction,
    Client,
    CommandInteractionOptionResolver,
    Guild,
    GuildMember,
    InteractionEditReplyOptions,
    Message,
    MessagePayload,
    MessageReplyOptions,
} from 'discord.js';

import { LanguageData } from '../../../../types/languageData.js';
import logger from '../../../core/logger.js';
import { SubCommandArgumentValue } from '../../../core/functions/method.js';
import { QueueRepeatMode } from 'discord-player';

export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction | Message, data: LanguageData, command: SubCommandArgumentValue, execTimestamp?: number, args?: string[]) => {
        // Guard's Typing
        if (!client.user || !interaction.member || !interaction.guild || !interaction.channel) return;


        if (await client.db.table("TEMP").get(`${interaction.guildId}.PLAYER_TYPE`) === "lavalink") {
            try {
                let voiceChannel = (interaction.member as GuildMember).voice.channel;
                let player = client.lavalink.getPlayer(interaction.guildId as string);

                if (interaction instanceof ChatInputCommandInteraction) {
                    var mode = interaction.options.getString('mode');
                } else {
                    var _ = await client.method.checkCommandArgs(interaction, command, args!, data); if (!_) return;
                    var mode = client.method.string(args!, 0);
                };

                if (!player || !player.playing || !voiceChannel) {
                    await client.method.interactionSend(interaction, { content: data.loop_no_queue });
                    return;
                };

                await player.setRepeatMode(mode as "off" | "track" | "queue");

                await client.method.interactionSend(interaction, {
                    content: data.loop_command_work
                        .replace("{mode}", mode === 'track' ? `🔂` : `▶`)
                });
                return;
            } catch (error: any) {
                logger.err(error);
            };
        } else {
            try {
                let queue = interaction.client.player.nodes.get(interaction.guild as Guild);

                if (!queue || !queue.isPlaying()) {
                    await client.method.interactionSend(interaction, { content: data.loop_no_queue });
                    return;
                };

                if (interaction instanceof ChatInputCommandInteraction) {
                    var loopMode = interaction.options.getString('mode')!;
                } else {
                    var _ = await client.method.checkCommandArgs(interaction, command, args!, data); if (!_) return;
                    var loopMode = client.method.string(args!, 0)!;
                };

                var lpmode = 0;

                if (loopMode === "off") lpmode = 0;
                if (loopMode === "track") lpmode = 1;

                queue.setRepeatMode(loopMode as unknown as number)
                let mode = lpmode === QueueRepeatMode.TRACK ? `🔂` : lpmode === QueueRepeatMode.QUEUE ? `🔂` : `▶`;

                await client.method.interactionSend(interaction, {
                    content: data.loop_command_work
                        .replace("{mode}", mode === 'track' ? `🔂` : `▶`)
                });
                return;
            } catch (error: any) {
                logger.err(error);
            };
        }
    },
};
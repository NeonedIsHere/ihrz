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
    AttachmentBuilder,
    ChatInputCommandInteraction,
    Client,
    GuildMember,
    Message,
} from 'discord.js';
import { LanguageData } from '../../../../types/languageData';
import { SubCommandArgumentValue } from '../../../core/functions/method';
import { DatabaseStructure } from '../../../../types/database_structure';
import { readFileSync } from 'fs';
import path from 'path';

import {
    calculateMessageTime,
    calculateVoiceActivity,
    calculateActiveChannels,
    calculateActiveVoiceChannels,
    getChannelName,
    getChannelMessagesCount,
    getChannelMinutesCount,
} from "../../../core/functions/userStatsUtils.js";

export default {
    run: async (
        client: Client,
        interaction: ChatInputCommandInteraction<"cached"> | Message,
        data: LanguageData,
        command: SubCommandArgumentValue,
        execTimestamp?: number,
        args?: string[]
    ) => {
        let permCheck = await client.method.permission.checkCommandPermission(interaction, command.command!);
        if (!permCheck.allowed) return client.method.permission.sendErrorMessage(interaction, data, permCheck.neededPerm || 0);

        // Guard's Typing
        if (
            !client.user ||
            !interaction.member ||
            !interaction.guild ||
            !interaction.channel
        )
            return;

        let member: GuildMember;
        let user;

        if (interaction instanceof ChatInputCommandInteraction) {
            member = (interaction.options.getMember('member') || interaction.member) as GuildMember;
            user = interaction.user;
        } else {
            let _ = await client.method.checkCommandArgs(interaction, command, args!, data);
            if (!_) return;
            member = (client.method.member(interaction, args!, 0) || interaction.member) as GuildMember;
            user = interaction.author;
        }

        let res = (await client.db.get(`${interaction.guildId}.STATS.USER.${member.user.id}`)) as DatabaseStructure.UserStats | null;

        if (!res) {
            return await client.method.interactionSend(interaction, { content: data.unblacklist_user_is_not_exist })
        }

        let monthlyVoiceActivity = 0
        let weeklyVoiceActivity = 0;
        let dailyVoiceActivity = 0;

        let monthlyMessages: DatabaseStructure.StatsMessage[] = [];
        let weeklyMessages: DatabaseStructure.StatsMessage[] = [];
        let dailyMessages: DatabaseStructure.StatsMessage[] = [];
        let totalMessages: number = res.messages?.length || 0;

        let nowTimestamp = Date.now();

        let dailyTimeout = 86_400_000; // 24 hours in ms
        let weeklyTimeout = 604_800_000; // One week in ms
        let monthlyTimeout = 2_592_000_000; // One month in ms

        let firstActiveVoiceChannel = "";
        let secondActiveVoiceChannel = "";
        let thirdActiveVoiceChannel = "";

        let firstActiveChannel = "";
        let secondActiveChannel = "";
        let thirdActiveChannel = "";

        res.messages?.forEach((msg) => {
            const result = calculateMessageTime(
                msg,
                nowTimestamp,
                dailyTimeout,
                weeklyTimeout,
                monthlyTimeout,
                dailyMessages,
                weeklyMessages,
                monthlyMessages
            );
            dailyMessages = result.dailyMessages;
            weeklyMessages = result.weeklyMessages;
            monthlyMessages = result.monthlyMessages;
        });

        res.voices?.forEach((voice) => {
            const result = calculateVoiceActivity(
                voice,
                nowTimestamp,
                dailyTimeout,
                weeklyTimeout,
                monthlyTimeout,
                dailyVoiceActivity,
                weeklyVoiceActivity,
                monthlyVoiceActivity
            );
            dailyVoiceActivity = result.dailyVoiceActivity;
            weeklyVoiceActivity = result.weeklyVoiceActivity;
            monthlyVoiceActivity = result.monthlyVoiceActivity;
        });

        const activeChannels = calculateActiveChannels(res.messages || []);
        firstActiveChannel = activeChannels.firstActiveChannel;
        secondActiveChannel = activeChannels.secondActiveChannel;
        thirdActiveChannel = activeChannels.thirdActiveChannel;

        const activeVoiceChannels = calculateActiveVoiceChannels(res.voices || []);
        firstActiveVoiceChannel = activeVoiceChannels.firstActiveVoiceChannel;
        secondActiveVoiceChannel = activeVoiceChannels.secondActiveVoiceChannel;
        thirdActiveVoiceChannel = activeVoiceChannels.thirdActiveVoiceChannel;

        let htmlContent = readFileSync(
            path.join(process.cwd(), 'src', 'assets', 'userStatsPage.html'),
            'utf-8'
        );

        htmlContent = htmlContent
            .replaceAll('{header_h1_value}', data.header_h1_value)
            .replaceAll('{messages_word}', data.messages_word)
            .replaceAll('{voice_activity}', data.voice_activity)
            .replaceAll('{minutes_word}', data.minutes_word)
            .replaceAll('{top_voice}', data.top_voice)
            .replaceAll('{top_message}', data.top_message)
            .replaceAll('{author_username}', member.user.globalName || member.user.displayName)
            .replaceAll('{author_pfp}', member.user.displayAvatarURL({ size: 512 }))
            .replaceAll('{guild_name}', interaction.guild.name)
            .replaceAll('{messages_length}', String(totalMessages))
            .replaceAll('{voice_daily}', String(Math.round(dailyVoiceActivity / 1000 / 60)))
            .replaceAll('{voice_weekly}', String(Math.round(weeklyVoiceActivity / 1000 / 60)))
            .replaceAll('{voice_monthly}', String(Math.round(monthlyVoiceActivity / 1000 / 60)))
            .replaceAll('{message_daily}', String(dailyMessages.length))
            .replaceAll('{message_weekly}', String(weeklyMessages.length))
            .replaceAll('{message_monthly}', String(monthlyMessages.length))
            .replaceAll('{messages_top1}', String(getChannelName(interaction.guild, firstActiveChannel)))
            .replaceAll('{messages_top2}', String(getChannelName(interaction.guild, secondActiveChannel)))
            .replaceAll('{messages_top3}', String(getChannelName(interaction.guild, thirdActiveChannel)))
            .replaceAll('{messages_top1_2}', String(getChannelMessagesCount(firstActiveChannel, res.messages || [])))
            .replaceAll('{messages_top2_2}', String(getChannelMessagesCount(secondActiveChannel, res.messages || [])))
            .replaceAll('{messages_top3_2}', String(getChannelMessagesCount(thirdActiveChannel, res.messages || [])))
            .replaceAll('{voice_top1}', String(getChannelName(interaction.guild, firstActiveVoiceChannel)))
            .replaceAll('{voice_top2}', String(getChannelName(interaction.guild, secondActiveVoiceChannel)))
            .replaceAll('{voice_top3}', String(getChannelName(interaction.guild, thirdActiveVoiceChannel)))
            .replaceAll('{voice_top1_2}', String(getChannelMinutesCount(firstActiveVoiceChannel, res.voices || [])))
            .replaceAll('{voice_top2_2}', String(getChannelMinutesCount(secondActiveVoiceChannel, res.voices || [])))
            .replaceAll('{voice_top3_2}', String(getChannelMinutesCount(thirdActiveVoiceChannel, res.voices || [])));

        const image = await client.method.imageManipulation.html2Png(htmlContent, {
            width: 1280,
            height: 720,
            scaleSize: 2,
            elementSelector: '.container',
            omitBackground: true,
            selectElement: true,
        });

        const attachment = new AttachmentBuilder(image, { name: 'image.png' });

        await client.method.interactionSend(interaction, { files: [attachment] });
    },
};
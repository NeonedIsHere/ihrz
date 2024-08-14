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

import { Client, AuditLogEvent, GuildChannel, CategoryChannel, ChannelType, TextChannel } from 'discord.js';
import { BotEvent } from '../../../types/event';
import { protectionCache } from './ready.js';
import { LanguageData } from '../../../types/languageData';

let multiTimeout: Map<string, NodeJS.Timeout> = new Map<string, NodeJS.Timeout>();

export const event: BotEvent = {
    name: "channelDelete",
    run: async (client: Client, channel: GuildChannel) => {
        let data = await client.db.get(`${channel.guild.id}.PROTECTION`);
        if (!data) return;

        if (data.deletechannel && data.deletechannel.mode === 'allowlist') {

            let fetchedLogs = await channel.guild.fetchAuditLogs({
                type: AuditLogEvent.ChannelDelete,
                limit: 75,
            });

            let relevantLog = fetchedLogs.entries.find(entry =>
                entry.targetId === channel.id &&
                entry.executorId !== client.user?.id &&
                entry.executorId
            );

            if (!relevantLog) return;

            let baseData = await client.db.get(`${channel.guild.id}.ALLOWLIST.list.${relevantLog.executorId}`);

            if (!baseData) {
                let user = channel.guild.members.cache.get(relevantLog.executorId!);

                protectionCache.isRaiding.set(channel.guildId, true);

                var timeout = multiTimeout.get(channel.guildId);

                if (timeout) {
                    clearTimeout(timeout);
                }

                multiTimeout.set(channel.guildId, setTimeout(async () => {
                    protectionCache.isRaiding.set(channel.guildId, false);

                    await client.method.punish(data, user);

                    const backup = protectionCache.data.get(channel.guild.id);
                    if (!backup) return;

                    try {
                        const currentCategories = channel.guild.channels.cache.filter(ch => ch.type === ChannelType.GuildCategory) as Map<string, CategoryChannel>;
                        const currentChannels = channel.guild.channels.cache.filter(ch => ch.isTextBased() || ch.isVoiceBased());
                        const lang = await client.func.getLanguageData(channel.guildId) as LanguageData;

                        for (const categoryBackup of backup.categories) {
                            let category = currentCategories.get(categoryBackup.id);

                            if (!category) {
                                category = await channel.guild.channels.create({
                                    name: categoryBackup.name,
                                    type: ChannelType.GuildCategory,
                                    position: categoryBackup.position,
                                    reason: `Category re-created by Protect (${relevantLog.executorId})`
                                });
                            }

                            for (const chBackup of categoryBackup.channels) {
                                let existingChannel = currentChannels.get(chBackup.id);

                                if (!existingChannel) {
                                    try {
                                        existingChannel = await channel.guild.channels.create({
                                            name: chBackup.name,
                                            type: chBackup.type as any,
                                            parent: category.id,
                                            position: chBackup.position,
                                            permissionOverwrites: chBackup.permissions,
                                            reason: `Restoration after raid by Protect (${relevantLog.executorId})`
                                        });

                                        (existingChannel as TextChannel).send(lang.protection_avoid_channel_delete
                                            .replace('${channel.guild.ownerId}', channel.guild.ownerId)
                                            .replace('${firstEntry.executorId}', relevantLog.executorId!)
                                        );
                                    } catch {
                                        existingChannel = await channel.guild.channels.create({
                                            name: chBackup.name,
                                            type: chBackup.type as any,
                                            parent: category.id,
                                            permissionOverwrites: chBackup.permissions,
                                            reason: `Restoration after raid by Protect (${relevantLog.executorId})`
                                        });

                                        (existingChannel as TextChannel).send(lang.protection_avoid_channel_delete
                                            .replace('${channel.guild.ownerId}', channel.guild.ownerId)
                                            .replace('${firstEntry.executorId}', relevantLog.executorId!)
                                        );
                                    }
                                } else if (existingChannel.parentId !== category.id || (existingChannel as any).position !== chBackup.position) {
                                    await (existingChannel as GuildChannel).setParent(category.id, { lockPermissions: false }).catch(() => { });
                                    await (existingChannel as GuildChannel).setPosition(chBackup.position).catch(() => { });
                                }
                            }
                        }
                    } finally {
                        protectionCache.isRaiding.set(channel.guildId, false);
                    }
                }, 5000));
            }
        }
    },
};
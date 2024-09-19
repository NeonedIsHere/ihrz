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
    BaseGuildTextChannel,
    GuildMember,
    ApplicationCommandType,
    Message,
    ChannelType,
    BaseGuildVoiceChannel
} from 'discord.js'

import { Command } from '../../../../types/command.js';
import logger from '../../../core/logger.js';
import { LanguageData } from '../../../../types/languageData.js';

export const command: Command = {
    name: 'membercount',

    description: 'Set a member count channels!',
    description_localizations: {
        "fr": "Parametrer un canal vocal pour afficher des statistique"
    },

    options: [
        {
            name: "action",

            description: "<Power on /Power off>",
            description_localizations: {
                "fr": "<Power on /Power off>"
            },

            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "Power on",
                    value: "on"
                },
                {
                    name: "Power off",
                    value: "off"
                },
            ]
        },
        {
            name: "channel",

            description: `The channel to set the member count`,
            description_localizations: {
                "fr": "Le cannal pour définir le module membercount"
            },

            channel_types: [ChannelType.GuildVoice],

            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
        {
            name: 'name',
            required: false,
            type: ApplicationCommandOptionType.String,

            description: `{BotCount}, {RolesCount}, {MemberCount}, {ChannelCount}, {BoostCount}`,
            description_localizations: {
                "fr": "{BotCount}, {RolesCount}, {MemberCount}, {ChannelCount}, {BoostCount}"
            }
        },
    ],
    thinking: true,
    category: 'membercount',
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: ChatInputCommandInteraction<"cached"> | Message, lang: LanguageData, runningCommand: any, execTimestamp?: number, args?: string[]) => {
        let permCheck = await client.method.permission.checkCommandPermission(interaction, command!);
        if (!permCheck.allowed) return client.method.permission.sendErrorMessage(interaction, lang, permCheck.neededPerm || 0);

        // Guard's Typing
        if (!client.user || !interaction.member || !interaction.guild || !interaction.channel) return;

        const permissionsArray = [PermissionsBitField.Flags.Administrator]
        const permissions = interaction instanceof ChatInputCommandInteraction ?
            interaction.memberPermissions?.has(permissionsArray)
            : interaction.member.permissions.has(permissionsArray);

        if (!permissions && permCheck.neededPerm === 0) {
            await client.method.interactionSend(interaction, { content: lang.setmembercount_not_admin });
            return;
        };

        if (interaction instanceof ChatInputCommandInteraction) {
            var type = interaction.options.getString("action");
            var messagei = interaction.options.getString("name")?.toLowerCase()!;
            var channel = interaction.options.getChannel("channel") as BaseGuildVoiceChannel;
        } else {
            var _ = await client.method.checkCommandArgs(interaction, command, args!, lang); if (!_) return;
            var type = client.method.string(args!, 0);
            var channel = client.method.voiceChannel(interaction, args!, 0)!;
            var messagei = client.method.string(args!, 2)?.toLowerCase()!;
        }

        let help_embed = new EmbedBuilder()
            .setColor(await client.db.get(`${interaction.guild?.id}.GUILD.GUILD_CONFIG.embed_color.all`) || "#0014a8")
            .setTitle(lang.setmembercount_helpembed_title)
            .setDescription(lang.setmembercount_helpembed_description)
            .addFields({ name: lang.setmembercount_helpembed_fields_name, value: lang.setmembercount_helpembed_fields_value });

        if (type == "on") {
            let botMembers = interaction.guild.members.cache.filter((member: GuildMember) => member.user.bot);
            let rolesCollection = interaction.guild.roles.cache;
            let channelsCount = interaction.guild.channels.cache.size.toString()!;
            let rolesCount = rolesCollection.size!;
            let boostsCount = interaction.guild.premiumSubscriptionCount?.toString() || '0';

            if (!messagei) {
                await client.method.interactionSend(interaction, { embeds: [help_embed] });
                return;
            };

            let joinmsgreplace = messagei
                .replace("{membercount}", interaction.guild.memberCount.toString()!)
                .replace("{rolescount}", rolesCount.toString())
                .replace("{channelcount}", channelsCount)
                .replace("{boostcount}", boostsCount)
                .replace("{botcount}", botMembers.size.toString()!);

            if (messagei.includes("member")) {
                await client.db.set(`${interaction.guildId}.GUILD.MCOUNT.member`,
                    { name: messagei, enable: true, event: "member", channel: channel?.id }
                );
            } else if (messagei.includes("roles")) {
                await client.db.set(`${interaction.guildId}.GUILD.MCOUNT.roles`,
                    { name: messagei, enable: true, event: "roles", channel: channel?.id }
                );
            } else if (messagei.includes("channel")) {
                await client.db.set(`${interaction.guildId}.GUILD.MCOUNT.channel`,
                    { name: messagei, enable: true, event: "bot", channel: channel?.id }
                );
            } else if (messagei.includes("boost")) {
                await client.db.set(`${interaction.guildId}.GUILD.MCOUNT.boost`,
                    { name: messagei, enable: true, event: "bot", channel: channel?.id }
                );
            } else if (messagei.includes("bot")) {
                await client.db.set(`${interaction.guildId}.GUILD.MCOUNT.bot`,
                    { name: messagei, enable: true, event: "bot", channel: channel?.id }
                );
            };

            await client.method.iHorizonLogs.send(interaction, {
                title: lang.setmembercount_logs_embed_title_on_enable,
                description: lang.setmembercount_logs_embed_description_on_enable
                    .replace(/\${interaction\.user\.id}/g, interaction.member.user.id)
                    .replace(/\${channel\.id}/g, channel?.id!)
                    .replace(/\${messagei}/g, messagei)
            });

            let fetched = interaction.guild?.channels.cache.get(channel?.id as string);

            (fetched as BaseGuildTextChannel).edit({ name: joinmsgreplace });
            await client.method.interactionSend(interaction, {
                content: lang.setmembercount_command_work_on_enable.replace("${client.iHorizon_Emojis.icon.Yes_Logo}", client.iHorizon_Emojis.icon.Yes_Logo)
            });
            return;

        } else if (type == "off") {
            await client.db.delete(`${interaction.guildId}.GUILD.MCOUNT`);

            await client.method.iHorizonLogs.send(interaction, {
                title: lang.setmembercount_logs_embed_title_on_disable,
                description: lang.setmembercount_logs_embed_description_on_disable
                    .replace(/\${interaction\.user\.id}/g, interaction.member.user.id)
            });

            await client.method.interactionSend(interaction, {
                content: lang.setmembercount_command_work_on_disable.replace('${client.iHorizon_Emojis.icon.Yes_Logo}', client.iHorizon_Emojis.icon.Yes_Logo)
            });
            return;
        } else if (!type) {
            await client.method.interactionSend(interaction, { embeds: [help_embed] });
            return;
        } else if (!messagei) {
            await client.method.interactionSend(interaction, { embeds: [help_embed] });
            return;
        };
    },
};
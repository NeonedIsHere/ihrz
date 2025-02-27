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
    InteractionEditReplyOptions,
    Message,
    MessageReplyOptions,
    PermissionsBitField
} from 'discord.js';
import { LanguageData } from '../../../../types/languageData';
import { Command } from '../../../../types/command';
import { Option } from '../../../../types/option';

export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction<"cached"> | Message, lang: LanguageData, command: Option | Command | undefined, neededPerm: number, args?: string[]) => {

        // Guard's Typing
        if (!interaction.member || !client.user || !interaction.guild || !interaction.channel) return;

        if (interaction instanceof ChatInputCommandInteraction) {
            var action = interaction.options.getString("action");
        } else {
            
            var action = client.method.string(args!, 0);
        };

        const permissionsArray = [PermissionsBitField.Flags.Administrator]
        const permissions = interaction instanceof ChatInputCommandInteraction ?
            interaction.memberPermissions?.has(permissionsArray)
            : interaction.member.permissions.has(permissionsArray);

        if (!permissions && neededPerm === 0) {
            await client.method.interactionSend(interaction, { content: lang.security_disable_not_admin });
            return;
        };

        if (action === 'on') {
            await client.db.set(`${interaction.guildId}.CONFESSION.disable`, false);
            await client.method.interactionSend(interaction, {
                content: lang.confession_disable_command_work_on
            });

            await client.method.iHorizonLogs.send(interaction, {
                title: lang.confession_log_embed_title_on_enable,
                description: lang.confession_log_embed_desc_on_enable
                    .replace('${interaction.user}', interaction.member.user.toString())
            });

            return;
        } else if (action === 'off') {

            await client.db.set(`${interaction.guildId}.CONFESSION.disable`, true);
            await client.method.interactionSend(interaction, {
                content: lang.confession_disable_command_work_off
            });

            await client.method.iHorizonLogs.send(interaction, {
                title: lang.confession_log_embed_title_on_enable,
                description: lang.confession_log_embed_desc_on_disabled
                    .replace('${interaction.user}', interaction.member.user.toString())
            });

            return;
        };
    },
};
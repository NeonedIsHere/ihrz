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
    Message,
    PermissionsBitField,
} from 'discord.js';

import { LanguageData } from '../../../../types/languageData';
import { Command } from '../../../../types/command';
import { Option } from '../../../../types/option';
export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction<"cached"> | Message, lang: LanguageData, command: Option | Command | undefined, neededPerm: number, args?: string[]) => {


        // Guard's Typing
        if (!interaction.member || !client.user || !interaction.guild || !interaction.channel) return;

        const permissionsArray = [PermissionsBitField.Flags.ManageMessages]
        const permissions = interaction instanceof ChatInputCommandInteraction ?
            interaction.memberPermissions?.has(permissionsArray)
            : interaction.member.permissions.has(permissionsArray);

        if (!permissions && neededPerm === 0) {
            await client.method.interactionSend(interaction, { content: lang.economy_disable_not_admin });
            return;
        };

        if (interaction instanceof ChatInputCommandInteraction) {
            var state = interaction.options.getString("action") as string;
        } else {
            
            var state = client.method.longString(args!, 0) as string;
        };

        let current_state = await client.db.get(`${interaction.guildId}.ECONOMY.disabled`);

        if (state === 'on') {

            if (!current_state) {
                await client.method.interactionSend(interaction, {
                    content: lang.economy_disable_already_enable
                        .replace('${interaction.user.id}', interaction.member.user.id)
                });
                return;
            };

            await client.db.set(`${interaction.guildId}.ECONOMY.disabled`, false);

            await client.method.interactionSend(interaction, {
                content: lang.economy_disable_set_enable
                    .replace('${interaction.user.id}', interaction.member.user.id)
            });
        } else if (state === 'off') {

            if (current_state) {
                await client.method.interactionSend(interaction, {
                    content: lang.economy_disable_already_disable
                        .replace('${interaction.user.id}', interaction.member.user.id)
                });
                return;
            };

            await client.db.set(`${interaction.guildId}.ECONOMY.disabled`, true);

            await client.method.interactionSend(interaction, {
                content: lang.economy_disable_set_disable
                    .replace('${interaction.user.id}', interaction.member.user.id)
            });
        };

        await client.method.iHorizonLogs.send(interaction, {
            title: lang.economy_disable_logs_embed_title,
            description: lang.economy_disable_logs_embed_desc
                .replace(/\${interaction\.user\.id}/g, interaction.member.user.id)
                .replace('${state}', state)
        });
    },
};
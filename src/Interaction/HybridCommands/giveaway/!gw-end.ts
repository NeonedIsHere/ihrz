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

import { Command } from '../../../../types/command';
import { Option } from '../../../../types/option';
import { LanguageData } from '../../../../types/languageData';
import logger from '../../../core/logger.js';

export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction<"cached"> | Message, lang: LanguageData, command: Option | Command | undefined, neededPerm: number, args?: string[]) => {

        // Guard's Typing
        if (!interaction.member || !client.user || !interaction.guild || !interaction.channel) return;

        const permissionsArray = [PermissionsBitField.Flags.ManageMessages]
        const permissions = interaction instanceof ChatInputCommandInteraction ?
            interaction.memberPermissions?.has(permissionsArray)
            : interaction.member.permissions.has(permissionsArray);

        if (!permissions && neededPerm === 0) {
            await client.method.interactionSend(interaction, { content: lang.end_not_admin });
            return;
        };

        if (interaction instanceof ChatInputCommandInteraction) {
            var inputData = interaction.options.getString("giveaway-id");
        } else {
            
            var inputData = client.method.string(args!, 0);
        };

        if (!await client.giveawaysManager.isValid(inputData as string)) {
            await client.method.interactionSend(interaction, {
                content: lang.end_not_find_giveaway
                    .replace(/\${gw}/g, inputData as string)
            });
            return;
        };

        if (await client.giveawaysManager.isEnded(inputData as string)) {
            await client.method.interactionSend(interaction, { content: lang.end_command_error });
            return;
        };

        // @ts-ignore
        client.giveawaysManager.end(client, inputData as string)

        await client.method.interactionSend(interaction, {
            content: lang.end_confirmation_message
                .replace(/\${timeEstimate}/g, "0")
        });

        await client.method.iHorizonLogs.send(interaction, {
            title: lang.end_logs_embed_title,
            description: lang.end_logs_embed_description
                .replace(/\${interaction\.user\.id}/g, interaction.member.user.id)
                .replace(/\${giveaway\.messageID}/g, inputData as string)
        });

        return;
    },
};
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
} from 'pwss';

import { SubCommandArgumentValue } from '../../../core/functions/arg';
import { LanguageData } from '../../../../types/languageData';
import logger from '../../../core/logger.js';

export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction | Message, data: LanguageData, command: SubCommandArgumentValue, execTimestamp?: number, args?: string[]) => {
        // Guard's Typing
        if (!interaction.member || !client.user || !interaction.guild || !interaction.channel) return;

        const permissionsArray = [PermissionsBitField.Flags.ManageMessages]
        const permissions = interaction instanceof ChatInputCommandInteraction ?
            interaction.memberPermissions?.has(permissionsArray)
            : interaction.member.permissions.has(permissionsArray);

        if (!permissions) {
            await client.method.interactionSend(interaction, { content: data.end_not_admin });
            return;
        };

        if (interaction instanceof ChatInputCommandInteraction) {
            var inputData = interaction.options.getString("giveaway-id");
        } else {
            var _ = await client.method.checkCommandArgs(interaction, command, args!, data); if (!_) return;
            var inputData = client.method.string(args!, 0);
        };

        if (!await client.giveawaysManager.isValid(inputData as string)) {
            await client.method.interactionSend(interaction, {
                content: data.end_not_find_giveaway
                    .replace(/\${gw}/g, inputData as string)
            });
            return;
        };

        if (await client.giveawaysManager.isEnded(inputData as string)) {
            await client.method.interactionSend(interaction, { content: data.end_command_error });
            return;
        };

        // @ts-ignore
        client.giveawaysManager.end(client, inputData as string)

        await client.method.interactionSend(interaction, {
            content: data.end_confirmation_message
                .replace(/\${timeEstimate}/g, "0")
        });

        try {
            let logEmbed = new EmbedBuilder()
                .setColor("#bf0bb9")
                .setTitle(data.end_logs_embed_title)
                .setDescription(data.end_logs_embed_description
                    .replace(/\${interaction\.user\.id}/g, interaction.member.user.id)
                    .replace(/\${giveaway\.messageID}/g, inputData as string)
                );

            let logchannel = interaction.guild.channels.cache.find((channel: { name: string; }) => channel.name === 'ihorizon-logs');
            if (logchannel) {
                (logchannel as BaseGuildTextChannel).send({ embeds: [logEmbed] })
            };

        } catch (e: any) {
            logger.err(e)
        };

        return;
    },
};
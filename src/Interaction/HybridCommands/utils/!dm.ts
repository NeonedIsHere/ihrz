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
    ActionRowBuilder,
    ApplicationCommandType,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    Message,
    PermissionFlagsBits,
    PermissionsBitField,
} from 'discord.js'

import { LanguageData } from '../../../../types/languageData';

import { SubCommandArgumentValue, member } from '../../../core/functions/method';
export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction<"cached"> | Message, lang: LanguageData, command: SubCommandArgumentValue, execTimestamp?: number, args?: string[]) => {
        let permCheck = await client.method.permission.checkCommandPermission(interaction, command.command!);
        if (!permCheck.allowed) return client.method.permission.sendErrorMessage(interaction, lang, permCheck.neededPerm || 0);

        // Guard's Typing
        if (!client.user || !interaction.member || !interaction.guild || !interaction.channel) return;

        const permissionsArray = [PermissionsBitField.Flags.Administrator]
        const permissions = interaction instanceof ChatInputCommandInteraction ?
            interaction.memberPermissions?.has(permissionsArray)
            : interaction.member.permissions.has(permissionsArray);

        if (!permissions && permCheck.neededPerm === 0) {
            await client.method.interactionSend(interaction, { content: lang.punishpub_not_admin });
            return;
        };

        if (interaction instanceof ChatInputCommandInteraction) {
            var isPrivate = interaction.options.getString("private") === "yes" ? true : false;
            var msg = interaction.options.getString("message")!;
            var targetMember = interaction.options.getMember("member")!;
        } else {
            var _ = await client.method.checkCommandArgs(interaction, command, args!, lang); if (!_) return;
            var isPrivate = client.method.string(args!, 0) === "yes" ? true : false;
            var targetMember = client.method.member(interaction, args!, 1)!;
            var msg = client.method.longString(args!, 2)!
        };

        let buttons = [new ButtonBuilder()
            .setCustomId("forgot-my-name")
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Message from: " + interaction.guildId)
            .setDisabled(true)];

        if (isPrivate === false) {
            buttons.push(
                new ButtonBuilder()
                    .setCustomId("forgot-my-name2")
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel("Message by: " + interaction.member.user.id)
                    .setDisabled(true)
            )
        };


        await targetMember.send({
            content: msg, components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        buttons
                    )
            ]
        }).then(async () => {
            await client.method.interactionSend(interaction, {
                content: lang.utils_dm
                    .replace("${client.iHorizon_Emojis.icon.Yes_Logo}", client.iHorizon_Emojis.icon.Yes_Logo)
                    .replace("${targetMember.toString()}", targetMember.toString())
                    .replace("${client.iHorizon_Emojis.icon.Yes_Logo}", client.iHorizon_Emojis.icon.Yes_Logo)
            })
        }).catch(async () => {
            await client.method.interactionSend(interaction, {
                content: lang.utils_dm
                    .replace("${client.iHorizon_Emojis.icon.Yes_Logo}", client.iHorizon_Emojis.icon.Yes_Logo)
                    .replace("${targetMember.toString()}", targetMember.toString())
                    .replace("${client.iHorizon_Emojis.icon.Yes_Logo}", client.iHorizon_Emojis.icon.Yes_Logo)
            })

            await client.method.interactionSend(interaction, {
                content: lang.utils_dm_cant
                    .replace("${client.iHorizon_Emojis.icon.Yes_Logo}", client.iHorizon_Emojis.icon.Yes_Logo)
                    .replace("${targetMember.toString()}", targetMember.toString())
            })
        })

        return;
    },
};
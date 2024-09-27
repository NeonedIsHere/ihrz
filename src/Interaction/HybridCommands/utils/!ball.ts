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
    EmbedBuilder,
    Message,
    PermissionsBitField
} from 'discord.js';
import { LanguageData } from '../../../../types/languageData';
import wait from '../../../core/functions/wait.js';
import { Command } from '../../../../types/command';
import { SubCommandArgumentValue } from '../../../core/functions/method';
export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction<"cached"> | Message, data: LanguageData, command: SubCommandArgumentValue, execTimestamp?: number, args?: string[]) => {
        let permCheck = await client.method.permission.checkCommandPermission(interaction, command.command!);
        if (!permCheck.allowed) return client.method.permission.sendErrorMessage(interaction, data, permCheck.neededPerm || 0);

        // Guard's Typing
        if (!interaction.member || !client.user || !interaction.guild || !interaction.channel) return;

        const permissionsArray = [PermissionsBitField.Flags.Administrator]
        const permissions = interaction instanceof ChatInputCommandInteraction ?
            interaction.memberPermissions?.has(permissionsArray)
            : interaction.member.permissions.has(permissionsArray);

        if (!permissions && permCheck.neededPerm === 0) {
            await client.method.interactionSend(interaction, { content: data.prevnames_not_admin });
        }

        let banned_members = await interaction.guild.bans.fetch()

        let unbanned_members: string[] = [];
        let cannot_unban = 0;

        if (!banned_members) {
            await client.method.interactionSend(interaction, { content: data.action_unban_all_no_banned_members });
            return;
        }

        await Promise.all(banned_members.map(async index => {
            try {
                await interaction.guild?.bans.remove(index.user.id);
                unbanned_members.push(index.user.id);
            } catch (e) {
                cannot_unban++;
            }
            await wait(800);
        }));

        await client.db.set(`${interaction.guildId}.UTILS.unban_members`, unbanned_members);

        await client.method.interactionSend(interaction, {
            embeds: [
                new EmbedBuilder()
                    .setColor(2829617)
                    .setDescription(
                        data.action_unban_all_embed_desc
                            .replace("${client.iHorizon_Emojis.icon.Yes_Logo}", client.iHorizon_Emojis.icon.Yes_Logo)
                            .replace("${unbanned_members.length}", unbanned_members.length.toString())
                            .replace("${client.iHorizon_Emojis.icon.No_Logo}", client.iHorizon_Emojis.icon.No_Logo)
                            .replace('${cannot_unban}', cannot_unban.toString())
                    )
                    .setFooter(await client.method.bot.footerBuilder(interaction))
            ],
            files: [await interaction.client.method.bot.footerAttachmentBuilder(interaction)]
        });

        return;
    },
};

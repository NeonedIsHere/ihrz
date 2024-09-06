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
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    Message,
    GuildMember,
} from 'discord.js';
import { LanguageData } from '../../../../types/languageData';
import { DatabaseStructure } from '../../../../types/database_structure';
import { SubCommandArgumentValue } from '../../../core/functions/method';

const itemsPerPage = 5;

export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction | Message, data: LanguageData, command: SubCommandArgumentValue, execTimestamp?: number, args?: string[]) => {
        // Guard's Typing
        if (!interaction.member || !client.user || !interaction.guild || !interaction.channel) return;

        if (interaction instanceof ChatInputCommandInteraction) {
            var backupID = interaction.options.getString('backup-id');
        } else {
            var _ = await client.method.checkCommandArgs(interaction, command, args!, data); if (!_) return;
            var backupID = client.method.string(args!, 0);
        };

        if (backupID && !await client.db.get(`BACKUPS.${interaction.member.user.id}.${backupID}`)) {
            await client.method.interactionSend(interaction, {
                content: data.backup_this_is_not_your_backup.replace("${client.iHorizon_Emojis.icon.No_Logo}", client.iHorizon_Emojis.icon.No_Logo)
            });
            return;
        };

        let data2 = await client.db.get(`BACKUPS.${interaction.member.user.id}`) as DatabaseStructure.DbBackupsUserObject;
        let backups = [];

        for (let i in data2) {
            let result = data2[i];

            let v = (data.backup_string_see_another_v
                .replace('${result.categoryCount}', result.categoryCount.toString())
                .replace('${result.channelCount}', result.channelCount.toString()));

            if (result) backups.push({ name: `${result.guildName} - (||${i}||)`, value: v });
        };

        const totalPages = Math.ceil(backups.length / itemsPerPage);
        let currentPage = 0;

        const generateEmbed = async (page: number) => {
            let embed = new EmbedBuilder()
                .setDescription(backups.length > 0 ? data.backup_all_of_your_backup : data.backup_backup_doesnt_exist)
                .setAuthor({ name: interaction.member?.user.username || (interaction.member as GuildMember)?.displayName, iconURL: "attachment://user_icon.png" })
                .setColor(await client.db.get(`${interaction.guild?.id}.GUILD.GUILD_CONFIG.embed_color.ihrz-logs`) || "#bf0bb9")
                .setTimestamp();

            if (backups.length > 0) {
                let start = page * itemsPerPage;
                let end = start + itemsPerPage;
                let currentBackups = backups.slice(start, end);

                currentBackups.forEach(backup => embed.addFields(backup));
            }

            embed.setFooter({
                text: backups.length > 0
                    ? data.prevnames_embed_footer_text
                        .replace("${currentPage + 1}", String(page + 1))
                        .replace("${pages.length}", String(totalPages))
                    : data.prevnames_embed_footer_text.replace("${currentPage + 1}", "1").replace("${pages.length}", "1"),
                iconURL: "attachment://footer_icon.png"
            });
            return embed;
        };

        const generateButtons = (page: number) => {
            return new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('previous')
                        .setLabel('<<')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(page === 0 || backups.length === 0),
                    new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('>>')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(page === totalPages - 1 || backups.length === 0)
                );
        };

        const originalResponse = await client.method.interactionSend(interaction, {
            embeds: [await generateEmbed(currentPage)],
            components: [generateButtons(currentPage)],
            files: [
                await interaction.client.method.bot.footerAttachmentBuilder(interaction),
                { attachment: await interaction.client.func.image64((interaction.member as GuildMember).user.displayAvatarURL()), name: 'user_icon.png' }
            ]
        });

        if (backups.length > 0) {
            const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60_000 });

            collector.on('collect', async (i) => {
                if (i.customId === 'previous') {
                    currentPage--;
                } else if (i.customId === 'next') {
                    currentPage++;
                }

            await i.update({
                embeds: [await generateEmbed(currentPage)],
                components: [generateButtons(currentPage)]
            });

            collector.on('end', () => {
                originalResponse.edit({ components: [] });
            });
        }

        return;
    },
};
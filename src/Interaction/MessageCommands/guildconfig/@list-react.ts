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
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    Message,
    PermissionsBitField
} from 'pwss';

import { isDiscordEmoji, isSingleEmoji } from '../../../core/functions/emojiChecker.js';
import { LanguageData } from '../../../../types/languageData';
import { Command } from '../../../../types/command';
import { DatabaseStructure } from '../../../../types/database_structure.js';export const command: Command = {

    name: 'list-react',
    aliases: ['react-list', 'listreact', 'reactlist'],

    description: 'Show all specific messages saved to be react',
    description_localizations: {
        "fr": "Afficher tous les messages spécifiques enregistrés pour être réagis"
    },

    thinking: false,
    category: 'guildconfig',
    type: "PREFIX_IHORIZON_COMMAND",
    run: async (client: Client, interaction: Message, execTimestamp: number, args: string[]) => {


        let permission = interaction.member?.permissions?.has(PermissionsBitField.Flags.AddReactions);

        if (!permission) {
            return;
        };

        let data = await client.func.getLanguageData(interaction.guildId) as LanguageData;

        let all_specific_message: DatabaseStructure.DbGuildObject["REACT_MSG"] = await client.db.get(`${interaction.guildId}.GUILD.REACT_MSG`) || {};

        let currentPage = 0;

        let pages: string[] = [];

        Object.entries(all_specific_message).forEach(([key, value]) => {
            pages.push(`Quand une personne envoie **\`${key}\`**, je **réagis** avec ${value}\n`);
        });

        if (pages.length === 0) {
            await interaction.reply({ content: 'Aucune données as été trouvé, veuillez en ajouter avant.', allowedMentions: { repliedUser: false } });
            return;
        }

        let createEmbed = async () => {
            return new EmbedBuilder()
                .setColor(await client.db.get(`${interaction.guild?.id}.GUILD.GUILD_CONFIG.embed_color.all`) || "#000000")
                .setDescription(pages[currentPage])
                .setFooter({
                    text: data.prevnames_embed_footer_text
                        .replace("${currentPage + 1}", `${currentPage + 1}`)
                        .replace("${pages.length}", `${pages.length}`),
                    iconURL: "attachment://icon.png"
                })
                .setTimestamp()
        };

        let row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('previousPage')
                .setLabel('⬅️')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('nextPage')
                .setLabel('➡️')
                .setStyle(ButtonStyle.Secondary),
        );

        let messageEmbed = await interaction.reply({
            embeds: [await createEmbed()],
            components: [(row as ActionRowBuilder<ButtonBuilder>)],
            files: [{ attachment: await client.func.image64(client.user?.displayAvatarURL()), name: 'icon.png' }]
        });

        let collector = messageEmbed.createMessageComponentCollector({
            filter: async (i) => {
                await i.deferUpdate();
                return interaction.author.id === i.user.id;
            }, time: 60000
        });

        collector.on('collect', async (interaction: { customId: string; }) => {
            if (interaction.customId === 'previousPage') {
                currentPage = (currentPage - 1 + pages.length) % pages.length;
            } else if (interaction.customId === 'nextPage') {
                currentPage = (currentPage + 1) % pages.length;
            }

            messageEmbed.edit({ embeds: [await createEmbed()] });
        });

        collector.on('end', () => {
            row.components.forEach((component) => {
                if (component instanceof ButtonBuilder) {
                    component.setDisabled(true);
                }
            });
            messageEmbed.edit({ components: [(row as ActionRowBuilder<ButtonBuilder>)] });
        });
    },
};

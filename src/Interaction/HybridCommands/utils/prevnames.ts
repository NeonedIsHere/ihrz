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
    ApplicationCommandOptionType,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    ApplicationCommandType,
    MessagePayload,
    Message,
    InteractionEditReplyOptions,
    MessageReplyOptions
} from 'pwss'

import { Command } from '../../../../types/command';
import { LanguageData } from '../../../../types/languageData';

export const command: Command = {

    name: 'prevnames',

    description: 'Lookup an Discord User, and see this previous username !',
    description_localizations: {
        "fr": "Recherchez un utilisateur Discord et voyez ces noms d'utilisateur précédent"
    },

    aliases: ["pvnames", "pvname", "prevname"],

    options: [
        {
            name: 'user',
            type: ApplicationCommandOptionType.User,

            description: "L'utilisateur que vous voulez rechercher",
            description_localizations: {
                "fr": "user you want to see this previous username"
            },

            required: false
        },
    ],
    thinking: false,
    category: 'utils',
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: ChatInputCommandInteraction | Message, lang: LanguageData, runningCommand: any, execTimestamp?: number, args?: string[]) => {        // Guard's Typing
        // Guard's Typing
        if (!client.user || !interaction.member || !interaction.guild || !interaction.channel) return;

        if (interaction instanceof ChatInputCommandInteraction) {
            var user = interaction.options.getUser("user") || interaction.user;
        } else {
            var _ = await client.method.checkCommandArgs(interaction, command, args!, lang); if (!_) return;
            var user = await client.method.user(interaction, args!, 0) || interaction.member.user;
        };

        // if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        //     await client.method.interactionSend(interaction,{ content: lang.prevnames_not_admin });
        //     return;
        // };

        var table = client.db.table("PREVNAMES")
        var char: Array<string> = await table.get(`${user.id}`) || [];

        if (char.length == 0) {
            await client.method.interactionSend(interaction, { content: lang.prevnames_undetected });
            return;
        };

        let currentPage = 0;
        let usersPerPage = 5;
        let pages: { title: string; description: string; }[] = [];

        for (let i = 0; i < char.length; i += usersPerPage) {
            let pageUsers = char.slice(i, i + usersPerPage);
            let pageContent = pageUsers.map((userId) => userId).join('\n');
            pages.push({
                title: `${lang.prevnames_embed_title.replace("${user.username}", user.globalName as string)} | Page ${i / usersPerPage + 1}`,
                description: pageContent,
            });
        };

        let createEmbed = async () => {
            return new EmbedBuilder()
                .setColor(await client.db.get(`${interaction.guild?.id}.GUILD.GUILD_CONFIG.embed_color.audits-logs`) || "#000000")
                .setTitle(pages[currentPage].title)
                .setDescription(pages[currentPage].description)
                .setFooter({
                    text: lang.prevnames_embed_footer_text
                        .replace('${currentPage + 1}', (currentPage + 1).toString())
                        .replace('${pages.length}', pages.length.toString()),
                    iconURL: "attachment://footer_icon.png"
                })
                .setTimestamp()
        };

        let row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId('previousPage')
                .setLabel('⬅️')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('nextPage')
                .setLabel('➡️')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("trash-prevnames-embed")
                .setLabel('🗑️')
                .setStyle(ButtonStyle.Danger)
        );

        let messageEmbed = await client.method.interactionSend(interaction,{
            embeds: [await createEmbed()],
            components: [row],
            files: [await client.method.bot.footerAttachmentBuilder(interaction)]
        });

        let collector = messageEmbed.createMessageComponentCollector({
            filter: async (i) => {
                await i.deferUpdate();
                return interaction.member?.user.id === i.user.id;
            }, time: 60000
        });

        collector.on('collect', async (interaction_2: { customId: string; }) => {
            if (interaction_2.customId === 'previousPage') {

                currentPage = (currentPage - 1 + pages.length) % pages.length;

            } else if (interaction_2.customId === 'nextPage') {
                currentPage = (currentPage + 1) % pages.length;

            } else if (interaction_2.customId === 'trash-prevnames-embed') {

                if (interaction.member?.user.id === user.id) {
                    let table = client.db.table("PREVNAMES");

                    await table.delete(`${user.id}`);

                    messageEmbed.edit({
                        embeds: [],
                        components: [],
                        files: [],
                        content: lang.prevnames_data_erased
                    })
                    return;

                }
            };

            messageEmbed.edit({ embeds: [await createEmbed()] });
        });

        collector.on('end', async () => {
            await messageEmbed.edit({ components: [] });
        });

        return;
    },
};
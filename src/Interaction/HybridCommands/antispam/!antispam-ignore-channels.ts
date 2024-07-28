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
    ChannelSelectMenuBuilder,
    ChannelType,
    ChatInputCommandInteraction,
    Client,
    ComponentType,
    EmbedBuilder,
    InteractionEditReplyOptions,
    Message,
    MessagePayload,
    MessageReplyOptions,
    PermissionsBitField,
} from 'discord.js';
import { LanguageData } from '../../../../types/languageData';
import { AntiSpam } from '../../../../types/antispam';
import { SubCommandArgumentValue } from '../../../core/functions/method';

export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction | Message, lang: LanguageData, command: SubCommandArgumentValue, execTimestamp?: number, args?: string[]) => {
        // Guard's Typing
        if (!interaction.member || !client.user || !interaction.guild || !interaction.channel) return;

        const permissionsArray = [PermissionsBitField.Flags.Administrator]
        const permissions = interaction instanceof ChatInputCommandInteraction ?
            interaction.memberPermissions?.has(permissionsArray)
            : interaction.member.permissions.has(permissionsArray);

        if (!permissions) {
            await client.method.interactionSend(interaction, { content: lang.addmoney_not_admin });
            return;
        };

        let all_channels = await client.db.get(`${interaction.guildId}.GUILD.ANTISPAM.BYPASS_CHANNELS`) as AntiSpam.AntiSpamOptions['BYPASS_CHANNELS'];

        const embed = new EmbedBuilder()
            .setColor("#6666ff")
            .setTitle(lang.antispam_manage_embed_title)
            .setDescription(lang.antispam_ignorechannels_embed_desc)
            .setThumbnail(interaction.guild.iconURL({ forceStatic: false })!)
            .addFields({
                name: lang.joinghostping_add_ok_embed_fields_name,
                value: Array.isArray(all_channels) && all_channels.length > 0
                    ? all_channels.map(x => `<#${x}>`).join(', ')
                    : lang.setjoinroles_var_none
            })
            .setFooter(await client.method.bot.footerBuilder(interaction));

        const select = new ChannelSelectMenuBuilder()
            .setCustomId('antispam-select-config')
            .setPlaceholder(lang.help_select_menu)
            .setChannelTypes([ChannelType.GuildText, ChannelType.GuildForum, ChannelType.GuildMedia])
            .setMaxValues(25)
            .setMinValues(0);

        if (all_channels !== undefined && all_channels.length >= 1) {
            const channels: string[] = Array.isArray(all_channels) ? all_channels : [all_channels];
            select.setDefaultChannels(channels);
        };

        const button = new ButtonBuilder()
            .setStyle(ButtonStyle.Success)
            .setCustomId("antispam-manage-save-button")
            .setLabel(lang.antispam_manage_button_label);

        const originalResponse = await client.method.interactionSend(interaction, {
            embeds: [embed],
            components: [
                new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(select),
                new ActionRowBuilder<ButtonBuilder>().addComponents(button)
            ],
            files: [await client.method.bot.footerAttachmentBuilder(interaction)]
        });

        const collector = originalResponse.createMessageComponentCollector({
            componentType: ComponentType.ChannelSelect,
            time: 240_000,
        });

        const buttonCollector = originalResponse.createMessageComponentCollector({
            time: 240_000,
            componentType: ComponentType.Button,
        });

        let allchannel: string[] = [];

        buttonCollector.on('collect', async i => {
            if (i.user.id !== interaction.member?.user.id) {
                await i.reply({ content: lang.help_not_for_you, ephemeral: true });
                return;
            };

            await client.db.set(`${interaction.guildId}.GUILD.ANTISPAM.BYPASS_CHANNELS`, allchannel);

            await i.deferUpdate();

            collector.stop();
            buttonCollector.stop();
        });

        collector.on('collect', async (i) => {
            if (i.user.id !== interaction.member?.user.id) {
                await i.reply({ content: lang.help_not_for_you, ephemeral: true });
                return;
            };

            await i.deferUpdate();

            let values = i.values;

            embed.setFields({
                name: lang.joinghostping_add_ok_embed_fields_name,
                value: values.length === 0 ? lang.setjoinroles_var_none : values.map(x => `<#${x}>`).join(',')
            })

            allchannel = i.values;
            await client.method.interactionEdit(originalResponse as Message, { embeds: [embed] });
        });

        collector.on('end', async () => {
            await client.method.interactionEdit(originalResponse as Message, { components: [] });
        })
    },
};
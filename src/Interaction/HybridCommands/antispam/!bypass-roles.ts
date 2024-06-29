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
    ComponentType,
    EmbedBuilder,
    InteractionEditReplyOptions,
    Message,
    MessageEditOptions,
    MessagePayload,
    MessageReplyOptions,
    PermissionsBitField,
    RoleSelectMenuBuilder
} from 'pwss';
import { LanguageData } from '../../../../types/languageData';
import { AntiSpam } from '../../../../types/antispam';
import { SubCommandArgumentValue } from '../../../core/functions/arg';

export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction | Message, lang: LanguageData, command: SubCommandArgumentValue, execTimestamp?: number, args?: string[]) => {
        // Guard's Typing
        if (!interaction.member || !client.user || !interaction.guild || !interaction.channel) return;

        const permissionsArray = [PermissionsBitField.Flags.Administrator]
        const permissions = interaction instanceof ChatInputCommandInteraction ?
            interaction.memberPermissions?.has(permissionsArray)
            : interaction.member.permissions.has(permissionsArray);

        if (!permissions) {
            await client.args.interactionSend(interaction, { content: lang.addmoney_not_admin });
            return;
        };

        let all_roles = await client.db.get(`${interaction.guildId}.GUILD.ANTISPAM.BYPASS_ROLES`) as AntiSpam.AntiSpamOptions['BYPASS_ROLES'];

        const embed = new EmbedBuilder()
            .setColor("#6666ff")
            .setTitle(lang.antispam_manage_embed_title)
            .setDescription(lang.antispan_bypassroles_embed_desc)
            .setThumbnail(interaction.guild.iconURL({ forceStatic: false })!)
            .addFields({
                name: lang.setjoinroles_help_embed_fields_1_name,
                value: Array.isArray(all_roles) && all_roles.length > 0
                    ? all_roles.map(x => `<@&${x}>`).join(', ')
                    : lang.setjoinroles_var_none
            })
            .setFooter({
                text: await interaction.client.func.displayBotName(interaction.guildId),
                iconURL: interaction.client.user.displayAvatarURL({ forceStatic: false })
            });

        const select = new RoleSelectMenuBuilder()
            .setCustomId('antispam-select-config')
            .setPlaceholder(lang.help_select_menu)
            .setMinValues(0)
            .setMaxValues(20);

        if (all_roles !== undefined && all_roles.length >= 1) {
            const roles: string[] = Array.isArray(all_roles) ? all_roles : [all_roles];
            select.setDefaultRoles(roles);
        };

        const button = new ButtonBuilder()
            .setStyle(ButtonStyle.Success)
            .setCustomId("antispam-manage-save-button")
            .setLabel(lang.antispam_manage_button_label);

        const originalResponse = await client.args.interactionSend(interaction, {
            embeds: [embed],
            components: [
                new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(select),
                new ActionRowBuilder<ButtonBuilder>().addComponents(button)
            ]
        });

        const collector = originalResponse.createMessageComponentCollector({
            componentType: ComponentType.RoleSelect,
            time: 240_000,
        });

        const buttonCollector = originalResponse.createMessageComponentCollector({
            time: 240_000,
            componentType: ComponentType.Button,
        });

        let allroles: string[] = [];

        buttonCollector.on('collect', async i => {
            if (i.user.id !== interaction.member?.user.id) {
                await i.reply({ content: lang.help_not_for_you, ephemeral: true });
                return;
            };

            await client.db.set(`${interaction.guildId}.GUILD.ANTISPAM.BYPASS_ROLES`, allroles);

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
                name: lang.setjoinroles_help_embed_fields_1_name,
                value: values.length === 0 ? lang.setjoinroles_var_none : values.map(x => `<@&${x}>`).join(',')
            })

            allroles = i.values;
            await client.args.interactionEdit(originalResponse as Message, { embeds: [embed] });
        });

        collector.on('end', async () => {
            await client.args.interactionEdit(originalResponse as Message, { components: [] });
        })
    },
};
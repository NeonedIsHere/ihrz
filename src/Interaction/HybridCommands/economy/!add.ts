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
    User,
} from 'pwss';
import { LanguageData } from '../../../../types/languageData';
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

        if (await client.db.get(`${interaction.guildId}.ECONOMY.disabled`) === true) {
            await client.args.interactionSend(interaction,{
                content: lang.economy_disable_msg
                    .replace('${interaction.user.id}', interaction.member.user.id)
            });
            return;
        };

        if (interaction instanceof ChatInputCommandInteraction) {
            var amount = interaction.options.getNumber("amount") as number;
            var user = interaction.options.getUser("member") as User;
        } else {
            var _ = await client.args.checkCommandArgs(interaction, command, args!, lang); if (!_) return;
            var amount = client.args.number(args!, 0) as number;
            var user = client.args.user(interaction, 0) as User;
        };

        await client.args.interactionSend(interaction,{
            content: lang.addmoney_command_work
                .replace("${user.user.id}", user.id)
                .replace("${amount.value}", amount.toString())
        });

        await client.db.add(`${interaction.guildId}.USER.${user.id}.ECONOMY.money`, amount);

        try {
            let logEmbed = new EmbedBuilder()
                .setColor("#bf0bb9")
                .setTitle(lang.addmoney_logs_embed_title)
                .setDescription(lang.addmoney_logs_embed_description
                    .replace(/\${interaction\.user\.id}/g, interaction.member.user.id)
                    .replace(/\${amount\.value}/g, amount.toString())
                    .replace(/\${user\.user\.id}/g, user.id)
                );

            let logchannel = interaction.guild.channels.cache.find((channel: { name: string; }) => channel.name === 'ihorizon-logs');
            if (logchannel) { (logchannel as BaseGuildTextChannel).send({ embeds: [logEmbed] }) }
        } catch (e) { return; };
    },
};
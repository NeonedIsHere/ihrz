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
    AttachmentBuilder,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    Message,
    PermissionsBitField,
    time
} from 'discord.js';

import { LanguageData } from '../../../../types/languageData';
import { Command } from '../../../../types/command';
import { Option } from '../../../../types/option';

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

        let giveawaylang = client.giveawaysManager.getAllGiveawayData();
        let filtered = giveawaylang.filter((giveaway) => giveaway.giveawayData.guildId === interaction.guildId && !giveaway.giveawayData.ended);

        let embed = new EmbedBuilder()
            .setColor("#2986cc")
            .setTimestamp()
            .setTitle(lang.gw_getall_embed_title
                .replace('${interaction.guild?.name}', interaction.guild.name as string)
            )
            .setAuthor(
                {
                    name: (interaction.guild.name as string),
                    iconURL: "attachment://guild_icon.png"
                }
            )
            .setFooter(await client.method.bot.footerBuilder(interaction));

        filtered.forEach(index => {
            let Channel = `<#${index.giveawayData.channelId}>`;
            let MessageURL = `https://discord.com/channels/${interaction.guildId}/${index.giveawayData.channelId}/${index.giveawayId}`;
            let ExpireIn = `${time(new Date(index.giveawayData.expireIn), 'd')}`;

            embed.addFields(
                {
                    name: `\`${index.giveawayId}\``,
                    value: lang.gw_getall_embed_fields
                        .replace('${MessageURL}', MessageURL)
                        .replace('${ExpireIn}', ExpireIn)
                        .replace('${Channel}', Channel)
                }
            );
        });

        await client.method.interactionSend(interaction,
            {
                embeds: [embed],
                files: [
                    {
                        attachment: await interaction.client.func.image64(interaction.guild.iconURL() || client.user.displayAvatarURL()),
                        name: 'guild_icon.png'
                    }, await interaction.client.method.bot.footerAttachmentBuilder(interaction)
                ],
            }
        );

        return;
    },
};
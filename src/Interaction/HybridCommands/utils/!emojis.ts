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
    ApplicationCommandOptionType,
    EmbedBuilder,
    PermissionsBitField,
    ChatInputCommandInteraction,
    ApplicationCommandType,
    Message,
    MessagePayload,
    InteractionEditReplyOptions,
    MessageReplyOptions
} from 'discord.js'

import { LanguageData } from '../../../../types/languageData';

import { Command } from '../../../../types/command';
import { Option } from '../../../../types/option';

export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction<"cached"> | Message, lang: LanguageData, command: Option | Command | undefined, neededPerm: number, args?: string[]) => {


        // Guard's Typing
        if (!client.user || !interaction.member || !interaction.guild || !interaction.channel) return;

        if (interaction instanceof ChatInputCommandInteraction) {
            var str = (interaction.options.getString('emojis') as string).split(' ');
        } else {
            var str = args!
        };

        let cnt: number = 0;
        let nemj: string = '';


        const permissionsArray = [PermissionsBitField.Flags.Administrator]
        const permissions = interaction instanceof ChatInputCommandInteraction ?
            interaction.memberPermissions?.has(permissionsArray)
            : interaction.member.permissions.has(permissionsArray);

        if (!permissions && neededPerm === 0) {
            await client.method.interactionSend(interaction, { content: lang.punishpub_not_admin });
            return;
        };

        for (let emoji of str) {
            let match = emoji.match(/:(\w+):(\d+)>/);
            if (match) {
                let isAnimated = emoji.startsWith('<a:');

                await interaction.guild?.emojis.create({
                    attachment: `https://cdn.discordapp.com/emojis/${match[2]}.${isAnimated ? 'gif' : 'png'}`,
                    name: match[1]
                }).then((emoji) => {
                    client.method.channelSend(interaction, lang.emoji_send_new_emoji
                        .replace('${emoji.name}', emoji.name!)
                        .replace('${emoji}', emoji.toString())
                    );

                    cnt++;
                    nemj += `<${isAnimated ? 'a:' : ':'}${emoji.name}:${emoji.id}>`
                }).catch(() => {
                    client.method.channelSend(interaction, lang.emoji_send_err_emoji
                        .replace('${emoji.name}', emoji)
                    );
                });
            }
        }

        let embed = new EmbedBuilder()
            .setColor('#bea9de')
            .setFooter(await client.method.bot.footerBuilder(interaction))
            .setTimestamp()
            .setDescription(lang.emoji_embed_desc_work
                .replace('${cnt}', cnt.toString())
                .replace('${interaction.guild.name}', interaction.guild?.name!)
                .replace('${nemj}', nemj)
            )

        await client.method.interactionSend(interaction, {
            embeds: [embed],
            files: [await interaction.client.method.bot.footerAttachmentBuilder(interaction)]
        });
        return;
    },
};
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
    PermissionsBitField,
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    Role,
    Guild,
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
            var action = interaction.options.getString("action");
            var role = interaction.options.getRole("role");
        } else {
            
            var action = client.method.string(args!, 0);
            var role = client.method.role(interaction, args!, 0);
        };

        let a: number = 0;
        let s: number = 0;
        let e: number = 0;

        const permissionsArray = [PermissionsBitField.Flags.Administrator]
        const permissions = interaction instanceof ChatInputCommandInteraction ?
            interaction.memberPermissions?.has(permissionsArray)
            : interaction.member.permissions.has(permissionsArray);

        if (!permissions && neededPerm === 0) {
            await client.method.interactionSend(interaction, { content: lang.punishpub_not_admin });
            return;
        };

        if ((interaction.guild as Guild).memberCount >= 1500) {
            await client.method.interactionSend(interaction, { content: lang.massiverole_too_much_member });
            return;
        };

        if (action === 'add') {

            try {
                let members = await interaction.guild.members.fetch();
                let promises = [];

                for (let [memberID, member] of members!) {
                    if (!member.roles.cache.has(role?.id!)) {
                        let promise = member.roles.add(role as Role)
                            .then(() => {
                                a++;
                            })
                            .catch(() => {
                                e++;
                            });
                        promises.push(promise);
                    } else {
                        s++;
                    }
                };

                await Promise.all(promises);
            } catch (error) { };

            let embed = new EmbedBuilder()
                .setFooter(await client.method.bot.footerBuilder(interaction))
                .setColor(await client.db.get(`${interaction.guild?.id}.GUILD.GUILD_CONFIG.embed_color.utils-cmd`) || '#007fff')
                .setTimestamp()
                .setThumbnail(interaction.guild.iconURL())
                .setDescription(lang.massiverole_add_command_work
                    .replace('${interaction.user}', interaction.member.user.toString())
                    .replace('${a}', a.toString())
                    .replace('${s}', s.toString())
                    .replace('${e}', e.toString())
                    .replaceAll('${role}', role?.toString()!)
                );

            await client.method.interactionSend(interaction, {
                embeds: [embed],
                files: [await interaction.client.method.bot.footerAttachmentBuilder(interaction)]
            });
            return;
        } else if (action === 'sub') {

            try {
                let members = await interaction.guild.members.fetch();
                let promises = [];

                for (let [memberID, member] of members!) {
                    if (member.roles.cache.has(role?.id!)) {
                        let promise = member.roles.remove(role as Role)
                            .then(() => {
                                a++;
                            })
                            .catch(() => {
                                e++;
                            });
                        promises.push(promise);
                    } else {
                        s++;
                    }
                };

                await Promise.all(promises);
            } catch (error) { };

            let embed = new EmbedBuilder()
                .setFooter(await client.method.bot.footerBuilder(interaction))
                .setColor(await client.db.get(`${interaction.guild?.id}.GUILD.GUILD_CONFIG.embed_color.utils-cmd`) || '#007fff')
                .setTimestamp()
                .setThumbnail(interaction.guild.iconURL())
                .setDescription(lang.massiverole_sub_command_work
                    .replace('${interaction.user}', interaction.member.user.toString())
                    .replace('${a}', a.toString())
                    .replace('${s}', s.toString())
                    .replace('${e}', e.toString())
                    .replaceAll('${role}', role?.toString()!)
                );

            await client.method.interactionSend(interaction, {
                embeds: [embed],
                files: [await client.method.bot.footerAttachmentBuilder(interaction)]
            });
            return;
        };

        return;
    },
};
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
    ApplicationCommandType,
    Message,
    MessagePayload,
    InteractionEditReplyOptions,
    MessageReplyOptions
} from 'discord.js'

import { Command } from '../../../../types/command';
import { LanguageData } from '../../../../types/languageData';


export const command: Command = {
    name: 'nickrole',

    description: 'Give a roles to all user who have specified char in their username!',
    description_localizations: {
        "fr": "Donnez un rôle à tous les utilisateurs qui ont un caractère spécifique dans leur nom d'utilisateur"
    },

    options: [
        {
            name: 'action',
            type: ApplicationCommandOptionType.String,

            description: 'The action you want to do',
            description_localizations: {
                "fr": "L'action que vous souhaitez faire"
            },

            required: true,
            choices: [
                {
                    name: 'Add',
                    value: 'add'
                },
                {
                    name: 'Remove',
                    value: 'sub'
                }
            ]
        },
        {
            name: 'nickname',
            type: ApplicationCommandOptionType.String,

            description: 'The part including in the nickname',
            description_localizations: {
                "fr": "La partie incluant dans le pseudo"
            },

            required: true,
        },
        {
            name: 'role',
            type: ApplicationCommandOptionType.Role,

            description: 'The role you want to give',
            description_localizations: {
                "fr": "Le rôle que vous souhaitez donner"
            },

            required: true,
        },
    ],
    thinking: true,
    category: 'utils',
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: ChatInputCommandInteraction | Message, lang: LanguageData, runningCommand: any, execTimestamp?: number, args?: string[]) => {        // Guard's Typing
        // Guard's Typing
        if (!client.user || !interaction.member || !interaction.guild || !interaction.channel) return;

        if (interaction instanceof ChatInputCommandInteraction) {
            var action_1 = interaction.options.getString("action");
            var part_of_nickname = interaction.options.getString("nickname")?.toLowerCase();
            var role = interaction.options.getRole('role');
        } else {
            var _ = await client.method.checkCommandArgs(interaction, command, args!, lang); if (!_) return;
            var action_1 = client.method.string(args!, 0);
            var part_of_nickname = client.method.string(args!, 1)?.toLowerCase();
            var role = client.method.role(interaction, args!, 0);
        };

        if (!part_of_nickname || !role) return;
        let a: number = 0;
        let s: number = 0;
        let e: number = 0;

        const permissionsArray = [PermissionsBitField.Flags.Administrator]
        const permissions = interaction instanceof ChatInputCommandInteraction ?
            interaction.memberPermissions?.has(permissionsArray)
            : interaction.member.permissions.has(permissionsArray);

        if (!permissions) {
            await client.method.interactionSend(interaction, { content: lang.punishpub_not_admin });
            return;
        }

        if (action_1 === 'add') {

            try {
                let members = await interaction.guild.members.fetch();
                let promises = [];

                for (let [memberID, member] of members!) {
                    if (
                        (
                            member.user.globalName?.toLowerCase().includes(part_of_nickname)
                            || (member.nickname && member.nickname.toLowerCase().includes(part_of_nickname))
                        )
                        && !member.roles.cache.has(role?.id!)
                    ) {
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
            } catch (error) { }

            let embed = new EmbedBuilder()
                .setFooter(await client.method.bot.footerBuilder(interaction))
                .setColor(await client.db.get(`${interaction.guild?.id}.GUILD.GUILD_CONFIG.embed_color.utils-cmd`) || '#007fff')
                .setTimestamp()
                .setThumbnail(interaction.guild.iconURL())
                .setDescription(lang.nickrole_add_command_work
                    .replace('${interaction.user}', interaction.member.user.toString())
                    .replace('${a}', a.toString())
                    .replace('${s}', s.toString())
                    .replace('${e}', e.toString())
                    .replace('${part_of_nickname}', part_of_nickname)
                    .replaceAll('${role}', role?.toString()!)
                );

            await client.method.interactionSend(interaction, {
                embeds: [embed],
                files: [await client.method.bot.footerAttachmentBuilder(interaction)]
            });
            return;

        } else if (action_1 === 'sub') {
            try {
                let members = await interaction.guild?.members.fetch();
                let promises = [];

                for (let [memberID, member] of members!) {
                    if (
                        (
                            member.user.globalName?.toLowerCase().includes(part_of_nickname)
                            || (member.nickname && member.nickname.toLowerCase().includes(part_of_nickname))
                        )
                        && member.roles.cache.has(role?.id!)
                    ) {
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
            } catch (error) { }

            let embed = new EmbedBuilder()
                .setFooter(await client.method.bot.footerBuilder(interaction))
                .setColor(await client.db.get(`${interaction.guild?.id}.GUILD.GUILD_CONFIG.embed_color.utils-cmd`) || '#007fff')
                .setTimestamp()
                .setThumbnail(interaction.guild.iconURL())
                .setDescription(lang.nickrole_sub_command_work
                    .replace('${interaction.user}', interaction.member.user.toString())
                    .replace('${a}', a.toString())
                    .replace('${s}', s.toString())
                    .replace('${e}', e.toString())
                    .replace('${part_of_nickname}', part_of_nickname)
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
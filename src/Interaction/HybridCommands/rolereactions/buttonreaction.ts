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
    BaseGuildTextChannel,
    ApplicationCommandType,
    Message,
    ButtonBuilder,
    ButtonStyle
} from 'discord.js'

import { Command } from '../../../../types/command.js';
import logger from '../../../core/logger.js';
import { LanguageData } from '../../../../types/languageData.js';
import { DatabaseStructure } from '../../../../types/database_structure.js';

export const command: Command = {
    name: 'buttonreaction',

    description: 'Set a roles when user react to a button with specific emoji',
    description_localizations: {
        "fr": "Définir des rôles lorsque l'utilisateur réagit à un message avec un boutton spécifique"
    },

    aliases: ["btnreact"],
    options: [
        {
            name: "value",

            description: "Please make your choice.",
            description_localizations: {
                "fr": "Merci de faire votre choix"
            },

            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "Add another",
                    value: "add"
                },
                {
                    name: "Remove one",
                    value: "remove"
                }
            ]
        },
        {
            name: 'messageid',
            type: ApplicationCommandOptionType.String,

            description: "Please copy the identifiant of the message you want to configure",
            description_localizations: {
                "fr": "Veuillez copier l'identifiant du message que vous souhaitez configurer"
            },

            required: true
        },
        {
            name: 'reaction',
            type: ApplicationCommandOptionType.String,

            description: `The emojis you want`,
            description_localizations: {
                "fr": "Les emojis que tu veux"
            },

            required: false
        },
        {
            name: 'role',
            type: ApplicationCommandOptionType.Role,

            description: 'The role you want to configure',
            description_localizations: {
                "fr": "Le rôle que vous souhaitez configurer"
            },

            required: false
        }
    ],
    category: 'rolereactions',
    thinking: false,
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: ChatInputCommandInteraction<"cached"> | Message, lang: LanguageData, runningCommand: any, execTimestamp?: number, args?: string[]) => {
        let permCheck = await client.method.permission.checkCommandPermission(interaction, command!);
        if (!permCheck.allowed) return client.method.permission.sendErrorMessage(interaction, lang, permCheck.neededPerm || 0);

        // Guard's Typing
        if (!client.user || !interaction.member || !interaction.guild || !interaction.channel) return;

        const regex = /<a?:\w+:(\d+)>/;
        const permissionsArray = [PermissionsBitField.Flags.Administrator]
        const permissions = interaction instanceof ChatInputCommandInteraction ?
            interaction.memberPermissions?.has(permissionsArray)
            : interaction.member.permissions.has(permissionsArray);

        if (!permissions && permCheck.neededPerm === 0) {
            await client.method.interactionSend(interaction, { content: lang.reactionroles_dont_admin_added });
            return;
        };

        if (interaction instanceof ChatInputCommandInteraction) {
            var type = interaction.options.getString("value");
            var messagei = interaction.options.getString("messageid");
            var reaction = interaction.options.getString("reaction");
            var role = interaction.options.getRole("role");
        } else {
            var _ = await client.method.checkCommandArgs(interaction, command, args!, lang); if (!_) return;
            var type = client.method.string(args!, 0);
            var messagei = client.method.string(args!, 1);
            var reaction = client.method.string(args!, 2);
            var role = client.method.role(interaction, args!, 0);
        }

        let match = reaction?.match(regex);
        reaction = match ? match[1] : reaction;

        if (type == "add") {
            if (!role) { return await client.method.interactionSend(interaction, { content: lang.buttonreaction_roles_not_found }); };
            if (!reaction) { return await client.method.interactionSend(interaction, { content: lang.reactionroles_missing_reaction_added }) };

            await interaction.channel.messages.fetch(messagei!)
                .then(async msg => {
                    if (msg?.author.id !== client.user?.id) {
                        return await client.method.interactionSend(interaction, { content: lang.buttonreaction_message_other_user_error });
                    }

                    await client.method.buttonReact(msg, new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId(`button_reaction%${role?.id}`).setEmoji(reaction!))
                        .then(async () => {
                            if (!reaction) return;

                            if (reaction.includes("<") || reaction.includes(">") || reaction.includes(":")) {
                                await client.method.interactionSend(interaction, {
                                    content: lang.reactionroles_invalid_emote_format_added.replace("${client.iHorizon_Emojis.icon.No_Logo}", client.iHorizon_Emojis.icon.No_Logo)
                                })
                                return;
                            };

                            await client.db.set(`${interaction.guildId}.GUILD.REACTION_ROLES.${messagei}.button_reaction%${role?.id}`,
                                {
                                    rolesID: role?.id, reactionNAME: reaction, enable: true
                                }
                            );

                            await client.method.iHorizonLogs.send(interaction, {
                                title: lang.buttonreaction_logs_embed_title_added,
                                description: lang.buttonreaction_logs_embed_description_added
                                    .replace("${interaction.user.id}", interaction.member?.user.id!)
                                    .replace("${messagei}", messagei!)
                                    .replace("${reaction}", reaction)
                                    .replace("${role}", role?.toString()!)
                            });

                            await client.method.interactionSend(interaction, {
                                content: lang.reactionroles_command_work_added
                                    .replace("${messagei}", messagei!)
                                    .replace("${reaction}", reaction)
                                    .replace("${role}", role?.toString()!)
                                , ephemeral: true
                            });
                        })
                        .catch(async () => {
                            await client.method.interactionSend(interaction, { content: lang.buttonreaction_dont_message_found });
                            return;
                        })

                })
                .catch(async () => {
                    await client.method.interactionSend(interaction, { content: lang.reactionroles_cant_fetched_reaction_remove })
                    return;
                });
            return;
        } else if (type == "remove") {

            if (!reaction) {
                await client.method.interactionSend(interaction, { content: lang.reactionroles_missing_remove });
                return;
            };

            await interaction.channel.messages.fetch(messagei!)
                .then(async (message) => {
                    let res = await client.db.get(`${interaction.guildId}.GUILD.REACTION_ROLES.${message.id}`) as DatabaseStructure.ReactionRolesData[""];
                    let fetched = Object.values(res).find(x => x.reactionNAME === reaction);

                    if (!fetched) {
                        await client.method.interactionSend(interaction, { content: lang.reactionroles_missing_reaction_remove });
                        return
                    };

                    let reactionVar = await client.method.buttonUnreact(message, reaction!)

                    if (!reactionVar) {
                        await client.method.interactionSend(interaction, { content: lang.reactionroles_cant_fetched_reaction_remove })
                        return;
                    };

                    await client.db.delete(`${interaction.guildId}.GUILD.REACTION_ROLES.${messagei}.button_reaction%${fetched.rolesID}`);

                    await client.method.iHorizonLogs.send(interaction, {
                        title: lang.reactionroles_logs_embed_title_remove,
                        description: lang.reactionroles_logs_embed_description_remove
                            .replace("${interaction.user.id}", String(interaction.member?.user.id))
                            .replace("${messagei}", messagei!)
                            .replace("${reaction}", reaction!)
                    });

                    await client.method.interactionSend(interaction, {
                        content: lang.reactionroles_command_work_remove
                            .replace("${reaction}", reaction!)
                            .replace("${messagei}", messagei!)
                        , ephemeral: true
                    });
                    return;

                })
                .catch(async (err) => {
                    console.error(err)
                    await client.method.interactionSend(interaction, { content: lang.reactionroles_cant_fetched_reaction_remove })
                    return;
                });

        };
    },
};
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
    ChatInputCommandInteraction,
    ApplicationCommandType,
    Message,
    EmbedBuilder,
} from 'pwss';

import { Command } from '../../../../types/command';
import { LanguageData } from '../../../../types/languageData';
import { SubCommandArgumentValue } from '../../../core/functions/arg';

export const command: Command = {
    name: "ranks",

    description: "Subcommand for ranks category!",
    description_localizations: {
        "fr": "Commande sous-groupé pour la catégorie de niveau (message)"
    },

    options: [
        {
            name: "ranks-disable",
            name_localizations: {
                "fr": "statut"
            },

            description: "Disable the message when user earn new xp level message!",
            description_localizations: {
                "fr": "Désactivez le message lorsque l'utilisateur gagne un nouveau message de niveau XP"
            },

            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'action',
                    type: ApplicationCommandOptionType.String,

                    description: 'What you want to do?',
                    description_localizations: {
                        "fr": "Que voulez-vous faire ?"
                    },

                    required: true,
                    choices: [
                        {
                            name: 'Power On the module (send message when user earn xp level)',
                            value: "on"
                        },
                        {
                            name: "Power Off the module (don't send any message but user still earn xp level)",
                            value: "off"
                        },
                        {
                            name: "Disable the module (don't send any message and user don't earn xp level)",
                            value: "disable"
                        },
                    ],
                },
            ],
        },
        {
            name: "show-ranks",
            name_localizations: {
                "fr": "afficher"
            },

            description: "Get the user's xp level!",
            description_localizations: {
                "fr": "Obtenez le niveau XP de l'utilisateur"
            },

            aliases: ["see", "sh", "look"],

            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    type: ApplicationCommandOptionType.User,

                    description: 'The user you want to lookup, keep blank if you want to show your stats',
                    description_localizations: {
                        "fr": "L'utilisateur que vous souhaitez rechercher."
                    },

                    required: false
                }
            ],
        },
        {
            name: "ranks-channel",
            name_localizations: {
                "fr": "définir-cannal"
            },

            description: "Set the channel where user earn new xp level message!",
            description_localizations: {
                "fr": "Définir le canal sur lequel l'utilisateur gagne un nouveau message de niveau XP"
            },

            aliases: ["channel", "chann"],

            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'action',
                    type: ApplicationCommandOptionType.String,

                    description: 'What you want to do?',
                    description_localizations: {
                        "fr": "Que voulez-vous faire ?"
                    },

                    required: true,
                    choices: [
                        {
                            name: "Remove the module (send xp message on the user's message channel)",
                            value: "off"
                        },
                        {
                            name: 'Power on the module (send xp message on a specific channel)',
                            value: "on"
                        }
                    ],
                },
                {
                    name: 'channel',
                    type: ApplicationCommandOptionType.Channel,

                    description: 'The specific channel for xp message !',
                    description_localizations: {
                        "fr": "Le canal spécifique pour le message XP"
                    },

                    required: false
                }
            ],
        },
        {
            name: "ranks-leaderboard",
            name_localizations: {
                "fr": "classement"
            },

            description: "Get the xp's leaderboard of the guild!",
            description_localizations: {
                "fr": "Obtenez le classement XP du serveur"
            },

            aliases: ["rankslb"],

            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "ranks-ignore-channels",

            description: "Ignore this channels in the Ranks Module",
            description_localizations: {
                "fr": "Ignorer des salons afin que le module de Rangs ne l'ai prennent pas en compte"
            },

            aliases: ["ignore"],

            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "ranks-message",

            description: "Set a custom message when user earn level",
            description_localizations: {
                "fr": "Définir un message personalisé quand un membre gagne un niveaus"
            },

            aliases: ["msg"],

            type: ApplicationCommandOptionType.Subcommand,
        },
    ],
    thinking: false,
    category: 'ranks',
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: ChatInputCommandInteraction | Message, lang: LanguageData, runningCommand: SubCommandArgumentValue, execTimestamp?: number, options?: string[]) => {
        let fetchedCommand;
        let sub: SubCommandArgumentValue | undefined;

        if (interaction instanceof ChatInputCommandInteraction) {
            fetchedCommand = interaction.options.getSubcommand();
        } else {
            if (!options?.[0]) {
                await client.args.interactionSend(interaction, { embeds: [await client.args.createAwesomeEmbed(lang, command, client, interaction)] });
                return;
            }
            const cmd = command.options?.find(x => options[0] === x.name || x.aliases?.includes(options[0]));
            sub = { name: command.name, command: cmd };
            if (!cmd) return;

            fetchedCommand = cmd.name;
            options.shift();
        }

        const commandModule = await import(`./!${fetchedCommand}.js`);
        await commandModule.default.run(client, interaction, lang, sub, execTimestamp, options);
    },
};
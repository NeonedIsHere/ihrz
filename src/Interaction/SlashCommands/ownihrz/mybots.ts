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
} from 'discord.js';

import { LanguageData } from '../../../../types/languageData';
import { Command } from '../../../../types/command';
import { getConfig } from '../../../core/core.js';

export const command: Command = {
    name: "mybots",

    description: "Host your own iHorizon!",
    description_localizations: {
        "fr": "Hébergez votre propre iHorizon avec cette commande !"
    },

    options: [
        {
            name: "submit",

            description: "Submit for the creation of your own iHorizon!",
            description_localizations: {
                "fr": "Soumettre pour la création de votre propre iHorizon"
            },

            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'discord_bot_token',
                    type: ApplicationCommandOptionType.String,

                    description: 'The token of your discord bot!',
                    description_localizations: {
                        "fr": "Le token de votre bot Discord"
                    },

                    required: true
                },
                {
                    name: 'prefix',
                    type: ApplicationCommandOptionType.String,

                    description: 'The prefix of the bot',
                    description_localizations: {
                        "fr": "Le préfixe du bot (Optionnel)"
                    },

                    required: true
                },
                {
                    name: 'owner_two',
                    type: ApplicationCommandOptionType.User,

                    description: 'The second owner of your own discord bot!',
                    description_localizations: {
                        "fr": "Le second propriétaire de votre propre iHorizon (Optionnel)"
                    },

                    required: false
                }
            ],
        },
        {
            name: "change-token",

            description: "Change the token of your own iHorizon!",
            description_localizations: {
                "fr": "Changer le token de votre propre iHorizon"
            },

            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'botid',
                    type: ApplicationCommandOptionType.String,

                    description: 'Identifiant of your own iHorizon!',
                    description_localizations: {
                        "fr": "l'identifiant de votre propre iHorizon"
                    },

                    required: true
                },
                {
                    name: 'new_discord_bot_token',
                    type: ApplicationCommandOptionType.String,

                    description: 'The new token of your discord bot!',
                    description_localizations: {
                        "fr": "Le nouveau token de votre bot Discord"
                    },

                    required: true
                },
            ],
        },
        {
            name: "change-owner",

            description: "Change the owner of your own iHorizon!",
            description_localizations: {
                "fr": "Changer les propriétaire de votre ownihrz"
            },

            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'botid',
                    type: ApplicationCommandOptionType.String,

                    description: 'Identifiant of your own iHorizon!',
                    description_localizations: {
                        "fr": "l'identifiant de votre propre iHorizon"
                    },

                    required: true
                },
                {
                    name: 'owner_one',
                    type: ApplicationCommandOptionType.User,

                    description: 'The new first owner of your own discord bot!',
                    description_localizations: {
                        "fr": "Le nouveau premier propriétaire de votre propre iHorizon"
                    },

                    required: true
                },
                {
                    name: 'owner_two',
                    type: ApplicationCommandOptionType.User,

                    description: 'The second owner of your own discord bot!',
                    description_localizations: {
                        "fr": "Le nouveau second propriétaire de votre propre iHorizon (Optionnel)"
                    },

                    required: false
                }
            ],
        },
        {
            name: "list",

            description: "List your bot",
            description_localizations: {
                "fr": "Afficher tout vos bot(s) iHorizon personaliser"
            },

            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "manage",

            description: "Only for owner",
            description_localizations: {
                "fr": "Seulement pour les propriétaire d'iHorizon"
            },

            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "accept",

                    description: "Only for owner",
                    description_localizations: {
                        "fr": "Seulement pour les propriétaire d'iHorizon"
                    },

                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'id',
                            type: ApplicationCommandOptionType.String,

                            description: 'The id of the bot to accept their host!',
                            description_localizations: {
                                "fr": "L'identifiant du bot pour accepter son hébergement"
                            },

                            required: true
                        },
                        {
                            name: 'cluster',
                            type: ApplicationCommandOptionType.String,

                            description: 'The cluster where you want to host the bot!',
                            description_localizations: {
                                "fr": "Le cluster où seras localisé l'ownihrz"
                            },
                            choices: Object.entries(getConfig().core.cluster).map(([key, value]) => ({
                                name: `Cluster #${key}`,
                                value: key,
                            })),
                            required: true
                        }
                    ],
                },
                {
                    name: "deny",

                    description: "Only for owner",
                    description_localizations: {
                        "fr": "Seulement pour les propriétaire d'iHorizon"
                    },

                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'id',
                            type: ApplicationCommandOptionType.String,

                            description: 'The id of the bot to deny their host!',
                            description_localizations: {
                                "fr": "L'identifiant du bot pour refuser son hébergement"
                            },

                            required: true
                        }
                    ],
                },
                {
                    name: 'instance',
                    type: ApplicationCommandOptionType.Subcommand,

                    description: 'Only for owner',
                    description_localizations: {
                        "fr": "Seulement pour les propriétaire d'iHorizon"
                    },

                    options: [
                        {
                            name: 'action',
                            type: ApplicationCommandOptionType.String,

                            description: 'What do you want to do',
                            description_localizations: {
                                "fr": "Qu'est-ce que vous voulez faire"
                            },

                            choices: [
                                {
                                    name: 'Shutdown',
                                    value: 'shutdown'
                                },
                                {
                                    name: 'Power On',
                                    value: 'poweron'
                                },
                                {
                                    name: 'Delete',
                                    value: 'delete'
                                },
                                {
                                    name: 'Add time (Expire Date)',
                                    value: 'add-expire'
                                },
                                {
                                    name: 'Remove time (Expire Date)',
                                    value: 'sub-expire'
                                },
                                {
                                    name: 'List All',
                                    value: 'ls'
                                }
                            ],
                            required: true
                        },
                        {
                            name: 'id',
                            type: ApplicationCommandOptionType.String,

                            description: 'The id of the bot to manage !',
                            description_localizations: {
                                "fr": "L'identifiant du bot à gérer"
                            },

                            required: false
                        },
                        {
                            name: 'time',
                            type: ApplicationCommandOptionType.String,

                            description: 'The time to add/remove for the expire Date !',
                            description_localizations: {
                                "fr": "L'heure à ajouter/supprimer pour la date d'expiration"
                            },

                            required: false
                        }
                    ]
                },
            ],
        },
    ],
    thinking: false,
    category: 'ownihrz',
    type: ApplicationCommandType.ChatInput,

};
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
} from 'discord.js';

import { LanguageData } from '../../../../types/languageData';
import { Command } from '../../../../types/command';
import { Option } from '../../../../types/option';

export const command: Command = {
    name: "economy",
    name_localizations: {
        "fr": "économie"
    },

    description: "Subcommand for economy category!",
    description_localizations: {
        "fr": "Commande sous-groupé pour la catégorie d'économie"
    },

    options: [
        {
            name: 'balance-add',

            description: 'Add money to a user!',
            description_localizations: {
                "fr": "Ajoutez de l'argent à un utilisateur"
            },

            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'amount',
                    type: ApplicationCommandOptionType.Number,

                    description: 'The amount of money you want to add',
                    description_localizations: {
                        "fr": "Le montant d'argent que vous souhaitez ajouter"
                    },

                    required: true
                },
                {
                    name: 'member',
                    type: ApplicationCommandOptionType.User,

                    description: 'The member who you want to add money',
                    description_localizations: {
                        "fr": "Le membre à qui vous souhaitez ajouter de l'argent"
                    },

                    required: true
                }
            ],
        },
        {
            name: 'balance-remove',

            description: 'Remove money from a user!',
            description_localizations: {
                "fr": "Retirer de l'argent à un utilisateur"
            },

            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'amount',
                    type: ApplicationCommandOptionType.Number,

                    description: 'amount of $ you want add',
                    description_localizations: {
                        "fr": "montant de $ que vous souhaitez ajouter"
                    },

                    required: true
                },
                {
                    name: 'member',
                    type: ApplicationCommandOptionType.User,

                    description: 'the member you want to add the money',
                    description_localizations: {
                        "fr": "le membre auquel vous souhaitez ajouter de l'argent"
                    },

                    required: true
                }
            ],
        },
        {
            name: 'balance',

            description: 'Get the balance of a user!',
            description_localizations: {
                "fr": "Obtenir le solde d'un utilisateur"
            },

            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    type: ApplicationCommandOptionType.User,

                    description: 'Target a user for see their current balance or keep blank for yourself',
                    description_localizations: {
                        "fr": "Ciblez un utilisateur pour voir son solde actuel"
                    },

                    required: false
                }
            ],
        },
        {
            name: "economy-disable",

            description: "Disable the economy module into your guild",
            description_localizations: {
                "fr": "Désactiver entièrement le module d'économie sur un serveur"
            },

            type: ApplicationCommandOptionType.Subcommand,

            options: [
                {
                    name: "action",

                    description: "What do you want to do ?",
                    description_localizations: {
                        "fr": "Que voulez-vous faire ?"
                    },

                    type: ApplicationCommandOptionType.String,

                    choices: [
                        {
                            name: 'Enable the module',
                            value: "on"
                        },
                        {
                            name: "Disable the module",
                            value: "off"
                        },
                    ],

                    required: true
                }
            ]
        },
        {
            name: 'economy-leaderboard',

            description: "Get the users balance's leaderboard of the guild!",
            description_localizations: {
                "fr": "Obtenez le classement du solde des utilisateurs du serveur"
            },

            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'deposit',

            description: 'Deposit coin in your bank!',
            description_localizations: {
                "fr": "Déposez des pièces dans votre banque"
            },

            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'how-much',
                    type: ApplicationCommandOptionType.String,

                    description: 'How much coin you want to deposit in your bank?',
                    description_localizations: {
                        "fr": "Combien de pièces vous souhaitez déposer dans votre banque"
                    },

                    required: true
                }
            ],
        },
        {
            name: 'daily',

            description: 'Claim a daily reward!',
            description_localizations: {
                "fr": "Réclamez une récompense quotidienne"
            },

            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: 'monthly',

            description: 'Claim a monthly reward!',
            description_localizations: {
                "fr": "Réclamez une récompense mensuelle"
            },

            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: 'weekly',

            description: 'Claim a weekly reward!',
            description_localizations: {
                "fr": "Réclamez une récompense hebdomadaire"
            },

            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: 'pay',

            description: 'Pay a user a certain amount!',
            description_localizations: {
                "fr": "Payer à un utilisateur un certain montant"
            },

            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'amount',
                    type: ApplicationCommandOptionType.Number,

                    description: 'The amount of money you want to donate to them',
                    description_localizations: {
                        "fr": "Le montant d’argent que vous souhaitez lui donner"
                    },

                    required: true
                },
                {
                    name: 'member',
                    type: ApplicationCommandOptionType.User,

                    description: 'The member you want to donate the money',
                    description_localizations: {
                        "fr": "Le membre à qui vous souhaitez donner de l'argent"
                    },

                    required: true
                }
            ],
        },
        {
            name: 'rob',

            description: 'Rob a user!',
            description_localizations: {
                "fr": "Volé de l'argent d'un utilisateur"
            },

            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'member',
                    type: ApplicationCommandOptionType.User,

                    description: 'the member you want to rob a money',
                    description_localizations: {
                        "fr": "le membre à qui tu veux voler de l'argent"
                    },

                    required: true
                }
            ],
        },
        {
            name: 'withdraw',

            description: 'Withdraw coin from your bank!',
            description_localizations: {
                "fr": "Retirer des pièces de votre banque"
            },

            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'how-much',
                    type: ApplicationCommandOptionType.String,

                    description: 'How much coin you want to withdraw from your bank?',
                    description_localizations: {
                        "fr": "Combien de pièces vous souhaitez retirer de votre banque"
                    },

                    required: true
                }
            ],
        },
        {
            name: 'work',

            description: 'Claim a work reward!',
            description_localizations: {
                "fr": "Réclamez une récompense de travail"
            },

            type: ApplicationCommandOptionType.Subcommand
        },
    ],
    thinking: false,
    category: 'economy',
    type: ApplicationCommandType.ChatInput,

};
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

import { ActionRowBuilder, BaseGuildTextChannel, ButtonBuilder, ButtonStyle, ChannelType, ChatInputCommandInteraction, Client, CommandInteractionOptionResolver, EmbedBuilder, GuildMember, Interaction, PermissionFlagsBits } from 'discord.js';
import { LanguageData } from '../../../types/languageData';
import { BotEvent } from '../../../types/event';
import { Command } from '../../../types/command';

var timeout: number = 1000;

async function cooldDown(client: Client, interaction: Interaction) {
    let tn = Date.now();
    let table = client.db.table("TEMP");
    var fetch = await table.get(`COOLDOWN.${interaction.user.id}`);
    if (fetch !== null && timeout - (tn - fetch) > 0) return true;

    await table.set(`COOLDOWN.${interaction.user.id}`, tn);
    return false;
};

async function handleCommandExecution(client: Client, interaction: ChatInputCommandInteraction<"cached">, command: Command, lang: LanguageData, thinking: boolean) {
    const options = interaction.options as CommandInteractionOptionResolver;
    const group = options.getSubcommandGroup(false);
    const subCommand = options.getSubcommand(false);

    if (group && subCommand) {
        const subCmd = client.subCommands.get(group + " " + subCommand);

        if (subCmd && subCmd.run) {
            let permCheck = await client.method.permission.checkCommandPermission(interaction, command!);
            if (!permCheck.allowed) return client.method.permission.sendErrorMessage(interaction, lang, permCheck.neededPerm || 0);

            if ((!subCmd.thinking || thinking === undefined) && thinking) {
                await interaction.deferReply();
            }

            return await subCmd.run(client, interaction, lang, command, Date.now(), []);
        }
    }
    else if (subCommand) {
        const subCmd = client.subCommands.get(subCommand);

        if (subCmd && subCmd.run) {
            let permCheck = await client.method.permission.checkCommandPermission(interaction, command!);
            if (!permCheck.allowed) return client.method.permission.sendErrorMessage(interaction, lang, permCheck.neededPerm || 0);

            if ((!subCmd.thinking || thinking === undefined) && thinking) {
                await interaction.deferReply();
            }

            return await subCmd.run(client, interaction, lang, command, Date.now(), []);
        }
    }

    if (command.thinking) {
        await interaction.deferReply();
    }

    let permCheck = await client.method.permission.checkCommandPermission(interaction, command!);
    if (!permCheck.allowed) return client.method.permission.sendErrorMessage(interaction, lang, permCheck.neededPerm || 0);

    if (command.run) await command.run(client, interaction, lang, command, Date.now(), []);
    return
}

async function handleCommandError(client: Client, interaction: ChatInputCommandInteraction, command: any, error: any) {
    await client.method.interactionSend(interaction, {
        content: "**Let me suggest you to report this issue with `/report`.**"
    });
}

export const event: BotEvent = {
    name: "interactionCreate",
    run: async (client: Client, interaction: Interaction) => {
        if (interaction.isAutocomplete()) {
            const cmd = client.commands.get(interaction.commandName);
            if (cmd?.autocomplete) await cmd.autocomplete(client, interaction);
            return;
        }

        if (!interaction.isChatInputCommand() || interaction.user.bot) return;

        const command = client.commands?.get(interaction.commandName);
        if (!command) {
            return interaction.reply({ content: 'Connection error.', ephemeral: true });
        }

        if (interaction.channel?.type === ChannelType.DM && !command?.integration_types?.includes(1)) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(2829617)
                        .setImage('https://ihorizon.me/assets/img/banner/ihrz_fr-FR.png')
                        .setDescription(`# Uhh Oh!!\n\nIt seems you are using ${client.user?.username!} in a private conversation.\nI want to clarify that ${client.user?.username!} can only be used in a Discord server!\n\nTo unleash my full potential, add me!`)
                ],
                components: [
                    new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            new ButtonBuilder()
                                .setEmoji(client.iHorizon_Emojis.icon.Crown_Logo)
                                .setLabel('Invite ' + client.user?.username!)
                                .setStyle(ButtonStyle.Link)
                                .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user?.id}&permissions=8&scope=bot`),
                            new ButtonBuilder()
                                .setEmoji(client.iHorizon_Emojis.icon.Sparkles)
                                .setLabel('Main Website')
                                .setStyle(ButtonStyle.Link)
                                .setURL('https://ihorizon.me'),
                        )
                ]
            });
        }

        if (await cooldDown(client, interaction)) {
            const data = await client.func.getLanguageData(interaction.guild?.id) as LanguageData;
            return await interaction.reply({ content: data.Msg_cooldown, ephemeral: true });
        }

        if (await client.db.table('BLACKLIST').get(`${interaction.user.id}.blacklisted`)) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#0827F5")
                        .setTitle(":(")
                        .setImage(client.config.core.blacklistPictureInEmbed)
                ],
                ephemeral: true
            });
        }

        try {
            let thinking = false;
            if (command.thinking) {
                thinking = true;
            }

            const lang = await client.func.getLanguageData(interaction.guildId) as LanguageData;
            await handleCommandExecution(client, (interaction as ChatInputCommandInteraction<"cached">), command, lang, thinking);
        } catch (error) {
            console.error(error)
            // await handleCommandError(client, interaction, command, error);
        }
    },
};
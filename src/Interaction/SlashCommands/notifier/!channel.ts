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
    PermissionsBitField,
} from 'discord.js';
import { LanguageData } from '../../../../types/languageData.js';
import { DatabaseStructure } from '../../../../types/database_structure.js';

export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction, lang: LanguageData) => {
        // Guard's Typing
        if (!interaction.member || !client.user || !interaction.user || !interaction.guild || !interaction.channel) return;

        if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator)) {
            await interaction.reply({ content: lang.punishpub_not_admin });
            return;
        };

        let channel = interaction.options.getChannel("chann") as BaseGuildTextChannel;
        let fetched = await client.db.get(`${interaction.guildId}.NOTIFIER`) as DatabaseStructure.NotifierSchema;

        if (fetched && channel.id === fetched.channelId) {
            return await client.method.interactionSend(interaction, {
                content: lang.joinghostping_add_already_set
                    .replace("${channel}", channel.toString())
            })
        };

        await client.method.iHorizonLogs.send(interaction, {
            title: lang.notifier_config_channel_logsEmbed_title,
            description: lang.notifier_config_channel_logsEmbed_desc
                .replace('${interaction.user.id}', interaction.member.toString())
                .replace('${channel}', channel.toString())
        });

        await client.db.set(`${interaction.guildId}.NOTIFIER.channelId`, channel.id);

        await client.method.interactionSend(interaction, {
            content: lang.notifier_config_message_command_ok
                .replace("${channel.toString()}", channel.toString())
        })
    },
};
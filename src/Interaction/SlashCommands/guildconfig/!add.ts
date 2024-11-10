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
    PermissionsBitField,
    BaseGuildTextChannel,
    ChatInputCommandInteraction,
    GuildChannel,
    EmbedBuilder,
} from 'discord.js';
import { LanguageData } from '../../../../types/languageData';
import { DatabaseStructure } from '../../../../types/database_structure';
import { Command } from '../../../../types/command';
import { Option } from '../../../../types/option';
export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction<"cached">, data: LanguageData, command: Option | Command | undefined) => {
        let permCheck = await client.method.permission.checkCommandPermission(interaction, command!);
        if (!permCheck.allowed) return client.method.permission.sendErrorMessage(interaction, data, permCheck.neededPerm || 0);
        // Guard's Typing
        if (!interaction.member || !client.user || !interaction.user || !interaction.guild || !interaction.channel) return;

        if ((!interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator) && permCheck.neededPerm === 0)) {
            await client.method.interactionSend(interaction, { content: data.setup_not_admin });
            return;
        };

        let channel = interaction.options.getChannel('channel') as GuildChannel;
        let all_channels: DatabaseStructure.GhostPingData['channels'] = await client.db.get(`${interaction.guildId}.GUILD.GUILD_CONFIG.GHOST_PING.channels`) || [];

        if (all_channels?.includes(channel.id)) {
            await interaction.reply({
                content: data.joinghostping_add_already_set
                    .replace('${channel}', channel.toString())
            });
            return;
        };

        await client.db.push(`${interaction.guildId}.GUILD.GUILD_CONFIG.GHOST_PING.channels`, channel.id);

        (channel as BaseGuildTextChannel).send({ content: data.joinghostping_add_sent_to_channel });

        all_channels?.push(channel.id);

        let embed = new EmbedBuilder()
            .setTitle(data.joinghostping_add_ok_embed_title)
            .setColor("#475387")
            .setDescription(data.joinghostping_add_ok_embed_desc)
            .addFields({
                name: data.joinghostping_add_ok_embed_fields_name,
                value: all_channels ? Array.from(new Set(all_channels.map(x => `<#${x}>`))).join('\n') : `<#${channel.id}>`
            });

        await client.method.iHorizonLogs.send(interaction, {
            title: data.joinghostping_add_logs_embed_title,
            description: data.joinghostping_add_logs_embed_desc
                .replace('${interaction.user}', interaction.user.toString())
                .replace('${channel}', channel.toString())
        });

        await interaction.reply({ embeds: [embed] });
        return;
    },
};
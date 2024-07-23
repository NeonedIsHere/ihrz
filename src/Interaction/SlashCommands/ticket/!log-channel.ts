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
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    GuildChannel,
    PermissionsBitField,
} from 'pwss';
import { LanguageData } from '../../../../types/languageData';
export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction, data: LanguageData) => {
        // Guard's Typing
        if (!interaction.member || !client.user || !interaction.user || !interaction.guild || !interaction.channel) return;

        

        if (await client.db.get(`${interaction.guildId}.GUILD.TICKET.disable`)) {
            await interaction.editReply({ content: data.ticket_disabled_command });
            return;
        };
        let channel = interaction.options.getChannel('channel') as GuildChannel;

        if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator)) {
            await interaction.editReply({ content: data.disableticket_not_admin });
            return;
        };

        await client.db.set(`${interaction.guildId}.GUILD.TICKET.logs`, channel?.id);

        let embed = new EmbedBuilder()
            .setColor(await client.db.get(`${interaction.guild?.id}.GUILD.GUILD_CONFIG.embed_color.audits-logs`) || "#008000")
            .setTitle(data.ticket_logchannel_embed_title)
            .setDescription(data.ticket_logchannel_embed_desc
                .replace('${interaction.user}', interaction.user.toString())
                .replace('${channel}', channel.toString())
            )
            .setFooter(await client.method.bot.footerBuilder(interaction))
            .setTimestamp();

        await interaction.editReply({
            embeds: [embed],
            files: [await client.method.bot.footerAttachmentBuilder(interaction)]
        });
        return;
    },
};
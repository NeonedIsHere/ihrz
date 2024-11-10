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
} from 'discord.js';
import { LanguageData } from '../../../../types/languageData';
import { Command } from '../../../../types/command';
import { Option } from '../../../../types/option';

export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction<"cached">, lang: LanguageData, command: Option | Command | undefined, neededPerm: number) => {


        // Guard's Typing
        if (!interaction.member || !client.user || !interaction.user || !interaction.guild || !interaction.channel) return;

        var text = "";

        let baselang = await client.db.get(`${interaction.guildId}.ALLOWLIST`);

        if (!baselang) {

            await client.db.set(`${interaction.guildId}.ALLOWLIST`,
                {
                    enable: false,
                    list: {
                        [`${interaction.guild?.ownerId}`]: { allowed: true },
                    },
                }
            );

            baselang = await client.db.get(`${interaction.guildId}.ALLOWLIST`);
        };

        for (var i in baselang.list) {
            text += `<@${i}>\n`
        };

        if (interaction.user.id !== interaction.guild.ownerId && !text.includes(interaction.user.id)) {
            await interaction.reply({ content: lang.allowlist_show_not_permited });
            return;
        };

        let embed = new EmbedBuilder()
            .setColor(await client.db.get(`${interaction.guild?.id}.GUILD.GUILD_CONFIG.embed_color.all`) || "#000000")
            .setAuthor({ name: lang.allowlist_show_embed_author })
            .setDescription(`${text}`)
            .setFooter(await client.method.bot.footerBuilder(interaction))
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            files: [await interaction.client.method.bot.footerAttachmentBuilder(interaction)]
        });
        return;
    },
};
/*
・ iHorizon Discord Bot (https://github.com/ihrz/ihrz)

・ Licensed under the Attribution-NonCommercial-ShareAlike 2.0 Generic (CC BY-NC-SA 2.0)

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

import * as apiUrlParser from '../../../core/functions/apiUrlParser.js';
import { LanguageData } from '../../../../types/languageData';
import { axios } from '../../../core/functions/axios.js';

export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction, data: LanguageData) => {

        let kiss = interaction.options.getUser("user");
        let url = apiUrlParser.assetsFinder(client.assets, "kiss");

        axios.get(url)
            .then(async () => {
                let embed = new EmbedBuilder()
                    .setColor(await client.db.get(`${interaction.guild?.id}.GUILD.GUILD_CONFIG.embed_color.fun-cmd`) || "#ff0884")
                    .setDescription(data.kiss_embed_description
                        .replace(/\${kiss\.id}/g, kiss?.id as string)
                        .replace(/\${interaction\.user\.id}/g, interaction.user.id)
                    )
                    .setImage(url)
                    .setTimestamp()
                await interaction.editReply({ embeds: [embed] });
                return;
            }).catch(async (err) => {
                await interaction.editReply({ content: 'Error: The API is down!' });
            });
    },
};
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
import { Custom_iHorizon } from '../../../../types/ownihrz';

import logger from '../../../core/logger.js';

import { Command } from '../../../../types/command';
import { Option } from '../../../../types/option';

export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction<"cached">, lang: LanguageData, command: Option | Command | undefined, neededPerm: number) => {


        // Guard's Typing
        if (!interaction.member || !client.user || !interaction.user || !interaction.guild || !interaction.channel) return;

        let botId = interaction.options.getString('botid')!;
        let newToken = interaction.options.getString('new_discord_bot_token')!;
        let tempTable = client.db.table('TEMP');
        let table = client.db.table('OWNIHRZ');

        let alllang = await table.get("CLUSTER");

        let timeout: number = 3600000;
        let executingBefore = await tempTable.get(`OWNIHRZ_CHANGE_TOKEN.${interaction.user.id}.timeout`);

        if (executingBefore !== null && timeout - (Date.now() - executingBefore) > 0) {
            let time = client.timeCalculator.to_beautiful_string(timeout - (Date.now() - executingBefore));

            await interaction.reply({ content: lang.monthly_cooldown_error.replace(/\${time}/g, time) });
            return;
        };

        function getlang() {
            for (let ownerId in alllang) {
                for (let bot_id in alllang[ownerId]) {
                    if (bot_id !== botId) continue;
                    return alllang[ownerId][botId];
                }
            }
        }

        let id_2 = getlang() as Custom_iHorizon;

        if (!id_2) {
            await interaction.reply({ content: lang.mybot_manage_accept_not_found });
            return;
        };

        if (!client.owners.includes(interaction.user.id) && (id_2.OwnerOne !== interaction.user.id)) {
            await interaction.reply({ content: client.iHorizon_Emojis.icon.No_Logo, ephemeral: true });
            return;
        }

        let bot_1 = (await client.ownihrz.Get_Bot(newToken).catch(() => { }))?.data || 404

        if (!bot_1.bot) {
            await interaction.reply({ content: lang.mybot_manage_accept_token_error });
            return;
        } else {

            let utils_msg = lang.mybot_manage_accept_utils_msg
                .replace('${bot_1.bot.id}', bot_1.bot.id)
                .replace('${bot_1.bot.username}', bot_1.bot.username)
                .replace("${bot_1.bot_public ? 'Yes' : 'No'}",
                    bot_1.bot_public ? lang.mybot_manage_accept_utiis_yes : lang.mybot_manage_accept_utils_no
                );

            let embed = new EmbedBuilder()
                .setColor('#ff7f50')
                .setTitle(lang.mybot_manage_accept_embed_title
                    .replace('${bot_1.bot.username}', bot_1.bot.username)
                    .replace('${bot_1.bot.discriminator}', bot_1.bot.discriminator)
                )
                .setDescription(lang.mybot_manage_accept_embed_desc
                    .replace('${utils_msg}', utils_msg)
                )
                .setFooter(await client.method.bot.footerBuilder(interaction));

            await interaction.reply({
                embeds: [embed],
                ephemeral: false,
                files: [await client.method.bot.footerAttachmentBuilder(interaction)]
            });

            try {
                await client.ownihrz.Change_Token(id_2.Cluster!, id_2.Code, newToken);
            } catch (error: any) {
                return logger.err(error)
            };

            await tempTable.set(`OWNIHRZ_CHANGE_TOKEN.${interaction.user.id}.timeout`, Date.now());
            return;
        };
    },
};
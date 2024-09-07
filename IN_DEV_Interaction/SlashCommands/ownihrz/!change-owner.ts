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

import { OwnIHRZ } from '../../../core/modules/ownihrzManager.js';

import { LanguageData } from '../../../../types/languageData.js';
import { Custom_iHorizon } from '../../../../types/ownihrz.js';

import logger from '../../../core/logger.js';

const OWNIHRZ = new OwnIHRZ();
export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction, data: LanguageData) => {
        // Guard's Typing
        if (!interaction.member || !client.user || !interaction.user || !interaction.guild || !interaction.channel) return;

        let botId = interaction.options.getString('botid')!;
        let OwnerOne = interaction.options.getUser('owner_one')!.id;
        let OwnerTwo = interaction.options.getUser('owner_two')?.id || OwnerOne;

        let tempTable = client.db.table('TEMP');
        let table = client.db.table('OWNIHRZ');

        let allData = await table.get("CLUSTER");

        let timeout: number = 3600000;
        let executingBefore = await tempTable.get(`OWNIHRZ_CHANGE_OWNER.${botId}.timeout`);

        if (executingBefore !== null && timeout - (Date.now() - executingBefore) > 0) {
            let time = client.timeCalculator.to_beautiful_string(timeout - (Date.now() - executingBefore));

            await interaction.reply({ content: data.monthly_cooldown_error.replace(/\${time}/g, time) });
            return;
        };

        function getData() {
            for (let ownerId in allData) {
                for (let bot_id in allData[ownerId]) {
                    if (bot_id !== botId) continue;
                    return allData[ownerId][botId];
                }
            }
        }

        let id_2 = getData() as Custom_iHorizon;

        if (!id_2) {
            await interaction.reply({ content: data.mybot_manage_accept_not_found });
            return;
        };

        if (!client.owners.includes(interaction.user.id) &&
            (id_2.OwnerOne !== interaction.user.id)) {
            await interaction.reply({ content: client.iHorizon_Emojis.icon.No_Logo, ephemeral: true });
            return;
        }

        let bot_1 = (await OWNIHRZ.Get_Bot(id_2.Auth).catch(() => { }))?.data || 404

        if (!bot_1.bot) {
            await interaction.reply({ content: data.mybot_manage_accept_token_error });
            return;
        } else {

            let embed = new EmbedBuilder()
                .setColor('#ff7f50')
                .setTitle(data.mybot_manage_accept_embed_title
                    .replace('${bot_1.bot.username}', bot_1.bot.username)
                    .replace('${bot_1.bot.discriminator}', bot_1.bot.discriminator)
                )
                .setDescription(data.mybot_change_owner
                    .replace("${OwnerOne}", OwnerOne)
                    .replace("${OwnerTwo}", OwnerTwo)
                )
                .setFooter(await client.method.bot.footerBuilder(interaction));

            await interaction.reply({
                embeds: [embed],
                ephemeral: false,
                files: [await client.method.bot.footerAttachmentBuilder(interaction)]
            });

            try {
                await OWNIHRZ.Change_Owner(client.config, id_2.Cluster!, id_2.Code, OwnerOne, OwnerTwo);

                var botData = await table.get(`CLUSTER.${id_2.OwnerOne}.${botId}`);
                await table.delete(`CLUSTER.${id_2.OwnerOne}.${botId}`);

                botData.OwnerOne = OwnerOne;
                botData.OwnerTwo = OwnerTwo;

                await table.set(`CLUSTER.${OwnerOne}.${botId}`, botData);
            } catch (error: any) {
                return logger.err(error)
            };

            await tempTable.set(`OWNIHRZ_CHANGE_TOKEN.${botId}.timeout`, Date.now());
            return;
        };
    },
};
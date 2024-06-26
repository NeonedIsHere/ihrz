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
    ChatInputCommandInteraction,
    User
} from 'pwss';
import { LanguageData } from '../../../../types/languageData';

export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction, data: LanguageData) => {
        // Guard's Typing
        if (!interaction.member || !client.user || !interaction.user || !interaction.guild || !interaction.channel) return;

        let user = interaction.options.getUser("member") as User;
        let amount = interaction.options.getNumber("amount") as number;

        let member = await client.db.get(`${interaction.guildId}.USER.${user.id}.ECONOMY.money`);

        if (await client.db.get(`${interaction.guildId}.ECONOMY.disabled`) === true) {
            await interaction.reply({
                content: data.economy_disable_msg
                    .replace('${interaction.user.id}', interaction.user.id)
            });
            return;
        };

        if (amount.toString().includes('-')) {
            await interaction.reply({ content: data.pay_negative_number_error });
            return;
        };

        if (amount && member < amount) {
            await interaction.reply({ content: data.pay_dont_have_enought_to_give });
            return;
        }

        await interaction.reply({
            content: data.pay_command_work
                .replace(/\${interaction\.user\.username}/g, interaction.user.globalName || interaction.user.username)
                .replace(/\${user\.user\.username}/g, user.globalName!)
                .replace(/\${amount}/g, amount.toString())
        });

        await client.db.add(`${interaction.guildId}.USER.${user.id}.ECONOMY.money`, amount!);
        await client.db.sub(`${interaction.guildId}.USER.${interaction.user.id}.ECONOMY.money`, amount!);
        return;
    },
};
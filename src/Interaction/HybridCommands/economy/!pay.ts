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
    User,
    Message,
    GuildMember
} from 'pwss';
import { LanguageData } from '../../../../types/languageData';
import { SubCommandArgumentValue } from '../../../core/functions/arg';
export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction | Message, lang: LanguageData, command: SubCommandArgumentValue, execTimestamp?: number, args?: string[]) => {
        // Guard's Typing
        if (!interaction.member || !client.user || !interaction.guild || !interaction.channel) return;

        if (interaction instanceof ChatInputCommandInteraction) {
            var amount = interaction.options.getNumber("amount") as number;
            var user = interaction.options.getMember("member") as GuildMember;
        } else {
            var _ = await client.args.checkCommandArgs(interaction, command, args!, lang); if (!_) return;
            var amount = client.args.number(args!, 0) as number;
            var user = client.args.member(interaction, 0) as GuildMember;
        };

        let member = await client.db.get(`${interaction.guildId}.USER.${user.id}.ECONOMY.money`);

        if (await client.db.get(`${interaction.guildId}.ECONOMY.disabled`) === true) {
            await client.args.interactionSend(interaction, {
                content: lang.economy_disable_msg
                    .replace('${interaction.user.id}', interaction.member.user.id)
            });
            return;
        };

        if (amount.toString().includes('-')) {
            await client.args.interactionSend(interaction, { content: lang.pay_negative_number_error });
            return;
        };

        if (amount && member < amount) {
            await client.args.interactionSend(interaction, { content: lang.pay_dont_have_enought_to_give });
            return;
        }

        await client.args.interactionSend(interaction, {
            content: lang.pay_command_work
                .replace(/\${interaction\.user\.username}/g, (interaction.member.user as User).globalName || interaction.member.user.username)
                .replace(/\${user\.user\.username}/g, user.user.globalName!)
                .replace(/\${amount}/g, amount.toString())
        });

        await client.db.add(`${interaction.guildId}.USER.${user.id}.ECONOMY.money`, amount!);
        await client.db.sub(`${interaction.guildId}.USER.${interaction.member.user.id}.ECONOMY.money`, amount!);
        return;
    },
};
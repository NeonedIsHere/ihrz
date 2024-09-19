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
    PermissionsBitField,
} from 'discord.js';

import { LanguageData } from '../../../../types/languageData';
import { SubCommandArgumentValue } from '../../../core/functions/method';

export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction<"cached">, data: LanguageData, command: SubCommandArgumentValue) => {        
        let permCheck = await client.method.permission.checkCommandPermission(interaction, command.command!);
        if (!permCheck.allowed) return client.method.permission.sendErrorMessage(interaction, data, permCheck.neededPerm || 0);

        // Guard's Typing
        if (!interaction.member || !client.user || !interaction.user || !interaction.guild || !interaction.channel) return;

        let action = interaction.options.getString("action");
        let footerName = interaction.options.getString('name');

        if ((!interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator) && permCheck.neededPerm === 0)) {
            await interaction.editReply({ content: data.setup_not_admin });
            return;
        };

        if (action === "reset") {
            await client.db.delete(`${interaction.guildId}.BOT.botName`);

            await interaction.editReply({ content: data.guildconfig_setbot_footername_is_reset });
            return;
        } else if (footerName) {
            if (footerName.length >= 32) return await interaction.editReply({ content: data.guildconfig_setbot_footername_footer_too_long_msg });

            await client.db.set(`${interaction.guildId}.BOT.botName`, footerName);

            await interaction.editReply({
                content: data.guildconfig_setbot_footername_is_good
                    .replace("${footerName}", footerName)
            });
            return;
        } else {
            await interaction.editReply({ content: data.guildconfig_setbot_footername_not_found });
            return;
        }
    },
};
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

        if (interaction.user.id !== interaction.guild.ownerId) {
            await interaction.editReply({ content: lang.authorization_sanction_not_permited });
            return;
        };

        let choose = interaction.options.getString('choose');

        if (choose) {
            await client.db.set(`${interaction.guild.id}.PROTECTION.SANCTION`, choose);

            if (choose === 'simply') choose = lang.authorization_sanction_simply;
            if (choose === 'simply+derank') choose = lang.authorization_sanction_simply_unrank;
            if (choose === 'simply+ban') choose = lang.authorization_sanction_simply_ban;

            await interaction.editReply({
                content: lang.authorization_sanction_command_work
                    .replace('${interaction.user}', interaction.user.toString())
                    .replace('${choose}', choose)
            });
            return;
        };
    },
};
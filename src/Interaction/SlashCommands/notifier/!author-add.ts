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
    BaseGuildTextChannel,
    ChatInputCommandInteraction,
    Client,
    Guild,
    PermissionsBitField,
} from 'discord.js';
import { LanguageData } from '../../../../types/languageData.js';
import { DatabaseStructure } from '../../../../types/database_structure.js';
import { Platform } from '../../../core/StreamNotifier.js';
import { Command } from '../../../../types/command.js';
import { Option } from '../../../../types/option.js';

export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction<"cached">, lang: LanguageData, command: Option | Command | undefined, neededPerm: number) => {        


        // Guard's Typing
        if (!interaction.member || !client.user || !interaction.user || !interaction.guild || !interaction.channel) return;

        if ((!interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator) && neededPerm === 0)) {
            await interaction.reply({ content: lang.punishpub_not_admin });
            return;
        };

        let platform = interaction.options.getString("platform") as Platform;
        let author = interaction.options.getString("author") as string;

        if (await client.notifier.authorExistOnPlatform(platform, author)) {
            let fetched = await client.db.get(`${interaction.guildId}.NOTIFIER`) as DatabaseStructure.NotifierSchema | null;
            let fetchedUsers = fetched?.users || [];

            fetchedUsers.push({ id_or_username: author, platform: platform });

            const uniqueArray = fetchedUsers.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    JSON.stringify(t) === JSON.stringify(value)
                ))
            ) || [];

            await client.db.set(`${interaction.guildId}.NOTIFIER.users`, uniqueArray);

            await client.method.interactionSend(interaction, {
                embeds: [
                    await client.notifier.generateAuthorsEmbed(interaction.guild),
                    await client.notifier.generateConfigurationEmbed(interaction.guild)
                ]
            })
        } else {
            return interaction.reply({ content: lang.notifier_author_add_author_doesnt_exist })
        }
    },
};
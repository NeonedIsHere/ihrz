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
    PermissionsBitField,
    BaseGuildTextChannel,
    ChatInputCommandInteraction,
    GuildChannel,
    EmbedBuilder,
    User,
} from 'discord.js';
import { LanguageData } from '../../../../../types/languageData';
import { Command } from '../../../../../types/command';
import { Option } from '../../../../../types/option';
export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction<"cached">, lang: LanguageData, command: Option | Command | undefined, neededPerm: number) => {


        // Guard's Typing
        if (!interaction.member || !client.user || !interaction.user || !interaction.guild || !interaction.channel) return;

        if ((!interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator) && neededPerm === 0)) {
            await client.method.interactionSend(interaction, { content: lang.setup_not_admin });
            return;
        };

        let user = interaction.options.getUser('user') as User;
        let perm = interaction.options.getString('permission') as string;

        if (perm === "0") {
            await client.db.delete(`${interaction.guildId}.UTILS.USER_PERMS.${user.id}`);

            await client.method.interactionSend(interaction, {
                content: lang.perm_set_deleted.replace("${user.toString()}", user.toString())
            });
        } else {
            let fetchedPerm = await client.method.permission.checkUserPermissions(
                interaction.member,
            );

            if (fetchedPerm <= parseInt(perm) && interaction.guild.ownerId !== interaction.member.id) {
                await client.method.interactionSend(interaction, {
                    content: lang.perm_set_warn_message.replace(
                        "${interaction.member.toString()}",
                        interaction.member.toString(),
                    ),
                });
                return;
            }

            await client.db.set(`${interaction.guildId}.UTILS.USER_PERMS.${user.id}`, parseInt(perm));

            await client.method.interactionSend(interaction, {
                content: lang.perm_set_ok.replace("${user.toString()}", user.toString())
                    .replace("${perm}", perm)
            });
        }

        return;
    },
};
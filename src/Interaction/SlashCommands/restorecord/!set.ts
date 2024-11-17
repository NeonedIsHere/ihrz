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
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Channel,
    ChatInputCommandInteraction,
    Client,
    GuildTextBasedChannel,
    PermissionsBitField
} from 'discord.js';
import { LanguageData } from '../../../../types/languageData';
import { Command } from '../../../../types/command';
import { Option } from '../../../../types/option';
import { createRestoreCord, createRestoreCordLink } from '../../../core/functions/restoreCordHelper.js';

export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction<"cached">, lang: LanguageData, command: Option | Command | undefined, neededPerm: number) => {


        // Guard's Typing
        if (!interaction.member || !client.user || !interaction.user || !interaction.guild || !interaction.channel) return;

        if ((!interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator) && neededPerm === 0)) {
            await client.method.interactionSend(interaction, { content: lang.security_disable_not_admin });
            return;
        };

        var channel = interaction.options.getChannel("channel") as Channel | null;
        var messagei = interaction.options.getString("messageid");
        var role = interaction.options.getRole("role");

        if (!role) { return await client.method.interactionSend(interaction, { content: lang.buttonreaction_roles_not_found }); };

        await (channel as GuildTextBasedChannel | null)?.messages.fetch(messagei!)
            .then(async msg => {
                if (msg?.author.id !== client.user?.id) {
                    return await client.method.interactionSend(interaction, { content: lang.buttonreaction_message_other_user_error });
                }

                let buttonLink = createRestoreCordLink({ guildId: interaction.guildId, clientId: client.user.id });

                createRestoreCord({
                    guildId: interaction.guildId,
                    apiToken: client.config.api.apiToken,
                    roleId: role?.id,
                    author: interaction.user
                })
                    .then(async (res) => {

                        msg.edit({
                            components: [
                                new ActionRowBuilder<ButtonBuilder>().addComponents(
                                    new ButtonBuilder()
                                        .setStyle(ButtonStyle.Link)
                                        .setLabel(lang.rc_verify)
                                        .setURL(buttonLink)
                                )
                            ]
                        })

                        let msgLink = `https://discord.com/channels/${interaction.guildId}/${channel?.id}/${messagei}`;

                        await client.method.interactionSend(interaction, {
                            content: lang.rc_command_ok
                                .replace("${interaction.user.toString()}", interaction.user.toString())
                                .replace("${res.secretCode}", String(res.secretCode))
                                .replace("${msgLink}", msgLink),
                            ephemeral: true
                        });

                        await interaction.user.send(lang.rc_command_ok_dm.replace("${interaction.guild.name}", interaction.guild.name).replace("${res.secretCode}", res.secretCode!))
                            .catch(() => interaction.followUp({ content: lang.rc_command_dm_failed, ephemeral: true }))
                            .then(() => interaction.followUp({ content: lang.rc_command_dm_ok, ephemeral: true }))
                            ;

                        await client.db.set(`${interaction.guildId}.GUILD.RESTORECORD`, {
                            channelId: channel?.id,
                            messageId: messagei,
                        });

                    })
                    .catch(async () => {
                        await client.method.interactionSend(interaction, { content: lang.rc_command_horizongw_down });
                        return;
                    })

            })
            .catch(async (err) => {
                await client.method.interactionSend(interaction, { content: lang.reactionroles_cant_fetched_reaction_remove })
                return;
            });
        return;

    },
};
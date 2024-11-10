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
    EmbedBuilder,
    GuildMember,
    InteractionEditReplyOptions,
    Message,
    MessagePayload,
    MessageReplyOptions,
    PermissionsBitField,
} from 'discord.js';

import logger from '../../../core/logger.js';
import { LanguageData } from '../../../../types/languageData.js';
import { Command } from '../../../../types/command.js';
import { Option } from '../../../../types/option.js';
import { generatePassword } from '../../../core/functions/random.js';
import { DatabaseStructure } from '../../../../types/database_structure.js';

export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction<"cached"> | Message, lang: LanguageData, command: Option | Command | undefined, neededPerm: number, args?: string[]) => {

        // Guard's Typing
        if (!client.user || !interaction.member || !interaction.guild || !interaction.channel) return;

        const permissionsArray = [PermissionsBitField.Flags.ManageMessages]
        const permissions = interaction instanceof ChatInputCommandInteraction ?
            interaction.memberPermissions?.has(permissionsArray)
            : interaction.member.permissions.has(permissionsArray);

        if (!permissions && neededPerm === 0) {
            await client.method.interactionSend(interaction, { content: lang.tempmute_dont_have_permission.replace("${client.iHorizon_Emojis.icon.No_Logo}", client.iHorizon_Emojis.icon.No_Logo) });
            return;
        };

        if (interaction instanceof ChatInputCommandInteraction) {
            var tomute = interaction.options.getMember("user") as GuildMember | null;
            var mutetime = interaction.options.getString("time");
        } else {
            
            var tomute = client.method.member(interaction, args!, 0) as GuildMember | null;
            var mutetime = client.method.string(args!, 1) as string | null;
        };

        if (!mutetime || !tomute || !mutetime) { return; };

        let mutetimeMS = client.timeCalculator.to_ms(mutetime);

        if (!mutetimeMS) {
            await client.method.interactionSend(interaction, { content: lang.too_new_account_invalid_time_on_enable });
            return;
        }

        let mutetimeString = client.timeCalculator.to_beautiful_string(mutetime);

        if (!interaction.guild.members.me?.permissions.has([PermissionsBitField.Flags.ManageMessages])) {
            await client.method.interactionSend(interaction, {
                content: lang.tempmute_i_dont_have_permission.replace("${client.iHorizon_Emojis.icon.No_Logo}", client.iHorizon_Emojis.icon.No_Logo)
            });
            return;
        };

        if (tomute.id === interaction.member.user.id) {
            await client.method.interactionSend(interaction, {
                content: lang.tempmute_cannot_mute_yourself.replace("${client.iHorizon_Emojis.icon.No_Logo}", client.iHorizon_Emojis.icon.No_Logo)
            });
            return;
        }

        if (tomute.isCommunicationDisabled() === true) {
            await client.method.interactionSend(interaction, { content: lang.tempmute_already_muted });
            return;
        };

        await (tomute.timeout(mutetimeMS, lang.tempmute_logs_embed_title)).catch(() => { });

        await client.method.interactionSend(interaction, lang.tempmute_command_work
            .replace("${tomute.id}", tomute.id)
            .replace("${ms(ms(mutetime))}", mutetimeString)
        );

        setTimeout(async () => {
            await client.method.channelSend(interaction, {
                content: lang.tempmute_unmuted_by_time.replace("${tomute.id}", tomute?.id!),
            });
        }, mutetimeMS);

        await client.method.iHorizonLogs.send(interaction, {
            title: lang.tempmute_logs_embed_title,
            description: lang.tempmute_logs_embed_description
                .replace("${interaction.user.id}", interaction.member.user.id)
                .replace("${tomute.id}", tomute.id)
                .replace("${ms(ms(mutetime))}", mutetimeString)
        });

        let warnObject: DatabaseStructure.WarnsData = {
            timestamp: Date.now(),
            reason: lang.tempmute_logs_embed_description
                .replace("${interaction.user.id}", interaction.member.user.id)
                .replace("${tomute.id}", tomute.id)
                .replace("${ms(ms(mutetime))}", mutetimeString),
            authorID: interaction.member.user.id,
            id: generatePassword({ length: 8, lowercase: true, numbers: true })
        }

        await client.db.push(`${interaction.guildId}.USER.${tomute.user.id}.WARNS`, warnObject);
    },
};
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
    ApplicationCommandOptionType,
    EmbedBuilder,
    PermissionsBitField,
    ChatInputCommandInteraction,
    ApplicationCommandType,
    Message,
    MessagePayload,
    InteractionEditReplyOptions,
    MessageReplyOptions,
    GuildMember,
    GuildChannel,
    VoiceBasedChannel
} from 'discord.js'

import { LanguageData } from '../../../../types/languageData';

import { SubCommandArgumentValue, member } from '../../../core/functions/method.js';
import { isInVoiceChannel } from '../../../core/functions/leashModuleHelper.js';
import { promptYesOrNo } from '../../../core/functions/awaitingResponse.js';
import { DatabaseStructure } from '../../../../types/database_structure';

export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction<"cached"> | Message, lang: LanguageData, command: SubCommandArgumentValue, neededPerm?: number, args?: string[]) => {


        // Guard's Typing
        if (!client.user || !interaction.member || !interaction.guild || !interaction.channel) return;

        if (interaction instanceof ChatInputCommandInteraction) {
            var user = interaction.options.getMember("member")!;
        } else {
            var user = client.method.member(interaction, args!, 0)!;
        };

        const permissionsArray = [PermissionsBitField.Flags.ModerateMembers, PermissionsBitField.Flags.MoveMembers]
        const permissions = interaction instanceof ChatInputCommandInteraction ?
            interaction.memberPermissions?.has(permissionsArray)
            : interaction.member.permissions.has(permissionsArray);

        if (!permissions && neededPerm === 0) {
            await client.method.interactionSend(interaction, { content: lang.punishpub_not_admin });
            return;
        };

        let baseData = await client.db.get(`${interaction.guildId}.UTILS.LEASH_CONFIG`) || {
            maxLeashedByUsers: 3,
            maxLeashTime: client.timeCalculator.to_ms("30min")
        } as DatabaseStructure.LeashConfig;
        let fetchedData = (await client.db.get(`${interaction.guildId}.UTILS.LEASH`) || []) as DatabaseStructure.LeashData[];
        let filteredData = fetchedData.filter(x => x.dom === interaction.member?.user.id) || [];

        if (filteredData.length >= (baseData.maxLeashedByUsers)) {
            await client.method.interactionSend(interaction, { content: `Little naughty guy, you can't put more than 3 people on a leash :D` });
            return;
        }


        if (filteredData.find(x => x.sub === user.id)) {
            await client.method.interactionSend(interaction, { content: `Little naughty guy, you already own this cuties :smirk:` });
            return;
        }


        if (!isInVoiceChannel(user) || isInVoiceChannel(interaction.member)) {
            let response = await promptYesOrNo(interaction, {
                content: `${client.iHorizon_Emojis.icon.No_Logo} | The member you want to leash (or yourself) is not in voice channel!\n${client.iHorizon_Emojis.icon.Warning_Icon} | Are you sure to want to perform this action ?`,
                yesButton: lang.var_yes,
                noButton: lang.var_no,
                dangerAction: false
            })
            if (!response) {
                await client.method.interactionSend(interaction, { content: `${client.iHorizon_Emojis.icon.Yes_Logo} | Leash configurations canceled`, components: [] })
                return;
            }
        }

        fetchedData!.push({ dom: interaction.member.user.id, sub: user.id, timestamp: Date.now() })
        await client.db.set(`${interaction.guildId}.UTILS.LEASH`, Array.from(new Set(fetchedData)));

        await client.method.interactionSend(interaction, { content: `${client.iHorizon_Emojis.icon.Yes_Logo} | You have sucessfuly leashed the user in this guild :smirk:`, components: [] })
    },
};
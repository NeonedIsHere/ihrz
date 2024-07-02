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
    GuildMember,
    InteractionEditReplyOptions,
    Message,
    MessagePayload,
    MessageReplyOptions,
    User,
} from 'pwss';
import { LanguageData } from '../../../../types/languageData';
import { SubCommandArgumentValue } from '../../../core/functions/arg';

export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction | Message, data: LanguageData, command: SubCommandArgumentValue, execTimestamp?: number, args?: string[]) => {
        // Guard's Typing
        if (!client.user || !interaction.member || !interaction.guild || !interaction.channel) return;

        if (interaction instanceof ChatInputCommandInteraction) {
            var member = interaction.options.getMember("user") as GuildMember | null;
        } else {
            var _ = await client.args.checkCommandArgs(interaction, command, args!, data); if (!_) return;
            var member = client.args.member(interaction, 0) as GuildMember | null;
        };

        let mentionedUser = member || interaction.member.user as User;

        let embed = new EmbedBuilder()
            .setImage(mentionedUser.displayAvatarURL({ extension: 'png', size: 512 }))
            .setColor("#add5ff")
            .setTitle(data.avatar_embed_title
                .replace('${mentionedUser.username}', mentionedUser.displayName)
            )
            .setDescription(data.avatar_embed_description)
            .setTimestamp()
            .setFooter(await client.args.bot.footerBuilder(interaction));

        await client.args.interactionSend(interaction, {
            embeds: [embed],
            files: [await client.args.bot.footerAttachmentBuilder(interaction)]
        });
        return;
    },
};
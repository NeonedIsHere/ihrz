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
    Message,
    User,
} from 'pwss';
import { LanguageData } from '../../../../types/languageData';
import { SubCommandArgumentValue } from '../../../core/functions/arg';
export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction | Message, data: LanguageData, command: SubCommandArgumentValue, execTimestamp?: number, args?: string[]) => {
        // Guard's Typing
        if (!client.user || !interaction.member || !interaction.guild || !interaction.channel) return;

        if (interaction instanceof ChatInputCommandInteraction) {
            var user = interaction.options.getMember("user") as GuildMember || interaction.member;
        } else {
            var _ = await client.args.checkCommandArgs(interaction, command, args!, data); if (!_) return;
            var user = client.args.member(interaction, 0) || interaction.member;
        };

        let baseData = await client.db.get(`${interaction.guildId}.USER.${user.id}.XP_LEVELING`);
        var level = baseData?.level || 0;
        var currentxp = baseData?.xp || 0;

        var xpNeeded = level * 500 + 500;
        var expNeededForLevelUp = xpNeeded - currentxp;

        let nivEmbed = new EmbedBuilder()
            .setTitle(data.level_embed_title
                .replace('${user.username}', String(user.user.globalName || user.displayName))
            )
            .setColor(await client.db.get(`${interaction.guild?.id}.GUILD.GUILD_CONFIG.embed_color.all`) || '#0014a8')
            .addFields(
                {
                    name: data.level_embed_fields1_name, value: data.level_embed_fields1_value
                        .replace('${currentxp}', currentxp)
                        .replace('${xpNeeded}', xpNeeded.toString()), inline: true
                },
                {
                    name: data.level_embed_fields2_name, value: data.level_embed_fields2_value
                        .replace('${level}', level), inline: true
                }
            )
            .setDescription(data.level_embed_description.replace('${expNeededForLevelUp}', expNeededForLevelUp.toString())
            )
            .setTimestamp()
            .setThumbnail("https://cdn.discordapp.com/attachments/847484098070970388/850684283655946240/discord-icon-new-2021-logo-09772BF096-seeklogo.com.png")
            .setFooter(await client.args.bot.footerBuilder(interaction));

        await client.args.interactionSend(interaction, {
            embeds: [nivEmbed],
            allowedMentions: { repliedUser: false },
            files: [await client.args.bot.footerAttachmentBuilder(interaction)]
        });
        return;
    },
};
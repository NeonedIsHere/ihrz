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
    AttachmentBuilder,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    GuildMember,
    Message,
    User,
} from 'discord.js';
import { LanguageData } from '../../../../types/languageData';
import { Command } from '../../../../types/command';
import { Option } from '../../../../types/option';
import { readFileSync } from 'node:fs';
import path from 'node:path';
export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction<"cached"> | Message, lang: LanguageData, command: Option | Command | undefined, neededPerm: number, args?: string[]) => {

        // Guard's Typing
        if (!client.user || !interaction.member || !interaction.guild || !interaction.channel) return;

        if (interaction instanceof ChatInputCommandInteraction) {
            var user = interaction.options.getMember("user") as GuildMember || interaction.member;
        } else {

            var user = client.method.member(interaction, args!, 0) || interaction.member;
        };

        let baseData = await client.db.get(`${interaction.guildId}.USER.${user.id}.XP_LEVELING`);
        var level = baseData?.level || 0;
        var currentxp = baseData?.xp || 0;

        var xpNeeded = level * 500 + 500;
        var expNeededForLevelUp = xpNeeded - currentxp;

        var htmlContent = readFileSync(path.join(process.cwd(), "src", "assets", "ranksCard.html"), 'utf-8');

        htmlContent = htmlContent
            .replace('AVATAR_URL', user.displayAvatarURL({ extension: 'png', size: 128 }))
            .replace('USERNAME', user.user.globalName || user.displayName)
            .replace('LEVEL', level)
            .replace('PROGRESS_PERCENT', String((currentxp / xpNeeded) * 100))
            .replace('CURRENT_XP', currentxp)
            .replace('XP_NEEDED', String(xpNeeded))
            .replace('XP_REMAINING', String(expNeededForLevelUp))
            .replace('TOTAL_XP', currentxp);

        const image = await client.method.imageManipulation.html2Png(htmlContent, {
            elementSelector: '.card',
            omitBackground: true,
            selectElement: true,
        });

        const attachment = new AttachmentBuilder(image, { name: 'image.png' });

        let nivEmbed = new EmbedBuilder()
            .setTitle(lang.level_embed_title
                .replace('${user.username}', String(user.user.globalName || user.displayName))
            )
            .setColor('#0014a8')
            .addFields(
                {
                    name: lang.level_embed_fields1_name, value: lang.level_embed_fields1_value
                        .replace('${currentxp}', currentxp)
                        .replace('${xpNeeded}', xpNeeded.toString()), inline: true
                },
                {
                    name: lang.level_embed_fields2_name, value: lang.level_embed_fields2_value
                        .replace('${level}', level), inline: true
                }
            )
            .setImage("attachment://image.png")
            .setDescription(lang.level_embed_description.replace('${expNeededForLevelUp}', expNeededForLevelUp.toString())
            )
            .setTimestamp()
            .setThumbnail("https://cdn.discordapp.com/attachments/847484098070970388/850684283655946240/discord-icon-new-2021-logo-09772BF096-seeklogo.com.png")
            .setFooter(await client.method.bot.footerBuilder(interaction));

        await client.method.interactionSend(interaction, {
            embeds: [nivEmbed],
            allowedMentions: { repliedUser: false },
            files: [await client.method.bot.footerAttachmentBuilder(interaction), attachment]
        });
        return;
    },
};
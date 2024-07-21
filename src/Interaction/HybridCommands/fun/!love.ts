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

import { Client, EmbedBuilder, ChatInputCommandInteraction, User, Message, GuildMember } from 'pwss';
import { LanguageData } from '../../../../types/languageData';

import Jimp from 'jimp';
import logger from '../../../core/logger.js';

import { fileURLToPath } from 'url';
import path from 'path';
import { SubCommandArgumentValue } from '../../../core/functions/arg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction | Message, lang: LanguageData, command: SubCommandArgumentValue, execTimestamp?: number, args?: string[]) => {
        // Guard's Typing
        if (!interaction.member || !client.user || !interaction.guild || !interaction.channel) return;

        if (interaction instanceof ChatInputCommandInteraction) {
            var user1 = interaction.options.getMember("user1") as GuildMember || interaction.member;
            var user2 = interaction.options.getMember("user2") as GuildMember || interaction.guild.members.cache.random() as GuildMember;
        } else {
            var _ = await client.args.checkCommandArgs(interaction, command, args!, lang); if (!_) return;
            var user1 = client.args.member(interaction, args!, 0) || interaction.member;
            var user2 = client.args.member(interaction, args!, 1) || interaction.guild.members.cache.random() as GuildMember;
        }

        let profileImageSize = 512;
        let canvasWidth = profileImageSize * 3;
        let canvasHeight = profileImageSize;

        try {
            let [profileImage1, profileImage2, heartEmoji] = await Promise.all([
                Jimp.read(user1.displayAvatarURL({ extension: 'png', size: 512 })),
                Jimp.read(user2.displayAvatarURL({ extension: 'png', size: 512 })),
                Jimp.read(path.join(__dirname, '..', '..', '..', '..', '..', 'src', 'assets', 'heart.png'))
            ]);

            profileImage1.resize(profileImageSize, profileImageSize);
            profileImage2.resize(profileImageSize, profileImageSize);
            heartEmoji.resize(profileImageSize, profileImageSize);

            let combinedImage = new Jimp(canvasWidth, canvasHeight);

            combinedImage.blit(profileImage1, 0, 0);
            combinedImage.blit(heartEmoji, profileImageSize, profileImageSize / 2 - heartEmoji.bitmap.height / 2);
            combinedImage.blit(profileImage2, profileImageSize * 2, 1);

            let buffer = await combinedImage.getBufferAsync(Jimp.MIME_PNG);
            let always100: Array<string> = client.config.command.alway100;

            var found = always100.find(element => {
                if (
                    element === `${user1.id}x${user2.id}`
                    ||
                    element === `${user2.id}x${user1.id}`
                ) {
                    return true;
                }
                return false;
            });

            var randomNumber: number;
            if (found) {
                randomNumber = 100;
            } else {
                randomNumber = Math.floor(Math.random() * 101);
            }

            var embed = new EmbedBuilder()
                .setColor("#FFC0CB")
                .setTitle("💕")
                .setImage(`attachment://love.png`)
                .setDescription(lang.love_embed_description
                    .replace('${user1.username}', user1.user.username)
                    .replace('${user2.username}', user2.user.username)
                    .replace('${randomNumber}', randomNumber.toString())
                )
                .setFooter(await client.args.bot.footerBuilder(interaction))
                .setTimestamp();

            await client.args.interactionSend(interaction, {
                embeds: [embed],
                files: [
                    { attachment: buffer, name: 'love.png' },
                    await interaction.client.args.bot.footerAttachmentBuilder(interaction),
                ]
            });
        } catch (error: any) {
            logger.err(error);
            await client.args.interactionSend(interaction, { content: lang.love_command_error });
        }
    },
};

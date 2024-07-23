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

/*
・ ElektraBots Discord Bot (https://github.com/belugafr/ElektraBots)

・ Mainly developed by NayaWeb (https://github.com/belugafr)

・ Copyright © 2021-2023 ElektraBots
*/

import {
    AttachmentBuilder,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    GuildMember,
    Message,
    User,
} from 'pwss'

import { AxiosResponse, axios } from '../../../core/functions/axios.js';
import { LanguageData } from '../../../../types/languageData.js';
import { SubCommandArgumentValue } from '../../../core/functions/arg.js';
export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction | Message, lang: LanguageData, command: SubCommandArgumentValue, execTimestamp?: number, args?: string[]) => {
        // Guard's Typing
        if (!interaction.member || !client.user || !interaction.guild || !interaction.channel) return;

        if (interaction instanceof ChatInputCommandInteraction) {
            var user: GuildMember = interaction.options.getMember('user') as GuildMember || interaction.member;
            var entry = interaction.options.getString('comment');
            var messageArgs = entry!.split(' ');
        } else {
            var _ = await client.method.checkCommandArgs(interaction, command, args!, lang); if (!_) return;
            var user: GuildMember = client.method.member(interaction, args!, 0) || interaction.member;
            var entry = client.method.longString(args!, 1);
            var messageArgs = entry!.split(' ');
        };

        if (messageArgs.length < 1) {
            await client.method.interactionSend(interaction, { content: lang.fun_var_good_sentence });
            return;
        };

        let username = user.user.username;
        let displayname = user.user.globalName;

        if (username.length > 15) {
            username = username.substring(0, 15);
        };

        if (displayname && displayname.length > 15) {
            displayname = displayname.substring(0, 15);
        };

        if (username.length > 15) {
            username = username.substring(0, 15);
        };

        let link = `https://some-random-api.com/canvas/misc/tweet?avatar=${encodeURIComponent((user.displayAvatarURL({ extension: 'png', size: 1024 })))}&username=${encodeURIComponent((username))}&comment=${encodeURIComponent(messageArgs.join(' '))}&displayname=${encodeURIComponent((displayname!))}`;

        let embed = new EmbedBuilder()
            .setColor('#000000')
            .setImage('attachment://tweet-elektra.png')
            .setTimestamp()
            .setFooter(await client.method.bot.footerBuilder(interaction));

        let imgs: AttachmentBuilder;

        await axios.get(link, { responseType: 'arrayBuffer' }).then((response: AxiosResponse) => {
            imgs = new AttachmentBuilder(Buffer.from(response.data, 'base64'), { name: 'tweet-elektra.png' });
            embed.setImage(`attachment://tweet-elektra.png`);
        });

        await client.method.interactionSend(interaction, { embeds: [embed], files: [imgs!, await interaction.client.method.bot.footerAttachmentBuilder(interaction)] });
        return;
    },
};
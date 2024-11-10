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
    PermissionsBitField
} from 'discord.js';
import { LanguageData } from '../../../../types/languageData';
import { Command } from '../../../../types/command';
import { Option } from '../../../../types/option';

export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction<"cached">, lang: LanguageData, command: Option | Command | undefined, neededPerm: number) => {        


        // Guard's Typing
        if (!interaction.member || !client.user || !interaction.user || !interaction.guild || !interaction.channel) return;

        let id = interaction.options.getString("id");
        let message = interaction.options.getString("reason");

        if ((!interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator) && neededPerm === 0)) {
            await interaction.editReply({ content: lang.suggest_accept_not_admin });
            return;
        };

        let baselang = await client.db.get(`${interaction.guildId}.SUGGEST`);
        let fetchId = await client.db.get(`${interaction.guildId}.SUGGESTION.${id}`);

        if (!baselang
            || baselang?.channel !== interaction.channel?.id
            || baselang?.disable === true) {
            await interaction.deleteReply();
            await interaction.followUp({
                content: lang.suggest_acceptnot_good_channel
                    .replace('${baselang?.channel}', baselang?.channel),
                ephemeral: true
            });

            return;
        };

        if (!fetchId) {
            await interaction.deleteReply();
            await interaction.followUp({ content: lang.suggest_accept_not_found_db, ephemeral: true });
            return;
        } else if (fetchId.replied) {
            await interaction.deleteReply();
            await interaction.followUp({ content: lang.suggest_accept_already_replied, ephemeral: true });
            return;
        };

        let channel = interaction.guild.channels.cache.get(baselang?.channel);

        await (channel as BaseGuildTextChannel).messages.fetch(fetchId?.msgId).then(async (msg) => {

            let embed = new EmbedBuilder(msg.embeds[0].data);

            embed.addFields({
                name: lang.suggest_accept_embed_fields_to_put
                    .replace('${interaction.user.username}', interaction.user.globalName as string),
                value: message as string
            });

            embed.setFooter(await client.method.bot.footerBuilder(interaction));
            embed.setColor('#21744c');
            embed.setTitle(lang.suggest_acceptembed_title_to_put
                .replace('${msg.embeds[0].data?.title}', msg.embeds[0].data?.title as string));

            await msg.edit({ embeds: [embed] });
            await client.db.set(`${interaction.guildId}.SUGGESTION.${id}.replied`, true);

            await interaction.deleteReply();
            await interaction.followUp({
                content: lang.suggest_accept_command_work
                    .replace('${interaction.guild.id}', interaction.guildId as string)
                    .replace('${interaction.channel.id}', interaction.channel?.id as string)
                    .replace('${fetchId?.msgId}', fetchId?.msgId),
                ephemeral: true
            });
            return;
        }).catch(async () => {
            await interaction.deleteReply();
            await interaction.followUp({ content: lang.suggest_accept_command_error, ephemeral: true });
            return;
        });
    },
};
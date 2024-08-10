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

import { Client, AuditLogEvent, Role } from 'discord.js'

import { BotEvent } from '../../../types/event';

export const event: BotEvent = {
    name: "roleUpdate",
    run: async (client: Client, oldRole: Role, newRole: Role) => {

        let data = await client.db.get(`${newRole.guild.id}.PROTECTION`);
        if (!data) return;

        if (data.updaterole && data.updaterole.mode === 'allowlist') {
            let fetchedLogs = await newRole.guild.fetchAuditLogs({
                type: AuditLogEvent.RoleUpdate,
                limit: 75,
            });

            let relevantLog = fetchedLogs.entries.find(entry =>
                entry.targetId === oldRole.id &&
                entry.executorId !== client.user?.id &&
                entry.executorId
            );

            if (!relevantLog) {
                return;
            }

            let baseData = await client.db.get(`${newRole.guild.id}.ALLOWLIST.list.${relevantLog.executorId}`);

            if (!baseData) {
                newRole.edit({
                    ...oldRole
                });

                let user = newRole.guild.members.cache.get(relevantLog?.executorId as string);

                switch (data?.['SANCTION']) {
                    case 'simply':
                        break;
                    case 'simply+derank':
                        await user?.roles.set([], "Punish").catch(() => false);
                        break;
                    case 'simply+ban':
                        user?.ban({ reason: 'Protect!' }).catch(() => { });
                        break;
                    default:
                        return;
                };
            };
        }
    },
};
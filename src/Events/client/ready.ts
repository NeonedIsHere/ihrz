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
    ActivityType,
} from "pwss";

import logger from "../../core/logger.js";

import { BotEvent } from "../../../types/event.js";

export const event: BotEvent = {
    name: "ready",
    run: async (client: Client) => {
        async function refreshDatabaseModel() {
            client.db.table(`TEMP`).deleteAll();
            let table = client.db.table("OWNER");
            let owners = [...client.owners, ...(await table.all()).map((x) => x.id)];

            owners.forEach(async (ownerId) => {
                try {
                    let _ = await client.users?.fetch(ownerId);
                    await table.set(_.id, { owner: true });
                } catch {
                    table.delete(ownerId);
                }
            });
        }

        async function quotesPresence() {
            client.user?.setPresence({
                activities: [
                    {
                        name: `music on ${client.guilds.cache.size} guilds | Use ;help`,
                        type: ActivityType.Listening,
                    },
                ],
            });
        }

        await client.player.init({
            id: client.user?.id as string,
            username: "bot_" + client.user?.id,
        });

        setInterval(quotesPresence, 120_000),
            refreshDatabaseModel(),
            quotesPresence(),
            logger.log(`${client.config.console.emojis.HOST} >> Bot is ready`.white);
    },
};

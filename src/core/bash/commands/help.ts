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

import { Client } from "pwss";
import { BashCommands } from "../../../../types/bashCommands";
import logger from "../../logger.js";

export const command: BashCommands = {
    command_name: "help",
    command_description: "Show this message",
    run: function (client: Client, args: string) {
        let string = `iHorizon bash,\nThese shell commands are defined internally.    Type 'help' to see this list.\n\n`;

        let commands = client.bash.map(index => ({
            command_name: index.command_name,
            command_description: index.command_description
        }));

        commands.sort((a, b) => a.command_name.localeCompare(b.command_name));

        commands.forEach(command => {
            const padding = ' '.repeat(47 - command.command_name.length);
            string += ` ${command.command_name}${padding}${command.command_description}\r\n`;
        });

        logger.legacy(string);
    }
};

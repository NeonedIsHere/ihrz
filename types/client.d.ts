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

import { LyricsManager } from "../src/core/functions/lyrics-fetcher.js";
import { iHorizonTimeCalculator } from "../src/core/functions/ms.js";
import * as argsHelper from '../src/core/functions/method.js'

import { GiveawayManager } from "../src/core/modules/giveawaysManager.js";
import { Collection, Snowflake } from 'discord.js';
import { LavalinkManager } from "lavalink-client";

import { clientFunction } from "./clientFunction";
import { AnotherCommand } from "./anotherCommand";
import { BotContent } from './botContent'
import { Category } from "./category";

import { VanityInviteData } from "./vanityUrlData";
import { Command } from "./command";
import { Emojis } from "./emojis";

import * as ClientVersion from "../src/version.js";
import { Assets } from "./assets";
import { ConfigData } from "./configDatad.js";
import { BashCommands } from "./bashCommands.js";
import { StreamNotifier } from "../src/core/StreamNotifier.js";
import { models } from "../src/core/newDatabase.js";
import { SteganoDB } from "stegano.db";

declare module 'discord.js' {
    export interface Client {
        func: clientFunction,
        commands: Collection<string, Command>,
        category: Category[]
        message_commands: Collection<string, Command>,
        player: LavalinkManager,
        invites: Collection<string, Collection<string, number | null>>,
        vanityInvites: Collection<Snowflake, VanityInviteData>,
        buttons: Collection<string, Function>,
        selectmenu: Collection<string, Function>,
        db: SteganoDB,
        m: typeof models,
        db2: typeof models.exec,
        applicationsCommands: Collection<string, AnotherCommand>,
        iHorizon_Emojis: Emojis,
        giveawaysManager: GiveawayManager,
        content: BotContent[],
        timeCalculator: iHorizonTimeCalculator,
        lyricsSearcher: LyricsManager,
        version: typeof ClientVersion,
        assets: Assets,
        config: ConfigData,
        isModuled?: boolean,
        owners: string[],
        method: typeof argsHelper,
        bash: Collection<string, BashCommands>,
        notifier: StreamNotifier
    }
};
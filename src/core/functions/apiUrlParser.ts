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

import { Assets } from "../../../types/assets.js";
import config from "../../files/config.js";

export enum ClusterMethod {
    CreateContainer = 0,
    DeleteContainer = 1,
    StartupContainer = 2,
    ShutdownContainer = 3,
    PowerOnContainer = 4,
    ChangeTokenContainer = 5,
    ChangeOwnerContainer = 6,
    ChangeExpireTime = 7,
    StartupCluster = 8,
    ShutDownCluster = 9
};

export enum GatewayMethod {
    GenerateOauthLink = 0,
    CreateRestoreCordGuild = 1,
    ForceJoinRestoreCord = 2,
    AddSecurityCodeAmount = 3,
    ChangeRole = 4,
};


export function assetsFinder(body: Assets, type: string): string {
    return `https://raw.githubusercontent.com/ihrz/assets/main/${type}/${Math.floor(Math.random() * body[type])}.gif`;
};

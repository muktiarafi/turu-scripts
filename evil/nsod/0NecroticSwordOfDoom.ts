/*
name: Necrotic Sword of Doom
description: Does the entirety of and to farm "necrotic sword of doom"
tags: nsod, necrotic, sword, doom, necrotic sword of doom
*/
// Port of Scripts/Evil/NSoD/0NecroticSwordOfDoom.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreNSOD } from "./CoreNSOD";

const NSoD = new CoreNSOD();

export class NecroticSwordOfDoom {}

export const scriptOptions = defineScriptOptions(
    NSoD.optionsStorage,
    [NSoD.maxStack, NSoD.preFarm, NSoD.getSDKA, Core.skipOptions],
    true,
);

export default function main(): void {
    if (
        (!bot.config!.get<boolean>("getSDKA") && !Core.isMember) ||
        (!Core.checkInventory(14474, undefined, { toInv: false }) && !Core.isMember)
    ) {
        Core.bankingBlackList.push(...NSoD.essences);
    }

    Core.setOptions();

    NSoD.getNSOD();

    Core.setOptions(false);
}

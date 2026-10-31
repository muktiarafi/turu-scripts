/*
name: Smart Void Auras
description: farms void auras via what ever the current best method you have to farm them..
tags: smart, gathering, unstable, essences, commanding, shadow, essences, retrieve, void aura
*/
// Port of Scripts/Evil/NSoD/VoidAuras/0SmartVoidAuras.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions } from "turu";
import { Core } from "../../../core/CoreBots";
import { CoreNSOD } from "../CoreNSOD";

const NSoD = new CoreNSOD();

export class SmartVoidAuras {}

export const scriptOptions = defineScriptOptions(
    NSoD.optionsStorage,
    [NSoD.maxStack, NSoD.getSDKA, Core.skipOptions],
    true,
);

export default function main(): void {
    if (
        (!bot.config!.get<boolean>("getSDKA") && !Core.isMember) ||
        (!Core.checkInventory(14474, undefined, { toInv: false }) && !Core.isMember)
    ) {
        Core.bankingBlackList.push(...NSoD.essences);
    }
    Core.bankingBlackList.push("Void Aura");

    Core.setOptions();

    NSoD.voidAuras();

    Core.setOptions(false);
}

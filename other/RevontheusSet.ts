/*
name: Revontheus Set
description: farms the "Revontheus" set from Mob: "Undead Legend".
tags: revontheus, undead legend, set
*/
// Port of Scripts/Other/RevontheusSet.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { ClassType, Core } from "../core/CoreBots";

export class RevontheusSet {
    getSet(): void {
        const Set = ["Revontheus Visage", "Wings of Revontheus", "Revontheus"];

        if (Core.checkInventory(Set)) {
            Core.logger("You already have the set");
            return;
        }

        Core.addDrop(...Set);
        Core.equipClass(ClassType.Solo);

        while (!bot.shouldExit && !Core.checkInventory(Set)) {
            Core.killMonster("underworld", "r10", "Left", "Undead Legend", undefined, undefined, { log: false });
        }

        if (bot.config!.get<boolean>("Equip")) {
            Core.equip(...Set);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "RevontheusSet",
    [Core.skipOptions, option.bool("Equip", "Equip the revontheus set?", "", false)],
    true,
);

export default function main(): void {
    const script = new RevontheusSet();
    Core.setOptions();

    script.getSet();

    Core.setOptions(false);
}

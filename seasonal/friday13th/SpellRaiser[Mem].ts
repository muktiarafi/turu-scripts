/*
name: SpellRaiser Set (Member Only)
description: This will do the required quest for the SpellRaiser Set.
tags: spellraiser, member, friday-the-13th, seasonal
*/
// Port of Scripts/Seasonal/Friday13th/SpellRaiser[Mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFriday13th } from "./story/CoreFriday13th";

const F13 = new CoreFriday13th();

export class SpellRaiser {
    getAll(): void {
        const AllRewards = [
            ...[
                ...Core.ensureLoad(7400).rewards.map((i) => i.name),
                ...Core.ensureLoad(7402).rewards.map((i) => i.name),
            ],
            ...Core.ensureLoad(7404).rewards.map((i) => i.name),
        ];

        if (Core.checkInventory(AllRewards, undefined, { toInv: false })) {
            return;
        }

        F13.splatterwar();

        bot.drops.add(...AllRewards);

        Core.equipClass(ClassType.Farm);

        Core.registerQuests(7400, 7402, 7404);
        while (!bot.shouldExit && !Core.checkInventory(AllRewards, undefined, { toInv: false })) {
            Core.killMonster("splatterwardage", "r4", "Left", "*", undefined, undefined, { log: false });
        }
        Core.jumpWait();
        Core.toBank(...AllRewards);
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new SpellRaiser();
    Core.setOptions();

    script.getAll();

    Core.setOptions(false);
}

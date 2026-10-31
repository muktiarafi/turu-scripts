/*
name: The Lost Knight Set and Backup Blade (Member Only)
description: This will do the required quest for the The Lost Knight Set and Backup Blade Cape.
tags: the-lost-knight, backup-blade, member, friday-the-13th, seasonal
*/
// Port of Scripts/Seasonal/Friday13th/TheLostKnightAndBackupBlade[Mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFriday13th } from "./story/CoreFriday13th";

const F13 = new CoreFriday13th();

export class TheLostKnightAndBackupBlade {
    getAll(): void {
        const AllRewards = [
            ...[
                ...Core.ensureLoad(7401).rewards.map((i) => i.name),
                ...Core.ensureLoad(7403).rewards.map((i) => i.name),
            ],
            ...Core.ensureLoad(7405).rewards.map((i) => i.name),
        ];

        if (Core.checkInventory(AllRewards, undefined, { toInv: false })) {
            return;
        }

        F13.splatterwar();

        bot.drops.add(...AllRewards);

        Core.equipClass(ClassType.Farm);

        Core.registerQuests(7401, 7403, 7405);
        while (!bot.shouldExit && !Core.checkInventory(AllRewards, undefined, { toInv: false })) {
            Core.killMonster("splatterwarshrade", "r3", "Right", "*", undefined, undefined, { log: false });
        }
        Core.jumpWait();
        Core.toBank(...AllRewards);
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new TheLostKnightAndBackupBlade();
    Core.setOptions();

    script.getAll();

    Core.setOptions(false);
}

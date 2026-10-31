/*
name: Lesser Hollowborn Caladbolg
description: This script will get Lesser Hollowborn Caladbolg by completing "How Much For One Rib?" quest.
tags: lesser caladbolg, caladbolg, hollowborn, dark unicorn rib, how much for one rib, quest
*/
// Port of Scripts/Hollowborn/HollowbornLichKing/LesserHollowbornCaladbolg.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreHollowbornLichKing, CounterblowRewards } from "./CoreHollowbornLichKing";

const coreHollowbornLichKing = new CoreHollowbornLichKing();

export class LesserHollowbornCaladbolg {
    getLHC(): void {
        // Lesser Hollowborn Caladbolg
        if (Core.checkInventory(85029, undefined, { toInv: false })) {
            return;
        }

        Core.addDrop("Lesser Hollowborn Caladbolg", "Darkon's Receipt", "Ingredients?", "Hollow Soul");

        coreHollowbornLichKing.counterblow(CounterblowRewards.Altar_Of_the_Hollowborn_Caladbolg);

        Core.equipClass(ClassType.Solo);
        // for darkon receipts v
        Core.registerQuests(7325, 9665);
        while (!bot.shouldExit && !Core.checkInventory(85029)) {
            Core.huntMonster("doomvault", "Binky", "Dark Unicorn Rib", undefined, { isTemp: false, log: false });
        }
        Core.cancelRegisteredQuests();
        Core.logger("RNG gods have smiled upon you! Banking the weapon.");
        Core.toBank("Lesser Hollowborn Caladbolg");
    }
}

export default function main(): void {
    const script = new LesserHollowbornCaladbolg();
    Core.setOptions();

    script.getLHC();

    Core.setOptions(false);
}

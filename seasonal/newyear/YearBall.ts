/*
name: Year Ball
description: This will farm the Year Ball items.
tags: farm, seasonal, new-year, year-ball, merge
*/
// Port of Scripts/Seasonal/NewYear/YearBall.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";

export class YearBall {
    getDrops(): void {
        if (!Core.isSeasonalMapActive("newyear")) {
            return;
        }

        const ACNonmem = [
            "AntiRetrograde Clock",
            "Aurora Caller",
            "Aurora Caller's Bow",
            "Aurora Caller's Cape",
            "Aurora Caller's Hat",
            "Aurora Caller's Helm",
            "Aurora Caller's Rune",
            "Aurora Caller's Staff",
            "Aurora Caller's Wings",
            "Axeros' Snow Globe Wand",
            "Chaotic Chrono Eye",
            "Elegant Bejeweled Cane",
            "Frigid Wolf Spear",
            "Glacial Knight",
            "Glacial Knight Cape",
            "Glacial Knight Crown",
            "Glacial Knight Crown Locks",
            "Glacial Knight Hair",
            "Glacial Knight Locks",
            "Glacial Knight Rune",
            "Glacial Knight Rune Sword Cape",
            "Glacial Knight Shag",
            "Glacial Knight Sword",
            "Glacial Knight Swords",
            "Nascent ChronoWeaver's Runes",
            "New Year Dawning",
            "Party Time Twig Pet",
            "Sheathed Glacial Knight Cape",
            "Timeseeker's Blades",
            "Timeseeker's Staff",
        ];

        if (Core.checkInventory(ACNonmem, undefined, { toInv: false })) {
            Core.logger("You already have all of the items.");
            return;
        }

        for (const Reward of ACNonmem) {
            Core.huntMonster("newyear", "2023 Ball", Reward, undefined, { isTemp: false });
            Core.toBank(Reward);
        }
    }
}

export default function main(): void {
    const script = new YearBall();
    Core.setOptions();

    script.getDrops();

    Core.setOptions(false);
}

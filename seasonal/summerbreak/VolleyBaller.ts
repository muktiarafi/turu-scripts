/*
name: Volley Baller
description: This will finish the Volley Baller Quest and farm items.
tags: farm, quest, volley-baller, summer-break
*/
// Port of Scripts/Seasonal/SummerBreak/VolleyBaller.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";

export class VolleyBaller {
    readonly rewards: string[] = [
        "Volleyball Captain",
        "Volleyball Hero",
        "Volleyball Hero's Hat",
        "Volleyball Heroine's Hat",
        "Volleyball Hero's Hat + Glasses",
        "Volleyball Heroine's Hat + Glasses",
        "Volleyball Hero's Glasses",
        "Volleyball Team A Mascot",
        "Volleyball Hero's Board Cape",
        "Volleyball Team A Mascot Pet",
        "Volleyball Hero's Rod",
        "Volleyball Hero's Surfboard",
        "Volleyball Hero's Foam Spear",
        "Volleyball Hero's Foam Gauntlets",
        "Volleyball Hero's WaterGun",
        "Volleyball Hero's WaterGuns",
    ];

    volleyBallerQuest(): void {
        if (!Core.isSeasonalMapActive("summerbreak")) {
            return;
        }

        Core.addDrop(...this.rewards);

        let i = 1;
        while (!bot.shouldExit && !Core.checkInventory(this.rewards, undefined, { toInv: false })) {
            Core.ensureAccept(8794);
            Core.huntMonster("summerbreak", "MMMirage", "Gum Ball", 6);
            Core.ensureCompleteChoose(8794);
            Core.toBank(...this.rewards);
            Core.logger(`Completed x${i++}`);
        }
        Core.logger("All drops Already Acquired");
    }
}

export default function main(): void {
    const script = new VolleyBaller();
    Core.bankingBlackList.push(...script.rewards);
    Core.setOptions();

    script.volleyBallerQuest();

    Core.setOptions(false);
}

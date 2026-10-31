/*
name: Sweet Summer Treats
description: This will farm the Sweet Summer Treats.
tags: farm, merge, shop, sweet, summer-break, treats
*/
// Port of Scripts/Seasonal/SummerBreak/SweetSummerTreats.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";

export class SweetSummerTreats {
    getTreats(): void {
        if (!Core.isSeasonalMapActive("summerbreak")) {
            return;
        }

        const rewards = ["Sunflower Outfit", "SunFlower Locks", "Sunflower Hair"];
        if (Core.checkInventory(rewards, undefined, { toInv: false })) {
            return;
        }

        Core.addDrop(...rewards);
        Core.registerQuests(7578);
        while (!bot.shouldExit && Core.checkInventory(rewards)) {
            Core.huntMonster("summerbreak", "Ice Cream Shark", "Icecream Shark", 3, { isTemp: false });
            Core.huntMonster("summerbreak", "MMMirage", "MMMirage", 3, { isTemp: false });
            Core.huntMonster("summerbreak", "Bananasplit", "Bananasplit", 3, { isTemp: false });
        }
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new SweetSummerTreats();
    Core.setOptions();

    script.getTreats();

    Core.setOptions(false);
}

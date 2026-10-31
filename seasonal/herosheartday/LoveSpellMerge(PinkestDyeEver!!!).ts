/*
name: Love Spell Merge (Pinkest Dye Ever!!!)
description: This will farm Pinkest Dye Ever!!! for the Love Spell Merge.
tags: farm, merge, shop, seasonal, heros, heart, love, spell, pinkest, dye
*/
// Port of Scripts/Seasonal/HerosHeartDay/LoveSpellMerge(PinkestDyeEver!!!).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { LoveSpell } from "./LoveSpellStory";

const LSS = new LoveSpell();

export class PinkestDyeEver {
    pinkestDyeEverScript(): void {
        if (!Core.isSeasonalMapActive("lovespell")) {
            return;
        }
        if (Core.checkInventory("Pinkest Dye Ever!!!", 200)) {
            Core.logger("You already have 200 (Max Quantity) Pinkest Dye Ever!!!");
            return;
        }

        Core.addDrop("Pinkest Dye Ever!!!");

        LSS.loveSpellScript();

        while (!bot.shouldExit && !Core.checkInventory("Pinkest Dye Ever!!!", 200)) {
            Core.ensureAccept(7935);
            Core.huntMonster("lovespell", "Mood Slime", "Mood Slime Hearts", 10);
            Core.huntMonster("lovespell", "Stolen Heart");
            Core.ensureComplete(7935);
        }
        Core.logger("You now have 200 (Max Quantity) Pinkest Dye Ever!!!");
    }
}

export default function main(): void {
    const script = new PinkestDyeEver();
    Core.setOptions();

    script.pinkestDyeEverScript();

    Core.setOptions(false);
}

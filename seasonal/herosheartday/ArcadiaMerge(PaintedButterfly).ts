/*
name: Painted Butterfly (Arcadia Merge)
description: This will complete the Painted Butterfly quest.
tags: farm, merge, quest, arcadia, seasonal, painted, butterfly, hero, heart
*/
// Port of Scripts/Seasonal/HerosHeartDay/ArcadiaMerge(PaintedButterfly).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.
// Must Have Completed Arcadia Storyline Up To: "Seperation Anxiety": http://aqwwiki.wikidot.com/big-daddy-s-quests#ArcadiaFarm

import { bot } from "turu";
import { Core } from "../../core/CoreBots";

export class FarmPaintedButterfly {
    paintedButterfly(): void {
        if (!Core.isSeasonalMapActive("arcadia")) {
            return;
        }
        Core.addDrop("Painted Butterfly");

        while (!bot.shouldExit && !Core.checkInventory("Painted Butterfly", 300)) {
            Core.ensureAccept(8520);
            Core.huntMonster("arcadia", "Agape", "Agape Petal", 1);
            Core.huntMonster("arcadia", "Spirit Butterfly", "Paper Butterfly Wings", 8);
            Core.huntMonster("arcadia", "Lightguard Wraith", "Armor Paint Residue", 8);
            Core.ensureComplete(8520);
        }
    }
}

export default function main(): void {
    const script = new FarmPaintedButterfly();
    Core.setOptions();

    script.paintedButterfly();

    Core.setOptions(false);
}

/*
name: Unoriginal Recipe Farm
description: Farms the max Unoriginal Recipe quantity.
tags: unoriginal-recipe, seasonal, april-fools
*/
// Port of Scripts/Seasonal/AprilFools/MeateorHuntMerge(UnoriginalRecipe).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { MeateorHunt } from "./MeateorHunt";

const MH = new MeateorHunt();

export class MeateorHuntMerge {
    getUnoriginalRecipe(Quant = 300): void {
        if (!Core.isSeasonalMapActive("MeateorTown")) {
            return;
        }
        //Item Check
        if (Core.checkInventory("Unoriginal Recipe", Quant)) {
            return;
        }

        //Add Drop
        Core.addDrop("Unoriginal Recipe");

        //Quest PreReqs
        MH.storyLine();

        Core.equipClass(ClassType.Solo);

        while (!bot.shouldExit && !Core.checkInventory("Unoriginal Recipe", Quant)) {
            Core.ensureAccept(8629);

            Core.huntMonster("BattleFowl", "Egg-stremis", "Egg-Streme Drumstick", undefined, { publicRoom: true });
            Core.huntMonster("BattleonTown", "ChickenCow", "ChickenCow Wings");
            Core.huntMonster("BattleFowl", "Zeuster Projection", "Zeuster's Thigh");
            Core.huntMonster("BattleFowl", "Sabertooth Chicken", "Chick-N-Nuggets", 10);

            Core.ensureComplete(8629);
        }
    }
}

export default function main(): void {
    const script = new MeateorHuntMerge();
    Core.setOptions();

    script.getUnoriginalRecipe();

    Core.setOptions(false);
}

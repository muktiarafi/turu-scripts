/*
name: Abhorrent Remains Farm
description: Farms the max Abhorrent Remains quantity.
tags: abhorrent-remains, kala, seasonal
*/
// Port of Scripts/Seasonal/IndonesianDay/KalaMergeAbhorrentRemains.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { KalaSeasonal } from "./Kala";

const Kala = new KalaSeasonal();

export class KalaMergeNonDaily {
    kalaMerge(item = "Abhorrent Remains", Quantity = 130): void {
        if (Core.checkInventory(item, Quantity)) {
            return;
        }

        if (!Core.isCompletedBefore(8215)) {
            Kala.storyLine();
        }

        Core.addDrop(item);
        Core.equipClass(ClassType.Farm);
        Core.registerQuests(8215);
        while (!bot.shouldExit && !Core.checkInventory(item, Quantity)) {
            Core.killMonster("kala", "r4", "Left", "Cemani Dricken", "Drickens Plucked", 8);
            Core.killMonster("kala", "r5", "Left", "Coconut Treeant", "Coconuts Collected", 8);
        }
    }
    //Didnt use Hunt because it kept getting into Kala's room and soft locking itself.
}

export default function main(): void {
    const script = new KalaMergeNonDaily();
    Core.setOptions();

    script.kalaMerge();

    Core.setOptions(false);
}

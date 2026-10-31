/*
name: Hanzo Orb Quests
description: Does the quests from either the Astral Orb Pet, or the Crimson Orb Pet
tags: astral, crimson, orb, pet, quests
*/
// Port of Scripts/Seasonal/SolarNewYear/EvenNaughtierMonkeys.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { WaterWar } from "./WaterWar";

const WW = new WaterWar();

export class EvenNaughtierMonkeys {
    rewards(): void {
        WW.storyLine();

        const rewards = Core.questRewards(6821);
        Core.addDrop(...rewards);

        Core.registerQuests(6821);
        for (const item of rewards) {
            while (!bot.shouldExit && !Core.checkInventory(item)) {
                Core.huntMonster("waterwar", "Temple Gibbon", "Clean Rag", 7);
            }
        }
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new EvenNaughtierMonkeys();
    Core.setOptions();

    script.rewards();

    Core.setOptions(false);
}

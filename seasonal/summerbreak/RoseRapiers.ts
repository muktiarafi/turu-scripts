/*
name: Rose Rapiers
description: does the quests in /summerhub (part of the thorny scavenger clue) for both rose rapiers
tags: rose, rapier, summer, seasonal, summerhub
*/
// Port of Scripts/Seasonal/SummerBreak/RoseRapiers.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";

export class RoseRapiers {
    getWeapons(): void {
        if (!Core.isSeasonalMapActive("Summerhub")) {
            return;
        }

        const RewardOptions = Core.ensureLoad(9278).rewards;

        bot.drops.add(...Core.questRewards(9278));
        bot.drops.add("Rose Clue", "Not the Bush You Were Looking For", "Compass Rose");

        for (const item of RewardOptions) {
            bot.drops.add(item.id);
            while (!bot.shouldExit && !Core.checkInventory(item.id)) {
                Core.ensureAcceptmultiple(9275, 9276, 9277, 9278);

                //Edit the Hunt Below\add more if needed
                Core.huntMonster("underglade", "Lunamoss", "Found the Rose Clue");
                Core.ensureComplete(9275);
                Core.huntMonster("terrarium", "Shambush", "Found the Not the Bush Clue");
                Core.ensureComplete(9276);
                Core.huntMonster("elemental", "Tree of Destiny", "Found the Compass Rose Clue");
                Core.ensureComplete(9277);
                Core.huntMonster("runedwoods", "Jir'abin", "Found the Rose Blades!");

                Core.ensureComplete(9278, item.id);
            }
        }
    }
}

export default function main(): void {
    const script = new RoseRapiers();
    Core.setOptions();

    script.getWeapons();

    Core.setOptions(true);
}

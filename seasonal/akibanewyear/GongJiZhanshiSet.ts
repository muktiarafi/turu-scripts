/*
name: Gong Ji Zhanshi Set
description: Farms the Gong Ji Zhanshi set from Red Envelope Hunt quest.
tags: seasonal, akiba new year, gong ji zhanshi, red envelope hunt, akibacny
*/
// Port of Scripts/Seasonal/AkibaNewYear/GongJiZhanshiSet.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class GongJiZhanshiSet {
    doQuest(): void {
        this.questsIfNeeded();
        this.getTheSet(5668, 1);
    }

    getTheSet(questID = 5668, quant = 1): void {
        const RewardOptions = Core.ensureLoad(questID).rewards;

        for (const item of RewardOptions) {
            Core.addDrop(item.name);
        }

        for (const item of RewardOptions) {
            while (!bot.shouldExit && !Core.checkInventory(item.id, quant)) {
                Core.ensureAccept(questID);
                Core.huntMonster("akibacny", "Fiery Lantern", "Lucky Envelope", undefined, { log: false });
                Core.ensureComplete(questID, item.id);
            }
        }
    }

    questsIfNeeded(): void {
        if (Core.isCompletedBefore(5667) || !Core.isSeasonalMapActive("akibacny")) {
            return;
        }

        Story.preLoad(this.questsIfNeeded);

        //Red Chicken Dance (5663)
        Story.mapItemQuest(5663, "akibacny", 5132);
        Story.killQuest(5663, "akibacny", "Red Chicken");

        //Year of Fire FIght (5664)
        Story.killQuest(5664, "akibacny", "Fiery Lantern");

        //HolyCud Crooner (5665)
        Story.killQuest(5665, "akibacny", "Xingzhi");

        //Summon of the Spicy One (5666)
        Story.mapItemQuest(5666, "akibacny", 5133);

        //Too Hot to Handle? (5667)
        Story.killQuest(5667, "akibacny", "Sriracha Holycud");
    }
}

export default function main(): void {
    const script = new GongJiZhanshiSet();
    Core.setOptions();

    script.doQuest();

    Core.setOptions(true);
}

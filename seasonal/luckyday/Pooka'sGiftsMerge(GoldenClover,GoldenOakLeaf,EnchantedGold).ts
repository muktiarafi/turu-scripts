/*
name: Pooka's Gifts Merge
description: This will merge Pooka's Gifts.
tags: farm, merge, pooka, seasonal, lucky, shop, gift
*/
// Port of Scripts/Seasonal/LuckyDay/Pooka'sGiftsMerge(GoldenClover,GoldenOakLeaf,EnchantedGold).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { PookaStory } from "./Pooka";

const Pooka = new PookaStory();

export class PookasGiftsMerge {
    getGiftItems(): void {
        if (!Core.isSeasonalMapActive("pooka")) {
            return;
        }
        Core.addDrop("Golden Clover", "Golden Oak Leaf", "Enchanted Gold");

        Pooka.completePooka();

        while (!bot.shouldExit && !Core.checkInventory(["Golden Clover", "Golden Oak Leaf", "Enchanted Gold"], 100)) {
            //Golden Clover
            if (!Core.checkInventory("Golden Clover", 100)) {
                Core.ensureAccept(7963);
                Core.huntMonster("pooka", "Sneevilchaun", "Lucky Clover", 10);
                Core.ensureComplete(7963);
            }

            //Golden Oak Leaf
            if (!Core.checkInventory("Golden Oak Leaf", 100)) {
                Core.ensureAccept(7964);
                Core.ensureAccept(7965);
                Core.huntMonster("pooka", "Lucky Treeant", "Oak Leaf", 6);
                Core.ensureComplete(7964);
            }

            //Enchanted Gold
            if (!Core.checkInventory("Enchanted Gold", 100)) {
                Core.huntMonster("pooka", "Lucky Treeant", "Treeant Wood", 5);
                Core.huntMonster("pooka", "Faerie", "Can of Gold Paint");
                Core.ensureComplete(7965);
            }
        }
    }
}

export default function main(): void {
    const script = new PookasGiftsMerge();
    Core.setOptions();

    script.getGiftItems();

    Core.setOptions(false);
}

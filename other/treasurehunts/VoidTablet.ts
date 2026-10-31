/*
name: Void Tablet Treasure Hunt
description: This script will complete the Void Tablet Treasure Hunt, which rewards Void Medulla Makila.
tags: void tablet, treasure hunt,museum,valencia,void gem,void-walking,void-walking potion,void,void shop,void medulla makilla
*/
// Port of Scripts/Other/TreasureHunts/VoidTablet.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class VoidTablet {
    doHunt(): void {
        if (Core.checkInventory("Void Medulla Makila")) {
            return;
        }

        Core.addDrop("Void Medulla Makila");

        // Void Tablet Hunt Started
        if (!Core.checkInventory(93827)) {
            Core.addDrop(93827);
            Core.getMapItem(14493, undefined, "museum");
        }

        // Void Gem
        if (!Core.checkInventory(93828)) {
            Core.addDrop(93828);
            Core.getMapItem(14494, undefined, "voidcave");
        }
        // Potion of Void-Walking
        if (!Core.checkInventory(Core.questRewards(10269))) {
            Core.addDrop(...Core.questRewards(10269));
            Core.ensureAccept(10269);
            Adv.buyItem("alchemyacademy", 397, 11474, 2, 1231);
            Core.huntMonster("lumafortress", "Light Treeant", "Light Apples", 4);
            Core.huntMonster("rivensylth", "Rivensylth Spider", "Spider Venom", 8);
            if (!Core.checkInventory("Void Energy Crystal")) {
                Core.getMapItem(14495, undefined, "laken");
            }
            Core.ensureComplete(10269);
            bot.wait.forPickup(Core.questRewards(10269)[0]);
        }

        // Golden Void Star
        if (!Core.checkInventory("Golden Void Star")) {
            Core.addDrop("Golden Void Star");
            Core.getMapItem(14497, undefined, "voidtempext");
        }

        // Void Medulla Makila
        Core.buyItem("void", 2583, 75303);
    }
}

export default function main(): void {
    const script = new VoidTablet();
    Core.setOptions();

    script.doHunt();

    Core.setOptions(false);
}

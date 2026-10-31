/*
name: Posty Mc Nobbins Quest Rewards
description: gest the quest rewards from all 4 quest from mc nobbins.
tags: mc nobbins, quest reward, farm, lucky day, luck, seasonal
*/
// Port of Scripts/Seasonal/Grenwog(Easter)/VorpalBunnyQuestRewards.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class VorpalBunnyQuestRewards {
    bunnySuit: string[] = [
        "Transforming Berzerker Bunny Helm",
        "Transforming Spear of the Berzerker Bunny",
        "Bunny on your Back",
    ];

    berzerkerBunnyHelm(): void {
        Core.addDrop("Transforming Berzerker Bunny Helm");
        if (!Core.isSeasonalMapActive("grenwog") || Core.checkInventory("Transforming Berzerker Bunny Helm")) {
            return;
        }

        Core.ensureAccept(234);
        Core.huntMonster("farm", "Treeant", "Wooden Egg");
        Core.ensureComplete(234);
        bot.wait.forPickup("Transforming Berzerker Bunny Helm");
    }

    transformingBunnySpear(): void {
        Core.addDrop("Transforming Spear of the Berzerker Bunny");
        if (!Core.isSeasonalMapActive("grenwog") || Core.checkInventory("Transforming Spear of the Berzerker Bunny")) {
            return;
        }

        Core.ensureAccept(235);
        Core.huntMonster("boxes", "Grizzlespit", "Egg Shell");
        Core.ensureComplete(235);
        bot.wait.forPickup("Transforming Spear of the Berzerker Bunny");
    }

    bunnyonyourBack(): void {
        Core.addDrop("Bunny on your Back");
        if (!Core.isSeasonalMapActive("grenwog") || Core.checkInventory("Bunny on your Back")) {
            return;
        }

        Core.ensureAccept(237);
        Core.huntMonster("orctown", "General Porkon", "Quacked Egg");
        Core.ensureComplete(237);
        bot.wait.forPickup("Bunny on your Back");
    }
}

export default function main(): void {
    const script = new VorpalBunnyQuestRewards();
    Core.setOptions();

    Farm.berserkerBunny(0, false);
    script.berzerkerBunnyHelm();
    script.transformingBunnySpear();
    script.bunnyonyourBack();

    Core.setOptions(false);
}

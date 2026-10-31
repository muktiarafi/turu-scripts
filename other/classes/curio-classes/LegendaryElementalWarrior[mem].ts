/*
name: LegendaryElementalWarrior[mem]
description: null
tags: null
*/
// Port of Scripts/Other/Classes/Curio-Classes/LegendaryElementalWarrior[mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";
import { GlaceraStory } from "../../../story/Glacera";
import { Core13LoC } from "../../../story/lordsofchaos/Core13LoC";

const Adv = new CoreAdvanced();
const glaceraStory = new GlaceraStory();
const LOC = new Core13LoC();

export class LegendaryElementalWarrior {
    getLEW(rankUpClass = true): void {
        if (Core.checkInventory("Legendary Elemental Warrior")) {
            return;
        }
        if (!Core.isMember) {
            Core.logger("Class requires member to buy without ACs.");
            return;
        }

        //Required Stories
        LOC.lionfang();
        glaceraStory.doAll();

        Adv.buyItem("Curio", 807, 22190);
        Adv.buyItem("Curio", 807, 22191);
        Adv.buyItem("Curio", 807, 22192);
        Adv.buyItem("Curio", 807, 22193);
        Adv.buyItem("Curio", 807, 22194);
        Adv.buyItem("Curio", 807, 22187);
        Adv.buyItem("Curio", 807, 22188);
        Adv.buyItem("Curio", 807, 22189);

        Core.buyItem("Curio", 809, "Legendary Elemental Warrior", undefined, 2412);

        if (rankUpClass) {
            Adv.rankUpClass("Legendary Elemental Warrior");
        }
    }
}

export default function main(): void {
    const script = new LegendaryElementalWarrior();
    Core.setOptions();

    script.getLEW();

    Core.setOptions(false);
}

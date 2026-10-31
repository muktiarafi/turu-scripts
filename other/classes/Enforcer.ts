/*
name: Enforcer Class
description: This script farms the Enforcer class.
tags: dwakel, mithril man, crashsite, class
*/
// Port of Scripts/Other/Classes/Enforcer.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Adv = new CoreAdvanced();
const Story = new CoreStory();

export class Enforcer {
    getClass(rankUpClass = true): void {
        if (Core.checkInventory("Enforcer")) {
            Core.logger("You already own Enforcer class.");
            return;
        }

        Core.addDrop("Enforcer");

        // Quadrolithium (122)
        Story.killQuest(122, "crashsite", "Dwakel Blaster");

        // Dam Balloons (123)
        Story.killQuest(123, "crashsite", "Dwakel Blaster");

        // Bumper Bolts (124)
        Story.killQuest(124, "crashsite", "Dwakel Blaster");

        // Mithril Man Batteries (125)
        Story.killQuest(125, "crashsite", "Mithril Man");

        // ProtoSartorium Parts (126)
        Story.killQuest(126, "crashsite", "ProtoSartorium");

        if (rankUpClass) {
            Adv.rankUpClass("Enforcer");
        }
    }
}

export default function main(): void {
    const script = new Enforcer();
    Core.setOptions();

    script.getClass();
    Core.setOptions(false);
}

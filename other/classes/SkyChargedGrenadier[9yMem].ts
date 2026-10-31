/*
name: SkyCharged Grenadier (9years Membership)
description: This script farms the SkyCharged Grenadier class.
tags: skycharged, grenadier, 9years, member, sky charged, captain stratos
*/
// Port of Scripts/Other/Classes/SkyChargedGrenadier[9yMem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();
const Adv = new CoreAdvanced();

export class SkyChargedGrenadier {
    getSCG(rankUpClass = true): void {
        if (Core.checkInventory("SkyCharged Grenadier")) {
            return;
        }

        if (!Core.hasAchievement(28, "ip14")) {
            Core.logger("This bot requires you to have 9 Years Membership or more.", undefined, { messageBox: true });
            return;
        }

        if (Core.isCompletedBefore(6933)) {
            return;
        }

        Story.preLoad(this.getSCG);

        Core.equipClass(ClassType.Farm);

        Core.addDrop("SkyCharged Grenadier", "Charged Grenade");

        // Clean the Deck (6930)
        Story.killQuest(6930, "skycharged", "Sky Pirate Draconian");

        // Draconian Delivery (6931)
        Story.killQuest(6931, "skycharged", ["Sky Pirate Dragon", "Sky Pirate Draconian"]);

        // Gladius and some Jelly (6932)
        Story.killQuest(6932, "skycharged", ["Gladius", "Rehydrated Gell Oh No"]);

        Core.ensureAccept(6933);
        Core.registerQuests(6934);
        while (!bot.shouldExit && !Core.checkInventory("Charged Grenade", 50)) {
            Core.huntMonster("skycharged", "Sky Pirate Draconian", "Sky Pirate Draconian Chased Off", 10);
            bot.wait.forPickup("Charged Grenade");
        }

        Adv.buyItem("skycharged", 1648, "Evolved Grenadier");
        Core.ensureComplete(6933);
        bot.wait.forPickup("SkyCharged Grenadier");

        if (rankUpClass) {
            Adv.rankUpClass("SkyCharged Grenadier");
        }
    }
}

export default function main(): void {
    const script = new SkyChargedGrenadier();
    Core.setOptions();

    script.getSCG();

    Core.setOptions(false);
}

/*
name: HighSeasCommander[10y]
description: null
tags: null
*/
// Port of Scripts/Other/Classes/HighSeasCommander[10y].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();
const Adv = new CoreAdvanced();

export class HighSeasCommander {
    getHSC(rankUpClass = true): void {
        if (Core.checkInventory("HighSeas Commander")) {
            return;
        }

        if (!Core.hasAchievement(27, "ip14")) {
            Core.logger("This bot requires you to have an account of 10 years or older.", undefined, {
                messageBox: true,
            });
            return;
        }

        this.unlockFarm();

        Core.logger("Farming for HighSeas Commander");
        Core.buyItem(bot.map.name, 1647, "Enchanted Pirate");
        Core.addDrop("HighSeas Commander", "Enchanted Token");
        Core.ensureAccept(6921);
        if (!Core.checkInventory("Enchanted Token", 50)) {
            Core.registerQuests(6922);
            Core.logger(`Farming Enchanted Tokens (${bot.inventory.getQuantity("Enchanted Token")}/50)`);

            while (!Core.checkInventory("Enchanted Token", 50)) {
                Core.huntMonster("natatorium", "Merdraconian", "Merdraconian Defeated", 5);
                Core.huntMonster("natatorium", "Anglerfish", "Anglerfish Defeated", 5);
                Core.huntMonster("natatorium", "Nessie", "Nessie Defeated");
                bot.wait.forPickup("Enchanted Token");
            }
            Core.cancelRegisteredQuests();
        }
        Core.ensureComplete(6921);
        bot.wait.forPickup("HighSeas Commander");

        if (rankUpClass) {
            Adv.rankUpClass("HighSeas Commander");
        }
    }

    unlockFarm(): void {
        if (Core.isCompletedBefore(6920)) {
            return;
        }

        Story.preLoad(this.unlockFarm);

        //6918 | Sweep the Deck
        Story.killQuest(6918, "highseas", "Skeleton Crew");

        //6919 | Troubles In Deep Waters
        Story.killQuest(6919, "highseas", "Pirate Crew");

        //6920 | The Captain Wants a Word
        Story.killQuest(6920, "highseas", "Capt. Beard");
    }
}

export default function main(): void {
    const script = new HighSeasCommander();
    Core.setOptions();

    script.getHSC();

    Core.setOptions(false);
}

/*
name: Pirate Class
description: This script will get the Pirate Class.
tags: merge-shop, pirate, class, tlapd, talk-like-a-pirate-day, seasonal
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/PirateClass.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { BlazebeardMerge } from "./mergeshops/BlazeBeardMerge";

const Adv = new CoreAdvanced();
const BBM = new BlazebeardMerge();

export class PirateClass {
    getPirate(rankUpClass = true): void {
        if (Core.checkInventory(["Classic Pirate", "Pirate"], undefined, { any: true })) {
            if (rankUpClass) {
                Adv.rankUpClass(Core.checkInventory("Classic Pirate") ? "Classic Pirate" : "Pirate");
            }
            return;
        }

        if (!Core.isSeasonalMapActive("blazebeard")) {
            return;
        }

        this.tinyStory();
        BBM.buyAllMerge("Pirate");

        if (rankUpClass) {
            Adv.rankUpClass("Pirate");
        }
    }

    tinyStory(): void {
        if (!Core.checkInventory("Pirate")) {
            if (!Core.isCompletedBefore(31)) {
                if (!Core.isCompletedBefore(28)) {
                    Core.ensureAccept(28);
                    Core.huntMonster("pirates", "Shark Bait", "Pirate Key", undefined, { isTemp: true });
                    Core.getMapItem(19, 1, "pirates");
                    Core.ensureComplete(28);
                }

                if (!Core.isCompletedBefore(29)) {
                    Core.ensureAccept(29);
                    Core.huntMonster("pirates", "Fishman Soldier", "Fish Scale", 9);
                    Core.ensureComplete(29);
                }
                if (!Core.isCompletedBefore(30)) {
                    Core.ensureAccept(30);
                    Core.huntMonster("pirates", "Fishwing", "Fish Wings", 6);
                    Core.ensureComplete(30);
                }
            }

            //Map Recovery 31
            Core.addDrop("Pirate");
            Core.ensureAccept(31);
            Core.killMonster("Pirates", "Mast", "Left", "Fishwing", "Map Fragment", 5);
            Core.ensureComplete(31);
        }
    }
}

export default function main(): void {
    const script = new PirateClass();
    Core.setOptions();

    script.getPirate();

    Core.setOptions(false);
}

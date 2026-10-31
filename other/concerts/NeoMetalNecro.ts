/*
name: Neo Metal Necro[class]
description: does the battle concert even quests for the classes, and buys the class.
tags: concert, metal necro, neo metal necro
*/
// Port of Scripts/Other/Concerts/NeoMetalNecro.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { BattleConcertClassQuests } from "./BattleConcert2023";

const Adv = new CoreAdvanced();
const BCCQ = new BattleConcertClassQuests();

export class NeoMetalNecro {
    getClass(rankUpClass = true): void {
        if (Core.checkInventory("Neo Metal Necro")) {
            if (rankUpClass) {
                Adv.rankUpClass("Neo Metal Necro");
            }
            return;
        }

        BCCQ.battleConcertQuests();

        // Revive the Encore 9327
        Core.addDrop("Bone Pick");
        Core.registerQuests(9327);
        while (!bot.shouldExit && !Core.checkInventory("Bone Pick", 10)) {
            Core.huntMonster("brainmeat", "Brain Matter");
        }

        Adv.buyItem("skulldome", 2312, 78967, undefined, 11974);

        if (rankUpClass) {
            Adv.rankUpClass("Neo Metal Necro");
        }
    }
}

export default function main(): void {
    const script = new NeoMetalNecro();
    Core.setOptions();

    script.getClass();

    Core.setOptions(false);
}

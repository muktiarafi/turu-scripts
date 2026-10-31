/*
name: Rustbucket (Class)
description: This script will get ProtoSartorium class.
tags: rustbucket, early game, class
*/
// Port of Scripts/Other/Classes/Rustbucket.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class Rustbucket {
    getRustbucket(rankUpClass = true): void {
        if (Core.checkInventory("Rustbucket")) {
            if (rankUpClass) {
                Adv.rankUpClass("Rustbucket");
            }
            return;
        }

        Core.addDrop("Rustbucket");

        if (!Core.checkInventory("Rustbucket")) {
            Core.getMapItem(12756, 1, "crashsite");
            bot.wait.forPickup("Rustbucket");
        }

        if (rankUpClass) {
            Adv.rankUpClass("Rustbucket");
        }
    }
}

export default function main(): void {
    const script = new Rustbucket();
    Core.setOptions();

    script.getRustbucket();

    Core.setOptions(false);
}

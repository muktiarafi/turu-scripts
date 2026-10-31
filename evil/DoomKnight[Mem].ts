/*
name: DoomKnight Class[Mem]
description: This script will get DoomKnight Class [Member]
tags: doomknight, class, evil, doom knight, member
*/
// Port of Scripts/Evil/DoomKnight[Mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../core/CoreAdvanced";
import { Core } from "../core/CoreBots";
import { CoreFarms } from "../core/CoreFarms";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();

export class DoomKnight {
    getDoomKnight(rankUpClass = true): void {
        if (Core.checkInventory("DoomKnight")) {
            return;
        }

        Core.buyItem("necropolis", 26, "Warrior");
        Core.buyItem("necropolis", 26, "Healer");

        Adv.rankUpClass("Warrior");
        Adv.rankUpClass("Healer");

        Farm.evilREP(5);

        Core.buyItem("shadowfall", 100, "DoomKnight", undefined, 6309);

        if (rankUpClass) {
            Adv.rankUpClass("DoomKnight");
        }
    }
}

export default function main(): void {
    const script = new DoomKnight();
    Core.setOptions();

    script.getDoomKnight();

    Core.setOptions(false);
}

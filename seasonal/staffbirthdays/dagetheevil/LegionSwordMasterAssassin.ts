/*
name: Legion Sword Master Assassin
description: farms the required materials for the class: "legion swordmaster assassin"
tags: legion, class, darkbirthday, legion swordmaster assassin
*/
// Port of Scripts/Seasonal/StaffBirthdays/DageTheEvil/LegionSwordMasterAssassin.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";
import { CoreLegion } from "../../../legion/CoreLegion";

const Legion = new CoreLegion();
const Adv = new CoreAdvanced();

export class LegionSwordMasterAssassin {
    getClass(rankUpClass = true): void {
        if (Core.checkInventory("Legion SwordMaster Assassin") || !Core.isSeasonalMapActive("darkbirthday")) {
            return;
        }

        Core.addDrop("Soul Essence");

        Legion.obsidianRock(300);
        Legion.farmLegionToken(5000);

        Adv.buyItem("darkbirthday", 1697, "Legion SwordMaster Assassin");

        if (rankUpClass) {
            Adv.rankUpClass("Legion SwordMaster Assassin");
        }
    }
}

export default function main(): void {
    const script = new LegionSwordMasterAssassin();
    Core.setOptions();

    script.getClass();

    Core.setOptions(false);
}

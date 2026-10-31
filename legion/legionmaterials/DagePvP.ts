/*
name: Legion Combat Trophy
description: This script will farm Legion Combat Trophies in /dagepvp.
tags: legion, combat, trophy, dage, pvp, dage pvp, dagepvp
*/
// Port of Scripts/Legion/LegionMaterials/DagePvP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";

const Legion = new CoreLegion();

export class LegionCombatTrophy {
    doLegionCombatTrophy(): void {
        bot.options.lagKiller = false;
        //order of quants: Trophy - Technique - Scroll
        Legion.dagePvP();
    }
}

export default function main(): void {
    const script = new LegionCombatTrophy();
    Core.setOptions();
    Core.bankingBlackList.push("Legion Trophy", "Technique Observed", "Sword Scroll Fragment");
    script.doLegionCombatTrophy();

    Core.setOptions(false);
}

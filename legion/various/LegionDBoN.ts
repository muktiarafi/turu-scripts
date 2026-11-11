/*
name: LegionDBoN
description: null
tags: null
*/
// Port of Scripts/Legion/Various/LegionDBoN.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";
import { CoreNation } from "../../nation/CoreNation";
import { DragonBladeofNulgath } from "../../nation/various/DragonBlade[mem]";

const Legion = new CoreLegion();
const Nation = new CoreNation();
const DBoN = new DragonBladeofNulgath();

export class LegionDBoN {
    getLegionDBoN(): void {
        if (Core.checkInventory("Legion DragonBlade of Nulgath")) {
            return;
        }

        Legion.farmLegionToken(5000);
        DBoN.getDragonBlade(true);
        bot.wait.forPickup("Legion DragonBlade of Nulgath");

        //Merge:
        Core.buyItem("underworld", 238, "Legion DragonBlade of Nulgath");
    }
}

export default function main(): void {
    const script = new LegionDBoN();
    Core.bankingBlackList.push(...Nation.bagDrops);
    Core.bankingBlackList.push(...DBoN.twistedItems);
    Core.bankingBlackList.push(
        "DragonBlade of Nulgath",
        "Combat Trophy",
        "Basic War Sword",
        "Behemoth Blade of Shadow",
        "Behemoth Blade of Light",
    );

    Core.setOptions();

    script.getLegionDBoN();

    Core.setOptions(false);
}

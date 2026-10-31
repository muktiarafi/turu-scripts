/*
name: Infinite Legion Dark Caster (Class)
description: This script will get Infinite Legion Dark Caster class and farm it to rank 10.
tags: ildc, infinite legion dc, dark caster, legion, class, dark birthday, undead legion
*/
// Port of Scripts/Legion/InfiniteLegionDarkCaster.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../core/CoreAdvanced";
import { Core } from "../core/CoreBots";
import { CoreLegion } from "./CoreLegion";

const Adv = new CoreAdvanced();
const Legion = new CoreLegion();

export class InfiniteLegionDC {
    getILDC(rankUpClass = true): void {
        if (Core.checkInventory("Infinite Legion Dark Caster")) {
            if (rankUpClass) {
                Adv.rankUpClass("Infinite Legion Dark Caster");
            }
            return;
        }

        Legion.farmLegionToken(2000);
        Core.buyItem("underworld", 238, "Infinite Legion Dark Caster");

        if (rankUpClass) {
            Adv.rankUpClass("Infinite Legion Dark Caster");
        }
    }
}

export default function main(): void {
    const script = new InfiniteLegionDC();
    Core.setOptions();

    script.getILDC();

    Core.setOptions(false);
}

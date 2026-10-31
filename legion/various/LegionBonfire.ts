/*
name: LegionBonfire
description: null
tags: null
*/
// Port of Scripts/Legion/Various/LegionBonfire.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";

const Legion = new CoreLegion();
const Adv = new CoreAdvanced();

export class LegionBonfire {
    getLegionBonfire(): void {
        if (bot.house.contains("Legion Bonfire")) {
            return;
        }

        Legion.farmLegionToken(10000);

        Adv.buyItem("underworld", 1985, "Legion Bonfire");
    }
}

export default function main(): void {
    const script = new LegionBonfire();
    Core.setOptions();

    script.getLegionBonfire();

    Core.setOptions(false);
}

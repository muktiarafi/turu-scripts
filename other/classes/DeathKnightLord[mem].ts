/*
name: Death Knight Lord Post-update farming script
description: Death Knight Lord, post-update farming script, deathknight lord, golden deathknight lord, silver deathknight lord, dkl, member, class
tags: death knight lord, member, class
*/
// Port of Scripts/Other/Classes/DeathKnightLord[mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { BonecastleTowerMerge } from "../mergeshops/BonecastleTowerMerge";

const BCM = new BonecastleTowerMerge();
const Adv = new CoreAdvanced();

export class DeathKnightLord {
    dkl(rankUpClass = true): void {
        // Check if DeathKnight Lord is already owned
        if (Core.checkInventory("DeathKnight Lord")) {
            Core.logger("DeathKnight Lord class is already owned");
            if (rankUpClass) {
                Adv.rankUpClass("DeathKnight Lord");
            }
            return;
        }

        // Member check
        if (!Core.isMember) {
            Core.logger("The DeathKnight Lord is a member-only item. You will not be able to obtain it otherwise.");
            return;
        }

        BCM.buyAllMerge("DeathKnight Lord");

        if (rankUpClass) {
            Adv.rankUpClass("DeathKnight Lord");
        }
    }
}

export default function main(): void {
    const script = new DeathKnightLord();
    Core.setOptions();

    script.dkl();

    Core.setOptions(false);
}

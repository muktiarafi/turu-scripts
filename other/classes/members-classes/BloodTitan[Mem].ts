/*
name: BloodTitan[Mem]
description: farms Bt then gets and ranks the blood titan class if you'r a member
tags: blood titan, blood titan tokens, member, class
*/
// Port of Scripts/Other/Classes/Members-CLasses/BloodTitan[Mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";
import { BloodTitanMerge } from "../../mergeshops/BloodTitanMerge[mem]";
import { TitanAttackStory } from "../../../story/TitanAttack";

const Adv = new CoreAdvanced();
const BTM = new BloodTitanMerge();
const Tas = new TitanAttackStory();

export class BloodTitan {
    getclass(rankUpClass = true): void {
        if (Core.checkInventory(16641, undefined, { toInv: false })) {
            return;
        }

        Tas.doAll();
        BTM.buyAllMerge("Blood Titan");

        if (rankUpClass) {
            Adv.rankUpClass("Blood Titan");
        }
    }
}

export default function main(): void {
    const script = new BloodTitan();
    Core.setOptions();

    script.getclass();

    Core.setOptions(false);
}

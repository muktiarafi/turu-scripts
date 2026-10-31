/*
name: Blood Ancient (Member) Class
description: This script farms the Blood Ancient class.
tags: ancient, class, vitae
*/
// Port of Scripts/Other/Classes/Members-CLasses/BloodAncient[Mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";
import { BloodAncientMerge } from "../../mergeshops/BloodAncientMerge";

const Adv = new CoreAdvanced();
const BAM = new BloodAncientMerge();

export class BloodAncient {
    getBAnc(rankUpClass = true): void {
        if (Core.checkInventory("Blood Ancient") || !Core.isMember) {
            Core.logger(
                Core.checkInventory("Blood Ancient")
                    ? "You already own Blood Ancient class."
                    : "Membership is required for this class.",
            );
            if (rankUpClass && Core.isMember) {
                Adv.rankUpClass("Blood Ancient");
            }
            return;
        }

        BAM.buyAllMerge("Blood Ancient");

        if (rankUpClass) {
            Adv.rankUpClass("Blood Ancient");
        }
    }
}

export default function main(): void {
    const script = new BloodAncient();
    Core.setOptions();

    script.getBAnc();
    Core.setOptions(false);
}

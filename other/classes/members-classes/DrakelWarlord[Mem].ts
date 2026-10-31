/*
name: Drakel Warlord (Member) Class
description: This script farms the Drakel Warlord class.
tags: warlord, member, class, deathpitarena
*/
// Port of Scripts/Other/Classes/Members-CLasses/DrakelWarlord[Mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";
import { DeathPitArenaRepMerge } from "../../mergeshops/DeathPitArenaRepMerge";

const Adv = new CoreAdvanced();
const DPARM = new DeathPitArenaRepMerge();

export class DrakelWarlord {
    getClass(rankUpClass = true): void {
        if (Core.checkInventory("Drakel Warlord") || !Core.isMember) {
            Core.logger(
                Core.checkInventory("Drakel Warlord")
                    ? "You already own Drakel Warlord class."
                    : "Membership is required for this class.",
            );
            if (rankUpClass) {
                Adv.rankUpClass("Drakel Warlord");
            }
            return;
        }

        DPARM.buyAllMerge("Drakel Warlord");

        if (rankUpClass) {
            Adv.rankUpClass("Drakel Warlord");
        }
    }
}

export default function main(): void {
    const script = new DrakelWarlord();
    Core.setOptions();

    script.getClass();
    Core.setOptions(false);
}

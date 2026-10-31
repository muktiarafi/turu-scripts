/*
name: Fiendish Storm Orb Quest Pet
description: This script will complete the "Fiendish Storm Orb Quest Pet" [9507] quest.
tags: fiendish, cape of lightning, boltstriker, lightninglord, stormbringer, reaver, reavers
*/
// Port of Scripts/Nation/Various/FiendishStormOrbQuestPet.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { StormCacheMerge } from "../../other/mergeshops/StormCacheMerge";

const SCM = new StormCacheMerge();

export class FiendishStormOrbQuestPet {
    doQuest(): void {
        if (!Core.checkInventory([83230, 83720]) || (Core.checkInventory(83720) && !Core.isMember)) {
            Core.logger(
                "You need to own Fiendish Storm Orb Quest Pet, and have active membership for Member version to do this quest.",
            );
            return;
        }

        Core.addDrop(...Core.questRewards(Core.checkInventory(83720) ? 9577 : 9576));
        Core.ensureAccept(Core.checkInventory(83720) ? 9577 : 9576);
        SCM.buyAllMerge("Cape of Lightning");
        Core.equipClass(ClassType.Solo);
        Core.huntMonster("pride", "Valsarian", "BoltStriker Armor", undefined, { isTemp: false });
        Core.huntMonster("queenreign", "Extriki", "LightningLord", undefined, { isTemp: false });

        Core.ensureComplete(Core.checkInventory(83720) ? 9577 : 9576);
    }
}

export default function main(): void {
    const script = new FiendishStormOrbQuestPet();
    Core.setOptions();

    script.doQuest();

    Core.setOptions(false);
}

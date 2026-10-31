/*
name: Ebony DragonBlade of Nulgath
description: This will get the Ebony DragonBlade of Nulgath.
tags: ebony-dragonblade-of-nulgath, ebony-dbon
*/
// Port of Scripts/Seasonal/BlackFriday/EbonyDragonBladeOfNulgath.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreNation } from "../../nation/CoreNation";
import { DragonBladeofNulgath } from "../../nation/various/DragonBlade[mem]";

const Nation = new CoreNation();
const DBoN = new DragonBladeofNulgath();

export class EbonyDragonBladeofNulgath {
    ebonyDbon(): void {
        if (Core.checkInventory("Ebony DragonBlade of Nulgath")) {
            return;
        }

        if (!Core.isMember && !Core.checkInventory("DragonBlade of Nulgath")) {
            Core.logger("You must be a member to farm DragonBlade of Nulgath! (Required to merge Ebony DBoN)");
            return;
        }

        Core.bankingBlackList.push("DragonBlade of Nulgath", "Diamond of Nulgath", "Ebony DragonBlade of Nulgath");
        if (!Core.checkInventory("Diamond of Nulgath", 100)) {
            Nation.farmDiamondofNulgath(100);
        }
        if (!Core.checkInventory("DragonBlade of Nulgath")) {
            DBoN.getDragonBlade();
        }
        Core.buyItem("evilwarnul", 456, "Ebony DragonBlade of Nulgath");
    }
}

export default function main(): void {
    const script = new EbonyDragonBladeofNulgath();
    Core.setOptions();
    script.ebonyDbon();
    Core.setOptions(false);
}

/*
name: Sanctified Light of Destiny
description: This bot will do the entire farm for the Sanctified Light of Destiny *Note*: it uses dailies due to BLOD
tags: BLOD, SLOD, blinding, sanctified, light, destiny, undead, 75, damage, good
*/
// Port of Scripts/Good/BLoD/1SanctifiedLightofDestiny.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { MineCraftingMetalsEnum } from "../../core/CoreDailies";
import { CoreFarms } from "../../core/CoreFarms";
import { BLODMethod, CoreBLOD } from "./CoreBLOD";

const Farm = new CoreFarms();
const BLOD = new CoreBLOD();

export class SanctifiedLightofDestiny {
    getSanctifiedLightofDestiny(): void {
        if (Core.checkInventory("Sanctified Light of Destiny")) {
            return;
        }

        BLOD.blindingLightOfDestiny(BLODMethod.Fewest_Hours);

        Core.addDrop("Sanctified Light of Destiny", "Pious Platinum");
        Core.ensureAccept(8112);

        if (!Core.checkInventory("Glorious Gold of Destiny")) {
            BLOD.upgradeMetal(MineCraftingMetalsEnum.Gold);
        }
        if (!Core.checkInventory("Pious Platinum of Destiny")) {
            BLOD.upgradeMetal(MineCraftingMetalsEnum.Platinum);
        }
        Farm.battleUnderB("Bone Dust", 300);
        BLOD.loyalSpiritOrb(25);
        Core.huntMonster("Extinction", "Cyworg", "Refined Metal", 5);

        Core.ensureComplete(8112);
    }
}

export default function main(): void {
    const script = new SanctifiedLightofDestiny();
    Core.setOptions();

    script.getSanctifiedLightofDestiny();

    Core.setOptions(false);
}

/*
name: UndeadEnergy
description: Farms max Undead Energy
tags: UndeadEnergy, Undead Energy
*/
// Port of Scripts/Other/Materials/UndeadEnergy.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class UndeadEnergy {
    maxUE(quant = 3): void {
        Farm.battleUnderB("Undead Energy");
    }
}

export default function main(): void {
    const script = new UndeadEnergy();
    Core.setOptions();

    script.maxUE();

    Core.setOptions(false);
}

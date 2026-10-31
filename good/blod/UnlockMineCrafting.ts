/*
name: Unlock MineCrafting
description: This bot will unlock the Mine Crafting quest, this is needed to farm the metals needed for BLoD
tags: blinding, light, destiny, BLOD, mine, crafting, metals
*/
// Port of Scripts/Good/BLoD/UnlockMineCrafting.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreBLOD } from "./CoreBLOD";

const BLOD = new CoreBLOD();

export class UnlockMineCrafting {
    mineCaftingItems: string[] = [
        "Blinding Light of Destiny Handle",
        "Bonegrinder Medal",
        "Bone Dust",
        "Undead Essence",
        "Undead Energy",
        "Spirit Orb",
        "Loyal Spirit Orb",
    ];

    doUnlockMineCrafting(): void {
        Core.addDrop(...this.mineCaftingItems);

        BLOD.unlockMineCrafting();

        Core.toBank(...this.mineCaftingItems);
    }
}

export default function main(): void {
    const script = new UnlockMineCrafting();
    Core.bankingBlackList.push(...script.mineCaftingItems);
    Core.setOptions();

    script.doUnlockMineCrafting();

    Core.setOptions(false);
}

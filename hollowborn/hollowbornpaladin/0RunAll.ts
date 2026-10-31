/*
name: Hollowborn Paladin - Do all
description: does all of hollowborn paladin
tags: hollowborn, hollowborn paladin, do all
*/
// Port of Scripts/Hollowborn/HollowbornPaladin/0RunAll.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHollowbornPaladin } from "./CoreHollowbornPaladin";

const HBPal = new CoreHollowbornPaladin();

export class HBPalAll {}

export default function main(): void {
    Core.setOptions();

    HBPal.getAll();

    Core.setOptions(false);
}

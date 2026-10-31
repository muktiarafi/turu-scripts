/*
name: HBP - The Dark Sacrifice
description: does the 'the dark sacrifice' part of hollowborn doomKnight
tags: hollowborn paladin, hollowborn, the dark sacrifice
*/
// Port of Scripts/Hollowborn/HollowbornPaladin/TheDarkSacrifice.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHollowbornPaladin } from "./CoreHollowbornPaladin";

const HBPal = new CoreHollowbornPaladin();

export class TheDarkSacrifice {}

export default function main(): void {
    Core.setOptions();

    HBPal.hbShadowOfFate();

    Core.setOptions(false);
}

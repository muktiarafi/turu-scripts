/*
name: HBP - Lets Get You A Suit
description: does the 'lets get you a suit' part of hollowborn doomKnight
tags: hollowborn paladin, hollowborn, lets get you a suit
*/
// Port of Scripts/Hollowborn/HollowbornPaladin/LetsGetYouASuit.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHollowbornPaladin } from "./CoreHollowbornPaladin";

const HBPal = new CoreHollowbornPaladin();

export class LetsGetYouASuit {}

export default function main(): void {
    Core.setOptions();

    HBPal.hbPaladin();

    Core.setOptions(false);
}

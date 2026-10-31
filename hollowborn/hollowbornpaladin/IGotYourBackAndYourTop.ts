/*
name: HBP - I Got Your Back And Your Top
description: does the 'i got your back and your top' part of hollowborn doomKnight
tags: hollowborn paladin, hollowborn, i got your back and your top
*/
// Port of Scripts/Hollowborn/HollowbornPaladin/IGotYourBackAndYourTop.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHollowbornPaladin } from "./CoreHollowbornPaladin";

const HBPal = new CoreHollowbornPaladin();

export class IGotYourBackAndYourTop {}

export default function main(): void {
    Core.setOptions();

    HBPal.hbPaladinHelmet();

    Core.setOptions(false);
}

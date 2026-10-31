/*
name: Gonna Getcha Story
description: This will finish the Gonna Getcha Storyline.
tags: gonna-getcha-story, friday-the-13th, seasonal
*/
// Port of Scripts/Seasonal/Friday13th/Story/10Gonnagetcha.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFriday13th } from "./CoreFriday13th";

const coreFriday13th = new CoreFriday13th();

export class Gonnagetcha {}

export default function main(): void {
    Core.setOptions();

    coreFriday13th.gonnagetcha();

    Core.setOptions(false);
}

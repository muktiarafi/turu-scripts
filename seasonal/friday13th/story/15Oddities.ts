/*
name: Oddities Story
description: This will finish the Oddities Storyline.
tags: oddities-story, friday-the-13th, seasonal
*/
// Port of Scripts/Seasonal/Friday13th/Story/15Oddities.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFriday13th } from "./CoreFriday13th";

const coreFriday13th = new CoreFriday13th();

export class Oddities {}

export default function main(): void {
    Core.setOptions();

    coreFriday13th.oddities();

    Core.setOptions(false);
}

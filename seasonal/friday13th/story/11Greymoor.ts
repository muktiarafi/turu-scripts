/*
name: Greymoor Story
description: This will finish the Greymoor Storyline.
tags: greymoor-story, friday-the-13th, seasonal
*/
// Port of Scripts/Seasonal/Friday13th/Story/11Greymoor.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFriday13th } from "./CoreFriday13th";

const coreFriday13th = new CoreFriday13th();

export class Greymoor {}

export default function main(): void {
    Core.setOptions();

    coreFriday13th.greymoor();

    Core.setOptions(false);
}

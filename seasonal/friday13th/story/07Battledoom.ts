/*
name: Battledoom Story
description: This will finish the Battledoom story.
tags: battledoom-story, friday-the-13th, seasonal
*/
// Port of Scripts/Seasonal/Friday13th/Story/07Battledoom.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFriday13th } from "./CoreFriday13th";

const coreFriday13th = new CoreFriday13th();

export class Battledoom {}

export default function main(): void {
    Core.setOptions();

    coreFriday13th.battledoom();

    Core.setOptions(false);
}

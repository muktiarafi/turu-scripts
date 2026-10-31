/*
name: Wormhole Story
description: This will finish the Wormhole Storyline.
tags: wormhole-story, friday-the-13th, seasonal
*/
// Port of Scripts/Seasonal/Friday13th/Story/08Wormhole.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFriday13th } from "./CoreFriday13th";

const coreFriday13th = new CoreFriday13th();

export class Wormhole {}

export default function main(): void {
    Core.setOptions();

    coreFriday13th.wormhole();

    Core.setOptions(false);
}

/*
name: Complete Friday the 13th Stories
description: This will finish all of the Friday the 13th Stories.
tags: friday-the-13th, all-stories, seasonal
*/
// Port of Scripts/Seasonal/Friday13th/Story/00CompleteFriday13th.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFriday13th } from "./CoreFriday13th";

const coreFriday13th = new CoreFriday13th();

export class CompleteFriday13th {}

export default function main(): void {
    Core.setOptions();

    coreFriday13th.completeFriday13th();

    Core.setOptions(false);
}

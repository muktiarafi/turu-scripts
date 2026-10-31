/*
name: Winter Horror Story
description: This script completes the Winterhorror quests.
tags: saga, story, quest, seasonal, frostval,frostvale,frost,winterhorror
*/
// Port of Scripts/Seasonal/Frostvale/Story/12Winterhorror.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFrostvale } from "./CoreFrostvale";

const Frost = new CoreFrostvale();

export class Winterhorror {}

export default function main(): void {
    Core.setOptions();

    Frost.winterhorror();
    Core.setOptions(false);
}

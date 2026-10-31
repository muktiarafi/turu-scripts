/*
name: Frostval Gala Story
description: This script completes the FrostvalGala quests.
tags: saga, story, quest, seasonal, frostval,frostvale,frost,frostvalgala,blank reflection
*/
// Port of Scripts/Seasonal/Frostvale/Story/27FrostvalGala.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFrostvale } from "./CoreFrostvale";

const Frost = new CoreFrostvale();

export class FrostvalGala {}

export default function main(): void {
    Core.setOptions();
    Frost.frostvalGala();
    Core.setOptions(false);
}

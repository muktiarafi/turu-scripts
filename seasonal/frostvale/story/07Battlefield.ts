/*
name: Battlefield Story
description: This script completes the Battlefield quests.
tags: saga, story, quest, seasonal, frostval,frostvale,frost,battlefield
*/
// Port of Scripts/Seasonal/Frostvale/Story/07Battlefield.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFrostvale } from "./CoreFrostvale";

const Frost = new CoreFrostvale();

export class Battlefield {}

export default function main(): void {
    Core.setOptions();

    Frost.battlefield();
    Core.setOptions(false);
}

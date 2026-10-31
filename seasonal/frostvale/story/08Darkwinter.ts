/*
name: Darkwinter Story
description: This script completes the Darkwinter quests.
tags: saga, story, quest, seasonal, frostval,frostvale,frost,darkwinter
*/
// Port of Scripts/Seasonal/Frostvale/Story/08Darkwinter.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFrostvale } from "./CoreFrostvale";

const Frost = new CoreFrostvale();

export class Darkwinter {}

export default function main(): void {
    Core.setOptions();

    Frost.darkwinter();
    Core.setOptions(false);
}

/*
name: Frozensoul Story
description: This script completes the Frozensoul quests.
tags: saga, story, quest, seasonal, frostval,frostvale,frost,frozensoul
*/
// Port of Scripts/Seasonal/Frostvale/Story/09Frozensoul.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFrostvale } from "./CoreFrostvale";

const Frost = new CoreFrostvale();

export class Frozensoul {}

export default function main(): void {
    Core.setOptions();

    Frost.frozensoul();
    Core.setOptions(false);
}

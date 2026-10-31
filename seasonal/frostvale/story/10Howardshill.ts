/*
name: Howard's Hill Story
description: This script completes the Howardshill quests.
tags: saga, story, quest, seasonal, frostval,frostvale,frost,howardshill
*/
// Port of Scripts/Seasonal/Frostvale/Story/10Howardshill.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFrostvale } from "./CoreFrostvale";

const Frost = new CoreFrostvale();

export class Howardshill {}

export default function main(): void {
    Core.setOptions();

    Frost.howardshill();
    Core.setOptions(false);
}

/*
name: Ice Cave Story
description: This script completes the IceCave quests.
tags: saga, story, quest, seasonal, frostval,frostvale,frost,icecave
*/
// Port of Scripts/Seasonal/Frostvale/Story/01IceCave.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFrostvale } from "./CoreFrostvale";

const Frost = new CoreFrostvale();

export class IceCave {}

export default function main(): void {
    Core.setOptions();

    Frost.iceCave();
    Core.setOptions(false);
}

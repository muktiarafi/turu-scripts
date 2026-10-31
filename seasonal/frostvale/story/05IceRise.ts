/*
name: Ice Rise Story
description: This script completes the IceRise quests.
tags: saga, story, quest, seasonal, frostval,frostvale,frost,icerise
*/
// Port of Scripts/Seasonal/Frostvale/Story/05IceRise.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFrostvale } from "./CoreFrostvale";

const Frost = new CoreFrostvale();

export class IceRise {}

export default function main(): void {
    Core.setOptions();

    Frost.iceRise();
    Core.setOptions(false);
}

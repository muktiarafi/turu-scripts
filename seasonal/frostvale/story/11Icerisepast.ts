/*
name: Icerise Past Story
description: This script completes the Icerisepast quests.
tags: saga, story, quest, seasonal, frostval,frostvale,frost,icerisepast
*/
// Port of Scripts/Seasonal/Frostvale/Story/11Icerisepast.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFrostvale } from "./CoreFrostvale";

const Frost = new CoreFrostvale();

export class Icerisepast {}

export default function main(): void {
    Core.setOptions();

    Frost.icerisepast();
    Core.setOptions(false);
}

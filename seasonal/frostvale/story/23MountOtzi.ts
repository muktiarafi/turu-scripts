/*
name: Mount Otzi Story
description: This script completes the MountOtzi quests.
tags: saga, story, quest, seasonal, frostval,frostvale,frost,mountotzi
*/
// Port of Scripts/Seasonal/Frostvale/Story/23MountOtzi.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFrostvale } from "./CoreFrostvale";

const Frost = new CoreFrostvale();

export class MountOtzi {}

export default function main(): void {
    Core.setOptions();

    Frost.mountOtzi();
    Core.setOptions(false);
}

/*
name: (Scarletta) Tower of Mirrors Story
description: This will finish the Tower of Mirrors story.
tags: tower, mirrors, farm, story, scarletta, throne, darkness
*/
// Port of Scripts/Story/ThroneofDarkness/06bScarletta(TowerofMirrors).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreToD } from "./CoreToD";

const TOD = new CoreToD();

export class TowerofMirrors {}

export default function main(): void {
    Core.setOptions();

    TOD.towerofMirrors();

    Core.setOptions(false);
}

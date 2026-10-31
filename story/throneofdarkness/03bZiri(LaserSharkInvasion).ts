/*
name: (Ziri) Laser Shark Invasion Story
description: This will finish the Laser Shark Invasion story.
tags: laser, shark, invasion, farm, story, ziri, throne, darkness
*/
// Port of Scripts/Story/ThroneofDarkness/03bZiri(LaserSharkInvasion).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreToD } from "./CoreToD";

const TOD = new CoreToD();

export class LaserSharkInvasion {}

export default function main(): void {
    Core.setOptions();

    TOD.laserSharkInvasion();

    Core.setOptions(false);
}

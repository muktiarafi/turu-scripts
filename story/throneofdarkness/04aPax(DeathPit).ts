/*
name: (Pax) Death Pit Story
description: This will finish the Death Pit story.
tags: death, pit, farm, story, pax, throne, darkness
*/
// Port of Scripts/Story/ThroneofDarkness/04aPax(DeathPit).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreToD } from "./CoreToD";

const TOD = new CoreToD();

export class DeathPit {}

export default function main(): void {
    Core.setOptions();

    TOD.deathPit();

    Core.setOptions(false);
}

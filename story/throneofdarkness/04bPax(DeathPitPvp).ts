/*
name: (Pax) Death Pit PvP
description: This will finish the Death Pit PvP story.
tags: death, pit, pvp, farm, story, pax, throne, darkness
*/
// Port of Scripts/Story/ThroneofDarkness/04bPax(DeathPitPvp).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreToD } from "./CoreToD";

const TOD = new CoreToD();

export class DeathPitPvP {}

export default function main(): void {
    Core.setOptions();

    TOD.deathPitPVP();

    Core.setOptions(false);
}

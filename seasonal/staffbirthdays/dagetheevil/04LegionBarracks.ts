/*
name: Legion Barracks
description: This script completes the storyline in \legionbarracks.
tags: legionbarracks, legion, barracks, seasonal, dage, story
*/
// Port of Scripts/Seasonal/StaffBirthdays/DageTheEvil/04LegionBarracks.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreDageBirthday } from "./CoreDageBirthday";

const Dage = new CoreDageBirthday();

export class LegionBarracks {}

export default function main(): void {
    Core.setOptions();

    Dage.legionBarracks();
    Core.setOptions(false);
}

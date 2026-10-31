/*
name: Cocytus Barracks
description: This script completes the storyline in \cocytusbarracks.
tags: cocytusbarracks, cocytus, barracks, seasonal, dage, story
*/
// Port of Scripts/Seasonal/StaffBirthdays/DageTheEvil/05CocytusBarracks.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreDageBirthday } from "./CoreDageBirthday";

const Dage = new CoreDageBirthday();

export class CocytusBarracks {}

export default function main(): void {
    Core.setOptions();

    Dage.cocytusBarracks();
    Core.setOptions(false);
}

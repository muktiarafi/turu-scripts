/*
name: Reapfinals
description: This script completes the storyline in \Reapfinals.
tags: Reapfinals, legion, tournament, seasonal, dage, story, seasonal, dagebirthday, general vaughn
*/
// Port of Scripts/Seasonal/StaffBirthdays/DageTheEvil/08Reapfinals.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreDageBirthday } from "./CoreDageBirthday";

const Dage = new CoreDageBirthday();

export class Reapfinals {}

export default function main(): void {
    Core.setOptions();

    Dage.reapfinals();
    Core.setOptions(false);
}

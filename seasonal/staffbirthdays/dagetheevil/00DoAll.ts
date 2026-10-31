/*
name: Dage Birthday (All)
description: This script will complete all the seasonal Dage Birthday storylines.
tags: darkpath, dark path, futurelegion, future legion, undervoid, under void, legionbarracks, legion barracks, cocytus, cocytus barracks, cocytusbarracks, dage, seasonal, birthday, march, story, all
*/
// Port of Scripts/Seasonal/StaffBirthdays/DageTheEvil/00DoAll.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreDageBirthday } from "./CoreDageBirthday";

const Dage = new CoreDageBirthday();

export class DageBirthdayAll {}

export default function main(): void {
    Core.setOptions();

    Dage.doAll();
    Core.setOptions(false);
}

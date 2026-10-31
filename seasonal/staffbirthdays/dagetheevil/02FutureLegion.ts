/*
name: Future Legion Story
description: This will complete the Future Legion story.
tags: story, quest, future, legion, legion, staff, birthday
*/
// Port of Scripts/Seasonal/StaffBirthdays/DageTheEvil/02FutureLegion.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreDageBirthday } from "./CoreDageBirthday";

const Dage = new CoreDageBirthday();

export class FutureLegion {}

export default function main(): void {
    Core.setOptions();

    Dage.futureLegion();
    Core.setOptions(false);
}

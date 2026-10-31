/*
name: Undervoid Story
description: This will complete the Undervoid story.
tags: story, quest, void, nation, legion, underworld, staff, birthday
*/
// Port of Scripts/Seasonal/StaffBirthdays/DageTheEvil/01Undervoid.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreDageBirthday } from "./CoreDageBirthday";

const Dage = new CoreDageBirthday();

export class UndervoidStory {}

export default function main(): void {
    Core.setOptions();

    Dage.undervoid();

    Core.setOptions(false);
}

/*
name: Dark Path Story
description: This script completes the storyline in darkpath and voidvault.
tags: darkpath, voidvault, seasonal, dage, story
*/
// Port of Scripts/Seasonal/StaffBirthdays/DageTheEvil/03DarkPath.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreDageBirthday } from "./CoreDageBirthday";

const Dage = new CoreDageBirthday();

export class DarkPath {}

export default function main(): void {
    Core.setOptions();

    Dage.darkPath();
    Core.setOptions(false);
}

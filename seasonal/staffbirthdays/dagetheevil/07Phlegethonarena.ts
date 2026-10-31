/*
name: Phlegethonarena
description: This script completes the storyline in \Phlegethonarena.
tags: Phlegethonarena, legion, tournament, seasonal, dage, story, seasonal, dagebirthday, general vaughn
*/
// Port of Scripts/Seasonal/StaffBirthdays/DageTheEvil/07Phlegethonarena.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreDageBirthday } from "./CoreDageBirthday";

const Dage = new CoreDageBirthday();

export class Phlegethonarena {}

export default function main(): void {
    Core.setOptions();

    Dage.phlegethonarena();
    Core.setOptions(false);
}

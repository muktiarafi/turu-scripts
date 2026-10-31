/*
name: Grumble Grumble Daily
description: Grumble Grumble
tags: daily, grumble grumble
*/
// Port of Scripts/Dailies/GrumbleGrumble.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreDailies } from "../core/CoreDailies";

const Daily = new CoreDailies();

export class GrumbleGrumble {}

export default function main(): void {
    Core.setOptions();

    Daily.grumbleGrumble();

    Core.setOptions(false);
}

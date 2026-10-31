/*
name: Eldritchbattletown
description: This will complete the Eldritchbattletown Story quest.
tags: story, quest, mogloween, seasonal, Eldritchbattletown
*/
// Port of Scripts/Seasonal/Mogloween/015Eldritchbattletown.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreMogloween } from "./CoreMogloween";

const coreMogloween = new CoreMogloween();

export class Eldritchbattletown {}

export default function main(): void {
    Core.setOptions();

    coreMogloween.eldritchbattletown();

    Core.setOptions(false);
}

/*
name: Cursed Castle Story
description: This will complete the cursed castle Story quest.
tags: story, quest, mogloween, seasonal, cursed, castle
*/
// Port of Scripts/Seasonal/Mogloween/14CursedCastle.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreMogloween } from "./CoreMogloween";

const coreMogloween = new CoreMogloween();

export class CursedCastle {}

export default function main(): void {
    Core.setOptions();

    coreMogloween.cursedCastle();

    Core.setOptions(false);
}

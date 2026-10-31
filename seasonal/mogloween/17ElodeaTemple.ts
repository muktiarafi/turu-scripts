/*
name: Elodea Temple Story
description: This will complete the elodea temple Story quest.
tags: story, quest, mogloween, seasonal, elodea, temple, elodeatemple
*/
// Port of Scripts/Seasonal/Mogloween/17ElodeaTemple.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreMogloween } from "./CoreMogloween";

const coreMogloween = new CoreMogloween();

export class ElodeaTemple {}

export default function main(): void {
    Core.setOptions();

    coreMogloween.elodeaTemple();

    Core.setOptions(false);
}

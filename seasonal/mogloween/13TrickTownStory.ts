/*
name: Trick Town Story
description: This will complete the Trick Town story quest.
tags: story, quest, mogloween, seasonal, trick, town
*/
// Port of Scripts/Seasonal/Mogloween/13TrickTownStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreMogloween } from "./CoreMogloween";

const coreMogloween = new CoreMogloween();

export class TrickTown {}

export default function main(): void {
    Core.setOptions();

    coreMogloween.trickTown();

    Core.setOptions(false);
}

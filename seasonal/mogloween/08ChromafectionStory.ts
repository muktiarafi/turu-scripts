/*
name: Chromafection Story
description: This will complete the Chromafection story quest.
tags: story, quest, mogloween, seasonal, chromafection
*/
// Port of Scripts/Seasonal/Mogloween/08ChromafectionStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreMogloween } from "./CoreMogloween";

const coreMogloween = new CoreMogloween();

export class Chromafection {}

export default function main(): void {
    Core.setOptions();

    coreMogloween.chromafection();

    Core.setOptions(false);
}

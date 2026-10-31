/*
name: Asylum Story
description: This will complete the Asylum story quest.
tags: story, quest, mogloween, seasonal, asylum
*/
// Port of Scripts/Seasonal/Mogloween/05AsylumStory[NotSeasonal].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreMogloween } from "./CoreMogloween";

const coreMogloween = new CoreMogloween();

export class AsylumMogloween {}

export default function main(): void {
    Core.setOptions();

    coreMogloween.asylum();

    Core.setOptions(false);
}

/*
name: Mystcroft Forest Story
description: This will complete the Mystcroft Forest story quest.
tags: story, quest, mogloween, seasonal, mystcroft, forest
*/
// Port of Scripts/Seasonal/Mogloween/07MystcroftForestStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreMogloween } from "./CoreMogloween";

const coreMogloween = new CoreMogloween();

export class MystcroftForest {}

export default function main(): void {
    Core.setOptions();

    coreMogloween.mystcroftForest();

    Core.setOptions(false);
}

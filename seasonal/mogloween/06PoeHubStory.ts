/*
name: Poe Hub Story
description: This will complete the Poe Hub story quest.
tags: story, quest, mogloween, seasonal, poe-hub
*/
// Port of Scripts/Seasonal/Mogloween/06PoeHubStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreMogloween } from "./CoreMogloween";

const coreMogloween = new CoreMogloween();

export class PoeHub {}

export default function main(): void {
    Core.setOptions();

    coreMogloween.poeHub();

    Core.setOptions(false);
}

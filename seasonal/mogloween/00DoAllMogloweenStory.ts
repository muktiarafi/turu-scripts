/*
name: Complete All Mogloween Story
description: This will complete all Mogloween story quests.
tags: story, quest, mogloween, seasonal, complete, all
*/
// Port of Scripts/Seasonal/Mogloween/00DoAllMogloweenStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreMogloween } from "./CoreMogloween";

const coreMogloween = new CoreMogloween();

export class DoAllMogloween {}

export default function main(): void {
    Core.setOptions();

    coreMogloween.doAll();

    Core.setOptions(false);
}

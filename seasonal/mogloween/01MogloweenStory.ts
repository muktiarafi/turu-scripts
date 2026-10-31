/*
name: Mogloween Story
description: This will complete the Mogloween story quest.
tags: story, quest, mogloween, seasonal
*/
// Port of Scripts/Seasonal/Mogloween/01MogloweenStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreMogloween } from "./CoreMogloween";

const coreMogloween = new CoreMogloween();

export class Mogloween {}

export default function main(): void {
    Core.setOptions();

    coreMogloween.mogloween();

    Core.setOptions(false);
}

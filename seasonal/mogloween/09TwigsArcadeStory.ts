/*
name: Twigs Arcade Story
description: This will complete the Twigs Arcade story quest.
tags: story, quest, mogloween, seasonal, twigs, arcade
*/
// Port of Scripts/Seasonal/Mogloween/09TwigsArcadeStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreMogloween } from "./CoreMogloween";

const coreMogloween = new CoreMogloween();

export class TwigsArcade {}

export default function main(): void {
    Core.setOptions();

    coreMogloween.twigsArcade();

    Core.setOptions(false);
}

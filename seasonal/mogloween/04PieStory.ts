/*
name: Pie Story
description: This will complete the Pie story quest.
tags: story, quest, mogloween, seasonal, pie
*/
// Port of Scripts/Seasonal/Mogloween/04PieStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreMogloween } from "./CoreMogloween";

const coreMogloween = new CoreMogloween();

export class Pie {}

export default function main(): void {
    Core.setOptions();

    coreMogloween.pie();

    Core.setOptions(false);
}

/*
name: Candy Corn Story
description: This will complete the Candy Corn story quest.
tags: story, quest, mogloween, seasonal, candy, corn
*/
// Port of Scripts/Seasonal/Mogloween/03CandyCornStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreMogloween } from "./CoreMogloween";

const coreMogloween = new CoreMogloween();

export class CandyCorn {}

export default function main(): void {
    Core.setOptions();

    coreMogloween.candyCorn();

    Core.setOptions(false);
}

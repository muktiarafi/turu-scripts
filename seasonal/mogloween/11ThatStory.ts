/*
name: That Story
description: This will complete the That story quest.
tags: story, quest, mogloween, seasonal, that
*/
// Port of Scripts/Seasonal/Mogloween/11ThatStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreMogloween } from "./CoreMogloween";

const coreMogloween = new CoreMogloween();

export class That {}

export default function main(): void {
    Core.setOptions();

    coreMogloween.that();

    Core.setOptions(false);
}

/*
name: NecroCarnival Story
description: This will complete the NecroCarnival story quest.
tags: story, quest, mogloween, seasonal, necro, carnival
*/
// Port of Scripts/Seasonal/Mogloween/12NecroCarnivalStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreMogloween } from "./CoreMogloween";

const coreMogloween = new CoreMogloween();

export class NecroCarnival {}

export default function main(): void {
    Core.setOptions();

    coreMogloween.necroCarnival();

    Core.setOptions(false);
}

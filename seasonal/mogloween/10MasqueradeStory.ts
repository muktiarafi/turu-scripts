/*
name: Masquerade Story
description: This will complete the Masquerade story quest.
tags: story, quest, mogloween, seasonal, masquerade
*/
// Port of Scripts/Seasonal/Mogloween/10MasqueradeStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreMogloween } from "./CoreMogloween";

const coreMogloween = new CoreMogloween();

export class Masquerade {}

export default function main(): void {
    Core.setOptions();

    coreMogloween.masquerade();

    Core.setOptions(false);
}

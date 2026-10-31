/*
name: Eldritch World Story
description: This will complete the eldritch world Story quest.
tags: story, quest, mogloween, seasonal, eldritch, world, eldritchworld, elodea
*/
// Port of Scripts/Seasonal/Mogloween/16EldritchWorld.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreMogloween } from "./CoreMogloween";

const coreMogloween = new CoreMogloween();

export class EldritchWorld {}

export default function main(): void {
    Core.setOptions();

    coreMogloween.eldritchWorld();

    Core.setOptions(false);
}

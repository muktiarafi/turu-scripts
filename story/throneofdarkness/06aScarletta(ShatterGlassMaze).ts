/*
name: (Scarletta) Shatter Glass Maze Story
description: This will finish the Shatter Glass Maze story.
tags: shatter, glass, maze, farm, story, scarletta, throne, darkness
*/
// Port of Scripts/Story/ThroneofDarkness/06aScarletta(ShatterGlassMaze).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreToD } from "./CoreToD";

const TOD = new CoreToD();

export class ShatterGlassMaze {}

export default function main(): void {
    Core.setOptions();

    TOD.shatterGlassMaze();

    Core.setOptions(false);
}

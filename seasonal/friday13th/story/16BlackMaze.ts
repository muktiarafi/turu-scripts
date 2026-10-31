/*
name: Black Maze Story
description: This will finish the Black Maze Storyline.
tags: black-maze-story, friday-the-13th, seasonal
*/
// Port of Scripts/Seasonal/Friday13th/Story/16BlackMaze.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFriday13th } from "./CoreFriday13th";

const coreFriday13th = new CoreFriday13th();

export class Blackmaze {}

export default function main(): void {
    Core.setOptions();

    coreFriday13th.blackMaze();

    Core.setOptions(false);
}

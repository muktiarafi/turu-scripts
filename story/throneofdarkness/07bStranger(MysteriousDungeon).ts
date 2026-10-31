/*
name: (Stranger) Mysterious Dungeon Story
description: This will finish the Mysterious Dungeon story.
tags: mysterious, dungeon, farm, story, throne, darkness, stranger
*/
// Port of Scripts/Story/ThroneofDarkness/07bStranger(MysteriousDungeon).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreToD } from "./CoreToD";

const TOD = new CoreToD();

export class MysteriousDungeon {}

export default function main(): void {
    Core.setOptions();

    TOD.mysteriousDungeon();

    Core.setOptions(false);
}

/*
name: (Summer) Living Dungeon
description: This will finish the Living Dungeon story.
tags: living, dungeon, summer, 2015, adventure, map, farm, story, living, dungeon, summer, 2015, adventure, map
*/
// Port of Scripts/Story/Summer2015AdventureMap/5LivingDungeon.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSummer } from "./CoreSummer";

const Summer = new CoreSummer();

export class LivingDungeonStory {}

export default function main(): void {
    Core.setOptions();

    Summer.livingDungeon();

    Core.setOptions(false);
}

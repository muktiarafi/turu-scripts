/*
name: Nova Shrine
description: This script will complete "Nova Shrine" storyline.
tags: story, quest, saga, dragons, dragon, nova, shrine, yokairealm, complete, all
*/
// Port of Scripts/Story/DragonsOfYokai/07NovaShrine.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreDOY } from "./CoreDOY";

const DOY = new CoreDOY();

export class NovaShrine {}

export default function main(): void {
    Core.setOptions();

    DOY.novaShrine();
    Core.setOptions(false);
}

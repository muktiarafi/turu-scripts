/*
name: AQW Zombies
description: This will finish the AQW Zombies quest.
tags: story, quest, doomwood, aqw-zombies
*/
// Port of Scripts/Story/Doomwood/AQWZombies.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreDoomwood } from "./CoreDoomwood";

const DW = new CoreDoomwood();

export class AQWZombies {}

export default function main(): void {
    Core.setOptions();

    DW.aqwZombies();

    Core.setOptions(false);
}

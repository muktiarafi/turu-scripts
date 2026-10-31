/*
name: Tech Fortress
description: This will complete the Tech Fortress quest.
tags: story, quest, doomwood, tech-fortress, part3
*/
// Port of Scripts/Story/Doomwood/Part3/5TechFortress.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreDoomwood } from "../CoreDoomwood";

const DW = new CoreDoomwood();

export class TechFortress {}

export default function main(): void {
    Core.setOptions();

    DW.techFortress();

    Core.setOptions(false);
}

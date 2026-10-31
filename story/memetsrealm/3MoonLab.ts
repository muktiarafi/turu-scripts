/*
name: Moon Lab
description: This will finish the Moon Lab quest.
tags: story, quest, memets-realm, moon-lab
*/
// Port of Scripts/Story/MemetsRealm/3MoonLab.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { MemetsRealm } from "./CoreMemet";

const Memet = new MemetsRealm();

export class MoonLab {}

export default function main(): void {
    Core.setOptions();

    Memet.moonLab();

    Core.setOptions(false);
}

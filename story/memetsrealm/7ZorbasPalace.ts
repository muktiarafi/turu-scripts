/*
name: Zorbas Palace
description: This will finish the Zorbas Palace quest.
tags: story, quest, memets-realm, zorbas-palace
*/
// Port of Scripts/Story/MemetsRealm/7ZorbasPalace.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { MemetsRealm } from "./CoreMemet";

const Memet = new MemetsRealm();

export class ZorbasPalace {}

export default function main(): void {
    Core.setOptions();

    Memet.zorbasPalace();

    Core.setOptions(false);
}

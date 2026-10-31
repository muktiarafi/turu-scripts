/*
name: Junkhoard
description: This will finish the Junkhoard quest.
tags: story, quest, shadow-war, junkhoard
*/
// Port of Scripts/Story/ShadowsOfWar/06Junkhoard.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoW } from "./CoreSoW";

const SoW = new CoreSoW();

export class Junkhoard {}

export default function main(): void {
    Core.setOptions();

    SoW.junkhoard();

    Core.setOptions(false);
}

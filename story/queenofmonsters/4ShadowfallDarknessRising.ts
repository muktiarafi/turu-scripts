/*
name: Shadowfall Darkness Rising
description: This will finish the Shadowfall Darkness Rising quest.
tags: story, quest, queen-monsters, shadowfall-darkness-rising
*/
// Port of Scripts/Story/QueenofMonsters/4ShadowfallDarknessRising.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreQOM } from "./CoreQoM";

const QOM = new CoreQOM();

export class CompleteDarknessRising {}

export default function main(): void {
    Core.setOptions();

    QOM.shadowfallDarknessRising();

    Core.setOptions(false);
}

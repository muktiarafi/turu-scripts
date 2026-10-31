/*
name: (Vaden) Bone Towers Story
description: This will finish the Bone Towers story.
tags: bone, towers, farm, story, vaden, throne, darkness
*/
// Port of Scripts/Story/ThroneofDarkness/01bVaden(BoneTowers)[Mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreToD } from "./CoreToD";

const TOD = new CoreToD();

export class BoneTowers {}

export default function main(): void {
    Core.setOptions();

    TOD.boneTowerAll();

    Core.setOptions(false);
}

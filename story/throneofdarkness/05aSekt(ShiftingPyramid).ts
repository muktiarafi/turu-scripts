/*
name: (Sekt) Shifting Pyramid Story
description: This will finish the Shifting Pyramid story.
tags: shifting, pyramid, farm, story, sekt, throne, darkness
*/
// Port of Scripts/Story/ThroneofDarkness/05aSekt(ShiftingPyramid).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreToD } from "./CoreToD";

const TOD = new CoreToD();

export class ShiftingPyramid {}

export default function main(): void {
    Core.setOptions();

    TOD.shiftingPyramid();

    Core.setOptions(false);
}

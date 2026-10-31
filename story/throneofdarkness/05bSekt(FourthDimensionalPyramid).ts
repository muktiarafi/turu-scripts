/*
name: (Sekt) Fourth Dimensional Pyramid Story
description: This will finish the Fourth Dimensional Pyramid story.
tags: fourth, dimensional, pyramid, farm, story, sekt, throne, darkness
*/
// Port of Scripts/Story/ThroneofDarkness/05bSekt(FourthDimensionalPyramid).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreToD } from "./CoreToD";

const TOD = new CoreToD();

export class FourthDimensionalPyramid {}

export default function main(): void {
    Core.setOptions();

    TOD.fourthDimensionalPyramid();

    Core.setOptions(false);
}

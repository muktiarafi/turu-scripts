/*
name: (Yasaris) Sekt Story
description: This will finish the Sekt story.
tags: sekt, farm, story, yasaris, throne, darkness
*/
// Port of Scripts/Story/ThroneofDarkness/05cSekt(Yasaris).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreToD } from "./CoreToD";

const TOD = new CoreToD();

export class Yasaris {}

export default function main(): void {
    Core.setOptions();

    TOD.yasaris();

    Core.setOptions(false);
}

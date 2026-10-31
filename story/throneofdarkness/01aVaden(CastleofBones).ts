/*
name: (Vaden) Castle of Bones Story
description: This will finish the Castle of Bones story.
tags: castle, bones, farm, story, vaden, throne, darkness
*/
// Port of Scripts/Story/ThroneofDarkness/01aVaden(CastleofBones).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreToD } from "./CoreToD";

const TOD = new CoreToD();

export class CastleofBones {}

export default function main(): void {
    Core.setOptions();

    TOD.castleofBones();

    Core.setOptions(false);
}

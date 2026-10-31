/*
name: (ToD) Complete Throne of Darkness Story
description: This will finish the Throne of Darkness story.
tags: throne, darkness, farm, story, complete, throne, darkness, all
*/
// Port of Scripts/Story/ThroneofDarkness/00CompleteThroneofDarkness.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreToD } from "./CoreToD";

const TOD = new CoreToD();

export class ThroneofDarkness {}

export default function main(): void {
    Core.setOptions();

    TOD.completeToD();

    Core.setOptions(false);
}

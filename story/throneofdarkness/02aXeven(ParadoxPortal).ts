/*
name: (Xeven) Paradox Portal Story
description: This will finish the Paradox Portal story.
tags: paradox, portal, farm, story, xeven, throne, darkness
*/
// Port of Scripts/Story/ThroneofDarkness/02aXeven(ParadoxPortal).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreToD } from "./CoreToD";

const TOD = new CoreToD();

export class ParadoxPortal {}

export default function main(): void {
    Core.setOptions();

    TOD.paradoxPortal();

    Core.setOptions(false);
}

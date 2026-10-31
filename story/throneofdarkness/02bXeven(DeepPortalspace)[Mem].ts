/*
name: (Xeven) Deep Portalspace Story
description: This will finish the Deep Portalspace story.
tags: deep, portalspace, farm, story, xeven, throne, darkness
*/
// Port of Scripts/Story/ThroneofDarkness/02bXeven(DeepPortalspace)[Mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreToD } from "./CoreToD";

const TOD = new CoreToD();

export class DeepPortalspace {}

export default function main(): void {
    Core.setOptions();

    TOD.deepSpace();

    Core.setOptions(false);
}

/*
name: Lotus Tomb
description: Does the /lotustomb storyline
tags: shadow of doom, lotustomb, lotus, tomb, story, saga, zhoom, tomb of the blue lotus
*/
// Port of Scripts/Seasonal/BlackFriday/ShadowofDoom/03LotusTomb.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreShadowofDoom } from "./CoreShadowofDoom";

const CoreSoD = new CoreShadowofDoom();

export class LotusTomb {}

export default function main(): void {
    Core.setOptions();

    CoreSoD.lotusTomb();

    Core.setOptions(false);
}

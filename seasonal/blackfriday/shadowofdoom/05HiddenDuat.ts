/*
name: Hidden Palace of Duat
description: Does the /hiddenduat storyline
tags: shadow of doom, hiddenduat, hidden, duat, story, saga, zhoom, hidden palace,palace
*/
// Port of Scripts/Seasonal/BlackFriday/ShadowofDoom/05HiddenDuat.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreShadowofDoom } from "./CoreShadowofDoom";

const CoreSoD = new CoreShadowofDoom();

export class HiddenDuat {}

export default function main(): void {
    Core.setOptions();

    CoreSoD.hiddenDuat();

    Core.setOptions(false);
}

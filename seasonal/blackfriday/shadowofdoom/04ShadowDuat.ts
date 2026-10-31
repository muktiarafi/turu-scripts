/*
name: Shadow Duat
description: Does the /shadowduat storyline
tags: shadow of doom, shadowduat, shadow, duat, story, saga, zhoom
*/
// Port of Scripts/Seasonal/BlackFriday/ShadowofDoom/04ShadowDuat.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreShadowofDoom } from "./CoreShadowofDoom";

const CoreSoD = new CoreShadowofDoom();

export class ShadowDuat {}

export default function main(): void {
    Core.setOptions();

    CoreSoD.shadowDuat();

    Core.setOptions(false);
}

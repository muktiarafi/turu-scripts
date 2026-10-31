/*
name: Shadow of Doom Do All
description: Does the Shadow of Doom Saga
tags: shadow of doom, camlan, shadowbattleon story, saga, doall, lotustomb
*/
// Port of Scripts/Seasonal/BlackFriday/ShadowofDoom/00DoAll.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreShadowofDoom } from "./CoreShadowofDoom";

const CoreSoD = new CoreShadowofDoom();

export class ShadowofDoomDoAll {}

export default function main(): void {
    Core.setOptions();

    CoreSoD.doAll();

    Core.setOptions(false);
}

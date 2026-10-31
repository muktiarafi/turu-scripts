/*
name: Shadowbattleon
description: Does the Shadow of Doom Saga
tags: shadow of doom, shadowbattleon, story, saga, doall, camlan
*/
// Port of Scripts/Seasonal/BlackFriday/ShadowofDoom/01ShadowBattleon.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreShadowofDoom } from "./CoreShadowofDoom";

const CoreSoD = new CoreShadowofDoom();

export class Shadowbattleon {}

export default function main(): void {
    Core.setOptions();

    CoreSoD.shadowBattleon();

    Core.setOptions(false);
}

/*
name: Shadowslayerwar
description: Completes the quest chain in /shadowslayerwar.
tags: shadowslayerwar, story, quests, shadowslayerwar
*/
// Port of Scripts/Seasonal/Mogloween/19ShadowSlayerWar.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreMogloween } from "./CoreMogloween";

const coreMogloween = new CoreMogloween();

export class ShadowSlayerWar {}

export default function main(): void {
    Core.setOptions();

    if (!Core.isCompletedBefore(10905)) {
        coreMogloween.birgittaMogloween();
    }

    coreMogloween.shadowSlayerWar();

    Core.setOptions(false);
}

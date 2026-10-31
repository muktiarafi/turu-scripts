/*
name: Commanding Shadow Essences
description: farms void auras via the "commanding shadow essences" quest.
tags: commanding, shadow, essences, void aura
*/
// Port of Scripts/Evil/NSoD/VoidAuras/CommandingShadowEssences.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions } from "turu";
import { Core } from "../../../core/CoreBots";
import { CoreNSOD } from "../CoreNSOD";

const NSoD = new CoreNSOD();

export class CommandingShadowEssences {}

export const scriptOptions = defineScriptOptions(NSoD.optionsStorage, [NSoD.getSDKA, Core.skipOptions], true);

export default function main(): void {
    Core.setOptions();

    NSoD.commandingShadowEssences();

    Core.setOptions(false);
}

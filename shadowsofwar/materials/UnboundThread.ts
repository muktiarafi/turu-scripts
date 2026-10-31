/*
name: Farms Unbound Thread
description: Farms the Unbound Thread from Shadows of War
tags: unbound thread, shadows of war
*/
// Port of Scripts/ShadowsOfWar/Materials/UnboundThread.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoWMats } from "../CoreSoWMats";

const SOWM = new CoreSoWMats();

export class UnboundThread {}

export default function main(): void {
    Core.bankingBlackList.push("Unbound Thread");

    Core.setOptions();

    SOWM.unboundThread();

    Core.setOptions(false);
}

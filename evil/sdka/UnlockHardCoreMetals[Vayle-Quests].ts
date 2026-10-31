/*
name: Unlock HardCore Metals
description: This script will unlock HardCore Metals using Vayle's Quests.
tags: unlock, hardcore, metals, vayle, quest, sdka, sepulchure, doom that looms, toiling with terror, a penny for your foughts, dark spirit donation
*/
// Port of Scripts/Evil/SDKA/UnlockHardCoreMetals[Vayle-Quests].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSDKA } from "./CoreSDKA";

const SDKA = new CoreSDKA();

export class UnlockHardCoreMetals_Vayle_Quests {}

export default function main(): void {
    Core.setOptions();

    SDKA.unlockHardCoreMetals();

    Core.setOptions(false);
}

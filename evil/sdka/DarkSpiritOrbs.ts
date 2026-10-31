/*
name: Dark Spirit Orbs
description: This script will farm 10500 Dark Spirit Orbs.
tags: dso, a penny for your foughts, sdka, evil, quest, farm
*/
// Port of Scripts/Evil/SDKA/DarkSpiritOrbs.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreSDKA } from "./CoreSDKA";

const SDKA = new CoreSDKA();

export class DarkSpiritOrbs {}

export const scriptOptions = defineScriptOptions(SDKA.optionsStorage, SDKA.options, true);

export default function main(): void {
    Core.setOptions();

    SDKA.farmDSO(10500);

    Core.setOptions(false);
}

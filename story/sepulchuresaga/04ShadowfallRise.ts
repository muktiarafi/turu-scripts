/*
name: Shadowfall Rise
description: This will finish the Shadowfall Rise quest.
tags: story, quest, sepulchure-saga, shadowfall-rise
*/
// Port of Scripts/Story/SepulchureSaga/04ShadowfallRise.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSepulchure } from "./CoreSepulchure";

const CoreSS = new CoreSepulchure();

export class ShadowfallRise {}

export default function main(): void {
    Core.setOptions();

    CoreSS.shadowfallRise();

    Core.setOptions(false);
}

/*
name: (Darkblood) Lionfang
description: This will finish the Lionfang quest.
tags: story, quest, chaos-saga, 13-lords-of-chaos, darkblood, lionfang
*/
// Port of Scripts/Story/LordsofChaos/11Lionfang(Darkblood).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { Core13LoC } from "./Core13LoC";

const LOC = new Core13LoC();

export class SagaDarkblood {}

export default function main(): void {
    Core.setOptions();

    LOC.lionfang();

    Core.setOptions(false);
}

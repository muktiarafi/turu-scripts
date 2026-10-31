/*
name: (Chiral Valley) Escherion
description: This will finish the Escherion quest.
tags: story, quest, chaos-saga, 13-lords-of-chaos, chiral-valley, escherion
*/
// Port of Scripts/Story/LordsofChaos/02Escherion(ChiralValley).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { Core13LoC } from "./Core13LoC";

const LOC = new Core13LoC();

export class SagaChiralValley {}

export default function main(): void {
    Core.setOptions();

    LOC.escherion();

    Core.setOptions(false);
}

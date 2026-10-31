/*
name: (Arcangrove) Ledgermayne
description: chaos-saga, 13-lords-of-chaos
tags: story, quest, chaos-saga, 13-lords-of-chaos, arcangrove, ledgermayne
*/
// Port of Scripts/Story/LordsofChaos/07Ledgermayne(Arcangrove).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { Core13LoC } from "./Core13LoC";

const LOC = new Core13LoC();

export class SagaArcangrove {}

export default function main(): void {
    Core.setOptions();

    LOC.ledgermayne();

    Core.setOptions(false);
}

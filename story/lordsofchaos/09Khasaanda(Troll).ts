/*
name: (Troll) Khasaanda
description: This will finish the Khasaanda quest.
tags: story, quest, chaos-saga, 13-lords-of-chaos, troll, khasaanda
*/
// Port of Scripts/Story/LordsofChaos/09Khasaanda(Troll).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { Core13LoC } from "./Core13LoC";

const LOC = new Core13LoC();

export class SagaTroll {}

export default function main(): void {
    Core.setOptions();

    LOC.khasaandaTroll();

    Core.setOptions(false);
}

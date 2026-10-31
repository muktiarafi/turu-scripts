/*
name: (Chaos Finale) Hero
description: This will finish the Hero quest.
tags: story, quest, chaos-saga, 13-lords-of-chaos, chaos-finale, hero
*/
// Port of Scripts/Story/LordsofChaos/14Hero(ChaosFinale).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { Core13LoC } from "./Core13LoC";

const LOC = new Core13LoC();

export class SagaChaosFinale {}

export default function main(): void {
    Core.setOptions();

    LOC.hero();

    Core.setOptions(false);
}

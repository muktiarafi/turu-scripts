/*
name: (Darkovia) Wolfwing
description: This will finish the Wolfwing quest.
tags: story, quest, chaos-saga, 13-lords-of-chaos, darkovia, wolfwing
*/
// Port of Scripts/Story/LordsofChaos/05Wolfwing(Darkovia).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { Core13LoC } from "./Core13LoC";

const LOC = new Core13LoC();

export class SagaDarkovia {}

export default function main(): void {
    Core.setOptions();

    LOC.wolfwing();

    Core.setOptions(false);
}

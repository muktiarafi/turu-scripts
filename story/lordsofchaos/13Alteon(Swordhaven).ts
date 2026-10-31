/*
name: (Swordhaven) Alteon
description: This will finish the Alteon quest.
tags: story, quest, chaos-saga, 13-lords-of-chaos, swordhaven, alteon
*/
// Port of Scripts/Story/LordsofChaos/13Alteon(Swordhaven).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { Core13LoC } from "./Core13LoC";

const LOC = new Core13LoC();

export class SagaSwordhaven {}

export default function main(): void {
    Core.setOptions();

    LOC.alteon();

    Core.setOptions(false);
}

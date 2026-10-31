/*
name: (Dwarfhold) Vath
description: This will finish the Vath quest.
tags: story, quest, chaos-saga, 13-lords-of-chaos, dwarfhold, vath
*/
// Port of Scripts/Story/LordsofChaos/03Vath(Dwarfhold).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { Core13LoC } from "./Core13LoC";

const LOC = new Core13LoC();

export class SagaDwarfhold {}

export default function main(): void {
    Core.setOptions();

    LOC.vath();

    Core.setOptions(false);
}

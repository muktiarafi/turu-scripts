/*
name: VoidKnightSwordQuest
description: null
tags: null
*/
// Port of Scripts/Nation/VoidKnightSwordQuest.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreNation } from "./CoreNation";

const Nation = new CoreNation();

export class VoidKnightSword {}

export default function main(): void {
    Core.bankingBlackList.push(...Nation.bagDrops);
    Core.setOptions();

    Nation.voidKnightSwordQuest();

    Core.setOptions(false);
}

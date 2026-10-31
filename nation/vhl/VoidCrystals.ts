/*
name: (VHL) Void Crystals
description: This will farm only the void crystals of Void Highlord class.
tags: farm, merge, nation, VHL, void, highlord, roentgenium, void crystal a, void crystal b
*/
// Port of Scripts/Nation/VHL/VoidCrystals.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreNation } from "../CoreNation";
import { CoreVHL } from "./CoreVHL";

const VHL = new CoreVHL();
const Nation = new CoreNation();

export class VoidCrystals {}

export const scriptOptions = defineScriptOptions(VHL.optionsStorage, VHL.options, true);

export default function main(): void {
    Core.bankingBlackList.push(...Nation.bagDrops);
    Core.setOptions();

    VHL.vhlCrystals();

    Core.setOptions(false);
}

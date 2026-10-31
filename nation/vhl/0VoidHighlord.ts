/*
name: Void Highlord (Class)
description: This will farm all requirements for the Void Highlord class to obtain.
tags: farm, class, nation, vhl, void, highlord, roentgenium, void crystal a, void crystal b
*/
// Port of Scripts/Nation/VHL/0VoidHighlord.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreNation } from "../CoreNation";
import { CoreVHL } from "./CoreVHL";

const VHL = new CoreVHL();
const Nation = new CoreNation();

export class VoidHighlord {}

export const scriptOptions = defineScriptOptions(VHL.optionsStorage, VHL.options, true);

export default function main(): void {
    Core.bankingBlackList.push(...Nation.bagDrops);
    Core.setOptions();

    VHL.getVHL();

    Core.setOptions(false);
}

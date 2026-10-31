/*
name: (VHL) Challenge Quest
description: This will farm all the requirements for Roentgenium of Nulgath Token.
tags: farm, quest, nation, VHL, void, highlord, roentgenium, void crystal a, void crystal b, challenge
*/
// Port of Scripts/Nation/VHL/VoidHighlordsChallenge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreNation } from "../CoreNation";
import { CoreVHL } from "./CoreVHL";

const VHL = new CoreVHL();
const Nation = new CoreNation();

export class VoidHighlordsChallenge {}

export const scriptOptions = defineScriptOptions(VHL.optionsStorage, VHL.options, true);

export default function main(): void {
    Core.bankingBlackList.push(...Nation.bagDrops);
    Core.setOptions();

    VHL.vhlChallenge(25);

    Core.setOptions(false);
}

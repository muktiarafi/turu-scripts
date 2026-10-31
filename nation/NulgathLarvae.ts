/*
name: NulgathLarvae
description: will do "Nulgath (Larvae) [2566]"
tags: nulgath, larvae, nation
*/
// Port of Scripts/Nation/NulgathLarvae.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreNation } from "./CoreNation";

const Nation = new CoreNation();

export class NulgathLarvae {}

export default function main(): void {
    Core.bankingBlackList.push(...Nation.bagDrops);
    Core.setOptions();

    Nation.nulgathLarvae();

    Core.setOptions(false);
}

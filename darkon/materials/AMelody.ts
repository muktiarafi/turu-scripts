/*
name: Farms the A Melody for the Darkon Debris 2 [reconstructed]
description: Farms the A Melody for the Darkon Debris 2 [reconstructed]
tags: a melody, darkon, debris
*/
// Port of Scripts/Darkon/Materials/AMelody.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreDarkon } from "../CoreDarkon";

const Darkon = new CoreDarkon();

export class AMelody {}

export default function main(): void {
    Core.bankingBlackList.push("A Melody");

    Core.setOptions();

    Darkon.aMelody();

    Core.setOptions(false);
}

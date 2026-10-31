/*
name: Ancient Remnant
description: Farms the Ancient Remnant for the Darkon Debris 2 [reconstructed]
tags: ancient remnant, darkon, debris
*/
// Port of Scripts/Darkon/Materials/AncientRemnant.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreDarkon } from "../CoreDarkon";

const Darkon = new CoreDarkon();

export class AncientRemnant {}

export default function main(): void {
    Core.setOptions();

    Darkon.ancientRemnant();

    Core.setOptions(false);
}

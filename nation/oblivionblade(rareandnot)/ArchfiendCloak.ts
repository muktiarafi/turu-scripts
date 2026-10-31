/*
name: ArchfiendCloak
description: null
tags: null
*/
// Port of Scripts/Nation/OblivionBlade(RareandNot)/ArchfiendCloak.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreOblivionBladeofNulgath } from "./CoreOblivionBladeofNulgath";

const COBoN = new CoreOblivionBladeofNulgath();

export class ArchfiendCloak {}

export default function main(): void {
    Core.setOptions();

    COBoN.archfiendCloak();

    Core.setOptions(false);
}

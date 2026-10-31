/*
name: VoucheritemChampionofNulgath
description: null
tags: null
*/
// Port of Scripts/Nation/OblivionBlade(RareandNot)/VoucheritemChampionofNulgath.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreOblivionBladeofNulgath } from "./CoreOblivionBladeofNulgath";

const COBoN = new CoreOblivionBladeofNulgath();

export class VoucheritemChampionofNulgath {}

export default function main(): void {
    Core.setOptions();

    COBoN.voucheritemChampionofNulgath();

    Core.setOptions(false);
}

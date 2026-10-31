/*
name: Pet Tamer REP
description: This script will farm Pet Tamer reputation to rank 10.
tags: pet, tamer, pettamer, pet tamer, rank, rep, reputation
*/
// Port of Scripts/Farm/REP/PetTamerREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class PetTamerREP {}

export default function main(): void {
    Core.setOptions();

    Farm.petTamerREP();
    Core.logger("aaaaaaaaaaaaaaaaaaaaaaaaaaaa");

    Core.setOptions(false);
}

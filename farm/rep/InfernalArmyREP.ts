/*
name: Infernal Army REP
description: This script will farm Infernal Army reputation to rank 10.
tags: infernalarmy, infernal army, infernal, army, rep, rank, reputation
*/
// Port of Scripts/Farm/REP/InfernalArmyREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class InfernalArmyREP {}

export default function main(): void {
    Core.setOptions();

    Farm.infernalArmyREP();

    Core.setOptions(false);
}

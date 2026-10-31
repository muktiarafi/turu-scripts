/*
name: Yew Mountains REP
description: This script will farm Yew Mountains REP to rank 10.
tags: yew mountains, rep, reputation, farm
*/
// Port of Scripts/Farm/REP/YewMountainsRep.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class YewMountainsREP {}

export default function main(): void {
    Core.setOptions();

    Farm.yewMountainsREP();

    Core.setOptions(false);
}

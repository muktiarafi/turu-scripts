/*
name: Bacon Cat REP
description: This script will farm Bacon Cat reputation to rank 10.
tags: baconcat, bacon cat, reputation, rep, farm, rank
*/
// Port of Scripts/Farm/REP/BaconCatREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreToD } from "../../story/throneofdarkness/CoreToD";

const Farm = new CoreFarms();
const TOD = new CoreToD();

export class BaconCatREP {
    doRep(): void {
        TOD.baconCatFortress();
        TOD.laserSharkInvasion();

        Farm.baconCatREP();
    }
}

export default function main(): void {
    const script = new BaconCatREP();
    Core.setOptions();

    script.doRep();

    Core.setOptions(false);
}

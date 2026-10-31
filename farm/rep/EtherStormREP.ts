/*
name: EtherStorm REP
description: This script will farm EtherStorm reputation to rank 10.
tags: ether, storm, etherstorm, ether storm, reputation, rep, rank
*/
// Port of Scripts/Farm/REP/EtherStormREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class EtherStormREP {}

export default function main(): void {
    Core.setOptions();

    Farm.etherStormREP();

    Core.setOptions(false);
}

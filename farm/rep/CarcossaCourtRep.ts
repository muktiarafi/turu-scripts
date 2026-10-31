/*
name: CarcossaCourt REP
description: This script will farm CarcossaCourt REP to rank 10.
tags: CarcossaCourt, rep, reputation, farm
*/
// Port of Scripts/Farm/REP/CarcossaCourtRep.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreSunSet } from "../../story/sunsetsaga/CoreSunSet";

const Farm = new CoreFarms();
const TLSSC = new CoreSunSet();

export class CarcossaCourRep {}

export default function main(): void {
    Core.setOptions();

    TLSSC.doAll();
    Farm.carcossaCourtRep();

    Core.setOptions(false);
}

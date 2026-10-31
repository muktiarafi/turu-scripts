/*
name: Ravenloss REP
description: This script will farm Ravenloss reputation to rank 10.
tags: raven loss, ravenloss, raven, loss, rep, rank, reputation
*/
// Port of Scripts/Farm/REP/RavenlossREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { RavenlossSaga } from "../../story/RavenlossSaga";

const Farm = new CoreFarms();
const RLS = new RavenlossSaga();

export class RavenlossREP {}

export default function main(): void {
    Core.setOptions();
    RLS.doAll();
    Farm.ravenlossREP();

    Core.setOptions(false);
}

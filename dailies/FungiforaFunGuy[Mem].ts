/*
name: Fungi for a Fun Guy Daily
description: Fungi for a Fun Guy
tags: daily, fungi for a fun guy, member
*/
// Port of Scripts/Dailies/FungiforaFunGuy[Mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreDailies } from "../core/CoreDailies";

const Daily = new CoreDailies();

export class FungiforaFunGuy {}

export default function main(): void {
    Core.setOptions();

    Daily.fungiforaFunGuy();

    Core.setOptions(false);
}

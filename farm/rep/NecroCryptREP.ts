/*
name: Necro Crypt REP
description: This script will farm Necro Crypt reputation to rank 10.
tags: necrocrypt, necro crypt, necro, crypt, rank, rep, reputation
*/
// Port of Scripts/Farm/REP/NecroCryptREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class NecroCryptREP {}

export default function main(): void {
    Core.setOptions();

    Farm.necroCryptREP();

    Core.setOptions(false);
}

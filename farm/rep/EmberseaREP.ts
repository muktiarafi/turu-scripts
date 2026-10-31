/*
name: Embersea REP
description: This script will farm Embersea reputation to rank 10.
tags: embersea, ember sea, ember, sea, reputation, rank, rep
*/
// Port of Scripts/Farm/REP/EmberseaREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreFireIsland } from "../../story/fireisland/CoreFireisland";

const Farm = new CoreFarms();
const FI = new CoreFireIsland();

export class EmberseaREP {}

export default function main(): void {
    Core.setOptions();

    FI.feverfew();
    Farm.emberseaREP();

    Core.setOptions(false);
}

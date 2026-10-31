/*
name: Good REP
description: This script will farm Good reputation to rank 10.
tags: good, rep, rank, reputation
*/
// Port of Scripts/Farm/REP/GoodREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { PoisonForest } from "../../story/PoisonForest";

const Farm = new CoreFarms();
const PForest = new PoisonForest();

export class GoodREP {}

export default function main(): void {
    Core.setOptions();

    Core.logger("Running PoisonForest storyline to be able to do the better rep method.");
    PForest.storyLine();
    Farm.goodREP();

    Core.setOptions(false);
}

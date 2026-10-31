/*
name: Diabolical REP
description: This script will farm Diabolical reputation to rank 10.
tags: diabolical, rep, rank, reputation
*/
// Port of Scripts/Farm/REP/DiabolicalREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreStory } from "../../core/CoreStory";

const Farm = new CoreFarms();
const Story = new CoreStory();

export class DiabolicalREP {
    doRep(): void {
        Story.killQuest(7875, "timevoid", "Unending Avatar");
        Story.killQuest(7876, "twilightedge", "ChaosWeaver Warrior");

        Farm.diabolicalREP();
    }
}

export default function main(): void {
    const script = new DiabolicalREP();
    Core.setOptions();

    script.doRep();

    Core.setOptions(false);
}

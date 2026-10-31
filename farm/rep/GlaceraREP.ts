/*
name: Glacera REP
description: This script will farm Glacera reputation to rank 10.
tags: glacera, rank, rep, reputation
*/
// Port of Scripts/Farm/REP/GlaceraREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { GlaceraStory } from "../../story/Glacera";

const Farm = new CoreFarms();
const glaceraStory = new GlaceraStory();

export class GlaceraREP {}

export default function main(): void {
    Core.setOptions();

    glaceraStory.doAll();
    Farm.glaceraREP();

    Core.setOptions(false);
}

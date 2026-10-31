/*
name: Unfinished Musical Score
description: Unfinished Musical Score
tags: darkon, unfinished musical score
*/
// Port of Scripts/Darkon/Materials/UnfinishedMusicalScore.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreDarkon } from "../CoreDarkon";

const Darkon = new CoreDarkon();

export class UnfinishedMusicalScore {}

export default function main(): void {
    Core.setOptions();

    Darkon.unfinishedMusicalScore();

    Core.setOptions(false);
}

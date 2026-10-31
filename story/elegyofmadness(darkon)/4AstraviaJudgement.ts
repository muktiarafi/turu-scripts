/*
name: Astravia Judgement
description: This will finish the Astravia Judgement quest.
tags: story, quest, elegy-of-madness, darkon, astravia, judgement
*/
// Port of Scripts/Story/ElegyofMadness(Darkon)/4AstraviaJudgement.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAstravia } from "./CoreAstravia";

const Astravia = new CoreAstravia();

export class CompleteAstraviaJudgement {}

export default function main(): void {
    Core.setOptions();

    Astravia.astraviaJudgement();

    Core.setOptions(false);
}

/*
name: Break Into the Hoard Daily
description: does the quest `break into the hoard` for the rewards
tags: daily, break into the hoard
*/
// Port of Scripts/Dailies/BreakIntotheHoard.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreDailies } from "../core/CoreDailies";
import { BoneBreak } from "../story/BoneBreak";

const Daily = new CoreDailies();
const boneBreak = new BoneBreak();

export class BreakIntotheHoard {}

export default function main(): void {
    Core.setOptions();

    boneBreak.storyLine();
    Daily.breakIntotheHoard({ keepReward: false, bank: true });

    Core.setOptions(false);
}

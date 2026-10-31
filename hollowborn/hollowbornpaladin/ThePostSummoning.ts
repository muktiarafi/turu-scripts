/*
name: HBP - The Post Summoning
description: does the 'the post summoning' part of hollowborn Paladin
tags: hollowborn paladin, hollowborn, the post summoning, hollowborn paladin character page badge
*/
// Port of Scripts/Hollowborn/HollowbornPaladin/ThePostSummoning.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHollowbornPaladin } from "./CoreHollowbornPaladin";

const HBPal = new CoreHollowbornPaladin();

export class ThePostSummoning {}

export default function main(): void {
    Core.setOptions();

    HBPal.getAll();

    Core.setOptions(false);
}

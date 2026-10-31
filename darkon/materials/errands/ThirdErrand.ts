/*
name: Darkons Third Errand
description: Darkons Third Errand
tags: darkon, third, errand
*/
// Port of Scripts/Darkon/Materials/Errands/ThirdErrand.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreDarkon } from "../../CoreDarkon";

const Darkon = new CoreDarkon();

export class ThirdErrand {}

export default function main(): void {
    Core.setOptions();

    Darkon.thirdErrand();

    Core.setOptions(false);
}

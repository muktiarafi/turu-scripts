/*
name: Darkons Second Errand
description: Darkons Second Errand
tags: darkon, errand, second
*/
// Port of Scripts/Darkon/Materials/Errands/SecondErrand.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreDarkon } from "../../CoreDarkon";

const Darkon = new CoreDarkon();

export class SecondErrand {}

export default function main(): void {
    Core.setOptions();

    Darkon.secondErrand();

    Core.setOptions(false);
}

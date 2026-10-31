/*
name: Darkons First Errand
description: Darkons First Errand
tags: darkon, errand, first
*/
// Port of Scripts/Darkon/Materials/Errands/FirstErrands.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreDarkon } from "../../CoreDarkon";

const Darkon = new CoreDarkon();

export class FirstErrand {}

export default function main(): void {
    Core.setOptions();

    Darkon.firstErrand();

    Core.setOptions(false);
}

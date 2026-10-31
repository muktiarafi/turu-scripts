/*
name: Las Gratitude
description: Las Gratitude
tags: darkon, las gratitude
*/
// Port of Scripts/Darkon/Materials/LasGratitude.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreDarkon } from "../CoreDarkon";

const Darkon = new CoreDarkon();

export class LasGratitude {}

export default function main(): void {
    Core.setOptions();

    Darkon.lasGratitude();

    Core.setOptions(false);
}

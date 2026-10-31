/*
name: Sukies Prestige
description: Sukies Prestige
tags: darkon, suki's prestige
*/
// Port of Scripts/Darkon/Materials/SukisPrestige.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreDarkon } from "../CoreDarkon";

const Darkon = new CoreDarkon();

export class SukisPrestiege {}

export default function main(): void {
    Core.setOptions();

    Darkon.sukisPrestiege();

    Core.setOptions(false);
}

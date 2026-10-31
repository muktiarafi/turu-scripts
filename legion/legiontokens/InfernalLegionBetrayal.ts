/*
name: InfernalLegionBetrayal
description: Uses the appropriate pet to farm Legion Tokens
tags: legion, legion token
*/
// Port of Scripts/Legion/LegionTokens/InfernalLegionBetrayal.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";

const Legion = new CoreLegion();

export class InfernalLegionBetrayal {}

export default function main(): void {
    Core.setOptions();

    Legion.ltInfernalLegionBetrayal();

    Core.setOptions(false);
}

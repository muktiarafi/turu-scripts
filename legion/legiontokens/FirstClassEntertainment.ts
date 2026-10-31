/*
name: FirstClassEntertainment
description: Uses the appropriate pet to farm Legion Tokens
tags: legion, legion token, solo
*/
// Port of Scripts/Legion/LegionTokens/FirstClassEntertainment.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";

const Legion = new CoreLegion();

export class FirstClassEntertainment {}

export default function main(): void {
    Core.setOptions();

    Legion.ltFirstClassEntertainment(undefined, undefined, undefined, false);

    Core.setOptions(false);
}

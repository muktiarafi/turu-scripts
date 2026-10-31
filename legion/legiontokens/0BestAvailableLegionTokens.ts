/*
name: Best Available Legion Token
description: uses the best pet you have for legion token farming
tags: legion, legion token, Smart Token, SmartToken, Best Token, besttoken
*/
// Port of Scripts/Legion/LegionTokens/0BestAvailableLegionTokens.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";

const Legion = new CoreLegion();

export class BestAvailableLegionTokens {}

export default function main(): void {
    Core.setOptions();

    Legion.farmLegionToken();

    Core.setOptions(false);
}

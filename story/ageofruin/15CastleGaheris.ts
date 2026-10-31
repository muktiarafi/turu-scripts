/*
name: Castle Gaheris
description: This script completes the st oryline in /castlegaheris.
tags: age, of, ruin, saga, story, quest, castlegaheris, castle, gaheris, queen victoria alteon
*/
// Port of Scripts/Story/AgeOfRuin/15CastleGaheris.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAOR } from "./CoreAOR";

const AOR = new CoreAOR();

export class CastleGaheris {}

export default function main(): void {
    Core.setOptions();

    AOR.castleGaheris();

    Core.setOptions(false);
}

/*
name: Faerie Court REP
description: This will farm Faerie Court REP.
tags: reputation, faerie, court, seasonal, lucky
*/
// Port of Scripts/Seasonal/LuckyDay/FaerieCourtREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class FaerieCourtREP {}

export default function main(): void {
    Core.setOptions();

    Farm.faerieCourtREP();

    Core.setOptions(false);
}

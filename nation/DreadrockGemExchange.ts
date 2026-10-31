/*
name: Dreadrock Gem Exchange (Tainted Gem Quest)
description: This script will farm Tainted Gems using "Dreadrock Gem Exhange" quest.
tags: tainted gem, dreadrock, dread rock, tainted, exchange, enntropy, shattered, polished, crystal
*/
// Port of Scripts/Nation/DreadrockGemExchange.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreNation } from "./CoreNation";

const Nation = new CoreNation();

export class DreadrockGemExchange {}

export default function main(): void {
    Core.setOptions();

    Nation.dreadrockGemExchange();

    Core.setOptions(false);
}

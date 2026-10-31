/*
name: Frostval Past, Present, and Future Story
description: This script completes the FrostvalPastPresentandFuture quests.
tags: saga, story, quest, seasonal, frostval,frostvale,frost,frostvalpastpresentandfuture
*/
// Port of Scripts/Seasonal/Frostvale/Story/16FrostvalPastPresentandFuture.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFrostvale } from "./CoreFrostvale";

const Frost = new CoreFrostvale();

export class FrostvalPastPresentandFuture {}

export default function main(): void {
    Core.setOptions();

    Frost.frostvalPastPresentandFuture();
    Core.setOptions(false);
}

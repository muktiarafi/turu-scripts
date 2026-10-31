/*
name: Tenacity Challenge
description: Farms the quest Tenacity Challenge to get Tainted Gems, Dark Crystal Shards and Blood Gem of the Archfiend (requires Nulgath Challenge Pet)
tags: nation, tainted gem, dark crystal shard, blood gem of the archfiend, nulgath challenge pet, daily
*/
// Port of Scripts/Dailies/TenacityChallenge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreDailies } from "../core/CoreDailies";

const Daily = new CoreDailies();

export class TenacityChallenge {}

export default function main(): void {
    Core.setOptions();

    Daily.tenacityChallenge();

    Core.setOptions(false);
}

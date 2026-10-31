/*
name: Hollowborn Reaper's Scythe
description: This script will farm Hollowborn Reaper's Scythe
tags: hollowborn, reaper, scythe, shadowrealm
*/
// Port of Scripts/Hollowborn/HollowbornReapersScythe.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { ShadowrealmMerge } from "./mergeshops/ShadowrealmMerge";

const SRM = new ShadowrealmMerge();

export class HollowbornScythe {}

export default function main(): void {
    Core.setOptions();

    SRM.buyAllMerge("Hollowborn Reaper's Scythe");

    Core.setOptions(false);
}

/*
name: Hollowborn Chaos Envoy - Unique Quarry
description: does the 'unique quarry' part of hollowborn chaos envoy
tags: hollowborn chaos envoy, hollowborn, unique quarry
*/
// Port of Scripts/Hollowborn/HollowbornChaosEnvoy/3UniqueQuarry.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions } from "turu";
import { configEnum, Core } from "../../core/CoreBots";
import { CoreHollowbornChaosEnvoy, UniqueQuarryRewards } from "./CoreHollowbornChaosEnvoy";

const HBCE = new CoreHollowbornChaosEnvoy();

export class HBCE3 {}

export const scriptOptions = defineScriptOptions(HBCE.optionsStorage, HBCE.options, true);

export default function main(): void {
    Core.setOptions();

    HBCE.uniqueQuarry(
        configEnum("Unique Quarry", UniqueQuarryRewards, UniqueQuarryRewards.Hollowborn_Benevolent_Locks),
    );

    Core.setOptions(false);
}

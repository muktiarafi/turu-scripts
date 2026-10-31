/*
name: Hollowborn Chaos Envoy - Persisting Mayhem
description: does the 'pesisting mayhem' part of hollowborn chaos envoy
tags: hollowborn chaos envoy, hollowborn, pesisting mayhem
*/
// Port of Scripts/Hollowborn/HollowbornChaosEnvoy/6PesistingMayhem.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions } from "turu";
import { configEnum, Core } from "../../core/CoreBots";
import { CoreHollowbornChaosEnvoy, PersistingMayhemRewards } from "./CoreHollowbornChaosEnvoy";

const HBCE = new CoreHollowbornChaosEnvoy();

export class HBCE6 {}

export const scriptOptions = defineScriptOptions(HBCE.optionsStorage, HBCE.options, true);

export default function main(): void {
    Core.setOptions();

    HBCE.persistingMayhem(
        configEnum("Persisting Mayhem", PersistingMayhemRewards, PersistingMayhemRewards.Hollowborn_Benevolent),
    );

    Core.setOptions(false);
}

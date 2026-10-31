/*
name: Hollowborn Chaos Envoy - In The Beasts Shadow
description: does the 'beasts shadow' part of hollowborn chaos envoy
tags: hollowborn chaos envoy, hollowborn, beasts shadow
*/
// Port of Scripts/Hollowborn/HollowbornChaosEnvoy/2InTheBeastsShadow.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions } from "turu";
import { configEnum, Core } from "../../core/CoreBots";
import { CoreHollowbornChaosEnvoy, InTheBeastsShadowRewards } from "./CoreHollowbornChaosEnvoy";

const HBCE = new CoreHollowbornChaosEnvoy();

export class HBCE2 {}

export const scriptOptions = defineScriptOptions(HBCE.optionsStorage, HBCE.options, true);

export default function main(): void {
    Core.setOptions();

    HBCE.inTheBeastsShadow(
        configEnum("In The Beasts Shadow", InTheBeastsShadowRewards, InTheBeastsShadowRewards.Hollowborn_Omega_Blades),
    );

    Core.setOptions(false);
}

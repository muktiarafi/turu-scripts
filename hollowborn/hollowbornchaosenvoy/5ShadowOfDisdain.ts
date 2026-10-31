/*
name: Hollowborn Chaos Envoy - Shadow Of Disdain
description: does the 'shadow of disdain' part of hollowborn chaos envoy
tags: hollowborn chaos envoy, hollowborn, shadow of disdain, hollowborn envoy of chaos character page badge
*/
// Port of Scripts/Hollowborn/HollowbornChaosEnvoy/5ShadowOfDisdain.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions } from "turu";
import { configEnum, Core } from "../../core/CoreBots";
import { CoreHollowbornChaosEnvoy, ShadowsOfDisdainRewards } from "./CoreHollowbornChaosEnvoy";

const HBCE = new CoreHollowbornChaosEnvoy();

export class HBCE5 {}

export const scriptOptions = defineScriptOptions(HBCE.optionsStorage, HBCE.options, true);

export default function main(): void {
    Core.setOptions();
    HBCE.shadowsOfDisdain(
        configEnum("Shadows Of Disdain", ShadowsOfDisdainRewards, ShadowsOfDisdainRewards.Hollowborn_Envoy_of_Chaos),
    );

    Core.setOptions(false);
}

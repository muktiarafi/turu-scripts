/*
name: Hollowborn Chaos Envoy - Wavering Illusions
description: does the 'wavering illusions' part of hollowborn chaos envoy
tags: hollowborn chaos envoy, hollowborn, wavering illusions
*/
// Port of Scripts/Hollowborn/HollowbornChaosEnvoy/4WaveringIllusions.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions } from "turu";
import { configEnum, Core } from "../../core/CoreBots";
import { CoreHollowbornChaosEnvoy, WaveringIllusionsRewards } from "./CoreHollowbornChaosEnvoy";

const HBCE = new CoreHollowbornChaosEnvoy();

export class HBCE4 {}

export const scriptOptions = defineScriptOptions(HBCE.optionsStorage, HBCE.options, true);

export default function main(): void {
    Core.setOptions();

    HBCE.waveringIllusions(
        configEnum("Wavering Illusions", WaveringIllusionsRewards, WaveringIllusionsRewards.Hollowborn_Eye_of_Chaos),
    );

    Core.setOptions(false);
}

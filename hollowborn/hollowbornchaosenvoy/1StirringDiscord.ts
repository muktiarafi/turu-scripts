/*
name: Hollowborn Chaos Envoy - Stirring Discord
description: does the 'stirring discord' part of hollowborn chaos envoy
tags: hollowborn chaos envoy, hollowborn, stirring discord
*/
// Port of Scripts/Hollowborn/HollowbornChaosEnvoy/1StirringDiscord.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions } from "turu";
import { configEnum, Core } from "../../core/CoreBots";
import { CoreHollowbornChaosEnvoy, StirringDiscordRewards } from "./CoreHollowbornChaosEnvoy";

const HBCE = new CoreHollowbornChaosEnvoy();

export class HBCE1 {}

export const scriptOptions = defineScriptOptions(HBCE.optionsStorage, HBCE.options, true);

export default function main(): void {
    Core.setOptions();

    HBCE.stirringDiscord(
        configEnum("Stirring Discord", StirringDiscordRewards, StirringDiscordRewards.Hollowborn_Chaos_Warrior),
    );

    Core.setOptions(false);
}

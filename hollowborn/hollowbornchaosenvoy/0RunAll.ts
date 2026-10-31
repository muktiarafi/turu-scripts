/*
name: Hollowborn Chaos Envy Run all
description: does all of hollowborn chaos envy
tags: hollowborn chaos envoy, hollowborn, do all
*/
// Port of Scripts/Hollowborn/HollowbornChaosEnvoy/0RunAll.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreHollowbornChaosEnvoy } from "./CoreHollowbornChaosEnvoy";

const HBCE = new CoreHollowbornChaosEnvoy();

export class HBCE0 {}

export const scriptOptions = defineScriptOptions(HBCE.optionsStorage, HBCE.options, true);

export default function main(): void {
    Core.setOptions();

    HBCE.getAll();

    Core.setOptions(false);
}

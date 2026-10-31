/*
name: HardCore Metals Daily
description: HardCore Metals
tags: daily, hardcore metals, member
*/
// Port of Scripts/Dailies/HardCoreMetals[Mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { choices, defineScriptOptions, option } from "turu";
import { configEnum, Core } from "../core/CoreBots";
import { CoreDailies, HardCoreMetalsEnum } from "../core/CoreDailies";

const Daily = new CoreDailies();

export class HardCoreMetals {}

export const scriptOptions = defineScriptOptions(
    "HardCoreMetals[mem](Daily)",
    [option.choice("metals", "Which Metal", "Select the metal you wish to get here", choices(HardCoreMetalsEnum))],
    true,
);

export default function main(): void {
    Core.setOptions();

    Daily.hardCoreMetals(
        [HardCoreMetalsEnum[configEnum("metals", HardCoreMetalsEnum, HardCoreMetalsEnum.Arsenic)]],
        10,
        { toBank: false },
    );

    Core.setOptions(false);
}

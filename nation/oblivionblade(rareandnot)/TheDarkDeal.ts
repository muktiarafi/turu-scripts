/*
name: TheDarkDeal
description: null
tags: null
*/
// Port of Scripts/Nation/OblivionBlade(RareandNot)/TheDarkDeal.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreOblivionBladeofNulgath } from "./CoreOblivionBladeofNulgath";

const COBoN = new CoreOblivionBladeofNulgath();

export class TheDarkDeal {}

export const scriptOptions = defineScriptOptions(
    "TheDarkDeal",
    [Core.skipOptions, option.int("RelicQuant", "Relic Quant", "Relic of Chaos quant", 0)],
    true,
);

export default function main(): void {
    Core.setOptions();

    COBoN.theDarkDeal(bot.config?.get<number>("RelicQuant") ?? null);

    Core.setOptions(false);
}

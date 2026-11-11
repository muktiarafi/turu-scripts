/*
name: DiamondsofNulgathSale
description: null
tags: null
*/
// Port of Scripts/Nation/OblivionBlade(RareandNot)/DiamondsofNulgathSale.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreOblivionBladeofNulgath } from "./CoreOblivionBladeofNulgath";

const COBoN = new CoreOblivionBladeofNulgath();

export class DiamondsofNulgathSale {}

export const scriptOptions = defineScriptOptions(
    "DiamondsofNulgathSale",
    [Core.skipOptions, option.int("DiamondQuant", "Diamond Quant", "Diamond of Nulgath quant", 1000)],
    true,
);

export default function main(): void {
    Core.setOptions();

    COBoN.diamondsofNulgathSale(bot.config?.get<number>("DiamondQuant") ?? null);

    Core.setOptions(false);
}

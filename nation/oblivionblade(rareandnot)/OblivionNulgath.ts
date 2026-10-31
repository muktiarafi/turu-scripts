/*
name: OblivionNulgath
description: null
tags: null
*/
// Port of Scripts/Nation/OblivionBlade(RareandNot)/OblivionNulgath.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreOblivionBladeofNulgath } from "./CoreOblivionBladeofNulgath";

const COBoN = new CoreOblivionBladeofNulgath();

export enum OblivionNulgathRewards {
    Unidentified_13 = "Unidentified_13",
    Tainted_Gem = "Tainted_Gem",
    Dark_Crystal_Shard = "Dark_Crystal_Shard",
    Diamond_of_Nulgath = "Diamond_of_Nulgath",
    Totem_of_Nulgath = "Totem_of_Nulgath",
    Gem_of_Nulgath = "Gem_of_Nulgath",
    Blood_Gem_of_the_Archfiend = "Blood_Gem_of_the_Archfiend",
}

export class OblivionNulgath {}

export const scriptOptions = defineScriptOptions(
    "TheDarkDeal",
    [
        Core.skipOptions,
        option.choice(
            "Reward",
            "Item Selec",
            "Select the Item then Quantity",
            choices(OblivionNulgathRewards),
            OblivionNulgathRewards.Unidentified_13,
        ),
        option.int("Quanity", "Item Quanity", "How many of the Selected reward", 0),
    ],
    true,
);

export default function main(): void {
    Core.setOptions();

    COBoN.oblivionNulgath(bot.config?.get<string>("Reward") ?? "", bot.config?.get<number>("Quanity") ?? null);

    Core.setOptions(false);
}

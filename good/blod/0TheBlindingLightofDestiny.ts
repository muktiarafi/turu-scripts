/*
name: Blinding Light of Destiny (Full)
description: This bot will do the entire farm for the Blinding Light of Destiny *Note*: it uses dailies!
tags: BLOD, blinding, light, destiny, undead, 75, damage, good, soul searching, minecrafting, metals, spirit orb, aura, loyal, blinding, bright, brilliant, weapon kit, finding fragments, bone some dust, essential essences, light merge, blinding light fragments
*/
// Port of Scripts/Good/BLoD/0TheBlindingLightofDestiny.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { choices, defineScriptOptions, option } from "turu";
import { configEnum, Core } from "../../core/CoreBots";
import { BLODMethod, CoreBLOD } from "./CoreBLOD";

const BLOD = new CoreBLOD();

export class TheBlindingLightofDestiny {}

export const scriptOptions = defineScriptOptions(
    "BLOD_options",
    [
        option.choice(
            "BLODMethod",
            "Method",
            "Which method do you want the bot to farm BLOD?" +
                "\nFewest Dailies:\tBlinding Blade of Destiny" +
                "\nOptimized:\tBlinding Daggers & Mace of Destiny" +
                "\nFewest Hours:\tBlinding Mace, Bow & Blade of Destiny",
            choices(BLODMethod),
            BLODMethod[BLODMethod.Optimized],
        ),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    Core.setOptions();

    BLOD.blindingLightOfDestiny(configEnum("BLODMethod", BLODMethod, BLODMethod.Fewest_Dailies));

    Core.setOptions(false);
}

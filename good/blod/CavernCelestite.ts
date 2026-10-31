/*
name: Cavern Celestite
description: This script farms the desired quantity of Cavern Celestite.
tags: cavern, celestite, BLOD, blinding, light, destiny, good, soul searching, nsod
*/
// Port of Scripts/Good/BLoD/CavernCelestite.cs.
// Differs from C#: options are declared before the game is reachable, so the Quantity default is
// Cavern Celestite's max stack from quest 939's data (1600) instead of C#'s read from the loaded quest.

import { bot, defineScriptOptions, option } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreBLOD } from "./CoreBLOD";

const BLOD = new CoreBLOD();

export class CavernCelestite {}

export const scriptOptions = defineScriptOptions(
    "CavernCelestite",
    [
        Core.skipOptions,
        option.int(
            "Quantity",
            "Cavern Celestite Quantity",
            "Choose the quantity of Cavern Celestite to farm. (Farms max stack by default)",
            1600,
        ),
    ],
    true,
);

export default function main(): void {
    Core.setOptions();

    BLOD.soulSearching("Cavern Celestite", bot.config.get<number>("Quantity"), false);

    Core.setOptions(false);
}

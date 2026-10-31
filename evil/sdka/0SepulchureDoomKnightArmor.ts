/*
name: Sepulchure's DoomKnight Armor (SDKA)
description: This script will get Sepulchure's DoomKnight Armor (SDKA)
tags: sepulchure, sdka, doomknight, armor, evil, member
*/
// Port of Scripts/Evil/SDKA/0SepulchureDoomKnightArmor.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreSDKA } from "./CoreSDKA";

const SDKA = new CoreSDKA();

export class SepulchureDoomKnightArmor {}

export const scriptOptions = defineScriptOptions(SDKA.optionsStorage, SDKA.options, true);

export default function main(): void {
    Core.setOptions();

    SDKA.doAll();

    Core.setOptions(false);
}

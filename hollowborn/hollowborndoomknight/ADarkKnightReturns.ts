/*
name: HBDK - A Dark Knight Returns
description: does the 'a dark knight returns' part of hollowborn doomKnight
tags: hollowborn, a dark knight returns, hollowborn doomknight, hollowborn sword of doom, hollowborn doomknight character page badge
*/
// Port of Scripts/Hollowborn/HollowbornDoomKnight/ADarkKnightReturns.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreHollowbornDoomKnight } from "./CoreHollowbornDoomKnight";

const HDK = new CoreHollowbornDoomKnight();

export class ADKReturns {}

export const scriptOptions = defineScriptOptions(HDK.optionsStorage, HDK.options, true);

export default function main(): void {
    Core.setOptions();

    HDK.getAll();

    Core.setOptions(false);
}

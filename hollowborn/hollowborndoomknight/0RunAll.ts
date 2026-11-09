/*
name: Hollowborn DoomKnight - Do all
description: does all of hollowborn DoomKnight
tags: hollowborn, hollowborn paladin, hollowborn doomknight, hollowborn sword of doom, do all
*/
// Port of Scripts/Hollowborn/HollowbornDoomKnight/0RunAll.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreHollowbornDoomKnight } from "./CoreHollowbornDoomKnight";

const HDK = new CoreHollowbornDoomKnight();

export class HDKAll {}

export const scriptOptions = defineScriptOptions(HDK.optionsStorage, HDK.options, true);

export default function main(): void {
    Core.setOptions();

    HDK.getAll(bot.config.get<boolean>("PreFarm"));

    Core.setOptions(false);
}

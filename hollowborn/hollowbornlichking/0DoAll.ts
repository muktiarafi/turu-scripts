/*
name: Hollowborn Lich King - Do all
description: does the *All* part of hollowborn Lich King
tags: hollowborn lich king, hollowborn, doall, do all
*/
// Port of Scripts/Hollowborn/HollowbornLichKing/0DoAll.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreHollowbornLichKing } from "./CoreHollowbornLichKing";

const sHBLK = new CoreHollowbornLichKing();

export class HBLK0 {}

export const scriptOptions = defineScriptOptions(sHBLK.optionsStorage, sHBLK.options, true);

export default function main(): void {
    Core.setOptions();

    sHBLK.getAll(bot.config.get<boolean>("getAll"), bot.config.get<boolean>("BankAfter"));

    Core.setOptions(false);
}

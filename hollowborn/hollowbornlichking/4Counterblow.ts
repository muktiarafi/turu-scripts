/*
name: Hollowborn Lich King - Counterblow
description: does the 'Counterblow' part of hollowborn Lich King
tags: hollowborn lich king, hollowborn, counterblow
*/
// Port of Scripts/Hollowborn/HollowbornLichKing/4Counterblow.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreHollowbornLichKing, CounterblowRewards } from "./CoreHollowbornLichKing";

const sHBLK = new CoreHollowbornLichKing();

export class HBLK4 {}

export const scriptOptions = defineScriptOptions(sHBLK.optionsStorage, sHBLK.options, true);

export default function main(): void {
    Core.setOptions();

    sHBLK.counterblow(CounterblowRewards.All);

    Core.setOptions(false);
}

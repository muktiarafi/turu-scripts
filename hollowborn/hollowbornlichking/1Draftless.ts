/*
name: Hollowborn Lich King - Draftless
description: does the 'Draftless' part of hollowborn Lich King
tags: hollowborn lich king, hollowborn, draftless
*/
// Port of Scripts/Hollowborn/HollowbornLichKing/1Draftless.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreHollowbornLichKing, DraftlessRewards } from "./CoreHollowbornLichKing";

const sHBLK = new CoreHollowbornLichKing();

export class HBLK1 {}

export const scriptOptions = defineScriptOptions(sHBLK.optionsStorage, sHBLK.options, true);

export default function main(): void {
    Core.setOptions();

    sHBLK.draftless(DraftlessRewards.All);

    Core.setOptions(false);
}

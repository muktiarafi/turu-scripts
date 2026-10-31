/*
name: Hollowborn Lich King - Lich King Fragment
description: maxes out the "Lich King Fragment" item
tags: hollowborn lich king, hollowborn, Lich King Fragment
*/
// Port of Scripts/Hollowborn/HollowbornLichKing/MaxLichKingFragments.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHollowbornLichKing, FlowStressRewards } from "./CoreHollowbornLichKing";

const sHBLK = new CoreHollowbornLichKing();

export class LichKingFragment {}

export default function main(): void {
    Core.setOptions();

    Core.oneTimeMessage("Warning", "this script will **NOT** stop till you manaully stop it.");
    sHBLK.flowStress(FlowStressRewards.Lich_King_Fragment, false, 10001);

    Core.setOptions(false);
}

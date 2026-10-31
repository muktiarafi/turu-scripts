/*
name: TotemofNulgath
description: null
tags: null
*/
// Port of Scripts/Nation/Materials/TotemofNulgath.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreNation } from "../CoreNation";

const Nation = new CoreNation();

export class TotemofNulgath {
    // public string OptionsStorage = "TotemofNulgath";
    // public bool DontPreconfigure = true;
    // public List<IOption> Options = new()
    // {
    //     new Option<bool>("Choose", "Taro[true]/VoucherItem[False]", "Pets will be Checked first, then; Choose Between the 2 methods (Taro[true] is harder, Voucher Item[false] takes longer)", false),
    //     CoreBots.Instance.SkipOptions
    // };
}

export default function main(): void {
    Core.setOptions();

    Nation.farmTotemofNulgath();

    Core.setOptions(false);
}

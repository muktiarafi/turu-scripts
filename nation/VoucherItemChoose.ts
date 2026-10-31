/*
name: VoucherItemChoose
description: null
tags: null
*/
// Port of Scripts/Nation/VoucherItemChoose.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { choices, defineScriptOptions, option } from "turu";
import { configEnum, Core } from "../core/CoreBots";
import { CoreNation, VoucherItemTotem } from "./CoreNation";

const Nation = new CoreNation();

export class VoucherItem {
    choose(): void {
        Nation.voucherItemTotemofNulgath(
            configEnum("VoucherItem", VoucherItemTotem, VoucherItemTotem.Totem_of_Nulgath),
        );
    }
}

export const scriptOptions = defineScriptOptions(
    "VoucherItem",
    [
        Core.skipOptions,
        option.choice(
            "VoucherItem",
            "Choose Your Item",
            "Extra stuff to choose, if you have any suggestions -form in disc, and put it under request. or dm Tato(the retarded one on disc)",
            choices(VoucherItemTotem),
            VoucherItemTotem[VoucherItemTotem.Totem_of_Nulgath],
        ),
    ],
    true,
);

export default function main(): void {
    const script = new VoucherItem();
    Core.setOptions();

    script.choose();

    Core.setOptions(false);
}

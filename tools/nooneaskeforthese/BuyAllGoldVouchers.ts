/*
name: Buy All Gold Vouchers
description: as the name says
tags: gold voucher, gold, voucher
*/
// Port of Scripts/Tools/NooneAskeforThese/BuyAllGoldVouchers.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class BuyAllGoldVouchers {
    getemall(TestMode = false): void {
        Core.logger("This script is pointless... but was requested to waste gold.");

        const vouchers = new Map([
            ["Gold Voucher 500k", 300],
            ["Gold Voucher 200k", 300],
            ["Gold Voucher 100k", 300],
            ["Gold Voucher 25k", 300],
            ["Gold Voucher 7.5k", 300],
        ]);

        for (const [voucher, maxQuant] of vouchers) {
            Farm.voucher(voucher, maxQuant);
        }
    }
}

export default function main(): void {
    const script = new BuyAllGoldVouchers();
    Core.setOptions();

    script.getemall();

    Core.setOptions(false);
}

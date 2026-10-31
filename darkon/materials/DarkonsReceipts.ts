/*
name: Darkons Receipt
description: Darkons Receipt
tags: darkon, darkons receipt
*/
// Port of Scripts/Darkon/Materials/DarkonsReceipts.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreDarkon } from "../CoreDarkon";

const Darkon = new CoreDarkon();

export class DarkonsReceipts {}

export default function main(): void {
    Core.setOptions();

    Darkon.farmReceipt();

    Core.setOptions(false);
}

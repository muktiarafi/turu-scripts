/*
name: Shadow Scythe Class Daily
description: Shadow Scythe Class
tags: daily, shadow scythe class
*/
// Port of Scripts/Dailies/ShadowScytheGeneral.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreDailies } from "../core/CoreDailies";

const Daily = new CoreDailies();

export class ShadowScytheClassDaily {}

export default function main(): void {
    Core.setOptions();

    Daily.shadowScytheClass();

    Core.setOptions(false);
}

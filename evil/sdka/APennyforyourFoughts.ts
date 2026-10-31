/*
name: A Penny For Your Foughts
description: This script will farm Dark Spirit Orbs using "A Penny For Your Foughts" Quest.
tags: dark spirit orbs, dso, penny, doomcoin, shadow creeper enchant, maul
*/
// Port of Scripts/Evil/SDKA/APennyforyourFoughts.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSDKA } from "./CoreSDKA";

const SDKA = new CoreSDKA();

export class DSOPenny {}

export default function main(): void {
    Core.bankingBlackList.push("DoomCoin", "Dark Spirit Orb", "Shadow Creeper Enchant");
    Core.setOptions();

    SDKA.penny();

    Core.setOptions(false);
}

/*
name: Crypto Token Daily
description: Crypto Token
tags: daily, crypto token
*/
// Port of Scripts/Dailies/CryptoToken.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreDailies } from "../core/CoreDailies";

const Daily = new CoreDailies();

export class CryptoToken {}

export default function main(): void {
    Core.setOptions();

    Daily.cryptoToken();

    Core.setOptions(false);
}

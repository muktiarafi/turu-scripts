/*
name: LeeryExchange(gold)
description: null
tags: null
*/
// Port of Scripts/Nation/Various/LeeryExchange(gold).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreNation } from "../CoreNation";

const Nation = new CoreNation();

export class leeryExchange {}

export default function main(): void {
    Core.bankingBlackList.push(Nation.uni(13), "Diamond of Nulgath", "Relic of Chaos");
    Core.setOptions();

    Nation.leeryExchangeGold();

    Core.setOptions(false);
}

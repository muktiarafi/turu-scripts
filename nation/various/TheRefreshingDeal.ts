/*
name: The Refreshing Deal
description: This script farms Gems and Totems of Nulgath using "The Refreshing Deal" Quest.
tags: refreshing, deal, gem, totem, nulgath, nation, crag, bamboozle, quest
*/
// Port of Scripts/Nation/Various/TheRefreshingDeal.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreNation } from "../CoreNation";

const Nation = new CoreNation();

export class TheRefreshingDeal {}

export const scriptOptions = defineScriptOptions(
    "RefreshingDeal",
    [
        Core.skipOptions,
        option.int("GemQuantity", "How many Gems of Nulgath?", "Max Stack is 1000", 1000),
        option.int("TotemQuantity", "How many Totems of Nulgath?", "Max Stack is 100", 100),
        option.bool("BankItems", "Bank nation items at the end", "true/false", false),
    ],
    true,
);

export default function main(): void {
    Core.bankingBlackList.push(...Nation.bagDrops);
    Core.setOptions();

    Nation.deal(bot.config!.get<number>("GemQuantity"), bot.config.get<number>("TotemQuantity"));

    Core.setOptions(false);
}

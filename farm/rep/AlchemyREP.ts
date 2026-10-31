/*
name: Alchemy REP
description: This script will farm Alchemy reputation to rank 10.
tags: alchemy, rep, reputation, farm
*/
// Port of Scripts/Farm/REP/AlchemyREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class AlchemyREP {
    //Gold Voucher 500k x6 (3.000.000 Gold) => 30x Dragon Runestone => Dragon Scale & Ice Vapor x30
    //Rank 1 to 10 => 6.100.000 Gold w/out boost											 (7KK WITH THE BOT)
    //Rank 1 to 10 => 4.900.000 Gold 25% boost (Cape of Awe)								 (5KK WITH THE BOT)
    //Rank 1 to 10 => 3.100.000 Gold REP Boost											     (4KK WITH THE BOT)
    //Rank 1 to 10 => 2.500.000 Gold REP Boost + 25% boost (Cape of Awe)					 (3KK WITH THE BOT)
    //Rank 1 to 10 => 1.300.000 Gold Server REP Boost + REP Boost + 25% boost (Cape of Awe)  (2KK WITH THE BOT)
}

export const scriptOptions = defineScriptOptions(
    "AlchemyREP",
    [
        option.bool(
            "goldMethod",
            "use Gold?",
            "Using gold to buy material, we'll farm them otherwise. (cost 7.000.000 without boosts rank 1 to 10)",
            false,
        ),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    Core.bankingBlackList.push("Dragon Runestone");
    Core.setOptions();

    Farm.alchemyREP(10, bot.config!.get<boolean>("goldMethod"));

    Core.setOptions(false);
}

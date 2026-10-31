/*
name: The Poisonous Deal
description: This script farms Tainted Gems and Dark Crystal Shards using "The Poisonous Deal" Quest.
tags: poisonous, deal, dark, crystal, shard, tainted, gem, nulgath, nation, crag, bamboozle, quest, claymore
*/
// Port of Scripts/Nation/Various/ThePoisonousDeal.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreNation } from "../CoreNation";
import { TaintedClaymore } from "./TaintedClaymore";

const Nation = new CoreNation();
const TC = new TaintedClaymore();

export class ThePoisonousDeal {
    deal(TaintedQuant: number, ShardQuant: number): void {
        if (!Core.checkInventory(Nation.cragName)) {
            Core.logger(`${Nation.cragName} missing. stopping`);
            return;
        }

        Nation.dragonSlayerReward();
        TC.doAll();

        Core.addDrop("Tainted Gem", "Dark Crystal Shard");

        Core.farmingLogger("Tainted Gem", TaintedQuant);

        while (!bot.shouldExit && !Core.checkInventory("Tainted Gem", TaintedQuant)) {
            Core.ensureAccept(4776);
            Nation.supplies("Unidentified 3");
            Nation.farmBloodGem(2);
            Nation.farmUni10(30);
            Core.ensureComplete(4776, 4769);
            bot.wait.forPickup("Tainted Gem");
        }

        Core.farmingLogger("Dark Crystal Shard", ShardQuant);

        while (!bot.shouldExit && !Core.checkInventory("Dark Crystal Shard", ShardQuant)) {
            Core.ensureAccept(4776);
            Nation.supplies("Unidentified 3");
            Nation.farmBloodGem(2);
            Nation.farmUni10(30);
            Core.ensureComplete(4776, 4770);
            bot.wait.forPickup("Dark Crystal Shard");
        }

        if (bot.config!.get<boolean>("BankItems")) {
            Core.toBank(...Nation.bagDrops);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "PoisonousDeal",
    [
        Core.skipOptions,
        option.int("TaintedQuantity", "How many Tainted Gems?", "Max Stack is 1000", 0),
        option.int("ShardQuantity", "How many Dark Crystal Shards?", "Max Stack is 1000", 0),
        option.bool("BankItems", "Bank nation items at the end", "true/false", false),
    ],
    true,
);

export default function main(): void {
    const script = new ThePoisonousDeal();
    Core.bankingBlackList.push(...Nation.bagDrops);
    Core.setOptions();

    script.deal(bot.config!.get<number>("TaintedQuantity"), bot.config.get<number>("ShardQuantity"));

    Core.setOptions(false);
}

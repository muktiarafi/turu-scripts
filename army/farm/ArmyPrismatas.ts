/*
name: Army Prismatas
description: Farms gold using the Prismatas in /archmage and selling the elemental bindings
tags: Prismatas, elemental binding, gold, farm
*/
// Port of Scripts/Army/Farm/ArmyPrismatas.cs.
// The Ultras' CoreEngine (C#'s `Core`) and CoreUltra are army/CoreArmySync's CoreArmyEngine and CoreArmySync.

import { bot, defineScriptOptions, option } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreArmyEngine, CoreArmySync } from "../CoreArmySync";

const Engine = new CoreArmyEngine();
const Ultra = new CoreArmySync();
const Farm = new CoreFarms();

export class ArmyPristmas {
    killPrismatas(): void {
        if (bot.config!.get<boolean>("StopAtMaxGold") && bot.config!.get<boolean>("MaxVouchers")) {
            Core.logger("StopAtMaxGold and MaxVouchers are both enabled - pick one. Stopping.");
            return;
        }

        const map = "archmage";
        const syncPath = Ultra.resolveSyncPath("ArmyBool.sync");
        Ultra.clearSyncFile(syncPath);
        bot.sleep(2500);
        Engine.join(map);
        Core.addDrop("Elemental Binding");
        Core.jump("r2", "Left");
        bot.player.setSpawnPoint();
        bot.sleep(1500);
        const sellEvery100 = bot.config!.get<boolean>("SellEvery100");
        const stopAtMaxGold = bot.config!.get<boolean>("StopAtMaxGold");
        while (!bot.shouldExit) {
            if (stopAtMaxGold && Ultra.checkArmyProgressBool(() => bot.player.gold >= 100000000, syncPath)) {
                bot.options.aggroMonsters = false;
                Core.jump("Enter", "Spawn");
                Core.logger("All players finished farm.");
                break;
            }
            // Dead → wait for respawn
            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);
                continue;
            }

            if (bot.player.cell !== "r2") {
                bot.map.jump("r2", "Left");
                bot.wait.forCellChange("r2");
            }

            bot.combat.attack((bot.monsters.currentAvailableMonsters.find((m) => m.mapId === 1)?.hp ?? 0) > 0 ? 1 : 2);

            if (Core.goldMaxed && bot.config!.get<boolean>("MaxVouchers")) {
                this.buyAllVouchers();
            }

            if (!Core.goldMaxed && sellEvery100 && Core.checkInventory("Elemental Binding", 100)) {
                Core.sellItem("Elemental Binding", undefined, { all: true });
            }

            bot.sleep(500);
        }
    }

    buyAllVouchers(TestMode = false): void {
        Core.logger("This is pointless... but was requested to waste gold.");

        // Ordered highest price -> lowest, with each voucher's gold cost so we know
        // when we can no longer afford another of that type.
        const vouchers: [Name: string, MaxQuant: number, Price: number][] = [
            ["Gold Voucher 500k", 300, 500000],
            ["Gold Voucher 200k", 300, 200000],
            ["Gold Voucher 100k", 300, 100000],
            ["Gold Voucher 25k", 300, 25000],
            ["Gold Voucher 7.5k", 300, 7500],
        ];

        for (const [voucher, maxQuant, price] of vouchers) {
            const currentQty = bot.inventory.getQuantity(voucher);

            if (currentQty >= maxQuant) {
                Core.logger(`Already have ${currentQty}x ${voucher}, skipping.`);
                continue;
            }

            const remaining = maxQuant - currentQty;
            const affordable = Math.trunc(bot.player.gold / price);
            const toBuy = Math.min(remaining, affordable);

            if (toBuy <= 0) {
                Core.logger(`Can't afford any ${voucher} (need ${price}, have ${bot.player.gold}), skipping.`);
                continue;
            }

            Farm.voucher(voucher, toBuy);
            Core.logger(`Bought ${toBuy}x ${voucher} (had ${currentQty}, gold remaining: ${bot.player.gold})`);

            if (bot.shouldExit) {
                return;
            }
        }

        Core.logger("BuyAllVouchers finished - spent as much gold as possible across all voucher types.");
    }
}

export const scriptOptions = defineScriptOptions(
    "ArmyPristmas",
    [
        option.bool(
            "SellEvery100",
            "Sell Every 100",
            "Enable to sell Elemental Binding every 100. Disable to keep them.",
            true,
        ),
        option.bool(
            "MaxVouchers",
            "Max Gold Vouchers",
            "Enable to *when gold is maxed* to buy as many of teh types of vouchers as you can till u ahve 300 of all [maxe quant]",
            true,
        ),
        option.bool(
            "StopAtMaxGold",
            "Stop at Max Gold",
            "Enable to stop when reaching 100M gold. Disable to continue farming.",
            true,
        ),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new ArmyPristmas();
    Core.bankingBlackList.push("Elemental Binding");
    Core.setOptions(undefined, { disableClassSwap: true });
    Core.logger("Elemental Bindings will be sold every 100\n The script will use what ever class you have on.");
    Engine.boot();
    script.killPrismatas();

    Core.setOptions(false);
}

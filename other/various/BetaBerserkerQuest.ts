/*
name: Secret Map Quest
description: if you own the (rare) beta berserker class, this will do the quest [5516] for the rewards.
tags: beta berserker armor, dark berserker, beta berserker, secret map, rare, pseudo-rare
*/
// Port of Scripts/Other/Various/BetaBerserkerQuest.cs.

import { bot } from "turu";
import { Core, rethrowIfStopped } from "../../core/CoreBots";

export class SecretMapQuest {
    private static readonly candleShopId = 1317;
    private static readonly candleName = "Golden 8th Birthday Candle";
    private static readonly darkBerserkerName = "Dark Berserker";

    private readonly months: Map<string, number> = new Map([
        ["Jan", 1],
        ["Feb", 2],
        ["Mar", 3],
        ["Apr", 4],
        ["May", 5],
        ["Jun", 6],
        ["Jul", 7],
        ["Aug", 8],
        ["Sep", 9],
        ["Oct", 10],
        ["Nov", 11],
        ["Dec", 12],
    ]);

    doQuest(): void {
        if (Core.checkInventory(SecretMapQuest.darkBerserkerName)) {
            Core.logger("You already own Dark Berserker.");
            return;
        }

        if (Core.checkInventory("Beta Berserker") || Core.checkInventory(Core.questRewards(5516))) {
            return;
        }

        if (!this.ensureGolden8thBirthdayCandle()) {
            bot.stop();
            return;
        }

        Core.unbank("Beta Berserker");
        Core.addDrop(...Core.questRewards(5516));

        while (!bot.shouldExit && !Core.checkInventory(Core.questRewards(5516))) {
            if (Core.checkInventory(SecretMapQuest.darkBerserkerName)) {
                Core.logger("You already own Dark Berserker.");
                bot.stop();
                return;
            }

            while (!bot.shouldExit && Core.checkClassRank({ currentClass: false, className: "Beta Berserker" }) < 10) {
                Core.killMonster("battleontown", "Enter", "Spawn", "*", undefined, undefined, { log: false });
            }

            Core.ensureAccept(5516);
            Core.huntMonster("nostalgiaquest", "Boss Zardman", "Secret Map");
            Core.ensureComplete(5516);
        }
    }

    private ensureGolden8thBirthdayCandle(): boolean {
        Core.unbank(SecretMapQuest.candleName);
        if (Core.checkInventory(SecretMapQuest.candleName)) {
            return true;
        }

        Core.logger("Checking if Your Acc is 8 Years Old");

        if (!this.isAccountAtLeast8YearsOld()) {
            Core.logger("your acc isn't old enough.");
            return false;
        }

        Core.buyItem(bot.map.name, SecretMapQuest.candleShopId, SecretMapQuest.candleName);
        bot.wait.forPickup(SecretMapQuest.candleName);

        return Core.checkInventory(SecretMapQuest.candleName);
    }

    private isAccountAtLeast8YearsOld(): boolean {
        try {
            // C# reads the JSON text and drops its quotes; bot.flash.get returns the string itself.
            const raw = String(bot.flash.get("world.myAvatar.objData.dCreated"));
            const parts = raw.replace(/^"|"$/g, "").split(" ");
            const time = parts[3].split(":");

            // C#'s creationDate.AddYears(8)
            const eightYearsAfter = new Date(
                parseInt(parts[5]) + 8,
                this.months.get(parts[1])! - 1,
                parseInt(parts[2]),
                parseInt(time[0]),
                parseInt(time[1]),
                parseInt(time[2]),
            ).getTime();

            return eightYearsAfter <= Date.now();
        } catch (error) {
            rethrowIfStopped(error);

            return false;
        }
    }
}

export default function main(): void {
    const script = new SecretMapQuest();
    Core.setOptions();

    script.doQuest();

    Core.setOptions(false);
}

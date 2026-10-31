/*
name: YouMadBroBadge
description: Does the alcemy sh...t till it gets the badge
tags: alchemy, you mad bro, rep, badge
*/
// Port of Scripts/Other/Badges/YouMadBroBadge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { AlchemyRunes, AlchemyTraits, CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class YouMadBroBadge {
    badge(useGold = true, FromAllBadge = false): void {
        if (!FromAllBadge) {
            useGold = bot.config!.get<boolean>("Use Gold");
        }

        if (Core.hasWebBadge(this.badgeName)) {
            Core.logger(`Already have the ${this.badgeName} badge`);
            return;
        }

        useGold = FromAllBadge || useGold;
        while (!bot.shouldExit && !Core.hasWebBadge(this.badgeName)) {
            Core.addDrop("Ice Vapor");
            Core.addDrop(11475);
            //dragon scale (2 items items have this name hence the id)

            if (!useGold) {
                Core.equipClass(ClassType.Farm);
                Core.farmingLogger("Dragon Scale", 30);
                while (!Core.checkInventory(11475, 30)) {
                    Core.killMonster("lair", "Hole", "Center", "*", undefined, undefined, {
                        isTemp: false,
                        log: false,
                    });
                }
                Core.killMonster("lair", "Enter", "Spawn", "*", "Ice Vapor", 30, { isTemp: false });
            } else {
                Farm.dragonRunestone(11);
                Core.buyItem("alchemy", 397, 11475, 10, 1232);
                Core.buyItem("alchemy", 397, 11478, 10, 1235);
            }

            //to make sure it always has 1 DRS
            // If Alchemy rank is less than 5, use Jera rune
            Farm.alchemyPacket(
                "Dragon Scale",
                "Ice Vapor",
                Farm.factionRank("Alchemy") < 5
                    ? AlchemyRunes.Jera
                    : Farm.factionRank("Alchemy") < 8
                      ? AlchemyRunes.Fehu
                      : AlchemyRunes.Gebo,
                { trait: AlchemyTraits.hOu },
            );
        }
        Core.trashCan("Dragon Scale", "Ice Vapor");
        Core.toBank("Dragon Runestone", "Gold Voucher 100k");
    }

    // private string[] PotionsToSell = {"Life Potion", "Basic Crusader Elixir", "Basic Barrier Potion", "Basic Crusader Elixir", "Divine Elixir", "Barrier Potion", "Basic Barrier Potion", "Basic Divine Elixir", "Crusader Elixir"};
    private readonly badgeName = "You mad bro?";
}

export const scriptOptions = defineScriptOptions(
    "YouMadBro",
    [
        option.bool(
            "Use Gold",
            "Use Gold?",
            `[✔️] Use Gold = Buy the Dragon Scales & Ice Vapor\n[❌] Use Gold = Farm the Dragon Scales & Ice Vapor`,
            true,
        ),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new YouMadBroBadge();
    Core.bankingBlackList.push("Dragon Runestone", "Ice Vapor");
    Core.setOptions();

    // Pass the "Use Gold" option to Badge method
    script.badge();

    Core.setOptions(false);
}

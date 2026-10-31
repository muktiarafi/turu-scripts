/*
name: Frostval Barbarian (Class)
description: This will finish the required quest and farms the required materials in order to get the Frostval Barbarian (Class).
tags: frostval-barbarian, class, seasonal, frostvale
*/
// Port of Scripts/Seasonal/Frostvale/FrostvalBarbarian.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreDailies } from "../../core/CoreDailies";
import { CoreFrostvale } from "./story/CoreFrostvale";
import { GlaceraStory } from "../../story/Glacera";

const Adv = new CoreAdvanced();
const Frostvale = new CoreFrostvale();
const Glacera = new GlaceraStory();
const Daily = new CoreDailies();

export class FrostvalBarbarian {
    getFB(rankUpClass = true): void {
        if (Core.checkInventory("Frostval Barbarian")) {
            return;
        }
        if (!Core.isSeasonalMapActive("frostvale")) {
            return;
        }

        Glacera.northstar();
        Frostvale.coldWindValley();

        if (!Core.checkInventory("Infernal Ice Heart") && !Core.checkInventory("Crypto Token", 5)) {
            Daily.cryptoToken();
            if (!Core.checkInventory("Crypto Token", 5)) {
                Core.logger(
                    `Please do the Crypto Token Daily ${5 - bot.inventory.getQuantity("Crypto Token")} more times before continuing the farm`,
                    undefined,
                    { messageBox: true, stopBot: true },
                );
            }
        }

        Core.addDrop(
            "Frostval Barbarian",
            "Frosty Barbarian's Helm",
            "Frosty Barbarian's Horns",
            "Bearded Barbarian Helm",
            "Frostval Barbarian Cape",
            "Frostval Barbarian Sword",
        );
        Core.ensureAccept(6649);
        Adv.buyItem("frostdeep", 520, "Sword Of Hope");
        if (!Core.checkInventory("Sassafras' War Helm")) {
            Core.addDrop("Sassafras' War Helm");
            while (!bot.shouldExit && !Core.checkInventory("Sassafras' War Helm")) {
                Core.ensureAccept(2570);
                Core.equipClass(ClassType.Farm);
                Core.huntMonster("newbie", "Slime", "Potent Dried Slime", 6);
                Core.ensureComplete(2570);
            }
            bot.wait.forPickup("Sassafras' War Helm");
        }
        if (!Core.checkInventory("Fur Tuft")) {
            Core.addDrop("Fur Tuft");
            Core.ensureAccept(1513);
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("alpine", "Wendigo", "Woebegone Wendigo");
            Core.ensureComplete(1513);
            bot.wait.forPickup("Fur Tuft");
        }
        if (!Core.checkInventory("Icy Holly")) {
            Core.addDrop("Icy Holly");
            Core.ensureAccept(6132);
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("coldwindvalley", "Snow Golem", "Elemental Ice", 5);
            Core.getMapItem(5557, 8, "coldwindvalley");
            Core.ensureComplete(6132);
            bot.wait.forPickup("Icy Holly");
        }
        if (!Core.checkInventory("Glaceran Key")) {
            Core.addDrop("Glaceran Key");
            Core.ensureAccept(3971);
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("northstar", "Karok The Fallen", "Karok defeated", 1);
            Core.ensureComplete(3971);
            bot.wait.forPickup("Glaceran Key");
        }
        if (!Core.checkInventory("Infernal Ice Heart")) {
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("frostvalfuture", "Wargoth the Frozen", "Frozen Orb", 5, { isTemp: false });
            Adv.buyItem("curio", 1539, "Infernal Ice Heart");
            bot.wait.forPickup("Infernal Ice Heart");
        }
        Core.ensureComplete(6649);

        bot.wait.forPickup("Frostval Barbarian");
        if (rankUpClass) {
            Adv.rankUpClass("Frostval Barbarian");
        }
    }
}

export default function main(): void {
    const script = new FrostvalBarbarian();
    Core.setOptions();

    script.getFB();

    Core.setOptions(false);
}

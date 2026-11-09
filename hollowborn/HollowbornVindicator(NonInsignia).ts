/*
name: Hollowborn Vindicator Class (Non Insignia)
description: Farms Hollowborn Vindicator Class.
tags: hollowborn, class, hbv,hollowborn vindicator, vindicator, gramiel, non insignia,ultragramielhub
*/
// Port of Scripts/Hollowborn/HollowbornVindicator(NonInsignia).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced } from "../core/CoreAdvanced";
import { Core } from "../core/CoreBots";
import { CoreFarms } from "../core/CoreFarms";
import { DeathsPower } from "./materials/DeathsPower";
import { GraceOrb } from "./materials/GraceOrb";
import { GramielsEmblem } from "./materials/GramielsEmblem";
import { HollowSoul } from "./materials/HollowSoul";
import { VindicatorBadge } from "./materials/VindicatorBadge";
import { VindicatorCrest } from "./materials/VindicatorCrest";
import { CoreHollowbornStory } from "../story/hollowborn/CoreHollowbornStory";

const Adv = new CoreAdvanced();
const Farm = new CoreFarms();
const HS = new HollowSoul();
const HBS = new CoreHollowbornStory();
const VB = new VindicatorBadge();
const DP = new DeathsPower();
const GO = new GraceOrb();
const GE = new GramielsEmblem();
const VC = new VindicatorCrest();

export class HBVNonInsig {
    getClass(rankUpClass = true, merge = false, quant = 4, FarmNextWeeks = false): void {
        // Already own the class OR already have enough Condensed Grace for merge
        if ((!merge && Core.checkInventory(94357)) || (merge && Core.checkInventory("Condensed Grace", quant))) {
            if (!merge && rankUpClass) {
                Adv.rankUpClass("Hollowborn Vindicator");
            }
            return;
        }

        // Prereqs
        Farm.experience(80);
        Farm.hollowbornREP();
        HBS.dawnSanctum();

        Core.addDrop("Condensed Grace");

        // Turu: the C# also reads the Farm4Weeks option here, which only this file's script
        // declares (0AllClasses and GramielsMerge failed); its main passes it instead.
        const preFarmNextWeeks = FarmNextWeeks;
        const currentQty = bot.inventory.getQuantity("Condensed Grace");
        const missingQty = 4 - currentQty;

        // Prefarm ON  → farm ALL remaining weeks worth of materials
        // Prefarm OFF → farm ONLY one week's materials
        const multiplier = preFarmNextWeeks ? missingQty : 1;

        // Run weekly whenever we still need any Condensed Grace
        if (missingQty > 0) {
            Core.ensureAccept(10299);

            // Farm weekly materials
            DP.getDP(multiplier);
            // Death's Power      (1 per weekly)
            HS.getYaSoulsHeeeere(1500 * multiplier);
            // Hollow Soul        (1500 per weekly)
            VB.getVindicatorBadge(200 * multiplier);
            // Vindicator Badge   (200 per weekly)
            GO.getGraceOrb(400 * multiplier);
            // Grace Orb          (400 per weekly)
            GE.getGramielsEmblem(300 * multiplier);
            // Gramiel's Emblem   (300 per weekly)
            VC.getVindicatorCrest(100 * multiplier);
            // Vindicator Crest   (100 per weekly)

            // Weekly lock check AFTER farming mats (so prefarming works safely)
            if (bot.quests.isDailyComplete(10299)) {
                Core.logger("Weekly quest completed. Come back next week.");
                Core.logger(`Next run: ${new Date(Date.now() + 7 * 86400000).toLocaleString("sv-SE")}`);
                return;
            }

            Core.ensureComplete(10299);
            bot.wait.forPickup("Condensed Grace");
        }

        // Not enough weekly turn-ins yet → exit and wait for reset
        if (!Core.checkInventory("Condensed Grace", 4)) {
            Core.logger(`Progress: ${bot.inventory.getQuantity("Condensed Grace")}/4 ${"Condensed Grace"}`);
            Core.logger(`Run again next week: ${new Date(Date.now() + 7 * 86400000).toLocaleString("sv-SE")}`);
            return;
        }

        // Buy + optionally rank up class
        Adv.buyItem("ultragramielhub", 2593, "Hollowborn Vindicator");

        if (rankUpClass) {
            Adv.rankUpClass("Hollowborn Vindicator");
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "FarmerJoePet",
    [
        option.bool(
            "Farm4Weeks",
            "Farm ALL 4 weeeks mats",
            "Save yourself some time, prefarm 4x the mats for all 4 weeks",
            true,
        ),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new HBVNonInsig();
    Core.setOptions();
    script.getClass(true, false, 4, bot.config.get<boolean>("Farm4Weeks"));
    Core.setOptions(false);
}

/*
name: Hollowborn Vindicator Class (Insignia)
description: Farms Hollowborn Vindicator Class prereqs for Insignia quest.
tags: hollowborn, class, hbv,hollowborn vindicator, vindicator, gramiel,insignia,ultragramielhub, ultragramiel
*/
// Port of Scripts/Hollowborn/HollowbornVindicator(Insignia).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
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

export class HBVInsig {
    getClass(rankUpClass = true): void {
        // Already own the class
        if (Core.checkInventory(94357)) {
            if (rankUpClass) {
                Adv.rankUpClass("Hollowborn Vindicator");
            }
            return;
        }

        // Prereqs
        Farm.experience(80);
        Farm.hollowbornREP();
        HBS.dawnSanctum();

        Core.addDrop("Condensed Grace");

        const currentQty = bot.inventory.getQuantity("Condensed Grace");
        const missingQty = 4 - currentQty;
        const multiplier = missingQty;

        // Still need weekly turn-ins
        if (missingQty > 0) {
            // Hard gate: need insignias before wasting time farming mats
            if (!Core.checkInventory("Gramiel the Graceful's Insignia", 5)) {
                Core.logger("Requires 5x Gramiel the Graceful's Insignia.");
                return;
            }

            // Weekly lock check
            if (bot.quests.isDailyComplete(10300)) {
                Core.logger("Weekly already completed.");
                Core.logger(`Next run: ${new Date(Date.now() + 7 * 86400000).toLocaleString("sv-SE")}`);
                return;
            }

            Core.ensureAccept(10300);

            // Farm all remaining weeks worth of materials in one run

            DP.getDP(multiplier);
            // Death's Power      (1 per weekly)
            HS.getYaSoulsHeeeere(75 * multiplier);
            // Hollow Soul        (75 per weekly)
            VB.getVindicatorBadge(10 * multiplier);
            // Vindicator Badge   (10 per weekly)
            GO.getGraceOrb(20 * multiplier);
            // Grace Orb          (20 per weekly)
            GE.getGramielsEmblem(15 * multiplier);
            // Gramiel's Emblem   (15 per weekly)
            VC.getVindicatorCrest(5 * multiplier);
            // Vindicator Crest   (5 per weekly)

            Core.ensureComplete(10300);
            bot.wait.forPickup("Condensed Grace");
        }

        // Not enough weeklies yet → wait for reset
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

export default function main(): void {
    const script = new HBVInsig();
    Core.setOptions();
    script.getClass();
    Core.setOptions(false);
}

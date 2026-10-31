/*
name: Keraunomedicine
description: One clean sweep quest completion for Keraunomedicine rewards
tags: Keraunomedicine,
*/
// Port of Scripts/Other/Various/Keraunomedicine.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreOasis } from "../../story/oasis/CoreOasis";

const Farm = new CoreFarms();
const COasis = new CoreOasis();

export class Keraunomedicine {
    getItems(): void {
        COasis.carcossaCabins();
        const questID = 10763;

        // materials
        Core.addDrop(
            "Crown of the Sky",
            "Volgritian's Tempest Helm",
            "Energized Aetheria Wings",
            "Aetheria Wings",
            "Galvanized Astrapè",
            "Gold Voucher 100k",
            "Volgritian's Scale",
            "Volgritian's Vet Receipt",
            "EP Cell",
        );

        Core.logger("====================================");
        Core.logger("      KERAUNOMEDICINE Started      ");
        Core.logger("====================================");

        Core.ensureAccept(questID);

        // ===== MATERIAL FARM =====

        Core.equipClass(ClassType.Solo);
        Core.huntMonster("naoisegrave", "Volgritian", "Volgritian's Scale", 25, { isTemp: false });

        while (!bot.shouldExit && !Core.checkInventory("Volgritian's Vet Receipt")) {
            Core.ensureAccept(10762);
            if (!Core.checkInventory("Gold Voucher 100k", 20)) {
                Farm.voucher("Gold Voucher 100k", 20);
            }
            Core.ensureComplete(10762);
        }

        while (!bot.shouldExit && !Core.checkInventory("Gold Voucher 100k", 20)) {
            Farm.voucher("Gold Voucher 100k", 20);
        }

        Core.registerQuests(Core.isMember ? 10761 : 10760);

        while (!bot.shouldExit && !Core.checkInventory("EP Cell", 250)) {
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("carcossacabins", "Clementine", "Clementine's Blood Sample");

            Core.equipClass(ClassType.Farm);
            Core.huntMonster("carcossacabins", "Evolved Lifeform", "Lifeform's Fingers", 9);
            Core.huntMonster("carcossacabins", "Doom Leech", "Leech's Ganglion", 9);

            bot.wait.forPickup("EP Cell");
        }

        Core.cancelRegisteredQuests();

        // ===== COMPLETE MAIN QUEST =====

        Core.ensureComplete(questID);

        // ===== FINISH =====

        Core.logger("====================================");
        Core.logger("      KERAUNOMEDICINE COMPLETE      ");
        Core.logger("====================================");
    }
}

export default function main(): void {
    const script = new Keraunomedicine();
    Core.setOptions();

    script.getItems();

    Core.setOptions(false);
}

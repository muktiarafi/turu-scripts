/*
name: Enchanted Nulgath Nation House
description: gets the enchanted nulgath nation house
tags: enchanted nulgath nation house, ennh, nulgath
*/
// Port of Scripts/Nation/Various/EnchantedNulgathNationHouse.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreDailies } from "../../core/CoreDailies";
import { CoreBLOD } from "../../good/blod/CoreBLOD";
import { CoreNation } from "../CoreNation";

const Daily = new CoreDailies();
const Nation = new CoreNation();
const BLOD = new CoreBLOD();
const Adv = new CoreAdvanced();

export class EnhancedNulgathNationHouse {
    getENNH(): void {
        if (Core.checkInventory("Enchanted Nulgath Nation House")) {
            Core.logger("ENNH Owned");
            return;
        }

        Core.addDrop(
            ...Nation.bagDrops.concat(
                "Cemaros' Amethyst",
                "Aluminum",
                "NUE Necronomicon",
                "Nulgath Nation House",
                "Enchanted Nulgath Nation House",
            ),
        );

        if (!Core.checkInventory("Nulgath Nation House")) {
            Nation.farmUni10(400);
            Nation.farmUni13(1);
            Nation.farmVoucher({ member: false, keepVoucher: true });
            Nation.farmDiamondofNulgath(300);
            Nation.farmDarkCrystalShard(250);
            Nation.farmTotemofNulgath(30);
            Nation.farmGemofNulgath(150);
            Nation.farmTaintedGem(200);
            Nation.farmBloodGem(100);
            Nation.approvalAndFavor(1000, 0);

            Adv.buyItem("mountdoomskull", 776, "Cemaros' Amethyst");

            BLOD.unlockMineCrafting();
            Daily.mineCrafting(["Aluminum"]);

            Adv.buyItem("lightguard", 277, "NUE Necronomicon");

            // Core.EnsureAccept(4779);
            if (!Core.ensureComplete(4779)) {
                Core.logger("Could not complete the quest, stopping bot", undefined, { messageBox: true });
                return;
            }
            bot.wait.forQuestComplete(4779);
            bot.wait.forPickup("Nulgath Nation House");
        }

        Adv.buyItem("tercessuinotlim", 1951, "Pink Star Diamond of Nulgath");
        Core.huntMonster("timelibrary", "Ancient Chest", "Musgravite of Nulgath", 2, { isTemp: false });
        Adv.buyItem("archportal", 1211, "Enchanted Nulgath Nation House");
    }
}

export default function main(): void {
    const script = new EnhancedNulgathNationHouse();
    Core.bankingBlackList.push(...Nation.bagDrops);
    Core.setOptions();

    script.getENNH();

    Core.setOptions(false);
}

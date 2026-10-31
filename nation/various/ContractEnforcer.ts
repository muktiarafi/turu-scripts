/*
name: Contract Enforcer of Nulgath
description: This script will farm the "Contract Enforcer of Nulgath" armor.
tags: malakai,pearl of nulgath,contract enforcer,katana,renunciation,the contract enforcer,armor
*/
// Port of Scripts/Nation/Various/ContractEnforcer.cs.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreDailies } from "../../core/CoreDailies";
import { CoreNation } from "../CoreNation";
import { DirtlickersMerge } from "../mergeshops/DirtlickersMerge";
import { NulgathDiamondMerge } from "../mergeshops/NulgathDiamondMerge";

const Nation = new CoreNation();
const NDM = new NulgathDiamondMerge();
const Daily = new CoreDailies();
const DLM = new DirtlickersMerge();
const Adv = new CoreAdvanced();

export class ContractEnforcer {
    getArmor(): void {
        if (Core.checkInventory("Contract Enforcer of Nulgath")) {
            return;
        }

        if (!Core.checkInventory("Malakai's Katana Pet")) {
            Core.logger("Malakai's Katana Pet required for this armor, getting it now.");
            NDM.buyAllMerge("Malakai's Katana Pet");
        }
        Core.addDrop("Contract Enforcer of Nulgath");
        this.adornments();
        this.armaments();

        Nation.farmUni13(3);
        Nation.farmDarkCrystalShard(100);
        Nation.farmTotemofNulgath(5);
        Nation.farmBloodGem(25);
        DLM.buyAllMerge("Shadow Legacy of Nulgath");
        Adv.buyItem("tercessuinotlim", 1951, "Unmoulded Fiend Essence");

        // Quest must be acepted for contract to drop, droprate is not 100%.
        Core.ensureAccept(10050);
        Core.huntMonster("ebilcorphq", "Dage the Evil", "Dage's Contract", undefined, { isTemp: false });

        if (!Core.checkInventory("Pearl of Nulgath", 4)) {
            Daily.pearlOfNulgath();
            if (!Core.checkInventory("Pearl of Nulgath", 4)) {
                Core.logger(
                    `You need 4 Pearls of Nulgath to complete the quest, you have ${bot.inventory.getQuantity("Pearl of Nulgath")}/4`,
                );
                return;
            }
        }

        if (!Core.checkInventory(Core.questRequirementIds(10050))) {
            if (!Core.checkInventory(Core.questRequirements(10050))) {
                Core.logger(
                    "You need to have both rewards from both quests in order to complete the quest. Run the script again tomorrow.",
                );
                return;
            }
        }

        Core.ensureComplete(10050);
        Core.toBank(...Core.questRewards(10048, 10049));
    }

    adornments(): void {
        if (Core.checkInventory(Core.questRewards(10048))) {
            return;
        }

        Core.addDrop(...Core.questRewards(10048));

        Nation.farmUni13(1);
        Nation.farmDiamondofNulgath(250);
        Nation.farmVoucher({ member: true, keepVoucher: true });
        Core.huntMonster("evilwarnul", "Undead Legend", "Wings of Revontheus", undefined, { isTemp: false });
        Nation.approvalAndFavor(1000, 1000);
        if (!Core.checkInventory("Pearl of Nulgath", 2)) {
            Daily.pearlOfNulgath();
            if (!Core.checkInventory("Pearl of Nulgath", 2)) {
                Core.logger(
                    `You need 2 Pearls of Nulgath to complete the quest, you have ${Math.trunc(bot.inventory.getQuantity("Pearl of Nulgath") / 2)}`,
                );
                return;
            }
        }
        Core.ensureAccept(10048);
        Core.ensureCompleteChoose(10048);
    }

    armaments(): void {
        if (Core.checkInventory(Core.questRewards(10049))) {
            return;
        }

        Core.addDrop(...Core.questRewards(10049));

        Nation.farmUni13(1);
        Nation.farmTaintedGem(150);
        Nation.supplies("Random Weapon of Nulgath");
        Nation.farmGemofNulgath(35);
        bot.quests.updateQuest(9531);
        Core.huntMonster("voidrefuge", "Carnage", "Bloodletter Katana", undefined, { isTemp: false });
        if (!Core.checkInventory("Pearl of Nulgath", 3)) {
            Daily.pearlOfNulgath();
            if (!Core.checkInventory("Pearl of Nulgath", 3)) {
                Core.logger(
                    `You need 3 Pearls of Nulgath to complete the quest, you have ${Math.trunc(bot.inventory.getQuantity("Pearl of Nulgath") / 3)}`,
                );
                return;
            }
        }
        Core.ensureAccept(10049);
        Core.ensureCompleteChoose(10049);
    }
}

export default function main(): void {
    const script = new ContractEnforcer();
    Core.setOptions();

    script.getArmor();

    Core.setOptions(false);
}

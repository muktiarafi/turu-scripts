/*
name: TheGameofGemstones(Gold[Members])
description: null
tags: null
*/
// Port of Scripts/Nation/Various/TheGameofGemstones(Gold[Members]).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreNation } from "../CoreNation";

const Nation = new CoreNation();
const Farm = new CoreFarms();

export class TheGameofGemstones {
    gold(quant = 100000000): void {
        if (!Core.isMember) {
            return;
        }

        Nation.farmUni13(1);
        if (!Core.checkInventory("Tendurrr The Assistant")) {
            Core.killMonster("tercessuinotlim", "m2", "Left", "*", "Tendurrr The Assistant", undefined, {
                isTemp: false,
            });
        }

        bot.quests.updateQuest(597);
        Core.registerQuests(5815);
        while (!bot.shouldExit && bot.player.gold < quant) {
            Nation.approvalAndFavor(1, 0);
            Core.huntMonster("Lavarun", "Mega Tyndarius", "Archfiend's Amber", undefined, { isTemp: false });
            Core.killMonster("Catacombs", "Boss2", "Left", "Dr. De'Sawed", "Phantasmia's Charoite", undefined, {
                isTemp: false,
            });
            Farm.bludrutBrawlBoss("Yoshino's Citrine", 1);
            Core.huntMonster("Wolfwing", "Wolfwing", "Tendou's Moonstone", undefined, { isTemp: false });
            Core.huntMonsterMapID("baconcatyou", 1, "Asuka's Ruby", undefined, { isTemp: false });
        }
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new TheGameofGemstones();
    Core.bankingBlackList.push("Tendurrr The Assistant", "Unidentified 13");
    Core.setOptions();

    script.gold();

    Core.setOptions(false);
}

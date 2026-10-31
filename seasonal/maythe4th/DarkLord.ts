/*
name: (Class) Dark Lord
description: This will merge Cyber Crystals and get the Dark Lord class.
tags: merge, seasonal, may-the-4th, dark, lord, class, dark lord, darklord
*/
// Port of Scripts/Seasonal/MayThe4th/DarkLord.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { MurderMoon } from "./MurderMoonStory";

const Adv = new CoreAdvanced();
const MMS = new MurderMoon();

export class DarkLord {
    getDL(rankUpClass = true): void {
        if (!Core.isSeasonalMapActive("murdermoon")) {
            return;
        }
        if (Core.checkInventory("Dark Lord")) {
            if (rankUpClass) {
                Adv.rankUpClass("Dark Lord");
            }
            return;
        }

        MMS.murderMoonStory(true);

        Core.addDrop(`Cyber Crystal`, "S Ring", "Fifth Lord's Filtrinator", "Dark Helmet", "Dotty");

        //Cyber Crystal x66
        Core.equipClass(ClassType.Farm);
        Core.registerQuests(8065);
        Core.killMonster("murdermoon", "r2", "Left", "*", "Cyber Crystal", 66, { isTemp: false });
        Core.cancelRegisteredQuests();

        //S Ring x15
        Core.equipClass(ClassType.Solo);
        Core.huntMonster("murdermoon", "Fifth Sepulchure", "S Ring", 15, { isTemp: false });

        //Fifth Lord's Filtrinator x15
        Core.huntMonster(`murdermoon`, "Fifth Sepulchure", "Fifth Lord's Filtrinator", 15, { isTemp: false });

        //Dark Helmet x1
        bot.quests.updateQuest(7484);
        Core.huntMonster("zorbaspalace", "Zorba the Bakk", "Dark Helmet", 1, { isTemp: false });

        //Dotty x15
        Core.huntMonster("zorbaspalace", "Zorba the Bakk", "Dotty", 15, { isTemp: false });

        //Gold Voucher 25k x4
        Adv.buyItem("murdermoon", 1998, "Gold Voucher 25k", 4);

        //Buying the Dark Lord
        Core.buyItem("murdermoon", 1998, "Dark Lord");
        bot.wait.forItemBuy();

        if (rankUpClass) {
            Adv.rankUpClass("Dark Lord");
        }
    }
}

export default function main(): void {
    const script = new DarkLord();
    Core.setOptions();

    script.getDL();

    Core.setOptions(false);
}

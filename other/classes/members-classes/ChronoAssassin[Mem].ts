/*
name: ChronoAssassin[Mem]
description: null
tags: null
*/
// Port of Scripts/Other/Classes/Members-CLasses/ChronoAssassin[Mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class ChronoAssassin {
    getChronoAss(rankUpClass = true): void {
        if (Core.checkInventory("Chrono Assassin")) {
            if (rankUpClass) {
                Adv.rankUpClass("Chrono Assassin");
            }
            return;
        }
        if (!Core.isMember) {
            return;
        }

        this.saeculumGem(12);
        Core.buyItem("tachyon", 1251, "Chrono Assassin");

        bot.wait.forPickup("Chrono Assassin");

        if (rankUpClass) {
            Adv.rankUpClass("Chrono Assassin");
        }
    }

    saeculumGem(GemQuant: number): void {
        Core.addDrop("Saeculum Gem");
        Core.logger(`Farming ${GemQuant} Saeculum Gem`);
        let i = 1;

        while (!bot.shouldExit && !Core.checkInventory("Saeculum Gem", GemQuant)) {
            Core.ensureAccept(5085);

            Core.equipClass(ClassType.Solo);
            Core.huntMonster("tachyon", "Svelgr the Devourer", "Svelgr Fang", undefined, { isTemp: false });

            Core.equipClass(ClassType.Farm);
            Core.huntMonster("portalwar", "Chronorysa", "Sands of Time", 6, { isTemp: false });
            Core.huntMonster("portalmaze", "Time Wraith", "Wraith Wisp", 12, { isTemp: false });

            Core.ensureComplete(5085);
            bot.wait.forPickup("Saeculum Gem");
            Core.logger(`Complete Quest ${i++} Time[s]`);
        }
    }
}

export default function main(): void {
    const script = new ChronoAssassin();
    Core.setOptions();

    script.getChronoAss();

    Core.setOptions(false);
}

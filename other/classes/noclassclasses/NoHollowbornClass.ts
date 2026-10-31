/*
name: NoHollowbornClass
description: null
tags: null
*/
// Port of Scripts/Other/Classes/NoClassClasses/NoHollowbornClass.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreHollowbornStory } from "../../../story/hollowborn/CoreHollowbornStory";

const Adv = new CoreAdvanced();
const HB = new CoreHollowbornStory();

export class NoHollowbornClass {
    getNHBC(rankUpClass = true): void {
        if (!Core.isSeasonalMapActive("trygve")) {
            return;
        }

        if (Core.checkInventory("No Hollowborn Class")) {
            if (rankUpClass && Core.checkClassRank({ currentClass: false, className: "No Hollowborn Class" }) < 10) {
                Adv.rankUpClass("No Hollowborn Class");
            }
            return;
        }

        HB.trygve();

        Core.addDrop("No Hollowborn Class");
        bot.quests.updateQuest(8298);
        // "No Hollowborn Class" quest, this is required to get the class ( if you havent done the questline)
        Core.equipClass(ClassType.Solo);
        Core.huntMonster("trygve", "Gramiel", "No Hollowborn Class", undefined, { isTemp: false });
        bot.wait.forPickup("No Hollowborn Class");

        if (rankUpClass) {
            Adv.rankUpClass("No Hollowborn Class");
        }
    }
}

export default function main(): void {
    const script = new NoHollowbornClass();
    Core.setOptions();

    script.getNHBC();

    Core.setOptions(false);
}

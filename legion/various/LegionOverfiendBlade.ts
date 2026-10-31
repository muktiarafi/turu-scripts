/*
name: LegionOverfiendBlade
description: null
tags: null
*/
// Port of Scripts/Legion/Various/LegionOverfiendBlade.cs.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class LegionBlade {
    private pets: string[] = ["Paragon Fiend Quest Pet", "Shogun Dage Pet", "Shogun Paragon Pet", "Paragon Ringbearer"];

    blade(): void {
        const Petcheck = (): void => {
            for (const Pet of this.pets) {
                switch (Pet) {
                    case "Paragon Fiend Quest Pet":
                        if (!Core.checkInventory(Pet)) {
                            break;
                        }
                        questID = 6748;
                        quant1 = 1;
                        quant2 = 1;
                        Core.logger(`Using ${Pet} For the Quest.`);
                        return;
                    case "Shogun Dage Pet":
                        if (!Core.checkInventory(Pet)) {
                            break;
                        }
                        questID = 5752;
                        quant1 = 1;
                        quant2 = 1;
                        Core.logger(`Using ${Pet} For the Quest.`);
                        return;
                    case "Paragon Ringbearer":
                        if (!Core.checkInventory(Pet)) {
                            break;
                        }
                        questID = 7071;
                        quant1 = 1;
                        quant2 = 1;
                        Core.logger(`Using ${Pet} For the Quest.`);
                        return;
                    case "Shogun Paragon Pet":
                        if (!Core.checkInventory(Pet)) {
                            break;
                        }
                        questID = 5751;
                        quant1 = 8;
                        quant2 = 10;
                        Core.logger(`Using ${Pet} For the Quest.`);
                        return;
                }
            }
        };
        // C# also sets an `item` (the pet) it never reads.
        let questID = 0;
        let quant1 = 1;
        let quant2 = 1;

        Petcheck();

        const RewardOptions = Core.ensureLoad(questID).rewards;

        Core.addDrop(...RewardOptions.map((x) => x.name));
        Core.equipClass(ClassType.Farm);
        for (const RewardOption of RewardOptions) {
            while (!bot.shouldExit && !Core.checkInventory(RewardOption.name)) {
                Core.ensureAccept(questID);
                Core.huntMonster("styx", "Sullen Soul", "Sullen Soul Received", quant1, { log: false });
                Core.huntMonster("styx", "Wrathful Soul", "Wrathful Soul Taken", quant2, { log: false });
                Core.ensureComplete(questID);
            }
            Core.logger(`${RewardOption.name} Obtainted.`);
        }
    }
}

export default function main(): void {
    const script = new LegionBlade();
    Core.setOptions();

    script.blade();

    Core.setOptions(false);
}

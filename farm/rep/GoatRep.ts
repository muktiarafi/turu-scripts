/*
name: Goat REP
description: This script will farm Goat reputation to rank 10.
tags: Goat, rank, rep, reputation
*/
// Port of Scripts/Farm/REP/GoatRep.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreStory } from "../../core/CoreStory";
import { DragonOfTime } from "../../other/classes/DragonOfTime";

const Farm = new CoreFarms();
const Story = new CoreStory();
const DoT = new DragonOfTime();

export class GoatREP {
    goatRep(): void {
        if (Farm.factionRank("Goat") >= 10) {
            Core.logger("You already have rank 10 Goat reputation.");
            return;
        }
        const drops = Core.questRewards(10143).concat(...Core.questRewards(10139));
        Core.addDrop(...drops);

        Farm.experience(50);
        if (!Story.questProgression(10139)) {
            Core.addDrop(92935);
            Core.ensureAccept(10139);

            if (!bot.house.items.concat(...bot.bank.items).some((i) => i.id === 1286)) {
                Core.buyItem("buyhouse", 71, 1286, 1, 1401);
            }

            if (!Core.checkInventory(17585)) {
                Farm.bladeofAweREP(1, true);
            }

            if (!Core.checkInventory(56723)) {
                Core.farmingLogger("Dragon of Time Armor");
                DoT.dotArmor();
            }

            if (!Core.checkInventory("Gold Voucher 500k", 2)) {
                Farm.voucher("Gold Voucher 500k", 2);
            }

            Core.equipClass(ClassType.Farm);
            Core.killMonster("j6cruise", "Frame1", "Left", "Chaos Goat", "Goat Bone", 189, { isTemp: false });
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("warundead", "Lich King", "Necronomnomicon", undefined, { isTemp: false });

            Core.ensureComplete(10139);
            bot.wait.forPickup(92935);
        }

        // Eat Grass | 10143
        Story.mapItemQuest(10143, "goatfield", 14325);

        // Run Around | 10144
        Story.mapItemQuest(10144, "goatfield", 14326);
        Core.toBank(...drops);
    }
}

export default function main(): void {
    const script = new GoatREP();
    Core.setOptions();

    script.goatRep();

    Core.setOptions(false);
}

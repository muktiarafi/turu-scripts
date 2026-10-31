/*
name: Mawa's Quests Rewards
description: This will farm the rewards from Mawa's Quests in /eventhub.
tags: mawa, seasonal, may the 4th,quest reward,its a trap,droid for sale,get me parts, trobba fett house guard
*/
// Port of Scripts/Seasonal/MayThe4th/MawaQuestRewards.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.
// //cs_include Scripts/CoreFarms.cs

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class MawaQuestRewards {
    getRewards(): void {
        this.droidForSale();
        this.getMeParts();
    }

    droidForSale(): void {
        if (Core.checkInventory(Core.questRewards(9745)) || !Core.isSeasonalMapActive("murdermoon")) {
            return;
        }

        Core.addDrop(...Core.questRewards(9745));

        //Droid For Sale (9745)
        const reqs = Core.questRequirements(9745);
        Farm.voucher("Gold Voucher 25k", 1);
        Core.huntMonster("murdermoon", "Tempest Soldier", reqs[1], undefined, { isTemp: false });
        Core.huntMonster("twigguhunt", "Infantry Droid", reqs[2], undefined, { isTemp: false });
        Core.chainComplete(9745);
        bot.wait.forDrop(Core.questRewards(9745)[0]);
    }

    getMeParts(): void {
        if (Core.checkInventory(Core.questRewards(10241)) || !Core.isSeasonalMapActive("murdermoon")) {
            return;
        }

        Core.addDrop(...Core.questRewards(10241));

        //Get Me Parts (10241)
        Core.huntMonsterQuest(
            10241,
            ["twigguhunt", "Infantry Droid", ClassType.Farm],
            ["murdermoon", "Tempest Soldier", ClassType.Farm],
            ["murdermoon", "Fifth Sepulchure", ClassType.Solo],
            ["eventhub", "Moon Guard", ClassType.Solo],
        );
        bot.wait.forDrop(Core.questRewards(10241)[0]);
    }
}

export default function main(): void {
    const script = new MawaQuestRewards();
    Core.setOptions();

    script.getRewards();

    Core.setOptions(false);
}

/*
name: Dark Ranger Armor
description: farms the "Dark Ranger" set from Quest: "Dark Ranger Corps".
tags: dark ranger, armor, set
*/
// Port of Scripts/Other/DarkRangerArmor.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../core/CoreAdvanced";
import { Core } from "../core/CoreBots";
import { CoreFarms } from "../core/CoreFarms";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();

export class DarkRanger {
    getArmor(): void {
        if (Core.checkInventory("Dark Ranger")) {
            return;
        }

        if (!Core.hasAchievement(24, "ip9")) {
            Core.logger('You need to have "8 years played" badge in order to use this bot.');
            return;
        }

        Adv.buyItem("whitemap", 1317, "Golden 8th Birthday Candle");
        Farm.sandseaREP();
        Core.addDrop("Dark Ranger");

        Core.registerQuests(5517);
        while (!bot.shouldExit && !Core.checkInventory("Dark Ranger")) {
            Core.huntMonster("nostalgiaquest", "Zardman Grunt", "Grunt Leather", 6);
            Core.huntMonster("nostalgiaquest", "Big Jack Sprat", "Black Dye", 2);
            bot.wait.forPickup("Dark Ranger");
        }
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new DarkRanger();
    Core.setOptions();

    script.getArmor();

    Core.setOptions(false);
}

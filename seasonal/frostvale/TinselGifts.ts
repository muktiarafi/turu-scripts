/*
name: Tinsel's Gifts
description: This will finish all of Tinsel's quest and obtain all of the quest rewards.
tags: tinsels-gifts, seasonal, frostvale
*/
// Port of Scripts/Seasonal/Frostvale/TinselGifts.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";

export class TinselGifts {
    getAll(): void {
        this.tinselWeapon();
        this.tinselHelm();
        this.tinselArmor();
        this.tinselCape();
    }

    tinselWeapon(): void {
        this.processSeasonalMap("frostdeep", 914, "Ancient Maggot", "Tinsel's Sword Bow");
    }

    tinselHelm(): void {
        this.processSeasonalMap("icevolcano", 915, "Ice Symbiote", "Tinsel's Helm Bow");
    }

    tinselArmor(): void {
        this.processSeasonalMap("goldenruins", 1517, "Golden Warrior", "Tinsel's Armor Bow");
    }

    tinselCape(): void {
        this.processSeasonalMap("icerise", 2554, "Arctic Direwolf", "Tinsel's Cape Bow");
    }

    private processSeasonalMap(mapName: string, questId: number, monsterName: string, itemBow: string): void {
        if (!Core.isSeasonalMapActive(mapName)) {
            return;
        }

        const rewards = Core.questRewards(questId);

        if (Core.checkInventory(rewards)) {
            return;
        }

        Core.addDrop(...rewards);

        while (!bot.shouldExit && !Core.checkInventory(rewards)) {
            Core.ensureAccept(questId);
            Core.huntMonster(mapName, monsterName, itemBow, undefined, { log: false });
            Core.ensureCompleteChoose(questId, rewards);
        }
        Core.toBank(...rewards);
    }
}

export default function main(): void {
    const script = new TinselGifts();
    Core.setOptions();

    script.getAll();

    Core.setOptions(false);
}

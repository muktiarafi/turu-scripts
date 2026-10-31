/*
name: Beach Party Token Items
description: This will farm Tiki Tokens and buy the items from the Beach Party Token Shop.
tags: farm, beach, party, tiki, tokens, items, shop
*/
// Port of Scripts/Seasonal/SummerBreak/BeachPartyTokenItems.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { MemetsRealm } from "../../story/memetsrealm/CoreMemet";

const Memet = new MemetsRealm();

export class BeachPartyTokenItems {
    tokenItems(): void {
        if (!Core.isSeasonalMapActive("beachparty")) {
            return;
        }

        const rewards = Core.ensureLoad(7010)
            .rewards.filter((x) => (Core.isMember ? true : !x.upgrade))
            .map((x) => x.name);
        if (Core.checkInventory(rewards, undefined, { toInv: false })) {
            return;
        }

        Core.addDrop("Tiki Tokens");
        Core.addDrop(...rewards);
        Memet.beachParty();

        Core.registerQuests(7010);
        while (!bot.shouldExit && !Core.checkInventory(rewards, undefined, { toInv: false })) {
            Core.killMonster("beachparty", "r3", "Left", "*", "Tiki Tokens", 5, { isTemp: false });
            Core.sleep();
        }
        Core.cancelRegisteredQuests();
        Core.toBank(...rewards);
    }
}

export default function main(): void {
    const script = new BeachPartyTokenItems();
    Core.setOptions();

    script.tokenItems();

    Core.setOptions(false);
}

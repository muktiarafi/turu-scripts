/*
name: VoidLodestone
description: pre-forgeenhancements if u don't have darkbox and dark key.
tags: void, lode, stone, void lodestone, Acheron
*/
// Port of Scripts/Other/Various/VoidLodeStone.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreDailies } from "../../core/CoreDailies";

const Daily = new CoreDailies();

export class VoidLodestone {
    getVoidLodestone(): void {
        if (Core.checkInventory("Void Lodestone")) {
            return;
        }

        // Arcane Lodestone
        if (!Core.checkInventory("Arcane Lodestone")) {
            //(Reward from the 'Open Ebony Chest' quest
            //Requires: ???(38565) to acess quest
            this.theDarkBox(38565);

            if (Core.checkInventory(38565)) {
                Core.ensureAccept(5723);
                Core.huntMonster("dreadfire", "Stray Mana", "Bronze Key", undefined, { isTemp: false });
                Core.huntMonster("dreadfire", "Living Brimstone", "Silver Key", undefined, { isTemp: false });
                Core.logger("Going to your house to load the shop.\n" + "[there may be a delay]");
                Core.sendPackets(`%xt%zm%house%1%${bot.player.username}%`);
                Core.sleep(5000);
                Core.buyItem(bot.map.name, 336, "Golden Key");
                Core.ensureComplete(5723);
            } else {
                Core.logger('Cannot Accept Quest Without Item "???"');
                return;
            }
        }

        // Mercury Elixir
        if (!Core.checkInventory("Mercury Elixir")) {
            //Reward from the 'Mercury Elixir' quest
            Core.ensureAccept(5757);
            Core.huntMonster("Battleunderb", "The Lost", "Mercury Elixir");
            Core.ensureComplete(5757);
        }

        Core.buyItem("doomwood", 1381, "Void Lodestone");
    }

    theDarkBox(itemID: number, quant = 1): void {
        const Reward = Core.ensureLoad(5710).rewards.find((x) => x.id === itemID);
        if (Reward == null) {
            Core.logger(`ERROR: itemID ${itemID} was not found in quest 5710`);
            return;
        }

        Core.addDrop("Dark Potion", Reward.name);

        Daily.monthlyTreasureChestKeys();
        if (!Core.checkInventory(["Dark Box", "Dark Key"])) {
            Core.logger("Dark Box & Key Not Found, Cannot Continue with Enh");
            return;
        }

        Core.logger("Pray to RNGsus for your item");
        while (!bot.shouldExit && !Core.checkInventory(Reward.id, quant)) {
            Core.ensureAccept(5710);
            if (Core.isMember) {
                Core.huntMonster("ruins", "Dark Elemental", "Dark Gem", undefined, { isTemp: false });
            } else {
                Core.huntMonster("darkfortress", "Dark Elemental", "Dark Gem", undefined, { isTemp: false });
            }
            Core.ensureComplete(5710);
            bot.wait.forPickup(Reward.id);
        }
    }
}

export default function main(): void {
    const script = new VoidLodestone();
    Core.bankingBlackList.push("Void Lodestone", "Arcane Lodestone", "Mercury Elixir", "Dark Potion", "Dark Gem");
    Core.setOptions();

    script.getVoidLodestone();

    Core.setOptions(false);
}

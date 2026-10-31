/*
name: EvolvedBloodOrbItems[Mem]
description: null
tags: null
*/
// Port of Scripts/Nation/EvolvedOrb/EvolvedBloodOrbItems[Mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreNation } from "../CoreNation";
import { EvolvedBloodOrb } from "./EvolvedBloodOrb";
import { JuggernautItemsofNulgath, RewardsSelection } from "../various/JuggernautItems";

const Adv = new CoreAdvanced();
const Nation = new CoreNation();
const EBO = new EvolvedBloodOrb();
const juggernaut = new JuggernautItemsofNulgath();

export class EvolvedBloodOrbItems {
    getItems(): void {
        if (!Core.isMember || Core.checkInventory(this.rewards, undefined, { toInv: false })) {
            return;
        }

        EBO.getEvolvedBloodOrb();

        this.flowLikeBlood();
        this.bloodTears();

        //yet to be added:
        //Flow Like Blood(AC)
        //Flow Like Blood(None-AC)
    }

    flowLikeBlood(): void {
        if (
            !Core.checkInventory("Platinum Coin of Nulgath: 2500") ||
            !Core.checkInventory(33196) ||
            Core.checkInventory("Evolved Blood of Nulgath")
        ) {
            return;
        }

        //#region Required Items
        if (!Core.checkInventory("1v1 PvP Trophy", 10)) {
            Core.logger('You do not own "10x 1v1 PvP Trophies", stopping', undefined, { stopBot: true });
        }

        Core.addDrop("Evolved Blood of Nulgath");

        if (!Core.checkInventory("RustBucket")) {
            Core.getMapItem(12756, 1, "crashsite");
            bot.wait.forPickup("RustBucket");
        }
        Adv.rankUpClass("RustBucket");

        //#endregion
        // Flow Like Blood - 4780
        Core.ensureAccept(4780);

        if (!Core.checkInventory("Crimson Plate of Nulgath")) {
            Core.ensureAccept(765);
            Nation.farmTotemofNulgath(3);
            Core.huntMonster("underworld", "Skull Warrior", "Skull Warrior Rune");
            Core.ensureComplete(765, 4961);
        }

        Nation.farmUni13(3);
        Nation.theAssistant("Unidentified 23");
        juggernaut.juggItems(RewardsSelection.Dimensional_Championof_Nulgath);
        if (Core.isMember) {
            Nation.forgeBloodGems(20);
        } else {
            Nation.farmBloodGem(20);
        }
        Core.ensureComplete(4780);
        bot.wait.forPickup("Evolved Blood of Nulgath");
    }

    bloodTears(): void {
        //Void Emotion 4774
        if (
            !Core.checkInventory("Platinum Coin of Nulgath: 300") ||
            !Core.checkInventory("Evolved Blood Orb") ||
            Core.checkInventory("Evolved Blood Guard")
        ) {
            return;
        }

        // Blood Tears | 4783
        Core.ensureAccept(4783);

        Nation.farmDiamondofNulgath(10);
        Nation.farmVoucher({ member: false });
        Core.huntMonster("orchestra", "Faust", "Faust Face", undefined, { isTemp: false });
        Nation.farmTotemofNulgath(1);
        Nation.farmBloodGem(5);

        Core.ensureComplete(4783);
        bot.wait.forPickup("Evolved Blood Guard");
    }

    private readonly rewards: string[] = ["Evolved Blood of Nulgath", "Evolved Blood Guard"];
}

export default function main(): void {
    const script = new EvolvedBloodOrbItems();
    Core.setOptions();

    script.getItems();

    Core.setOptions(false);
}

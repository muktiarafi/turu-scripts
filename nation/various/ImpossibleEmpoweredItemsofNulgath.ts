/*
name: Impossible Empowered Items of Nulgath
description: does the 'Impossible, Empowered Items of Nulgath' quest for "soulreaper of nulgath"
tags: soulreaper of nulgath, member
*/
// Port of Scripts/Nation/Various/ImpossibleEmpoweredItemsofNulgath.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreNation } from "../CoreNation";
import { RewardsSelection, TheLeeryContract } from "./TheLeeryContract[Member]";

const TLC = new TheLeeryContract();
const Nation = new CoreNation();

export class ImpossibleEmpoweredItemsofNulgath {
    getWep(): void {
        if (Core.checkInventory("SoulReaper of Nulgath") || !Core.isMember) {
            return;
        }

        //Quest Requirments:
        Nation.dragonSlayerReward();

        Core.ensureAccept(571);

        //Material Requirements:
        Nation.farmDiamondofNulgath(10);
        Nation.farmDarkCrystalShard(5);
        if (Core.checkInventory("Gemstone of Nulgath") && Core.isMember) {
            Nation.forgeTaintedGems(5);
        } else {
            Nation.farmTaintedGem(5);
        }
        Nation.farmUni13(1);
        Core.huntMonster("twilight", "Abaddon", "Abaddon's Terror", undefined, { isTemp: false });
        TLC.questItems(RewardsSelection.Godly_Golden_Dragon_Axe);

        Core.ensureComplete(571);
        bot.wait.forDrop("SoulReaper of Nulgath", 20);
        bot.wait.forPickup("SoulReaper of Nulgath", 20);
    }
}

export default function main(): void {
    const script = new ImpossibleEmpoweredItemsofNulgath();
    Core.setOptions();

    script.getWep();

    Core.setOptions(false);
}

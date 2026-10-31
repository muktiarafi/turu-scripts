/*
name: Tug and Pull
description: Completes the 'Tug and Pull' quest [10791] for the selected reward(s), drops Void Soul.
tags: hollowborn, hollowborn nation, Tug and Pull, void soul, hollowborn archfiend
*/
// Port of Scripts/Hollowborn/HollowbornNation/4TugandPull.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreHollowborn } from "../CoreHollowborn";
import { InTheFiendsShadow, Rewards } from "./1InTheFiendsShadow";
import { MuddledPast } from "./3MuddledPast";
import { NulgathDemandsWork } from "../../nation/afdl/NulgathDemandsWork";
import { CoreNation } from "../../nation/CoreNation";
import { EnhancedNulgathNationHouse } from "../../nation/various/EnchantedNulgathNationHouse";
import { JuggernautItemsofNulgath, RewardsSelection } from "../../nation/various/JuggernautItems";
import { CoreVHL } from "../../nation/vhl/CoreVHL";

const Nation = new CoreNation();
const MP = new MuddledPast();
const ITFS = new InTheFiendsShadow();
const NDW = new NulgathDemandsWork();
const CVHL = new CoreVHL();
const Jug = new JuggernautItemsofNulgath();
const ennh = new EnhancedNulgathNationHouse();
const HB = new CoreHollowborn();

export class TugandPull {
    doTugandPull(QuestOnly = false): void {
        if (QuestOnly && Core.isCompletedBefore(10792)) {
            Core.logger('"Tug and Pull" Already complete');
            return;
        }

        if (!Core.isCompletedBefore(10791)) {
            Core.logger("Completing previous quest *once*");
            MP.doMuddledPast(true);
        }

        // Accept requirements
        Jug.juggItems(RewardsSelection.Nulgath_Armor);
        Jug.juggItems(RewardsSelection.Battlefiend_Blade_of_Nulgath);
        this.getNulgathHouseGuest();
        HB.hardcoreContract();

        Core.addDrop(...this.rewards);

        if (QuestOnly) {
            Core.ensureAccept(TugandPull.questID);

            ITFS.fiendsShadow(Rewards.None, false, true, 100);
            NDW.ndwQuest(["Archfiend Essence Fragment"], 4);
            CVHL.vhlChallenge(8, false);
            this.ensureMortalCoil();
            if (Core.checkInventory("The Mortal Coil")) {
                Core.ensureComplete(TugandPull.questID);
            } else {
                Core.logger(
                    'Could not obtain "The Mortal Coil" from Nulgath; stopping before completing Tug and Pull.',
                    undefined,
                    { messageBox: true, stopBot: true },
                );
            }
            return;
        }

        while (
            !bot.shouldExit &&
            !Core.checkInventory(Core.initializeWithRetries(() => Core.questRewards(TugandPull.questID)))
        ) {
            Core.ensureAccept(TugandPull.questID);

            ITFS.fiendsShadow(Rewards.None, false, true, 100);
            NDW.ndwQuest(["Archfiend Essence Fragment"], 4);
            CVHL.vhlChallenge(8, false);
            this.ensureMortalCoil();
            if (Core.checkInventory("The Mortal Coil")) {
                Core.ensureComplete(TugandPull.questID);
            } else {
                Core.logger(
                    'Could not obtain "The Mortal Coil" from Nulgath; stopping before completing Tug and Pull.',
                    undefined,
                    { messageBox: true, stopBot: true },
                );
            }
        }
    }

    private ensureMortalCoil(): void {
        if (Core.checkInventory("The Mortal Coil")) {
            return;
        }

        Core.equipClass(ClassType.Dodge);
        Core.huntMonster("tercessuinotlim", "Nulgath", "The Mortal Coil", undefined, { isTemp: false });
    }

    private static readonly questID = 10792;
    rewards: string[] = [
        "Hollowborn Legacy of Nulgath",
        "Hollowborn Legacy of Nulgath Hood",
        "Hollowborn Cloak of Nulgath",
        "Hollowborn Spear of Nulgath",
        "Hollowborn Fiend Cloak of Nulgath",
        "Hollowborn Oblivion Blade Battle Pet",
    ];

    getNulgathHouseGuest(): void {
        if (Core.checkInventory("Nulgath House Guest")) {
            Core.logger(`All rewards already owned`);
            return;
        }

        // Required to accept
        ennh.getENNH();

        // Track only relevant rewards from quest 5661
        Core.addDrop("Nulgath House Guest");

        // Loop until all desired rewards are in inventory
        while (!bot.shouldExit && !Core.checkInventory("Nulgath House Guest")) {
            Core.ensureAccept(5661);

            Nation.supplies("Unidentified 4");
            Nation.farmTaintedGem(1);
            Nation.farmDarkCrystalShard(1);
            Nation.essenceofNulgath(1);
            Nation.farmGemofNulgath(1);

            Core.ensureComplete(5661);
        }
    }
}

export default function main(): void {
    const script = new TugandPull();
    Core.setOptions();

    script.doTugandPull();

    Core.setOptions(false);
}

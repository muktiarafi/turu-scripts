/*
name: Fiend of Light
description: This script will obtain the items from Fiend of Light set that you choose.
tags: learn, from, the, past, fiend, light
*/
// Port of Scripts/Other/Armor/FiendofLight.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { configEnum, Core } from "../../core/CoreBots";
import { CoreSepulchure } from "../../story/sepulchuresaga/CoreSepulchure";

const CoreSS = new CoreSepulchure();

export enum RewardsSelection {
    All,
    Fiend_of_Light = 44276,
    Fiend_of_Light_Helm = 44278,
    Fiend_of_Light_Hair = 44279,
    Fiend_of_Light_Winged_Hair = 44280,
    Fiend_of_Light_Blinded_Hair = 44281,
    Fiend_of_Light_Locks = 44282,
    Fiend_of_Light_Helm_Locks = 44283,
    Fiend_of_Light_Backblades = 44284,
    Fiend_of_Light_Wings = 44285,
    Fiend_of_Light_Wings_Tail = 44286,
    Fiend_of_Light_Tail = 44287,
    Fiend_of_Light_Blade = 44288,
    Doomed_Fiend_of_Light_Blade = 44289,
    Fiend_of_Light_Blades = 44290,
}

export class FiendofLight {
    fiendOfLight(): void {
        const reward = configEnum("RewardSelect", RewardsSelection, RewardsSelection.All);
        const chosenReward =
            reward === RewardsSelection.All
                ? Core.questRewards(6408)
                : [
                      Core.questRewards(6408).find(
                          (x) => x === RewardsSelection[reward].toLowerCase().replaceAll("_", " "),
                      )!,
                  ];

        if (Core.checkInventory(chosenReward)) {
            return;
        }

        CoreSS.sepulchuresRise();

        while (!bot.shouldExit && !Core.checkInventory(chosenReward)) {
            Core.ensureAccept(6408);
            Core.huntMonster("darkplane", "Light Spirit", "Crystallized Memory", 10);
            Core.ensureCompleteChoose(6408, chosenReward);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "FiendOfLight",
    [
        Core.skipOptions,
        option.choice(
            "selectReward",
            "Choose Your Reward",
            "",
            choices(RewardsSelection),
            RewardsSelection[RewardsSelection.All],
        ),
    ],
    true,
);

export default function main(): void {
    const script = new FiendofLight();
    Core.setOptions();

    script.fiendOfLight();

    Core.setOptions(false);
}

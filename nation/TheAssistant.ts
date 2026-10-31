/*
name: TheAssistant
description: null
tags: null
*/
// Port of Scripts/Nation/TheAssistant.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { configEnum, Core } from "../core/CoreBots";
import { CoreNation, SwindlesReturnReward } from "./CoreNation";

const Nation = new CoreNation();

export class TheAssistant {
    dothing(): void {
        if (bot.config == null) {
            Core.logger("Config is null.");
            return;
        }

        if (
            configEnum("ChooseReward", SwindlesReturnReward, SwindlesReturnReward.Tainted_Gem) ===
            SwindlesReturnReward.None
        ) {
            return;
        }

        const Reward = configEnum("ChooseReward", SwindlesReturnReward, SwindlesReturnReward.Tainted_Gem);

        Nation.theAssistant(null, 1000, true, Reward);
    }
}

export const scriptOptions = defineScriptOptions(
    "TheAssistant",
    [
        option.choice(
            "ChooseReward",
            "Choose Your Quest Reward",
            "if `returnPolicyDuringSupplies` is enabled in CoreBot Options, Choose the Reward here",
            choices(SwindlesReturnReward),
            SwindlesReturnReward[SwindlesReturnReward.None],
        ),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new TheAssistant();
    Core.setOptions();

    script.dothing();

    Core.setOptions(false);
}

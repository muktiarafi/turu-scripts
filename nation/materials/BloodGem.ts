/*
name: BloodGem
description: null
tags: blood gem, bloodgem, blood, gem, nation, materials, nation materials
*/
// Port of Scripts/Nation/Materials/BloodGem.cs.

import { bot, choices, defineScriptOptions, option } from "turu";
import { configEnum, Core } from "../../core/CoreBots";
import { CoreNation } from "../CoreNation";

const Nation = new CoreNation();

export enum HydraLevel {
    Head_85 = 85,
    Head_90 = 90,
}

export class BloodGem {
    setupHydras(): void {
        const Endless = bot.config!.get<boolean>("Endless");
        const hydraLevel = configEnum("HydraLevel", HydraLevel, HydraLevel.Head_85);
        if (bot.config!.get<boolean>("BloodyChaos")) {
            Nation.bloodyChaos(100, false, hydraLevel, Endless);
        } else {
            Nation.farmBloodGem(100, hydraLevel);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "BloodGems",
    [
        option.bool(
            "BloodyChaos",
            "Do Bloody Chaos",
            "This will require either an army, or if you're retarded a public group.",
            false,
        ),
        option.choice("HydraLevel", "Hydra Lvl to kill", "", choices(HydraLevel), HydraLevel[HydraLevel.Head_85]),
        option.bool("Endless", "Endless", "The end is never the end is never the end is never the end"),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new BloodGem();
    Core.setOptions();

    script.setupHydras();

    Core.setOptions(false);
}

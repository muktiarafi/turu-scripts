/*
name: LavarockForge
description: This script will farm the pre reqs for the Lavarock Forge Set.
tags: burning sword of doom, blazing light of destiny, blaze of awe, pre reqs, lavarock forge, seasonal
*/
// Port of Scripts/Seasonal/SummerBreak/LavarockForgePreReqs.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { BuyScrolls, Scrolls } from "../../farm/BuyScrolls";

const Scroll = new BuyScrolls();

export class LavarockForge {
    preReqs(FarmAwe = false, FarmBLOD = false, FarmBSOD = false): void {
        if (FarmAwe) {
            Core.logger("Farming Blaze of Awe Pre Reqs.");
            Scroll.buyScroll(Scrolls.ScorchedSteel, 99);
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("shadowstrike", "Sepulchuroth", "Akriloth's Scale", 500, { isTemp: false });
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("battleundere", "Lava Guard", "Molten Core", 50, { isTemp: false });
        }

        if (FarmBLOD) {
            Core.logger("Farming Blazing Light of Destiny Pre Reqs.");
            Scroll.buyScroll(Scrolls.ScorchedSteel, 99);
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("shadowstrike", "Sepulchuroth", "Akriloth's Scale", 1000, { isTemp: false });
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("battleundere", "Lava Guard", "Molten Core", 100, { isTemp: false });
        }

        if (FarmBSOD) {
            Core.logger("Farming Burning Sword of Doom Pre Reqs.");
            Scroll.buyScroll(Scrolls.ScorchedSteel, 99);
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("shadowstrike", "Sepulchuroth", "Akriloth's Scale", 1500, { isTemp: false });
            Core.huntMonster("ashfallcamp", "Smoldur", "Flame Heart", undefined, { isTemp: false });
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("battleundere", "Lava Guard", "Molten Core", 150, { isTemp: false });
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "LavarockForge",
    [
        Core.skipOptions,
        option.bool("FarmAwe", "Farm Blaze of Awe Pre Reqs?", "true/false", false),
        option.bool("FarmBLOD", "Farm Blazing Light of Destiny Pre Reqs?", "true/false", false),
        option.bool("FarmBSOD", "Farm Burning Sword of Doom Pre Reqs?", "true/false", false),
    ],
    true,
);

export default function main(): void {
    const script = new LavarockForge();
    Core.setOptions();

    script.preReqs(
        bot.config!.get<boolean>("FarmAwe"),
        bot.config!.get<boolean>("FarmBLOD"),
        bot.config!.get<boolean>("FarmBSOD"),
    );
    Core.setOptions(false);
}

/*
name: SinoftheAbyssMatsPreFarm[NoInsignia]
description: null
tags: null
*/
// Port of Scripts/Nation/Various/SinoftheAbyssMatsPreFarm[NoInsignia].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreNation } from "../CoreNation";

const Nation = new CoreNation();
const Adv = new CoreAdvanced();

export class SofAPreFarm {
    sofAMats(): void {
        if (Core.checkInventory("Sin of the Abyss")) {
            return;
        }

        // Log the MergeSword config value
        Core.logger(`MergeSword config: ${bot.config!.get<boolean>("MergeSword")}`);

        // Perform material farming
        Nation.farmTaintedGem(300);
        Nation.farmDarkCrystalShard(200);
        Nation.farmDiamondofNulgath(500);
        Nation.farmTotemofNulgath(50);
        Nation.farmGemofNulgath(150);
        Nation.farmBloodGem(50);

        // Notify user about materials
        Core.logger(
            "Materials Farm finished. Get the Insignias yourself if you own them, and if the option is enabled it'll buy them.",
        );

        const mergeSwordEnabled = bot.config.get<boolean>("MergeSword");

        if (mergeSwordEnabled) {
            const insigniasRequired = 25;
            const insigniasOwned = bot.inventory.getQuantity("Nulgath Insignia");
            if (Core.checkInventory("Nulgath Insignia", insigniasRequired)) {
                Adv.buyItem("ultranulgath", 2137, "Sin of the Abyss");
                Core.logger("Merging Sin of the Abyss...");
            } else {
                const missingInsignias = insigniasRequired - insigniasOwned;
                Core.logger(`Missing ${missingInsignias}/25 Nulgath Insignias. Get off your lazy ass and farm more!`);
            }
        } else {
            Core.logger("MergeSword option is disabled. Fucking farm those Insignias yourself!");
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "SinoftheAbyss",
    [
        option.bool(
            "MergeSword",
            'Merge "Sin of the Abyss"?',
            "if you have all the Requirements, should the bot buy the sword?",
            false,
        ),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new SofAPreFarm();
    Core.bankingBlackList.push(...Nation.bagDrops);
    Core.setOptions();

    script.sofAMats();

    Core.setOptions(false);
}

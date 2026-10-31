/*
name: Blacksmithing REP
description: This script will farm Blacksmithing reputation to rank 10.
tags: blacksmith, rep, reputation, rank, farm
*/
// Port of Scripts/Farm/REP/BlacksmithingREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export enum HydraLevels {
    Level_25 = "Level_25",
    Level_35 = "Level_35",
    Level_45 = "Level_45",
    Level_55 = "Level_55",
    Level_65 = "Level_65",
    Level_75 = "Level_75",
    Level_85 = "Level_85",
    Level_90 = "Level_90",
}

export class BlacksmithingREP {
    customBlacksmithingREP(hydraLevelSelection: HydraLevels): void {
        if (Farm.factionRank("Blacksmithing") >= 10) {
            Core.logger("Blacksmithing is already Rank 10.");
            return;
        }

        Core.logger(`Farming Blacksmithing REP using ${String(hydraLevelSelection).replaceAll("_", " ")} Hydras.`);

        Core.addDrop("Creature Shard", "Monster Trophy", "Hydra Scale Piece");

        // Simplified: enum name (e.g. "Level_25") already contains the level number,
        // so build the monster name directly instead of a switch or dictionary lookup.
        const hydraMonster = `Hydra Head ${String(hydraLevelSelection).split("_")[1]}`;

        while (!bot.shouldExit && Farm.factionRank("Blacksmithing") < 10) {
            Core.ensureAccept(8736);

            Core.equipClass(ClassType.Farm);
            Core.huntMonster("maul", "Creature Creation", "Creature Shard", 1, { isTemp: false });

            Core.huntMonster("towerofdoom", "Dread Klunk", "Monster Trophy", 15, { isTemp: false });

            if (hydraLevelSelection === HydraLevels.Level_85 || hydraLevelSelection === HydraLevels.Level_90) {
                Core.equipClass(ClassType.Solo);
            } else {
                Core.equipClass(ClassType.Farm);
            }

            // CHANGED: Using HuntMonster so Skua automatically detects the correct cell and pad
            Core.huntMonster("hydrachallenge", hydraMonster, "Hydra Scale Piece", 75, { isTemp: false });

            Core.ensureComplete(8736);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "BlackSmithRepGold",
    [
        option.bool(
            "UseGold",
            "Use Gold To Get Rep?",
            'Will Farm the Quest "Intrepid Investing" which costs 500k/ turnin. If you don\'t have the gold the bot will farm it.',
            false,
        ),
        option.bool("BulkFarmGold", "Pre-Farm Gold(100m)", "Bulk Turnin after farming 100m Gold.", false),
        option.choice(
            "HydraLevel",
            "Hydra Level",
            "Select the level of Hydra to fight (Only applies if NOT using Gold).",
            choices(HydraLevels),
            HydraLevels.Level_25,
        ),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new BlacksmithingREP();
    Core.setOptions();

    const useGold = bot.config!.get<boolean>("UseGold");

    if (useGold) {
        Farm.blacksmithingREP(10, bot.config!.get<boolean>("UseGold"), bot.config!.get<boolean>("BulkFarmGold"));
    } else {
        script.customBlacksmithingREP(bot.config!.get<HydraLevels>("HydraLevel"));
    }

    Core.setOptions(false);
}

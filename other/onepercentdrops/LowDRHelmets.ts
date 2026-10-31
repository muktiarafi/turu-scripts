/*
name: LowDRHelmets
description: null
tags: null
*/
// Port of Scripts/Other/OnePercentDrops/LowDRHelmets.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { Core } from "../../core/CoreBots";

export enum Helmets {
    Sekts_Mummys_Hat = "Sekts_Mummys_Hat",
    Dracolich_Destroyer_Mask = "Dracolich_Destroyer_Mask",
    Asherion_Helmet = "Asherion_Helmet",
    Drakath_Mask = "Drakath_Mask",
    Monster_Queens_Locks = "Monster_Queens_Locks",
    Monster_Queens_Malicious_Morph = "Monster_Queens_Malicious_Morph",
    Reapers_Morph = "Reapers_Morph",
    Reapers_Scream = "Reapers_Scream",
    Reapers_Visage = "Reapers_Visage",
    All = "All",
    None = "None",
}

export class LowDRHelmets {
    getItem(): void {
        const helmetConfig = bot.config?.get<Helmets>("Helmets");

        if (helmetConfig == null || helmetConfig === Helmets.None) {
            Core.logger(`"None" Selected, Stopping.`);
            return;
        }

        Core.farmingLogger(`${String(helmetConfig)}`, 1);

        if (
            helmetConfig === Helmets.Sekts_Mummys_Hat ||
            (helmetConfig === Helmets.All && !Core.checkInventory("Sekt's Mummy's Hat"))
        ) {
            Core.huntMonster("fourdpyramid", "Sekt's Mummy", "Sekt's Mummy's Hat", undefined, { isTemp: false });
        }

        if (
            helmetConfig === Helmets.Dracolich_Destroyer_Mask ||
            (helmetConfig === Helmets.All && !Core.checkInventory("Dracolich Destroyer Mask"))
        ) {
            Core.huntMonster("dragonheart", "Avatar of Desolich", "Dracolich Destroyer Mask", undefined, {
                isTemp: false,
            });
        }

        if (
            helmetConfig === Helmets.Asherion_Helmet ||
            (helmetConfig === Helmets.All && !Core.checkInventory("Asherion Helmet"))
        ) {
            Core.huntMonster("stonewooddeep", "Sir Kut", "Asherion Helmet", undefined, { isTemp: false });
        }

        if (
            helmetConfig === Helmets.Drakath_Mask ||
            (helmetConfig === Helmets.All && !Core.checkInventory("Drakath Mask"))
        ) {
            Core.huntMonster("finalbattle", "drakath", "Drakath Mask", undefined, { isTemp: false });
        }

        if (
            helmetConfig === Helmets.Monster_Queens_Locks ||
            (helmetConfig === Helmets.All && !Core.checkInventory("Monster Queen's Locks"))
        ) {
            Core.huntMonster("deadlines", "Eternal Dragon", "Monster Queen's Locks", undefined, { isTemp: false });
        }

        if (
            helmetConfig === Helmets.Monster_Queens_Malicious_Morph ||
            (helmetConfig === Helmets.All && !Core.checkInventory("Monster Queen's Malicious Morph"))
        ) {
            Core.huntMonster("deadlines", "Eternal Dragon", "Monster Queen's Malicious Morph", undefined, {
                isTemp: false,
            });
        }

        if (
            helmetConfig === Helmets.Reapers_Morph ||
            (helmetConfig === Helmets.All && !Core.checkInventory("Reaper's Morph"))
        ) {
            Core.huntMonster("thevoid", "Reaper", "Reaper's Morph", undefined, { isTemp: false });
        }

        if (
            helmetConfig === Helmets.Reapers_Scream ||
            (helmetConfig === Helmets.All && !Core.checkInventory("Reaper's Scream"))
        ) {
            Core.huntMonster("thevoid", "Reaper", "Reaper's Scream", undefined, { isTemp: false });
        }

        if (
            helmetConfig === Helmets.Reapers_Visage ||
            (helmetConfig === Helmets.All && !Core.checkInventory("Reaper's Visage"))
        ) {
            Core.huntMonster("thevoid", "Reaper", "Reaper's Visage", undefined, { isTemp: false });
        }

        // if (Bot.Config.Get<Helmets>("Helmets") == Helmets.Insert || Bot.Config.Get<Helmets>("Helmets") == Helmets.All && !Core.CheckInventory("Insert"))
        // {
        //     Core.HuntMonster("Map", "Mob", "Item", isTemp: false);
        // }
    }
}

export const scriptOptions = defineScriptOptions(
    "1%Helmets",
    [
        Core.skipOptions,
        option.choice(
            "Helmets",
            "Choose Your Helmets",
            "Extra Helmets can be added as long as they are 1% or lower drop chance.",
            choices(Helmets),
            Helmets.None,
        ),
    ],
    true,
);

export default function main(): void {
    const script = new LowDRHelmets();
    Core.setOptions();

    script.getItem();

    Core.setOptions(false);
}

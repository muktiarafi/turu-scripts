/*
name: 1% Drop Rate Capes
description: Farms all 1% drop rate capes.
tags: 1%, cape, drop-rate
*/
// Port of Scripts/Other/OnePercentDrops/LowDRCapes.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { Core } from "../../core/CoreBots";

export enum Capes {
    Infinity_Shield_Cape = "Infinity_Shield_Cape",
    Drakath_Wings = "Drakath_Wings",
    Wings_Of_Destruction = "Wings_Of_Destruction",
    Chaotic_Champion_Wings = "Chaotic_Champion_Wings",
    ShadowScythe_Warlocks_Demonic_Flames = "ShadowScythe_Warlocks_Demonic_Flames",
    ShadowScythe_Warlocks_Flames = "ShadowScythe_Warlocks_Flames",
    Skull_Pauldrons_of_Vordred = "Skull_Pauldrons_of_Vordred",
    All = "All",
    None = "None",
}

export class LowDRCapes {
    getItem(): void {
        const capeConfig = bot.config?.get<Capes>("Capes");

        if (capeConfig == null || capeConfig === Capes.None) {
            Core.logger(`"None" Selected, Stopping.`);
            return;
        }

        Core.farmingLogger(`${String(capeConfig)}`, 1);

        if (
            capeConfig === Capes.Infinity_Shield_Cape ||
            (capeConfig === Capes.All && !Core.checkInventory("Infinity Shield Cape"))
        ) {
            Core.huntMonster("whitehole", "Mehensi Serpent", "Infinity Shield Cape", undefined, { isTemp: false });
        }

        if (capeConfig === Capes.Drakath_Wings || (capeConfig === Capes.All && !Core.checkInventory("Drakath Wings"))) {
            Core.huntMonster("finalbattle", "Drakath", "Drakath Wings", undefined, { isTemp: false });
        }

        if (
            capeConfig === Capes.Chaotic_Champion_Wings ||
            (capeConfig === Capes.All && !Core.checkInventory("Chaotic Champion Wings"))
        ) {
            Core.huntMonster("finalbattle", "Drakath", "Chaotic Champion Wings", undefined, { isTemp: false });
        }

        if (
            capeConfig === Capes.Wings_Of_Destruction ||
            (capeConfig === Capes.All && !Core.checkInventory("Wings Of Destruction"))
        ) {
            Core.huntMonster("infernalspire", "Malxas", "Wings Of Destruction", undefined, { isTemp: false });
        }

        if (
            capeConfig === Capes.ShadowScythe_Warlocks_Demonic_Flames ||
            (capeConfig === Capes.All && !Core.checkInventory("ShadowScythe Warlock's Demonic Flames"))
        ) {
            Core.huntMonster("innershadows", "Krahen", "ShadowScythe Warlock's Demonic Flames", undefined, {
                isTemp: false,
            });
        }

        if (
            capeConfig === Capes.ShadowScythe_Warlocks_Flames ||
            (capeConfig === Capes.All && !Core.checkInventory("ShadowScythe Warlock's Flames"))
        ) {
            Core.huntMonster("innershadows", "Krahen", "ShadowScythe Warlock's Flames", undefined, { isTemp: false });
        }

        if (
            capeConfig === Capes.Skull_Pauldrons_of_Vordred ||
            (capeConfig === Capes.All && !Core.checkInventory("Skull Pauldrons of Vordred"))
        ) {
            Core.huntMonster("vordredboss", "Vordred", "Skull Pauldrons of Vordred", undefined, { isTemp: false });
        }

        // if (Bot.Config.Get<Capes>("Capes") == Capes.Insert || Bot.Config.Get<Capes>("Capes") == Capes.All && !Core.CheckInventory("Insert"))
        // {
        //     Core.HuntMonster("Map", "Mob", "Item", isTemp: false);
        // }
    }
}

export const scriptOptions = defineScriptOptions(
    "1%Capes",
    [
        Core.skipOptions,
        option.choice(
            "Capes",
            "Choose Your Capes",
            "Extra Capes can be added as long as they are 1% or lower drop chance.",
            choices(Capes),
            Capes.None,
        ),
    ],
    true,
);

export default function main(): void {
    const script = new LowDRCapes();
    Core.setOptions();

    script.getItem();

    Core.setOptions(false);
}

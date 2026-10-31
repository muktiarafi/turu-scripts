/*
name: LowDRArmors
description: null
tags: null
*/
// Port of Scripts/Other/OnePercentDrops/LowDRArmors.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { Core } from "../../core/CoreBots";

export enum Armors {
    Dark_FrostSpawn_Mage = "Dark_FrostSpawn_Mage",
    Feral_DoomKnight = "Feral_DoomKnight",
    Alteons_Royal_Armor = "Alteons_Royal_Armor",
    Dracolich_Destroyer = "Dracolich_Destroyer",
    Asherion_Armor = "Asherion_Armor",
    Lore_Golem = "Lore_Golem",
    All = "All",
    None = "None",
}

export class LowDRArmors {
    getItem(): void {
        const armorConfig = bot.config?.get<Armors>("Armors");

        if (armorConfig == null || armorConfig === Armors.None) {
            Core.logger(`"None" Selected, Stopping.`);
            return;
        }

        Core.farmingLogger(`${String(armorConfig)}`, 1);

        if (
            armorConfig === Armors.Dark_FrostSpawn_Mage ||
            (armorConfig === Armors.All && !Core.checkInventory("Dark FrostSpawn Mage"))
        ) {
            Core.huntMonster("northstar", "Karok The Fallen", "Dark FrostSpawn Mage", undefined, { isTemp: false });
        }

        if (
            armorConfig === Armors.Feral_DoomKnight ||
            (armorConfig === Armors.All && !Core.checkInventory("Feral DoomKnight"))
        ) {
            Core.huntMonster("stonewooddeep", "Sir Kut", "Feral DoomKnight", undefined, { isTemp: false });
        }

        if (
            armorConfig === Armors.Alteons_Royal_Armor ||
            (armorConfig === Armors.All && !Core.checkInventory("Alteon's Royal Armor"))
        ) {
            Core.huntMonster("swordhavenfalls", "Chaos Lord Alteon", "Alteon's Royal Armor", undefined, {
                isTemp: false,
            });
        }

        if (
            armorConfig === Armors.Dracolich_Destroyer ||
            (armorConfig === Armors.All && !Core.checkInventory("Dracolich Destroyer"))
        ) {
            Core.huntMonster("dragonheart", "Avatar of Desolich", "Dracolich Destroyer", undefined, { isTemp: false });
        }

        if (
            armorConfig === Armors.Asherion_Armor ||
            (armorConfig === Armors.All && !Core.checkInventory("Asherion Armor"))
        ) {
            Core.huntMonster("stonewooddeep", "Sir Kut", "Asherion Armor", undefined, { isTemp: false });
        }

        if (armorConfig === Armors.Lore_Golem || (armorConfig === Armors.All && !Core.checkInventory("Lore Golem"))) {
            Core.huntMonster("twistedcavern", "Lore Golem", "Lore Golem", undefined, { isTemp: false });
        }

        // if (Bot.Config.Get<Armors>("Armors") == Armors.Insert || Bot.Config.Get<Armors>("Armors") == Armors.All && !Core.CheckInventory("Insert"))
        // {
        //     Core.HuntMonster("Map", "Mob", "Item", isTemp: false);
        // }

        // case "item":
        // Code goes here
        // break;
    }
}

export const scriptOptions = defineScriptOptions(
    "1%Armors",
    [
        Core.skipOptions,
        option.choice(
            "Armors",
            "Choose Your Armors",
            "Extra Armors can be added as long as they are 1% or lower drop chance.",
            choices(Armors),
            Armors.None,
        ),
    ],
    true,
);

export default function main(): void {
    const script = new LowDRArmors();
    Core.setOptions();

    script.getItem();

    Core.setOptions(false);
}

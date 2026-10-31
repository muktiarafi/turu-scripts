/*
name: LowDRPets
description: null
tags: null
*/
// Port of Scripts/Other/OnePercentDrops/LowDRPets.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { Core } from "../../core/CoreBots";

export enum Pets {
    Akriloth_Pet = "Akriloth_Pet",
    All = "All",
    None = "None",
}

export class LowDRPets {
    getItem(): void {
        const petConfig = bot.config?.get<Pets>("Pets");

        if (petConfig == null || petConfig === Pets.None) {
            Core.logger(`"None" Selected, Stopping.`);
            return;
        }

        Core.farmingLogger(`${petConfig}`, 1);

        if ((petConfig === Pets.Akriloth_Pet || petConfig === Pets.All) && !Core.checkInventory("Akriloth Pet")) {
            Core.huntMonster("gravestrike", "Ultra Akriloth", "Akriloth Pet", undefined, { isTemp: false });
        }

        // if (Bot.Config.Get<Pets>("Pets") == Pets.Insert || Bot.Config.Get<Pets>("Pets") == Pets.All && !Core.CheckInventory("Insert"))
        // {
        //     Core.HuntMonster("Map", "Mob", "Item", isTemp: false);
        // }

        // case "item":
        // Code goes here
        // break;
    }
}

export const scriptOptions = defineScriptOptions(
    "1%Pets",
    [
        Core.skipOptions,
        option.choice(
            "Pets",
            "Choose Your Pets",
            "Extra Pets can be added as long as they are 1% or lower drop chance.",
            choices(Pets),
            Pets.None,
        ),
    ],
    true,
);

export default function main(): void {
    const script = new LowDRPets();
    Core.setOptions();

    script.getItem();

    Core.setOptions(false);
}

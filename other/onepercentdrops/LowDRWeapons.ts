/*
name: LowDRWeapons
description: null
tags: null
*/
// Port of Scripts/Other/OnePercentDrops/LowDRWeapons.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { Core } from "../../core/CoreBots";

export enum Weapons {
    Adas_Overcharged_Scythe = "Adas_Overcharged_Scythe",
    Amethyst_Pickaxe = "Amethyst_Pickaxe",
    Ancient_Frying_Pan = "Ancient_Frying_Pan",
    Blood_of_the_Void_Blade = "Blood_of_the_Void_Blade",
    Blood_of_the_Void_Daggers = "Blood_of_the_Void_Daggers",
    Burning_Blade = "Burning_Blade",
    Deaths_Bright_Blade = "Deaths_Bright_Blade",
    Deaths_Scythe = "Deaths_Scythe",
    Diamonds_Of_Time = "Diamonds_Of_Time",
    Bone_Claws_of_Turmoil = "Bone_Claws_of_Turmoil",
    Underworldly_Dark_Wand = "Underworldly_Dark_Wand",
    Legion_Chain_Whip = "Legion_Chain_Whip",
    Blood_Scythe_Of_Destruction = "Blood_Scythe_Of_Destruction",
    Sanctified_Guardian_Blade = "Sanctified_Guardian_Blade",
    Feral_Blade_of_Doom = "Feral_Blade_of_Doom",
    Feral_DoomBlade = "Feral_DoomBlade",
    Ruby_Pickaxe = "Ruby_Pickaxe",
    Duel_Swords_of_Vindication = "Duel_Swords_of_Vindication",
    Apocryphal_Blade_Of_The_Truth = "Apocryphal_Blade_Of_The_Truth",
    Evolved_Agony_Chain = "Evolved_Agony_Chain",
    Purified_Void_Blade = "Purified_Void_Blade",
    Purified_Void_Daggers = "Purified_Void_Daggers",
    TOO_Big_100K = "TOO_Big_100K",
    All = "All",
    None = "None",
}

export class LowDRWeapons {
    getItem(item: string | null = null): void {
        if (bot.config!.get<Weapons>("Weapons") === Weapons.None) {
            Core.logger(`"None" Selected, Stopping.`);
            return;
        }

        if (
            bot.config.get<Weapons>("Weapons") === Weapons.Adas_Overcharged_Scythe ||
            bot.config.get<Weapons>("Weapons") === Weapons.All
        ) {
            Core.killMonster("laken", "r12", "Left", "Ada", "Ada's Overcharged Scythe", undefined, { isTemp: false });
        }

        if (
            bot.config.get<Weapons>("Weapons") === Weapons.Amethyst_Pickaxe ||
            bot.config.get<Weapons>("Weapons") === Weapons.All
        ) {
            Core.huntMonster("djinn", "Tibicenas", "Amethyst Pickaxe", undefined, { isTemp: false });
        }

        if (
            bot.config.get<Weapons>("Weapons") === Weapons.Ancient_Frying_Pan ||
            bot.config.get<Weapons>("Weapons") === Weapons.All
        ) {
            Core.huntMonster("timevoid", "Unending Avatar", "Ancient Frying Pan", undefined, { isTemp: false });
        }

        if (
            bot.config.get<Weapons>("Weapons") === Weapons.Blood_of_the_Void_Daggers ||
            bot.config.get<Weapons>("Weapons") === Weapons.All
        ) {
            Core.huntMonster("voidbattle", "Jir'abin Challenge", "Blood of the Void Daggers", undefined, {
                isTemp: false,
            });
        }

        if (
            bot.config.get<Weapons>("Weapons") === Weapons.Blood_of_the_Void_Blade ||
            bot.config.get<Weapons>("Weapons") === Weapons.All
        ) {
            Core.huntMonster("voidbattle", "Jir'abin Challenge", "Blood of the Void Blade", undefined, {
                isTemp: false,
            });
        }

        if (
            bot.config.get<Weapons>("Weapons") === Weapons.Purified_Void_Blade ||
            bot.config.get<Weapons>("Weapons") === Weapons.All
        ) {
            Core.huntMonster("voidbattle", "Jir'abin Challenge", "Purified Void Blade", undefined, { isTemp: false });
        }

        if (
            bot.config.get<Weapons>("Weapons") === Weapons.Purified_Void_Daggers ||
            bot.config.get<Weapons>("Weapons") === Weapons.All
        ) {
            Core.huntMonster("voidbattle", "Jir'abin Challenge", "Purified Void Daggers", undefined, { isTemp: false });
        }

        if (
            bot.config.get<Weapons>("Weapons") === Weapons.Burning_Blade ||
            (bot.config.get<Weapons>("Weapons") === Weapons.All && !Core.checkInventory(31058))
        ) {
            Core.huntMonster("lostruinswar", "Diabolical Warlord", "Burning Blade");
        }

        if (
            bot.config.get<Weapons>("Weapons") === Weapons.Deaths_Bright_Blade ||
            bot.config.get<Weapons>("Weapons") === Weapons.All
        ) {
            Core.huntMonster("citadel", "Death's Head", "Death's Bright Blade", undefined, { isTemp: false });
        }

        if (
            bot.config.get<Weapons>("Weapons") === Weapons.Deaths_Scythe ||
            (bot.config.get<Weapons>("Weapons") === Weapons.All && !Core.checkInventory(25117))
        ) {
            Core.huntMonster("shadowattack", "Death", "Death's Scythe", undefined, { isTemp: false });
        }

        if (
            bot.config.get<Weapons>("Weapons") === Weapons.Bone_Claws_of_Turmoil ||
            bot.config.get<Weapons>("Weapons") === Weapons.All
        ) {
            Core.huntMonster("cloister", "Acornent", "Bone Claws of Turmoil", undefined, { isTemp: false });
        }

        if (
            bot.config.get<Weapons>("Weapons") === Weapons.Diamonds_Of_Time ||
            bot.config.get<Weapons>("Weapons") === Weapons.All
        ) {
            Core.huntMonster("cloister", "Acornent", "Diamonds Of Time", undefined, { isTemp: false });
        }

        if (
            bot.config.get<Weapons>("Weapons") === Weapons.Underworldly_Dark_Wand ||
            bot.config.get<Weapons>("Weapons") === Weapons.All
        ) {
            Core.huntMonster("legionarena", "Exalted Legion Champion", "Underworldly Dark Wand", undefined, {
                isTemp: false,
            });
        }

        if (
            bot.config.get<Weapons>("Weapons") === Weapons.Legion_Chain_Whip ||
            bot.config.get<Weapons>("Weapons") === Weapons.All
        ) {
            Core.huntMonster("legionarena", "Exalted Legion Champion", "Legion Chain Whip", undefined, {
                isTemp: false,
            });
        }

        if (
            bot.config.get<Weapons>("Weapons") === Weapons.Blood_Scythe_Of_Destruction ||
            bot.config.get<Weapons>("Weapons") === Weapons.All
        ) {
            Core.huntMonster("infernalspire", "Helzekiel", "Blood Scythe Of Destruction", undefined, { isTemp: false });
        }

        if (
            bot.config.get<Weapons>("Weapons") === Weapons.Sanctified_Guardian_Blade ||
            bot.config.get<Weapons>("Weapons") === Weapons.All
        ) {
            Core.huntMonster("aqlesson", "Carnax", "Sanctified Guardian Blade", undefined, { isTemp: false });
        }

        if (
            bot.config.get<Weapons>("Weapons") === Weapons.Feral_Blade_of_Doom ||
            bot.config.get<Weapons>("Weapons") === Weapons.All
        ) {
            Core.huntMonster("stonewooddeep", "Sir Kut", "Feral Blade of Doom", undefined, { isTemp: false });
        }

        if (
            bot.config.get<Weapons>("Weapons") === Weapons.Feral_DoomBlade ||
            bot.config.get<Weapons>("Weapons") === Weapons.All
        ) {
            Core.huntMonster("stonewooddeep", "Sir Kut", "Feral DoomBlade", undefined, { isTemp: false });
        }

        if (
            bot.config.get<Weapons>("Weapons") === Weapons.Ruby_Pickaxe ||
            bot.config.get<Weapons>("Weapons") === Weapons.All
        ) {
            Core.huntMonster("banished", "Desterrat Moya", "Ruby Pickaxe", undefined, { isTemp: false });
        }

        if (
            bot.config.get<Weapons>("Weapons") === Weapons.Duel_Swords_of_Vindication ||
            bot.config.get<Weapons>("Weapons") === Weapons.All
        ) {
            Core.huntMonster("xancave", "Shurpu Ring Guardian", "Duel Swords of Vindication", undefined, {
                isTemp: false,
            });
        }

        if (
            bot.config.get<Weapons>("Weapons") === Weapons.Apocryphal_Blade_Of_The_Truth ||
            bot.config.get<Weapons>("Weapons") === Weapons.All
        ) {
            Core.huntMonster("banished", "Desterrat Moya", "Apocryphal Blade Of The Truth", undefined, {
                isTemp: false,
            });
        }

        if (
            bot.config.get<Weapons>("Weapons") === Weapons.Evolved_Agony_Chain ||
            bot.config.get<Weapons>("Weapons") === Weapons.All
        ) {
            Core.huntMonster("lust", "Lascivia", "Evolved Agony Chain", undefined, { isTemp: false });
        }

        if (
            bot.config.get<Weapons>("Weapons") === Weapons.TOO_Big_100K ||
            bot.config.get<Weapons>("Weapons") === Weapons.All
        ) {
            Core.huntMonster("lair", "Red Dragon", "TOO Big 100K", undefined, { isTemp: false });
        }

        // if (Bot.Config.Get<Weapons>("Weapons") == Weapons.Insert || Bot.Config.Get<Weapons>("Weapons") == Weapons.All && !Core.CheckInventory("Insert"))
        //         //     Core.HuntMonster("Map", "Mob", "Item", isTemp: false);
        //
    }
}

export const scriptOptions = defineScriptOptions(
    "1%Weapons",
    [
        Core.skipOptions,
        option.choice(
            "Weapons",
            "Choose Your Weapons",
            "Extra Weapons can be added as long as they are 1% or lower drop chance.",
            choices(Weapons),
            Weapons.None,
        ),
    ],
    true,
);

export default function main(): void {
    const script = new LowDRWeapons();
    Core.setOptions();

    script.getItem();

    Core.setOptions(false);
}

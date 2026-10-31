/*
name: Дж2सरतϛȠကỊⱣ
description: Not for everyday use
tags: do, not, find, me
*/
// Port of Scripts/Tools/InsertNameHeresUltraPrep.cs.

import { bot, defineScriptOptions, option } from "turu";
import { CapeSpecial, CoreAdvanced, EnhancementType, HelmSpecial, WeaponSpecial } from "../core/CoreAdvanced";
import { Core } from "../core/CoreBots";
import { CoreFarms } from "../core/CoreFarms";
import { UnlockForgeEnhancements } from "../enhancement/UnlockForgeEnhancements";
import { BuyScrolls, Scrolls } from "../farm/BuyScrolls";
import { CoreLegion } from "../legion/CoreLegion";
import { needYourStrongestPotions } from "../other/various/Potions";
import { DageChallengeStory } from "../story/legion/DageChallengeStory";

const Adv = new CoreAdvanced();
const Farm = new CoreFarms();
const Scroll = new BuyScrolls();
const unlockForgeEnhancements = new UnlockForgeEnhancements();
const dageChallengeStory = new DageChallengeStory();
const Legion = new CoreLegion();

export class InsertNameHeresUltraPrep {
    ultraItems: string[] = [
        //Ultra Drops: [we're gonna bank/keep them banked]
        "Ezrajal Insignia",
        "Warden Insignia",
        "Engineer Insignia",
        "Nulgath Insignia",
        "Kala Insignia",
        "Avatar Tyndarius Insignia",
        "Iara Insignia",
        "Champion Drakath Insignia",
        "Malgor Insignia",
        "King Drago Insignia",
        "Avatar Tyndarius Insignia",
        "Malgor Insignia",
        "Volcanic Essence",
        "Darkon Insignia",
        "Dage the Evil Insignia", //Required Items:
        "The First Speaker Silenced",
        "Scroll of Life Steal",
        "Scroll of Enrage",
        "Potent Malevolence Elixir",
    ];

    example(): void {
        //#region  Ignore this
        Core.logger(
            'This script is made to help you prep for InsertNamehere\'s "ULTRAS - INSERTNAMEHERE.gbot" on `Grim Li`. First run and fill this script out, once its finished, you can Access your item (for easy copy paste) in `Documents > Skua > options > UltraPrep`, open that and u can simply copy paste names of items. Set your safe pot to: `Potent Malevolence Elixir` as its what this script grabs.',
        );

        // Stories
        Core.logger("Story prep for the ultras");

        // Ultra Dage
        Legion.joinLegion();
        dageChallengeStory.dageChallengeQuests();

        // Insert more stories when you care todo so.

        //prepare inventory
        Core.logger("Preparing Inventory!! (insignias will be kept in bank, as they will be auto-added by the quest.)");

        //bank insigs upto, but not including the required items.
        Core.toBank(...this.ultraItems.slice(0, 14));

        // Retrieve options excluding those related to players
        scriptOptions.options
            .filter((o) => !o.name.toLowerCase().startsWith("Player".toLowerCase()))
            .map((o) => bot.config.get(o.name));
        //#endregion
        //#region  Unbanking Required items
        // Iterate through options and unbank items for each option except those starting with "player"
        for (const option of scriptOptions.options) {
            if (option.name.toLowerCase().startsWith("player".toLowerCase())) {
                continue;
            }
            // Skip options starting with "player"

            // C# unbanks every value but null; an empty text (unset) or the Skip switch is no item.
            const itemNameNullable = bot.config.get(option.name);
            if (typeof itemNameNullable === "string" && itemNameNullable) {
                Core.unbank(itemNameNullable);
            }
        }

        //#region Player Setup
        // Dictionary with players and their corresponding classes
        const PlayersandItems: Map<string, string[]> = new Map();
        const playerKeyList = ["Player1", "Player2", "Player3", "Player4"];

        for (const playerKey of playerKeyList) {
            const playerName = bot.config!.get<string>(playerKey);
            if (playerName != null) {
                const items = [];
                switch (playerKey) {
                    case "Player1":
                        items.push("Legion Revenant");
                        items.push("ArchPaladin");
                        items.push("StoneCrusher");
                        if (Core.checkInventory("Chaos Avenger")) {
                            items.push("Chaos Avenger");
                        } else if (Core.checkInventory("Classic Legion DoomKnight")) {
                            items.push("Classic Legion DoomKnight");
                        } else {
                            items.push("Legion DoomKnight");
                        }
                        break;
                    case "Player2":
                        items.push("Quantum Chronomancer");
                        items.push("Legion Revenant");
                        if (Core.checkInventory("Chaos Avenger")) {
                            items.push("Chaos Avenger");
                        } else {
                            items.push("Verus DoomKnight");
                        }
                        items.push("StoneCrusher");
                        break;
                    case "Player3":
                        items.push("Lord of Order");
                        items.push("Legion Revenant");
                        break;
                    case "Player4":
                        items.push("ArchPaladin");
                        items.push("LightCaster");
                        items.push("Verus DoomKnight");
                        break;
                }
                PlayersandItems.set(playerName, items);
            }
        }

        // Iterate through the dictionary
        for (const player of PlayersandItems) {
            if (bot.player.username !== player[0]) {
                continue;
            }

            for (const Item of player[1]) {
                if (bot.inventory.contains(Item)) {
                    continue;
                }

                Core.unbank(Item);
            }
        }
        //#endregion  Unbanking Required items
        //#endregion
        //#region Preunlock Enhance
        this.doEnhs();
        //#endregion
        //#region Check & Unlock Forge Enhs + Redo Enhs after Unlocking (if any)
        // Quest IDs and Enhancement Names
        const questIDs = [
            2937, 8738, 8739, 8740, 8741, 8742, 8743, 8744, 8745, 8758, 8821, 8820, 8822, 8823, 8824, 8825, 8828, 8827,
            8826, 9172, 9171, 9560,
        ];

        const enhancementNames = [
            "Health Vamp/AweBlast",
            "ForgeWeapon",
            "Lacerate",
            "Smite",
            "Valiance",
            "ArcanasConcerto",
            "Absolution",
            "Vainglory",
            "Avarice",
            "ForgeCape",
            "Elysium",
            "Acheron[P2W]",
            "Penitence",
            "Lament",
            "Vim",
            "Examen",
            "ForgeHelm",
            "Pneuma",
            "Anima",
            "Dauntless",
            "Praxis",
            "Ravenous",
        ];

        // List to store missing enhancements
        const missingEnhancements: string[] = [];

        // Display quest completion status and track missing enhancements
        // C#'s Zip: pairs up to the shorter list.
        for (const [questID, enhancementName] of questIDs
            .slice(0, enhancementNames.length)
            .map((q, i) => [q, enhancementNames[i]] as const)) {
            const completionStatus = Core.isCompletedBefore(questID) ? "✅" : "❌";
            Core.logger(`${enhancementName} - ${completionStatus}`);

            // Add missing enhancement to the list
            if (!Core.isCompletedBefore(questID)) {
                missingEnhancements.push(enhancementName);
            }
        }

        // Dictionary to map enhancement names to their respective methods
        const enhancementActions = new Map([
            // AweBlast & Health Vamp:
            ["Awe Enhancments", Farm.unlockBoA.bind(Farm)],
            // Forge:
            ["ForgeWeapon", unlockForgeEnhancements.forgeWeaponEnhancement.bind(unlockForgeEnhancements)],
            ["Lacerate", unlockForgeEnhancements.lacerate.bind(unlockForgeEnhancements)],
            ["Smite", unlockForgeEnhancements.smite.bind(unlockForgeEnhancements)],
            ["Valiance", unlockForgeEnhancements.herosValiance.bind(unlockForgeEnhancements)],
            ["ArcanasConcerto", unlockForgeEnhancements.arcanasConcerto.bind(unlockForgeEnhancements)],
            ["Absolution", unlockForgeEnhancements.absolution.bind(unlockForgeEnhancements)],
            ["Vainglory", unlockForgeEnhancements.vainglory.bind(unlockForgeEnhancements)],
            ["Avarice", unlockForgeEnhancements.avarice.bind(unlockForgeEnhancements)],
            ["ForgeCape", unlockForgeEnhancements.forgeCapeEnhancement.bind(unlockForgeEnhancements)],
            ["Elysium", unlockForgeEnhancements.elysium.bind(unlockForgeEnhancements)],
            ["Acheron", unlockForgeEnhancements.acheron.bind(unlockForgeEnhancements)],
            ["Penitence", unlockForgeEnhancements.penitence.bind(unlockForgeEnhancements)],
            ["Lament", unlockForgeEnhancements.lament.bind(unlockForgeEnhancements)],
            ["Vim", unlockForgeEnhancements.vim.bind(unlockForgeEnhancements)],
            ["Examen", unlockForgeEnhancements.examen.bind(unlockForgeEnhancements)],
            ["ForgeHelm", unlockForgeEnhancements.forgeHelmEnhancement.bind(unlockForgeEnhancements)],
            ["Pneuma", unlockForgeEnhancements.pneuma.bind(unlockForgeEnhancements)],
            ["Anima", unlockForgeEnhancements.anima.bind(unlockForgeEnhancements)],
            ["Dauntless", unlockForgeEnhancements.dauntLess.bind(unlockForgeEnhancements)],
            ["Praxis", unlockForgeEnhancements.praxis.bind(unlockForgeEnhancements)],
            ["Ravenous", unlockForgeEnhancements.ravenous.bind(unlockForgeEnhancements)],
        ]);

        // Handle each missing enhancement using the dictionary
        for (const missingEnhancement of missingEnhancements) {
            const action = enhancementActions.get(missingEnhancement);
            if (action !== undefined) {
                action();
            } else {
                Core.logger(`Unhandled enhancement: ${missingEnhancement}`);
            }
        }

        // Use missingEnhancements list later as needed
        // Example usage:
        for (const missingEnhancement of missingEnhancements) {
            Core.logger(`Missing Enhancement: ${missingEnhancement}`);
        }

        // Do Enhs again after unlocking.
        this.doEnhs();

        //#endregion
        //#region  Potions & Scrolls
        // Buy potions and scrolls
        // potions to farm
        // desired quantity
        // whether to buy reagents
        // force farming these even if MaxAll is off
        needYourStrongestPotions({
            potions: ["Potent Malevolence Elixir"],
            quant: 300,
            buyReagents: true,
            separate: true,
        });

        Scroll.buyScroll(Scrolls.Enrage, 1000);
        if (!Core.checkInventory("Scroll of Life Steal", 99)) {
            Adv.buyItem(
                "terminatemple",
                2328,
                "Scroll of Life Steal",
                99 - bot.inventory.getQuantity("Scroll of Life Steal"),
            );
        }
        //#endregion  Potions & Scrolls
    }

    doEnhs(): void {
        // Wspecial x8 (x9 with Hvamp)
        Adv.enhanceItem(bot.config!.get<string>("Dauntless")!, EnhancementType.Lucky, {
            wSpecial: WeaponSpecial.Dauntless,
        });
        Adv.enhanceItem(bot.config!.get<string>("Valiance")!, EnhancementType.Lucky, {
            wSpecial: WeaponSpecial.Valiance,
        });
        Adv.enhanceItem(bot.config!.get<string>("Arcanas_Concerto")!, EnhancementType.Lucky, {
            wSpecial: WeaponSpecial.Arcanas_Concerto,
        });
        Adv.enhanceItem(bot.config!.get<string>("Awe_Blast")!, EnhancementType.Lucky, {
            wSpecial: WeaponSpecial.Awe_Blast,
        });
        Adv.enhanceItem(bot.config!.get<string>("Praxis")!, EnhancementType.Lucky, { wSpecial: WeaponSpecial.Praxis });
        Adv.enhanceItem(bot.config!.get<string>("Ravenous")!, EnhancementType.Lucky, {
            wSpecial: WeaponSpecial.Ravenous,
        });
        Adv.enhanceItem(bot.config!.get<string>("Elysium")!, EnhancementType.Lucky, {
            wSpecial: WeaponSpecial.Elysium,
        });
        Adv.enhanceItem(bot.config!.get<string>("Lacerate")!, EnhancementType.Lucky, {
            wSpecial: WeaponSpecial.Lacerate,
        });
        Adv.enhanceItem(bot.config!.get<string>("HealthVamp")!, EnhancementType.Lucky, {
            wSpecial: WeaponSpecial.Health_Vamp,
        });

        // Hspecial x3
        Adv.enhanceItem(bot.config!.get<string>("Wizard")!, EnhancementType.Wizard, { hSpecial: HelmSpecial.None });
        Adv.enhanceItem(bot.config!.get<string>("Luck")!, EnhancementType.Lucky, { hSpecial: HelmSpecial.None });
        Adv.enhanceItem(bot.config!.get<string>("Forge")!, EnhancementType.Lucky, { hSpecial: HelmSpecial.Forge });
        Adv.enhanceItem(bot.config!.get<string>("Healer")!, EnhancementType.Healer, { hSpecial: HelmSpecial.None });

        // Cspecial x5
        Adv.enhanceItem(bot.config!.get<string>("Absolution")!, EnhancementType.Lucky, {
            cSpecial: CapeSpecial.Absolution,
        });
        Adv.enhanceItem(bot.config!.get<string>("Avarice")!, EnhancementType.Lucky, { cSpecial: CapeSpecial.Avarice });
        Adv.enhanceItem(bot.config!.get<string>("Penitence")!, EnhancementType.Lucky, {
            cSpecial: CapeSpecial.Penitence,
        });
        Adv.enhanceItem(bot.config!.get<string>("Vainglory")!, EnhancementType.Lucky, {
            cSpecial: CapeSpecial.Vainglory,
        });
        Adv.enhanceItem(bot.config!.get<string>("Lament")!, EnhancementType.Lucky, { cSpecial: CapeSpecial.Lament });
    }
}

export const scriptOptions = defineScriptOptions(
    "UltraPrep",
    [
        Core.skipOptions, // Player options
        option.text("Player1", "Player 1 name", "Username of Player 1", "Player1"),
        option.text("Player2", "Player 2 name", "Username of Player 2", "Player2"),
        option.text("Player3", "Player 3 name", "Username of Player 3", "Player3"),
        option.text("Player4", "Player 4 name", "Username of Player 4", "Player4"), // Weapon and enhancement options
        option.text("Dauntless", "Dauntless Weapon", "Weapon for Dauntless", ""),
        option.text("Valiance", "Valiance Weapon", "Weapon for Valiance", ""),
        option.text("Arcanas_Concerto", "Arcanas Concerto Weapon", "Weapon for Arcanas Concerto", ""),
        option.text("Awe_Blast", "Awe Blast Weapon", "Weapon for Awe Blast", ""),
        option.text("Praxis", "Praxis Weapon", "Weapon for Praxis", ""),
        option.text("Ravenous", "Ravenous Weapon", "Weapon for Ravenous", ""),
        option.text("Elysium", "Elysium Weapon", "Weapon for Elysium", ""),
        option.text("Lacerate", "Lacerate Weapon", "Weapon for Lacerate", ""),
        option.text("HealthVamp", "HealthVamp Weapon", "Weapon for HealthVamp", ""), // Helm options
        option.text("Wizard", "Wizard Helm", "Helm for Wizard", ""),
        option.text("Luck", "Luck Helm", "Helm for Luck", ""),
        option.text("Forge", "Forge Helm", "Helm for Forge", ""),
        option.text("Healer", "Healer Helm", "Helm for Healer", ""), // Cape options
        option.text("Absolution", "Absolution Cape", "Cape for Absolution", ""),
        option.text("Avarice", "Avarice Cape", "Cape for Avarice", ""),
        option.text("Penitence", "Penitence Cape", "Cape for Penitence", ""),
        option.text("Vainglory", "Vainglory Cape", "Cape for Vainglory", ""),
        option.text("Lament", "Lament Cape", "Cape for Lament", ""),
    ],
    true,
);

export default function main(): void {
    const script = new InsertNameHeresUltraPrep();
    Core.bankingBlackList.push(...script.ultraItems.slice(-3));
    Core.setOptions();

    script.example();

    Core.setOptions(false);
}

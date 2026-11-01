/*
name: GetScrolls
description: Provides methods for acquiring combat scrolls (Enrage, Decay).
tags: ultra,scrolls,enrage,decay
*/
// Port of Scripts/Ultrasv3/DependenciesUltras/GetScrolls.cs.
//
// Turu: C#'s `Core` (CoreEnginev3) is `Engine` here, as `Core` is CoreBots (C#'s `C`).

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreEnginev3 } from "./CoreEnginev3";

const Engine = CoreEnginev3.instance;

export class GetScrolls {
    /** Farms and equips Scroll of Enrage (up to 200). Requires SpellCrafting rank 5. */
    getScrollOfEnrage(): void {
        const desiredCount = 200;

        if (!Engine.faction("SpellCrafting", 5)) {
            return;
        }

        const parchment = "Mystic Parchment";
        const ink = "Zealous Ink";
        const scroll = "Scroll of Enrage";

        while (!Core.checkInventory(scroll, desiredCount)) {
            // Mats
            Engine.forItem("Undead Infantry", "underworld", parchment, 2);
            Engine.buyItem(ink, 549, "dragonrune", 5, { calculateRemaining: false });

            // Craft
            Engine.join("spellcraft");
            bot.drops.add(scroll);
            bot.send.packet("%xt%zm%crafting%1%spellOnStart%7%1555%Spell%");
            bot.sleep(5000);
            bot.send.packet("%xt%zm%crafting%1%spellComplete%7%2330%Enrage%");

            Engine.waitForDrop(scroll, 10000);
            Engine.pickup(scroll);
            bot.drops.remove(scroll);

            if (bot.shouldExit) {
                break;
            }
        }
    }

    /**
     * Farms Scroll of Decay (up to 50). Requires SpellCrafting rank 5.
     * Does NOT equip — call CoreEngine.EquipConsumable("Scroll of Decay") separately.
     */
    getScrollOfDecay(): void {
        if (!Engine.faction("SpellCrafting", 5)) {
            return;
        }

        const parchment = "Mystic Parchment";
        const ink = "Zealous Ink";
        const scroll = "Scroll of Decay";

        while (!Core.checkInventory(scroll, 50)) {
            Engine.forItem("Undead Infantry", "underworld", parchment, 2);
            Engine.buyItem(ink, 549, "dragonrune", 5, { calculateRemaining: false });

            Engine.join("spellcraft");
            bot.drops.add(scroll);
            bot.send.packet("%xt%zm%crafting%1%spellOnStart%7%1555%Spell%");
            bot.sleep(5000);
            bot.send.packet("%xt%zm%crafting%1%spellComplete%7%2331%Decay%");

            Engine.waitForDrop(scroll, 5000);
            Engine.pickup(scroll);
        }
    }

    /**
     * Ensures you have at least `desiredCount` Vigil in inventory,
     * buying from SeaVoice merge shop if needed.
     */
    buyVigil(desiredCount = 200): void {
        const current = bot.inventory.getQuantity("Vigil");
        if (current >= desiredCount) {
            Core.logger(`Already have ${current}x Vigil (desired: ${desiredCount}), skipping buy.`);
            return;
        }

        Core.logger(`Have ${current}x Vigil, buying up to ${desiredCount}.`);
        Core.buyItem("seavoice", 2320, "Vigil", desiredCount);
    }

    /** Equips Vigil if not already equipped. */
    equipVigil(): void {
        if (!bot.inventory.isEquipped("Vigil")) {
            Core.equip(78994);
            Core.logger(`Vigil equipped? ${bot.inventory?.isEquipped("Vigil")}`);
        } else {
            Core.logger("Vigil already equipped.");
        }
    }
}

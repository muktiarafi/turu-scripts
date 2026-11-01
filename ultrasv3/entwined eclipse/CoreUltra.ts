/*
name: null
description: null
tags: null
*/
// Port of Scripts/Ultrasv3/Entwined Eclipse/CoreUltra.cs, the older copy of
// Ultrasv3/DependenciesUltras/CoreUltrav3.cs that the Entwined Eclipse scripts run on.
//
// Turu: the two files share most of their members, so this extends the CoreUltrav3 port and keeps
// only what differs: its engine is its own Entwined CoreEngine (C#'s `public CoreEngine Core =
// new()`), and the scroll and taunt helpers below. C#'s sync members are the ones in
// army/CoreArmySync.ts, which CoreUltrav3 extends. What this copy doesn't have and CoreUltrav3
// does (JoinHouse, PersistentJoinHouse, preferred users in EquipClassSync, the "Account-N" log
// labels) is there but unused by the Entwined scripts.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreUltrav3, type UltraEngine } from "../dependenciesultras/CoreUltrav3";
import { CoreEngine } from "./CoreEngine";

export class CoreUltra extends CoreUltrav3 {
    /** C#'s `Core`: this CoreUltra's own engine. */
    readonly Core = new CoreEngine();

    protected override get engine(): UltraEngine {
        return this.Core;
    }

    /** Crafts one batch of Scroll of Enrage when you have fewer than 100, then equips it. */
    override getScrollOfEnrage(): void {
        if (!this.Core.faction("SpellCrafting", 5)) {
            return;
        }

        const parchment = "Mystic Parchment";
        const ink = "Zealous Ink";
        const scroll = "Scroll of Enrage";

        if (!Core.checkInventory(scroll, 100)) {
            // Mats
            this.Core.forItem("Undead Infantry", "underworld", parchment, 2);
            this.Core.buyItem(ink, 549, "dragonrune", 5, { calculateRemaining: false });

            // Craft
            this.Core.join("spellcraft");
            bot.drops.add(scroll);
            bot.send.packet("%xt%zm%crafting%1%spellOnStart%7%1555%Spell%");
            bot.sleep(5000);
            bot.send.packet("%xt%zm%crafting%1%spellComplete%7%2330%Enrage%");

            this.Core.waitForDrop(scroll, 10000);
            this.Core.pickup(scroll);
        }

        this.Core.equipEnrage();
    }

    /**
     * C#'s `UseTaunt()` and `UseTaunt(int target)`: pauses the skill task and presses skill 5
     * until the target has Focus.
     */
    override useTaunt(target?: number): void {
        const hasFocus = (): boolean => bot.target.auras.some((a) => a != null && a.name === "Focus");

        if (target === undefined) {
            // Dead → wait for respawn
            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);
            }

            this.Core.disableSkills();

            while (!bot.shouldExit && !hasFocus()) {
                bot.skills.useSkill(5);
                bot.sleep(200);
            }

            this.Core.enableSkills();
            return;
        }

        // Attack the target first
        bot.combat.attack(target);
        bot.sleep(200);

        // Then apply taunt
        this.Core.disableSkills();
        while (!bot.shouldExit && !hasFocus()) {
            if (bot.skills.canUseSkill(5)) {
                bot.skills.useSkill(5);
            }
            bot.sleep(200);
        }
        this.Core.enableSkills();
    }

    override getScrollOfDecay(): void {
        if (!this.Core.faction("SpellCrafting", 5)) {
            return;
        }

        const parchment = "Mystic Parchment";
        const ink = "Zealous Ink";
        const scroll = "Scroll of Decay";

        // C# loops while you *have* 10 (`C.CheckInventory(scroll, 10)`), crafting forever once you
        // have them and never when you don't; fixed on purpose to craft until you have 10.
        while (!bot.shouldExit && !Core.checkInventory(scroll, 10)) {
            this.Core.forItem("Undead Infantry", "underworld", parchment, 2);
            this.Core.buyItem(ink, 549, "dragonrune", 5, { calculateRemaining: false });

            this.Core.join("spellcraft");
            bot.drops.add(scroll);
            bot.send.packet("%xt%zm%crafting%1%spellOnStart%7%1555%Spell%");
            bot.sleep(5000);
            bot.send.packet("%xt%zm%crafting%1%spellComplete%7%2331%Decay%");

            this.Core.waitForDrop(scroll, 5000);
            this.Core.pickup(scroll);
        }

        this.Core.equipConsumable(scroll);
    }
}

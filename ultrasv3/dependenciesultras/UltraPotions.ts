/*
name: UltraPotions
description: Ultra potion helper/presets with BuyReagents enabled
tags: ultra,potions
*/
// Port of Scripts/Ultrasv3/DependenciesUltras/UltraPotions.cs.

import { bot } from "turu";
import { Core, rethrowIfStopped } from "../../core/CoreBots";
import { CoreEnginev3 } from "./CoreEnginev3";
import { CoreUltrav3 } from "./CoreUltrav3";
import { PotionBuyerv2 } from "./GetPotions";

const C = CoreEnginev3.instance;
const Ultra = new CoreUltrav3();
const Pots = new PotionBuyerv2();

export class UltraPotions {
    //#region Class Detection
    normalizeString(s: string | null): string {
        return !s?.trim() ? "" : s.replaceAll(" ", "").toLowerCase();
    }

    hasAssignedClass(assignedClass: string): boolean {
        return this.normalizeString(bot.player.currentClass) === this.normalizeString(assignedClass);
    }

    //#endregion
    //#region Presets
    private getHonorOrMalicePotion(): string {
        if (bot.inventory.getQuantity("Potent Malice Potion") > 30) {
            return "Potent Malice Potion";
        }
        return "Potent Honor Potion";
    }

    getRecommendedPotions(context = ""): string[] {
        if (context.toLowerCase() === "Dage".toLowerCase()) {
            return ["Body Tonic", "Potent Destruction Elixir", this.getHonorOrMalicePotion()];
        }

        if (context.toLowerCase() === "Kolr".toLowerCase()) {
            if (this.hasAssignedClass("Lord of Order")) {
                return ["Fate Tonic", "Unstable Divine Elixir", "Felicitous Philtre"];
            }

            if (this.hasAssignedClass("King's Echo")) {
                return ["Fate Tonic", "Potent Destruction Elixir", "Felicitous Philtre"];
            }

            return ["Fate Tonic", "Potent Destruction Elixir", "Felicitous Philtre"];
        }

        if (context.toLowerCase() === "AstralEmpyrean".toLowerCase()) {
            if (this.hasAssignedClass("ArchPaladin")) {
                return ["Might Tonic", "Unstable Divine Elixir", this.getHonorOrMalicePotion()];
            }

            if (this.hasAssignedClass("StoneCrusher")) {
                return ["Might Tonic", "Unstable Divine Elixir", this.getHonorOrMalicePotion()];
            }

            if (this.hasAssignedClass("Lord of Order")) {
                return ["Might Tonic", "Unstable Divine Elixir", this.getHonorOrMalicePotion()];
            }

            if (this.hasAssignedClass("Verus DoomKnight")) {
                return ["Might Tonic", "Potent Destruction Elixir", this.getHonorOrMalicePotion()];
            }

            if (this.hasAssignedClass("King's Echo")) {
                return ["Fate Tonic", "Potent Destruction Elixir", this.getHonorOrMalicePotion()];
            }

            return [Ultra.getBestTonicPotion(), Ultra.getBestElixirPotion(), this.getHonorOrMalicePotion()];
        }

        if (context.toLowerCase() === "Speaker".toLowerCase()) {
            if (this.hasAssignedClass("ArchPaladin")) {
                return ["Body Tonic", "Potent Destruction Elixir", this.getHonorOrMalicePotion()];
            }

            if (this.hasAssignedClass("StoneCrusher")) {
                return ["Body Tonic", "Unstable Divine Elixir", this.getHonorOrMalicePotion()];
            }

            if (this.hasAssignedClass("Lord of Order")) {
                return ["Body Tonic", "Unstable Divine Elixir", this.getHonorOrMalicePotion()];
            }

            if (this.hasAssignedClass("Verus DoomKnight")) {
                return ["Body Tonic", "Potent Destruction Elixir", this.getHonorOrMalicePotion()];
            }

            if (this.hasAssignedClass("Void Highlord")) {
                return ["Body Tonic", "Potent Destruction Elixir", this.getHonorOrMalicePotion()];
            }

            if (this.hasAssignedClass("King's Echo")) {
                return ["Fate Tonic", "Potent Destruction Elixir", this.getHonorOrMalicePotion()];
            }

            return ["Body Tonic", "Potent Destruction Elixir", this.getHonorOrMalicePotion()];
        }

        if (this.hasAssignedClass("ArchPaladin")) {
            return ["Body Tonic", "Potent Destruction Elixir", this.getHonorOrMalicePotion()];
        }

        if (this.hasAssignedClass("StoneCrusher")) {
            return ["Body Tonic", "Unstable Divine Elixir", this.getHonorOrMalicePotion()];
        }

        if (this.hasAssignedClass("Lord of Order")) {
            return ["Body Tonic", "Unstable Divine Elixir", this.getHonorOrMalicePotion()];
        }

        if (this.hasAssignedClass("King's Echo")) {
            return ["Body Tonic", "Potent Destruction Elixir", this.getHonorOrMalicePotion()];
        }

        if (this.hasAssignedClass("Arcana Invoker")) {
            return ["Fate Tonic", "Potent Destruction Elixir", this.getHonorOrMalicePotion()];
        }

        if (this.hasAssignedClass("Verus DoomKnight")) {
            return ["Body Tonic", "Potent Destruction Elixir", this.getHonorOrMalicePotion()];
        }

        if (this.hasAssignedClass("Shaman")) {
            return ["Body Tonic", "Potent Destruction Elixir", "Felicitous Philtre"];
        }

        if (this.hasAssignedClass("ArchFiend")) {
            return ["Body Tonic", "Potent Revitalize Elixir", "Felicitous Philtre"];
        }

        // Default fallback when the current class does not match any preset
        return [Ultra.getBestTonicPotion(), Ultra.getBestElixirPotion(), this.getHonorOrMalicePotion()];
    }

    //#endregion
    //#region Potion Usage
    activateEquippedPotion(): void {
        // Only activate if a recognized potion is equipped (not a scroll/consumable)
        const hasPotion =
            bot.inventory.isEquipped("Potent Honor Potion") ||
            bot.inventory.isEquipped("Potent Malice Potion") ||
            bot.inventory.isEquipped("Potent Life Potion") ||
            bot.inventory.isEquipped("Felicitous Philtre") ||
            bot.inventory.isEquipped("Endurance Draught");

        if (hasPotion && bot.skills.canUseSkill(5)) {
            C.cast(5);
        }
    }

    private hasSelfAura(auraName: string): boolean {
        if (!auraName?.trim()) {
            return false;
        }

        try {
            return (
                bot?.self?.auras?.some((a) => a?.name != null && auraName.toLowerCase() === a.name.toLowerCase()) ===
                true
            );
        } catch (error) {
            rethrowIfStopped(error);

            return false;
        }
    }

    useRecommendedPotions(desiredQuant = 10, skipThird = false, context = "", ensureStock = false): void {
        let potions = this.getRecommendedPotions(context);

        if (potions.length === 0) {
            return;
        }

        if (skipThird && potions.length >= 3) {
            potions = potions.slice(0, 2);
        }

        if (ensureStock) {
            this.ensurePotions(desiredQuant, skipThird, context);
        }

        for (const potion of potions) {
            Core.logger(`Equipping ${potion}...`);

            for (let attempt = 0; attempt < 2 && !bot.inventory.isEquipped(potion); attempt++) {
                C.equipConsumable(potion);
                bot.sleep(500);
            }

            // Some consumables auto-use when equipped
            if (this.hasSelfAura(potion)) {
                Core.logger(`${potion} successfully applied.`);
                continue;
            }

            // If not equipped somehow, stop here
            if (!bot.inventory.isEquipped(potion)) {
                Core.logger(`Failed to equip ${potion}.`);
                bot.sleep(200);
                continue;
            }

            Core.logger(`Using ${potion}...`);

            Core.usePotion();

            bot.sleep(500);
        }
    }

    //#endregion
    //#region Potion Purchase
    ensurePotions(desiredQuant = 10, skipThird = false, context = ""): void {
        let potions = this.getRecommendedPotions(context);

        if (potions.length === 0) {
            return;
        }

        if (skipThird && potions.length >= 3) {
            potions = potions.slice(0, 2);
        }

        let missing: string[] = [];

        for (const potion of potions) {
            const current = bot.inventory.getQuantity(potion);

            if (current < desiredQuant) {
                const needed = desiredQuant - current;

                Core.logger(`Need ${needed}x more ${potion}.`);

                missing.push(potion);
            }
        }

        if (missing.length === 0) {
            Core.logger("All recommended potions already stocked.");
            return;
        }

        Pots.iNeedYourStrongestPotions([...missing], undefined, desiredQuant, true, true);

        missing = missing.filter((potion) => bot.inventory.getQuantity(potion) < desiredQuant);

        if (missing.length > 0) {
            Core.logger(
                `Potion purchase ended with missing items: ${missing.join(", ")}. ` +
                    "No further purchase retries are performed to avoid infinite loops.",
                undefined,
                { stopBot: false },
            );
            return;
        }

        Core.logger("Potion purchase complete.");
    }

    ensureRecommendedPotions(desiredQuant = 10, skipThird = false, context = ""): void {
        this.ensurePotions(desiredQuant, skipThird, context);
    }

    preparePotions(desiredQuant = 10, skipThird = false, context = ""): void {
        let potions = [
            "Fate Tonic",
            "Body Tonic",
            "Sage Tonic",
            "Might Tonic",
            "Wise Tonic",
            "Potent Destruction Elixir",
            "Divine Elixir",
            "Unstable Divine Elixir",
            "Potent Malevolence Elixir",
            "Potent Battle Elixir",
            "Potent Revitalize Elixir",
            "Potent Honor Potion",
            "Endurance Draught",
        ];

        if (skipThird && potions.length >= 3) {
            potions = potions.slice(0, 2);
        }

        Core.logger(`Preparing potions: ${potions.join(", ")}`);
        Pots.iNeedYourStrongestPotions([...potions], undefined, desiredQuant, true, true);
    }

    //#endregion
}

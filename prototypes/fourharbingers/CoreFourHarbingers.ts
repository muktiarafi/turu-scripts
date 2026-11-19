/*
name: null
description: null
tags: null
*/
// Port of Scripts/Prototypes/FourHarbingers/CoreFourHarbingers.cs.

import { bot } from "turu";
import { Core, configOr, rethrowIfStopped } from "../../core/CoreBots";

export enum FarmMode {
    Once = "Once",
    Until_Stopped = "Until_Stopped",
    Quest_Completions = "Quest_Completions",
    Item_Quantity = "Item_Quantity",
}

export class CoreFourHarbingers {
    static readonly allMergeItems: string[] = [
        "Celestial Dragon of Time",
        "Infernal Dragon of Time",
        "Harbinger of War",
        "Harbinger of Famine",
        "Harbinger of Death",
        "Harbinger of Conquest",
        "Bow of Halosis",
        "Halosis' Divine Wheel",
        "Wings of Mors",
        "Bello's Armaments",
        "Bello's Braziers",
        "Bello's Sanctified Braziers",
        "Hunting Bow of Halosis",
        "Poise of Halosis",
        "Poise of Fames",
        "Poise of Mors",
        "Poise of Bello",
        "Infernal Dragon of Time Hood",
        "Celestial Dragon of Time Hood",
        "Bello's Brazier",
        "Fames' Barren Scale",
        "Bello's Sanctified Brazier",
        "Nightstar Companion",
        "Scythe of Mors",
    ];

    private static readonly goldVoucher100k = "Gold Voucher 100k";
    private static readonly goldVoucher500k = "Gold Voucher 500k";

    private readonly mergeRecipes: Map<string, MergeRecipe> = CoreFourHarbingers.createMergeRecipes();

    usePotionsEnabled(): boolean {
        return configOr("UsePotions", false);
    }

    doEnhancementsEnabled(): boolean {
        return configOr("DoEnhancements", false);
    }

    getFarmMode(doAllMode: boolean, farmModeOverride: FarmMode): FarmMode {
        if (doAllMode) {
            return farmModeOverride;
        }

        if (configOr("FarmQuantity", 0) === 0) {
            return FarmMode.Until_Stopped;
        }

        return FarmMode.Quest_Completions;
    }

    getFarmQuantity(doAllMode: boolean, farmQuantityOverride: number): number {
        if (doAllMode) {
            return farmQuantityOverride;
        }

        return configOr("FarmQuantity", 0);
    }

    getFarmItem(doAllMode: boolean, farmItemOverride: string): string {
        if (doAllMode) {
            return farmItemOverride;
        }

        return "";
    }

    addDrops(...drops: string[]): void {
        bot.drops.add(...drops);
    }

    equipClass(className: string): boolean {
        return this.equipOwnedClass(className);
    }

    private equipOwnedClass(className: string): boolean {
        if (!Core.checkInventory(className, undefined, { toInv: false })) {
            Core.logger(`WARNING: ${className} is required for this setup.`, undefined, { messageBox: true });
            return false;
        }

        if (!bot.inventory.contains(className)) {
            // TEMPORARY Game4000 inventory change. Remove after the client inventory fix.
            if (Core.inventoryBagFreeSlots <= 0) {
                Core.logger(
                    `WARNING: ${className} is in the bank, but no free inventory slot is available.`,
                    undefined,
                    { messageBox: true },
                );
                return false;
            }

            bot.bank.ensureToInventory(className);
            bot.wait.forTrue(() => bot.inventory.contains(className), 20);
            if (!bot.inventory.contains(className)) {
                Core.logger(`WARNING: ${className} could not be moved from the bank.`, undefined, {
                    messageBox: true,
                });
                return false;
            }
        }

        Core.equip(className);
        bot.wait.forItemEquip(className);
        if (!bot.inventory.isEquipped(className)) {
            Core.logger(`WARNING: ${className} could not be equipped.`, undefined, { messageBox: true });
            return false;
        }

        return true;
    }

    /**
     * Equips `className`, or `fallbackClass` when you don't own it and `allowFallback` is on.
     * Returns the class equipped, or null when none could be (C#'s bool with an `out` class).
     */
    equipClassWithFallback(className: string, fallbackClass: string, allowFallback: boolean): string | null {
        let resolvedClass = className;
        if (!Core.checkInventory(className, undefined, { toInv: false })) {
            if (!allowFallback || !Core.checkInventory(fallbackClass, undefined, { toInv: false })) {
                Core.logger(`WARNING: ${className} is required for this setup.`, undefined, { messageBox: true });
                return null;
            }

            Core.logger(
                `WARNING: ${className} was selected, but you do not own it. Falling back to ${fallbackClass}.`,
                undefined,
                { messageBox: true },
            );
            resolvedClass = fallbackClass;
        }

        return this.equipOwnedClass(resolvedClass) ? resolvedClass : null;
    }

    ensureBossRoom(cell: string, pad: string): boolean {
        if ((bot.map.name ?? "").toLowerCase() !== "fourharbingers") {
            Core.join("fourharbingers-100000", cell, pad);
            return false;
        }

        if ((bot.player.cell ?? "").toLowerCase() !== cell.toLowerCase()) {
            Core.jump(cell, pad);
            return false;
        }

        return true;
    }

    returnToSafeRoom(): void {
        if ((bot.map.name ?? "").toLowerCase() !== "fourharbingers") {
            Core.join("fourharbingers-100000", "Enter", "Spawn");
        } else if ((bot.player.cell ?? "").toLowerCase() !== "enter") {
            Core.jump("Enter", "Spawn");
        }

        bot.wait.forCombatExit();
    }

    stopSkills(): void {
        bot.skills.resume();
        bot.skills.stop();
        bot.wait.forTrue(() => !bot.skills.timerRunning, 20);
    }

    runQuests(
        questID: number,
        fightBoss: () => boolean,
        restockPotions: () => void,
        farmMode: FarmMode,
        farmQuantity: number,
        farmItem: string,
    ): boolean {
        if (farmQuantity < 1) {
            farmQuantity = 1;
        }

        if (farmMode === FarmMode.Item_Quantity && !farmItem?.trim()) {
            Core.logger("WARNING: Farm Mode is Item Quantity, but Farm Item is empty.", undefined, {
                messageBox: true,
            });
            return false;
        }

        let completions = 0;
        while (!bot.shouldExit && !this.farmTargetReached(farmMode, farmQuantity, farmItem, completions)) {
            if (!fightBoss()) {
                return false;
            }

            bot.wait.forQuestComplete(questID);
            completions++;

            if (!this.farmTargetReached(farmMode, farmQuantity, farmItem, completions)) {
                restockPotions();
            }
        }

        return this.farmTargetReached(farmMode, farmQuantity, farmItem, completions);
    }

    private farmTargetReached(
        farmMode: FarmMode,
        farmQuantity: number,
        farmItem: string,
        completions: number,
    ): boolean {
        if (farmMode === FarmMode.Once) {
            return completions >= 1;
        }

        if (farmMode === FarmMode.Quest_Completions) {
            return completions >= farmQuantity;
        }

        if (farmMode === FarmMode.Until_Stopped) {
            return false;
        }

        return Core.checkInventory(farmItem, farmQuantity, { toInv: false });
    }

    getPotion(
        itemName: string,
        voucherName: string,
        voucherQuantity: number,
        voucherCost: number,
        targetQuantity: number,
        requiredAlchemyRank = 0,
        requiredFaction = "",
        requiredFactionRank = 0,
    ): void {
        try {
            if (bot.inventory.getQuantity(itemName) > 1) {
                return;
            }

            if (bot.bank.contains(itemName)) {
                // TEMPORARY Game4000 inventory change. Remove after the client inventory fix.
                if (!bot.inventory.contains(itemName) && Core.inventoryBagFreeSlots <= 0) {
                    this.warnPotion(itemName, "no free inventory slot is available");
                    return;
                }

                bot.bank.ensureToInventory(itemName);
                bot.wait.forTrue(() => bot.inventory.contains(itemName), 20);
                if (bot.inventory.getQuantity(itemName) > 1) {
                    return;
                }
            }

            if (requiredAlchemyRank > 0 && !bot.reputation.hasRank("Alchemy", requiredAlchemyRank)) {
                this.warnPotion(itemName, `Alchemy rank ${requiredAlchemyRank} is required`);
                return;
            }

            if (!!requiredFaction?.trim() && !bot.reputation.hasRank(requiredFaction, requiredFactionRank)) {
                this.warnPotion(itemName, `${requiredFaction} rank ${requiredFactionRank} is required`);
                return;
            }

            let requiredSlots = 0;
            if (!bot.inventory.contains(itemName)) {
                requiredSlots++;
            }
            if (!bot.inventory.contains(voucherName)) {
                requiredSlots++;
            }
            // TEMPORARY Game4000 inventory change. Remove after the client inventory fix.
            if (Core.inventoryBagFreeSlots < requiredSlots) {
                this.warnPotion(itemName, `${requiredSlots} free inventory slots are required`);
                return;
            }

            if (bot.bank.contains(voucherName)) {
                bot.bank.ensureToInventory(voucherName);
                bot.wait.forTrue(() => bot.inventory.contains(voucherName), 20);
            }

            let missingVouchers = voucherQuantity - bot.inventory.getQuantity(voucherName);
            if (missingVouchers < 0) {
                missingVouchers = 0;
            }

            const requiredGold = missingVouchers * voucherCost;
            if (bot.player.gold < requiredGold) {
                this.warnPotion(itemName, `${requiredGold} gold is required`);
                return;
            }

            Core.join("alchemyacademy");
            bot.shops.load(2036);
            if (!bot.shops.isLoaded || bot.shops.id !== 2036) {
                this.warnPotion(itemName, "the potion shop could not be loaded");
                return;
            }

            if (missingVouchers > 0) {
                Core.buyItem("alchemyacademy", 2036, voucherName, voucherQuantity);
                bot.wait.forTrue(() => bot.inventory.getQuantity(voucherName) >= voucherQuantity, 20);
            }

            if (bot.inventory.getQuantity(voucherName) < voucherQuantity) {
                this.warnPotion(itemName, "the required vouchers could not be purchased");
                return;
            }

            Core.buyItem("alchemyacademy", 2036, itemName, targetQuantity);
            bot.wait.forTrue(() => bot.inventory.getQuantity(itemName) >= targetQuantity, 20);
            if (bot.inventory.getQuantity(itemName) < targetQuantity) {
                this.warnPotion(itemName, "it could not be purchased");
            }
        } catch (ex) {
            rethrowIfStopped(ex);

            bot.log(`Potion preparation failed for ${itemName}: ${String(ex)}`);
            this.warnPotion(itemName, "preparation failed");
        }
    }

    usePotion(itemName: string, auraName: string): void {
        try {
            if ((bot.map.name ?? "").toLowerCase() !== "fourharbingers") {
                Core.logger("WARNING: Potions will only be used inside fourharbingers.");
                return;
            }

            if (!bot.inventory.contains(itemName)) {
                this.warnPotion(itemName, "it is not in the inventory");
                return;
            }

            bot.inventory.equipUsableItem(itemName);
            bot.wait.forItemEquip(itemName);
            bot.sleep(2000);
            if (!bot.inventory.isEquipped(itemName)) {
                this.warnPotion(itemName, "it could not be equipped");
                return;
            }

            if (bot.self.hasActiveAura(auraName)) {
                return;
            }

            const quantityBefore = bot.inventory.getQuantity(itemName);
            bot.skills.useSkill(5);
            bot.sleep(2000);
            bot.wait.forTrue(
                () => bot.self.hasActiveAura(auraName) || bot.inventory.getQuantity(itemName) < quantityBefore,
                20,
            );
            if (!bot.self.hasActiveAura(auraName) && bot.inventory.getQuantity(itemName) >= quantityBefore) {
                this.warnPotion(itemName, "its effect could not be verified");
            }
        } catch (ex) {
            rethrowIfStopped(ex);

            bot.log(`Potion use failed for ${itemName}: ${String(ex)}`);
            this.warnPotion(itemName, "use failed");
        }
    }

    restockPotions(potionNames: string[], getPotions: () => void, usePotions: () => void): void {
        if (potionNames.every((item) => bot.inventory.getQuantity(item) > 1)) {
            return;
        }

        this.returnToSafeRoom();
        getPotions();
        Core.join("fourharbingers-100000", "Enter", "Spawn");
        usePotions();
    }

    /**
     * Farms the scrolls (`farmScroll(scroll, quantity)`), buys the Gold Vouchers and merges every
     * selected item, with the merge items each one needs.
     */
    completeMergeItems(
        selectedItems: Iterable<string>,
        farmScroll: (scroll: string, quantity: number) => boolean,
    ): boolean {
        const targets = [...new Set([...selectedItems].filter((item) => this.mergeRecipes.has(item)))];

        if (targets.length === 0) {
            Core.logger("No Four Harbingers merge items were selected.");
            return true;
        }

        const itemDemand: Map<string, number> = new Map();
        const purchaseCounts: Map<string, number> = new Map();
        const materialRequirements: Map<string, number> = new Map();
        for (const target of targets) {
            this.addMergeDemand(target, 1, itemDemand, purchaseCounts, materialRequirements);
        }

        for (const [material, quantity] of materialRequirements) {
            if (material === CoreFourHarbingers.goldVoucher100k || material === CoreFourHarbingers.goldVoucher500k) {
                continue;
            }

            if (!farmScroll(material, quantity)) {
                Core.logger(
                    `WARNING: Failed to farm ${material} (${this.ownedQuantity(material)}/${quantity}).`,
                    undefined,
                    { messageBox: true },
                );
                return false;
            }
        }

        this.returnToSafeRoom();

        const voucher100k = this.getRequirement(materialRequirements, CoreFourHarbingers.goldVoucher100k);
        const voucher500k = this.getRequirement(materialRequirements, CoreFourHarbingers.goldVoucher500k);
        if (!this.buyGoldVouchers(voucher100k, voucher500k)) {
            return false;
        }

        for (const material of [...materialRequirements.keys()]) {
            this.moveToInventory(material);
        }

        // Deepest recipes first, so an item a deeper recipe consumes is merged again afterwards.
        for (const target of [...targets].sort((a, b) => this.getRecipeDepth(b) - this.getRecipeDepth(a))) {
            if (!this.acquireMergeItem(target, false)) {
                return false;
            }
        }

        Core.logger(`Four Harbingers merge complete: ${targets.join(", ")}.`);
        return true;
    }

    private addMergeDemand(
        itemName: string,
        quantity: number,
        itemDemand: Map<string, number>,
        purchaseCounts: Map<string, number>,
        materialRequirements: Map<string, number>,
    ): void {
        const recipe = this.mergeRecipes.get(itemName);
        if (!recipe) {
            materialRequirements.set(itemName, this.getRequirement(materialRequirements, itemName) + quantity);
            return;
        }

        const previousDemand = this.getRequirement(itemDemand, itemName);
        const previousPurchases = this.getRequirement(purchaseCounts, itemName);
        const totalDemand = previousDemand + quantity;
        const requiredPurchases = Math.max(0, totalDemand - this.ownedQuantity(itemName));
        const addedPurchases = requiredPurchases - previousPurchases;
        itemDemand.set(itemName, totalDemand);
        if (addedPurchases <= 0) {
            return;
        }

        purchaseCounts.set(itemName, requiredPurchases);
        for (const [requirement, perPurchase] of recipe.requirements) {
            this.addMergeDemand(
                requirement,
                perPurchase * addedPurchases,
                itemDemand,
                purchaseCounts,
                materialRequirements,
            );
        }
    }

    private buyGoldVouchers(voucher100k: number, voucher500k: number): boolean {
        const missing100k = Math.max(0, voucher100k - this.ownedQuantity(CoreFourHarbingers.goldVoucher100k));
        const missing500k = Math.max(0, voucher500k - this.ownedQuantity(CoreFourHarbingers.goldVoucher500k));
        const requiredGold = missing100k * 100000 + missing500k * 500000;
        if (bot.player.gold < requiredGold) {
            Core.logger(
                `WARNING: The selected Four Harbingers merge items require ${requiredGold.toLocaleString("en-US")} Gold for missing vouchers.`,
                undefined,
                { messageBox: true },
            );
            return false;
        }

        this.moveToInventory(CoreFourHarbingers.goldVoucher100k);
        this.moveToInventory(CoreFourHarbingers.goldVoucher500k);

        if (voucher100k > 0 && bot.inventory.getQuantity(CoreFourHarbingers.goldVoucher100k) < voucher100k) {
            Core.buyItem("fourharbingers", 2762, CoreFourHarbingers.goldVoucher100k, voucher100k);
        }

        if (voucher500k > 0 && bot.inventory.getQuantity(CoreFourHarbingers.goldVoucher500k) < voucher500k) {
            Core.buyItem("fourharbingers", 2762, CoreFourHarbingers.goldVoucher500k, voucher500k);
        }

        if (
            bot.inventory.getQuantity(CoreFourHarbingers.goldVoucher100k) < voucher100k ||
            bot.inventory.getQuantity(CoreFourHarbingers.goldVoucher500k) < voucher500k
        ) {
            Core.logger("WARNING: The required Four Harbingers Gold Vouchers could not be purchased.", undefined, {
                messageBox: true,
            });
            return false;
        }

        return true;
    }

    private acquireMergeItem(itemName: string, isRequirement: boolean): boolean {
        if (Core.checkInventory(itemName, undefined, { toInv: false })) {
            if (isRequirement) {
                this.moveToInventory(itemName);
            }

            return true;
        }

        const recipe = this.mergeRecipes.get(itemName);
        if (!recipe) {
            return false;
        }

        for (const requirement of recipe.requirements.keys()) {
            if (this.mergeRecipes.has(requirement) && !this.acquireMergeItem(requirement, true)) {
                return false;
            }
        }

        Core.buyItem("fourharbingers", 2762, itemName);
        if (!Core.checkInventory(itemName, undefined, { toInv: false })) {
            Core.logger(`WARNING: ${itemName} could not be merged.`, undefined, { messageBox: true });
            return false;
        }

        return true;
    }

    private moveToInventory(itemName: string): void {
        if (!bot.inventory.contains(itemName) && bot.bank.contains(itemName)) {
            bot.bank.ensureToInventory(itemName);
            bot.wait.forTrue(() => bot.inventory.contains(itemName), 20);
        }
    }

    private ownedQuantity(itemName: string): number {
        return [...bot.inventory.items, ...bot.bank.items]
            .filter((item) => item.name.toLowerCase() === itemName.toLowerCase())
            .reduce((sum, item) => sum + item.quantity, 0);
    }

    private getRecipeDepth(itemName: string): number {
        const recipe = this.mergeRecipes.get(itemName);
        if (!recipe) {
            return 0;
        }

        let depth = 1;
        for (const requirement of recipe.requirements.keys()) {
            depth = Math.max(depth, 1 + this.getRecipeDepth(requirement));
        }

        return depth;
    }

    private getRequirement(requirements: Map<string, number>, itemName: string): number {
        return requirements.get(itemName) ?? 0;
    }

    private static createMergeRecipes(): Map<string, MergeRecipe> {
        const recipes: Map<string, MergeRecipe> = new Map();

        CoreFourHarbingers.addRecipe(
            recipes,
            "Celestial Dragon of Time",
            [CoreFourHarbingers.goldVoucher100k, 10],
            ["Scroll of the Heretic", 10],
        );
        CoreFourHarbingers.addRecipe(
            recipes,
            "Infernal Dragon of Time",
            [CoreFourHarbingers.goldVoucher100k, 10],
            ["Scroll of the Heretic", 10],
        );
        CoreFourHarbingers.addRecipe(
            recipes,
            "Harbinger of War",
            [CoreFourHarbingers.goldVoucher100k, 10],
            ["Scroll of the Preacher", 20],
        );
        CoreFourHarbingers.addRecipe(
            recipes,
            "Harbinger of Famine",
            [CoreFourHarbingers.goldVoucher100k, 10],
            ["Scroll of the Benevolent", 20],
        );
        CoreFourHarbingers.addRecipe(
            recipes,
            "Harbinger of Death",
            [CoreFourHarbingers.goldVoucher100k, 10],
            ["Scroll of the Innocent", 20],
        );
        CoreFourHarbingers.addRecipe(
            recipes,
            "Harbinger of Conquest",
            [CoreFourHarbingers.goldVoucher100k, 10],
            ["Scroll of the Wanderer", 20],
        );
        CoreFourHarbingers.addRecipe(
            recipes,
            "Bow of Halosis",
            [CoreFourHarbingers.goldVoucher100k, 4],
            ["Scroll of the Wanderer", 4],
        );
        CoreFourHarbingers.addRecipe(
            recipes,
            "Halosis' Divine Wheel",
            [CoreFourHarbingers.goldVoucher100k, 2],
            ["Scroll of the Wanderer", 2],
        );
        CoreFourHarbingers.addRecipe(
            recipes,
            "Wings of Mors",
            [CoreFourHarbingers.goldVoucher100k, 2],
            ["Scroll of the Innocent", 2],
        );
        CoreFourHarbingers.addRecipe(
            recipes,
            "Bello's Armaments",
            [CoreFourHarbingers.goldVoucher100k, 2],
            ["Scroll of the Preacher", 2],
        );
        CoreFourHarbingers.addRecipe(
            recipes,
            "Bello's Braziers",
            ["Bello's Brazier", 1],
            [CoreFourHarbingers.goldVoucher100k, 2],
            ["Scroll of the Preacher", 2],
        );
        CoreFourHarbingers.addRecipe(
            recipes,
            "Bello's Sanctified Braziers",
            ["Bello's Sanctified Brazier", 1],
            [CoreFourHarbingers.goldVoucher100k, 2],
            ["Scroll of the Preacher", 2],
        );
        CoreFourHarbingers.addRecipe(
            recipes,
            "Hunting Bow of Halosis",
            ["Bow of Halosis", 1],
            [CoreFourHarbingers.goldVoucher100k, 2],
            ["Scroll of the Wanderer", 2],
        );
        CoreFourHarbingers.addRecipe(
            recipes,
            "Poise of Halosis",
            [CoreFourHarbingers.goldVoucher100k, 2],
            ["Scroll of the Wanderer", 2],
        );
        CoreFourHarbingers.addRecipe(
            recipes,
            "Poise of Fames",
            [CoreFourHarbingers.goldVoucher100k, 2],
            ["Scroll of the Benevolent", 2],
        );
        CoreFourHarbingers.addRecipe(
            recipes,
            "Poise of Mors",
            [CoreFourHarbingers.goldVoucher100k, 2],
            ["Scroll of the Innocent", 2],
        );
        CoreFourHarbingers.addRecipe(
            recipes,
            "Poise of Bello",
            [CoreFourHarbingers.goldVoucher100k, 2],
            ["Scroll of the Preacher", 2],
        );
        CoreFourHarbingers.addRecipe(
            recipes,
            "Infernal Dragon of Time Hood",
            [CoreFourHarbingers.goldVoucher100k, 2],
            ["Scroll of the Heretic", 2],
        );
        CoreFourHarbingers.addRecipe(
            recipes,
            "Celestial Dragon of Time Hood",
            [CoreFourHarbingers.goldVoucher100k, 2],
            ["Scroll of the Heretic", 2],
        );
        CoreFourHarbingers.addRecipe(
            recipes,
            "Bello's Brazier",
            [CoreFourHarbingers.goldVoucher100k, 4],
            ["Scroll of the Preacher", 4],
        );
        CoreFourHarbingers.addRecipe(
            recipes,
            "Fames' Barren Scale",
            [CoreFourHarbingers.goldVoucher100k, 4],
            ["Scroll of the Benevolent", 4],
        );
        CoreFourHarbingers.addRecipe(
            recipes,
            "Bello's Sanctified Brazier",
            [CoreFourHarbingers.goldVoucher100k, 4],
            ["Scroll of the Preacher", 4],
        );
        CoreFourHarbingers.addRecipe(
            recipes,
            "Nightstar Companion",
            ["Celestial Dragon of Time", 1],
            ["Infernal Dragon of Time", 1],
            ["Harbinger of Conquest", 1],
            ["Harbinger of Death", 1],
            ["Harbinger of Famine", 1],
            ["Harbinger of War", 1],
            [CoreFourHarbingers.goldVoucher500k, 30],
        );
        CoreFourHarbingers.addRecipe(
            recipes,
            "Scythe of Mors",
            [CoreFourHarbingers.goldVoucher100k, 4],
            ["Scroll of the Innocent", 4],
        );

        return recipes;
    }

    private static addRecipe(
        recipes: Map<string, MergeRecipe>,
        itemName: string,
        ...requirements: [ItemName: string, Quantity: number][]
    ): void {
        recipes.set(itemName, new MergeRecipe(requirements));
    }

    refreshPotion(itemName: string, auraName: string): void {
        if (
            bot.player.inCombat &&
            bot.inventory.isEquipped(itemName) &&
            !bot.self.hasActiveAura(auraName) &&
            bot.skills.canUseSkill(5)
        ) {
            bot.skills.useSkill(5);
        }
    }

    hasMonsterAura(mapID: number, auraName: string): boolean {
        try {
            const auras = bot.target.getMonsterAura(mapID);
            return (auras ?? []).some((a) => a.name.toLowerCase() === auraName.toLowerCase());
        } catch (error) {
            rethrowIfStopped(error);

            return false;
        }
    }

    warnEnhancementFallback(message: string): void {
        Core.logger(`WARNING: ${message} The script may fail.`, undefined, { messageBox: true });
    }

    private warnPotion(itemName: string, reason: string): void {
        Core.logger(`WARNING: ${itemName} was skipped because ${reason}. Continuing without it.`);
    }
}

export class MergeRecipe {
    requirements!: Map<string, number>;

    constructor(requirements: [ItemName: string, Quantity: number][]) {
        this.requirements = new Map(requirements);
    }
}

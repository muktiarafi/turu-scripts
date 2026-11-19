/*
name: Army Prismatas Gold Farm LW
description: Four-to-seven-player CoreLoneWolf Army gold farm for Elemental Binding.
tags: gold, prismatas, elemental binding, seven-player, army, corelonewolf
*/
// Port of Extras/ArmyPrismatasGoldFarm_LW.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { type Ref, ref } from "../LWRef";
import { bot, choices, defineScriptOptions, option } from "turu";
import { HelmSpecial } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { ClassPreset, CoreLoneWolf } from "../CoreLoneWolf";

const LoneWolf = new CoreLoneWolf();

export enum ArmyComposition {
    Default = "Default",
    Stable = "Stable",
    Unselected = "Unselected",
}

export class ArmyPrismatasGoldFarm_LW {
    private static readonly logPrefix = "Army Prismatas Gold Farm LW";
    private static readonly syncFileName = "ArmyPrismatasGoldFarm_LW.sync";
    private static readonly mapName = "archmage";
    private static readonly safeCell = "Enter";
    private static readonly safePad = "Spawn";
    private static readonly fightCell = "r2";
    private static readonly fightPad = "Left";
    private static readonly elementalBinding = "Elemental Binding";
    private static readonly goldVoucher100k = "Gold Voucher 100k";
    private static readonly goldVoucher500k = "Gold Voucher 500k";
    private static readonly voucherMap = "alchemyacademy";
    private static readonly voucherShopId = 2036;
    private static readonly voucherMaxStack = 300;
    private static readonly bindingMaxStack = 2500;
    private static readonly goldVoucher100kPrice = 100000;
    private static readonly goldVoucher500kPrice = 500000;
    private static readonly goldCap = 100000000;
    private static readonly minimumLevel = 80;
    private static readonly firstTargetMapId = 1;
    private static readonly secondTargetMapId = 2;
    private static readonly farmPollDelay = 100;
    private static readonly respawnPollDelay = 500;

    private playerAlias: string = "";
    private armyComposition: ArmyComposition = null!;
    private armyPlayerCount: number = 0;
    private privateRoomNumber: number = 0;
    private bindingSellQuantity: number = 0;
    private keepElementalBinding: boolean = false;
    private farmGoldVouchers: boolean = false;
    private finishingBindings: boolean = false;
    private antiLagApplied: boolean = false;
    private originalLagKiller: boolean = false;
    private originalHidePlayers: boolean = false;
    private originalDisableSelfAnimation: boolean = false;
    private originalDisableMonsterAnimation: boolean = false;
    private originalDisableSkillAnimation: boolean = false;
    private originalDisableDamageStrobe: boolean = false;
    private originalMonstersHidden: boolean = false;

    static player5 = option.text("player5", "Player 5 (Optional)", "Player 5 (Optional) account name.", "");
    static player6 = option.text("player6", "Player 6 (Optional)", "Player 6 (Optional) account name.", "");
    static player7 = option.text("player7", "Player 7 (Optional)", "Player 7 (Optional) account name.", "");

    applyAntiLag(): void {
        if (!bot.config!.get<boolean>("EnableAntiLag")) {
            return;
        }

        this.originalLagKiller = bot.options.lagKiller;
        this.originalHidePlayers = bot.options.hidePlayers;
        this.originalDisableSelfAnimation = bot.lite.disableSelfAnimation;
        this.originalDisableMonsterAnimation = bot.lite.disableMonsterAnimation;
        this.originalDisableSkillAnimation = bot.lite.disableSkillAnimation;
        this.originalDisableDamageStrobe = bot.lite.disableDamageStrobe;
        this.originalMonstersHidden = bot.flash.get<boolean>("ui.monsterIcon.redX.visible");
        this.antiLagApplied = true;

        bot.options.lagKiller = true;
        bot.options.hidePlayers = true;
        bot.lite.disableSelfAnimation = true;
        bot.lite.disableMonsterAnimation = true;
        bot.lite.disableSkillAnimation = true;
        bot.lite.disableDamageStrobe = true;

        if (!this.originalMonstersHidden) {
            bot.flash.callGameFunction("world.toggleMonsters");
        }
    }

    restoreAntiLag(): void {
        if (!this.antiLagApplied) {
            return;
        }

        bot.options.lagKiller = this.originalLagKiller;
        bot.options.hidePlayers = this.originalHidePlayers;
        bot.lite.disableSelfAnimation = this.originalDisableSelfAnimation;
        bot.lite.disableMonsterAnimation = this.originalDisableMonsterAnimation;
        bot.lite.disableSkillAnimation = this.originalDisableSkillAnimation;
        bot.lite.disableDamageStrobe = this.originalDisableDamageStrobe;

        const monstersHidden = bot.flash.get<boolean>("ui.monsterIcon.redX.visible");
        if (monstersHidden !== this.originalMonstersHidden) {
            bot.flash.callGameFunction("world.toggleMonsters");
        }

        this.antiLagApplied = false;
    }

    run(): void {
        if (!this.validateOptions()) {
            return;
        }

        this.finishingBindings = false;

        if (!LoneWolf.startArmySync(ArmyPrismatasGoldFarm_LW.syncFileName, this.armyPlayerCount)) {
            return;
        }

        if (!LoneWolf.validateHouseRequirements()) {
            return;
        }

        this.playerAlias = this.getPlayerAlias();
        const preset = this.getClassPreset();

        if (!this.validateAccess(preset)) {
            return;
        }

        Core.logger(
            `${ArmyPrismatasGoldFarm_LW.logPrefix} started as ${this.playerAlias} using ${this.armyComposition} composition.`,
        );

        if (this.keepElementalBinding) {
            Core.logger(
                `${ArmyPrismatasGoldFarm_LW.logPrefix} keeping all Elemental Binding until every active account has ${this.bindingSellQuantity}. Gold and voucher goals are disabled.`,
            );
        }

        this.registerBindingDrop();

        if (!this.prepare(preset) || !this.sync("SETUP_DONE")) {
            return;
        }

        let armyComplete = false;
        if (
            !this.runSafeRoomStage(
                preset,
                0,
                ref(
                    () => armyComplete,
                    (v) => (armyComplete = v),
                ),
            )
        ) {
            return;
        }

        let farmCycle = 1;
        while (!bot.shouldExit && !armyComplete) {
            if (!this.farmBindings(preset, farmCycle)) {
                return;
            }

            if (!this.sync(`CYCLE_${farmCycle}_SELL_READY`)) {
                return;
            }

            if (
                !this.runSafeRoomStage(
                    preset,
                    farmCycle,
                    ref(
                        () => armyComplete,
                        (v) => (armyComplete = v),
                    ),
                )
            ) {
                return;
            }

            farmCycle++;
        }

        if (bot.shouldExit || !armyComplete) {
            return;
        }

        if (!this.moveToHouse() || bot.shouldExit || !this.sync("PARKED")) {
            return;
        }

        this.stopArmy();
    }

    private validateOptions(): boolean {
        this.armyComposition = bot.config!.get<ArmyComposition>("ArmyComposition");
        this.privateRoomNumber = bot.config.get<number>("PrivateRoomNumber");
        this.bindingSellQuantity = bot.config.get<number>("BindingSellQuantity");
        this.keepElementalBinding = this.bindingSellQuantity < 0;
        this.farmGoldVouchers = !this.keepElementalBinding && bot.config.get<boolean>("FarmGoldVouchers");

        if (
            this.bindingSellQuantity === 0 ||
            this.bindingSellQuantity < -ArmyPrismatasGoldFarm_LW.bindingMaxStack ||
            this.bindingSellQuantity > ArmyPrismatasGoldFarm_LW.bindingMaxStack
        ) {
            Core.logger(
                `Binding Sell Quantity must be from -${ArmyPrismatasGoldFarm_LW.bindingMaxStack} through -1 or 1 through ${ArmyPrismatasGoldFarm_LW.bindingMaxStack}. Negative quantities keep Bindings.`,
                "ValidateOptions",
                { messageBox: true },
            );
            return false;
        }

        this.bindingSellQuantity = Math.abs(this.bindingSellQuantity);

        const playerFive = bot.config.get<string>("player5")?.trim() ?? "";
        const playerSix = bot.config.get<string>("player6")?.trim() ?? "";
        const playerSeven = bot.config.get<string>("player7")?.trim() ?? "";

        if (!playerFive && (!!playerSix || !!playerSeven)) {
            Core.logger("Player 5 is required when Player 6 or Player 7 is configured.", "ValidateOptions", {
                messageBox: true,
            });
            return false;
        }

        if (!playerSix && !!playerSeven) {
            Core.logger("Player 6 is required when Player 7 is configured.", "ValidateOptions", { messageBox: true });
            return false;
        }

        this.armyPlayerCount = !!playerSeven ? 7 : !!playerSix ? 6 : !!playerFive ? 5 : 4;

        return LoneWolf.validatePrivateRoomNumber(this.privateRoomNumber);
    }

    private validateAccess(preset: ClassPreset): boolean {
        if (bot.player.level >= ArmyPrismatasGoldFarm_LW.minimumLevel) {
            return true;
        }

        return this.fatal(
            `${ArmyPrismatasGoldFarm_LW.logPrefix} requires level ${ArmyPrismatasGoldFarm_LW.minimumLevel} or higher for ${this.playerAlias} (${preset.className}).`,
            "ValidateAccess",
        );
    }

    private prepare(preset: ClassPreset): boolean {
        Core.logger(`${ArmyPrismatasGoldFarm_LW.logPrefix} ${this.playerAlias} starting setup.`);

        if (this.armyComposition === ArmyComposition.Unselected) {
            Core.logger(
                `${ArmyPrismatasGoldFarm_LW.logPrefix} ${this.playerAlias} preserving current class ${preset.className} and skipping enhancements and potions.`,
            );
        } else {
            LoneWolf.equipClass(preset);
            if (bot.shouldExit) {
                return false;
            }

            if (bot.config!.get<boolean>("UseEnhancements")) {
                LoneWolf.prepareEnhancements(
                    preset.baseEnhancement,
                    preset.capeEnhancement,
                    preset.helmEnhancement,
                    preset.weaponEnhancement,
                    undefined,
                    preset.weaponEnhancementFallbacks,
                );
            }

            if (bot.config.get<boolean>("UsePotions")) {
                LoneWolf.preparePotions(preset.tonic, preset.elixir, preset.combatPotion);
            }
        }

        if (bot.shouldExit) {
            return false;
        }

        if (!this.prepareBankItems()) {
            return false;
        }

        Core.logger(`${ArmyPrismatasGoldFarm_LW.logPrefix} ${this.playerAlias} finished setup.`);
        return true;
    }

    private prepareBankItems(): boolean {
        if (bot.flash.get<string>("ui.mcPopup.currentLabel") !== "Bank") {
            bot.bank.open();
        }

        bot.bank.load();
        bot.bank.loaded = true;

        if (!this.moveBankedItemToInventory(ArmyPrismatasGoldFarm_LW.elementalBinding)) {
            return false;
        }

        return (
            !this.farmGoldVouchers ||
            (this.moveBankedItemToInventory(ArmyPrismatasGoldFarm_LW.goldVoucher100k) &&
                this.moveBankedItemToInventory(ArmyPrismatasGoldFarm_LW.goldVoucher500k))
        );
    }

    private moveBankedItemToInventory(itemName: string): boolean {
        const bankQuantity = bot.bank.getQuantity(itemName);
        if (bankQuantity <= 0) {
            return true;
        }

        if (!Core.hasSpaceFor(bot.bank.getItem(itemName))) {
            return this.fatal(
                `${itemName} cannot be moved from bank because the inventory is full.`,
                "PrepareBankItems",
            );
        }

        const inventoryQuantity = bot.inventory.getQuantity(itemName);
        const expectedQuantity = inventoryQuantity + bankQuantity;

        bot.bank.ensureToInventory(itemName);
        bot.wait.forTrue(() => bot.inventory.getQuantity(itemName) >= expectedQuantity, 20);

        const finalQuantity = bot.inventory.getQuantity(itemName);
        if (finalQuantity < expectedQuantity) {
            return this.fatal(
                LoneWolf.explainFailure(
                    `${itemName} could not be moved completely from bank. Inventory quantity: ${finalQuantity}/${expectedQuantity}.`,
                ),
                "PrepareBankItems",
            );
        }

        Core.logger(`${itemName} moved from bank. Inventory quantity: ${finalQuantity}.`, "PrepareBankItems");
        return true;
    }

    private registerBindingDrop(): void {
        if (!bot.drops.toPickup.includes(ArmyPrismatasGoldFarm_LW.elementalBinding)) {
            Core.addDrop(ArmyPrismatasGoldFarm_LW.elementalBinding);
        }

        if (!bot.drops.running) {
            bot.drops.start();
        }
    }

    private farmBindings(preset: ClassPreset, farmCycle: number): boolean {
        const targetQuantity = this.finishingBindings
            ? ArmyPrismatasGoldFarm_LW.bindingMaxStack
            : this.bindingSellQuantity;
        Core.jump(ArmyPrismatasGoldFarm_LW.fightCell, ArmyPrismatasGoldFarm_LW.fightPad);
        bot.options.aggroMonsters = true;

        if (this.armyComposition === ArmyComposition.Unselected) {
            // C# starts Skua's skill timer with its current skills; Turu starts the class's Advanced Skills.
            bot.skills.startAdvanced(bot.player.currentClass ?? undefined, false);
        } else {
            LoneWolf.startSkillEngine(
                preset.skills,
                this.playerAlias,
                false,
                ArmyPrismatasGoldFarm_LW.logPrefix,
                preset.skillMode,
            );
        }
        Core.logger(
            `${ArmyPrismatasGoldFarm_LW.logPrefix} ${this.playerAlias} started Elemental Binding cycle ${farmCycle}.`,
        );

        const readySignal = `CYCLE_${farmCycle}_BINDING_READY`;
        let readySignalSent = false;
        let deathLogged = false;
        while (!bot.shouldExit) {
            if (!bot.player.alive) {
                if (!deathLogged) {
                    Core.logger(
                        `${ArmyPrismatasGoldFarm_LW.logPrefix} ${this.playerAlias} died during cycle ${farmCycle}.`,
                    );
                    deathLogged = true;
                }

                bot.sleep(ArmyPrismatasGoldFarm_LW.respawnPollDelay);
                continue;
            }

            if (deathLogged) {
                Core.logger(
                    `${ArmyPrismatasGoldFarm_LW.logPrefix} ${this.playerAlias} respawned during cycle ${farmCycle}.`,
                );
                deathLogged = false;
                Core.jump(ArmyPrismatasGoldFarm_LW.fightCell, ArmyPrismatasGoldFarm_LW.fightPad);
            }

            if (!readySignalSent && this.reachedBindingQuantity(targetQuantity)) {
                if (!LoneWolf.sendArmySignal(readySignal)) {
                    return false;
                }

                readySignalSent = true;
                Core.logger(
                    `${ArmyPrismatasGoldFarm_LW.logPrefix} ${this.playerAlias} reached ${targetQuantity} Elemental Binding for cycle ${farmCycle} and is continuing to help.`,
                );
            }

            if (readySignalSent && this.allPlayersSignaled(readySignal)) {
                break;
            }

            const targetMapId = this.getCurrentTargetMapId();
            if (targetMapId > 0) {
                LoneWolf.maintainTarget(targetMapId);
            }

            bot.sleep(ArmyPrismatasGoldFarm_LW.farmPollDelay);
        }

        this.stopCombat();

        if (bot.shouldExit) {
            return false;
        }

        return true;
    }

    private reachedBindingQuantity(quantity: number): boolean {
        return bot.inventory.getQuantity(ArmyPrismatasGoldFarm_LW.elementalBinding) >= quantity;
    }

    private getCurrentTargetMapId(): number {
        if (LoneWolf.isMonsterAlive(ArmyPrismatasGoldFarm_LW.firstTargetMapId)) {
            return ArmyPrismatasGoldFarm_LW.firstTargetMapId;
        }

        return LoneWolf.isMonsterAlive(ArmyPrismatasGoldFarm_LW.secondTargetMapId)
            ? ArmyPrismatasGoldFarm_LW.secondTargetMapId
            : 0;
    }

    private runSafeRoomStage(preset: ClassPreset, farmCycle: number, armyComplete: Ref<boolean>): boolean {
        armyComplete.value = false;
        this.stopCombat();
        this.moveToSafeRoom();

        if (!this.keepElementalBinding && !this.isLocalCurrencyGoalComplete()) {
            if (this.farmGoldVouchers && bot.player.gold >= ArmyPrismatasGoldFarm_LW.goldCap) {
                this.purchaseGoldVouchers();

                if (bot.shouldExit) {
                    return false;
                }

                this.moveToSafeRoom();
            }

            if (bot.player.gold < ArmyPrismatasGoldFarm_LW.goldCap) {
                if (!this.sellBindings(farmCycle)) {
                    return false;
                }

                if (this.farmGoldVouchers) {
                    this.purchaseGoldVouchers();
                }

                if (bot.shouldExit) {
                    return false;
                }
            }
        }

        this.moveToSafeRoom();

        const currencySignal = `CYCLE_${farmCycle}_CURRENCY_COMPLETE`;
        if (
            !this.keepElementalBinding &&
            this.isLocalCurrencyGoalComplete() &&
            !LoneWolf.sendArmySignal(currencySignal)
        ) {
            return false;
        }

        const localComplete = this.isLocalGoalComplete();
        const completionSignal = `CYCLE_${farmCycle}_COMPLETE`;
        if (localComplete && !LoneWolf.sendArmySignal(completionSignal)) {
            return false;
        }

        if (!this.sync(`CYCLE_${farmCycle}_SAFE_DONE`)) {
            return false;
        }

        armyComplete.value = this.allPlayersSignaled(completionSignal);
        if (armyComplete.value) {
            Core.logger(
                this.keepElementalBinding
                    ? `${ArmyPrismatasGoldFarm_LW.logPrefix} confirmed every active account has ${this.bindingSellQuantity} Elemental Binding.`
                    : this.farmGoldVouchers
                      ? `${ArmyPrismatasGoldFarm_LW.logPrefix} confirmed every active account has max gold, vouchers, and Elemental Binding.`
                      : `${ArmyPrismatasGoldFarm_LW.logPrefix} confirmed every active account completed the gold objective.`,
            );
            return true;
        }

        if (this.farmGoldVouchers && !this.finishingBindings && this.allPlayersSignaled(currencySignal)) {
            this.finishingBindings = true;
            Core.logger(
                "Max gold and vouchers achieved by all active accounts. Continuing until everyone has max Elemental Binding (2500).",
                ArmyPrismatasGoldFarm_LW.logPrefix,
            );
        }

        if (this.armyComposition !== ArmyComposition.Unselected && bot.config!.get<boolean>("UsePotions")) {
            LoneWolf.usePotions(preset.tonic, preset.elixir, preset.combatPotion);
        }

        bot.options.aggroMonsters = true;
        return !bot.shouldExit;
    }

    private moveToSafeRoom(): void {
        if (bot.map.name?.toLowerCase() === ArmyPrismatasGoldFarm_LW.mapName?.toLowerCase()) {
            Core.jump(ArmyPrismatasGoldFarm_LW.safeCell, ArmyPrismatasGoldFarm_LW.safePad);
            return;
        }

        Core.join(
            `${ArmyPrismatasGoldFarm_LW.mapName}-${this.privateRoomNumber}`,
            ArmyPrismatasGoldFarm_LW.safeCell,
            ArmyPrismatasGoldFarm_LW.safePad,
        );
    }

    private sellBindings(farmCycle: number): boolean {
        if (this.keepElementalBinding) {
            return true;
        }

        if (this.isLocalCurrencyGoalComplete()) {
            Core.logger(
                `Currency objective already complete. Retaining ${ArmyPrismatasGoldFarm_LW.elementalBinding} for cycle ${farmCycle}.`,
                "SellBindings",
            );
            return true;
        }

        const quantityBefore = bot.inventory.getQuantity(ArmyPrismatasGoldFarm_LW.elementalBinding);
        if (quantityBefore <= 0) {
            Core.logger(
                `${ArmyPrismatasGoldFarm_LW.elementalBinding} inventory is already clear for cycle ${farmCycle}.`,
                "SellBindings",
            );
            return true;
        }

        Core.sellItem(ArmyPrismatasGoldFarm_LW.elementalBinding, undefined, { all: true });
        const quantityAfter = bot.inventory.getQuantity(ArmyPrismatasGoldFarm_LW.elementalBinding);

        if (quantityAfter <= 0) {
            Core.logger(
                `Sold ${quantityBefore} ${ArmyPrismatasGoldFarm_LW.elementalBinding} for cycle ${farmCycle}.`,
                "SellBindings",
            );
            return true;
        }

        return this.fatal(
            LoneWolf.explainFailure(
                `${ArmyPrismatasGoldFarm_LW.elementalBinding} failed to sell completely. Remaining quantity: ${quantityAfter}.`,
            ),
            "SellBindings",
        );
    }

    private purchaseGoldVouchers(): void {
        this.buyAffordableVoucher(
            ArmyPrismatasGoldFarm_LW.goldVoucher100k,
            ArmyPrismatasGoldFarm_LW.goldVoucher100kPrice,
        );

        if (
            this.getVoucherQuantity(ArmyPrismatasGoldFarm_LW.goldVoucher100k) < ArmyPrismatasGoldFarm_LW.voucherMaxStack
        ) {
            return;
        }

        this.buyAffordableVoucher(
            ArmyPrismatasGoldFarm_LW.goldVoucher500k,
            ArmyPrismatasGoldFarm_LW.goldVoucher500kPrice,
        );
    }

    private buyAffordableVoucher(voucherName: string, price: number): void {
        const quantityBefore = this.getVoucherQuantity(voucherName);
        const missing = ArmyPrismatasGoldFarm_LW.voucherMaxStack - quantityBefore;
        const affordable = Math.trunc(bot.player.gold / price);
        const buyQuantity = Math.min(missing, affordable);

        if (buyQuantity <= 0) {
            return;
        }

        Core.buyItem(
            ArmyPrismatasGoldFarm_LW.voucherMap,
            ArmyPrismatasGoldFarm_LW.voucherShopId,
            voucherName,
            buyQuantity,
        );

        const quantityAfter = this.getVoucherQuantity(voucherName);
        Core.logger(
            `${voucherName}: ${quantityAfter}/${ArmyPrismatasGoldFarm_LW.voucherMaxStack} after buying ${Math.max(0, quantityAfter - quantityBefore)}.`,
            "PurchaseGoldVouchers",
        );
    }

    private getVoucherQuantity(voucherName: string): number {
        return bot.inventory.getQuantity(voucherName) + bot.bank.getQuantity(voucherName);
    }

    private isLocalGoalComplete(): boolean {
        return this.keepElementalBinding
            ? this.reachedBindingQuantity(this.bindingSellQuantity)
            : this.isLocalCurrencyGoalComplete() &&
                  (!this.farmGoldVouchers || this.reachedBindingQuantity(ArmyPrismatasGoldFarm_LW.bindingMaxStack));
    }

    private isLocalCurrencyGoalComplete(): boolean {
        if (bot.player.gold < ArmyPrismatasGoldFarm_LW.goldCap) {
            return false;
        }

        return (
            !this.farmGoldVouchers ||
            (this.getVoucherQuantity(ArmyPrismatasGoldFarm_LW.goldVoucher100k) >=
                ArmyPrismatasGoldFarm_LW.voucherMaxStack &&
                this.getVoucherQuantity(ArmyPrismatasGoldFarm_LW.goldVoucher500k) >=
                    ArmyPrismatasGoldFarm_LW.voucherMaxStack)
        );
    }

    private allPlayersSignaled(signal: string): boolean {
        for (let playerNumber = 1; playerNumber <= this.armyPlayerCount; playerNumber++) {
            if (!LoneWolf.hasArmySignal(signal, playerNumber)) {
                return false;
            }
        }

        return true;
    }

    private stopCombat(): void {
        LoneWolf.stopSkillEngine();
        bot.skills.stop();
        bot.combat.cancelTarget();
    }

    private getClassPreset(): ClassPreset {
        if (this.armyComposition === ArmyComposition.Unselected) {
            return Object.assign(new ClassPreset(), { className: bot.player.currentClass ?? "Current Class" });
        }

        if (LoneWolf.isArmyPlayer(1)) {
            return this.armyComposition === ArmyComposition.Stable ? LoneWolf.archFiend() : LoneWolf.legionRevenant();
        }

        if (LoneWolf.isArmyPlayer(2)) {
            return LoneWolf.stoneCrusher();
        }

        if (LoneWolf.isArmyPlayer(3)) {
            return LoneWolf.archPaladin();
        }

        if (LoneWolf.isArmyPlayer(4)) {
            return LoneWolf.lordOfOrder();
        }

        if (LoneWolf.isArmyPlayer(5)) {
            const shaman = LoneWolf.shaman(true);
            shaman.helmEnhancement = HelmSpecial.Examen;
            return shaman;
        }

        if (LoneWolf.isArmyPlayer(6)) {
            return LoneWolf.bard();
        }

        return LoneWolf.verusDoomKnight();
    }

    private getPlayerAlias(): string {
        if (LoneWolf.isArmyPlayer(1)) {
            return "playerOne";
        }

        if (LoneWolf.isArmyPlayer(2)) {
            return "playerTwo";
        }

        if (LoneWolf.isArmyPlayer(3)) {
            return "playerThree";
        }

        if (LoneWolf.isArmyPlayer(4)) {
            return "playerFour";
        }

        if (LoneWolf.isArmyPlayer(5)) {
            return "playerFive";
        }

        if (LoneWolf.isArmyPlayer(6)) {
            return "playerSix";
        }

        return "playerSeven";
    }

    private sync(step: string): boolean {
        Core.logger(`${ArmyPrismatasGoldFarm_LW.logPrefix} ${this.playerAlias} entering ${step}.`);

        if (!LoneWolf.syncArmy(step)) {
            return false;
        }

        Core.logger(`${ArmyPrismatasGoldFarm_LW.logPrefix} ${this.playerAlias} continued from ${step}.`);
        return true;
    }

    private moveToHouse(): boolean {
        return LoneWolf.moveToHouse(ArmyPrismatasGoldFarm_LW.logPrefix);
    }

    private fatal(message: string, caller: string): boolean {
        Core.logger(message, caller, { messageBox: true, stopBot: true });
        return false;
    }

    private stopArmy(): void {
        if (LoneWolf.isArmyPlayer(1)) {
            bot.sleep(2000);

            if (bot.shouldExit) {
                return;
            }

            if (LoneWolf.stopArmySync("COMPLETE")) {
                Core.logger(`${ArmyPrismatasGoldFarm_LW.logPrefix} playerOne published COMPLETE.`);
            } else {
                Core.logger(`${ArmyPrismatasGoldFarm_LW.logPrefix} playerOne could not publish COMPLETE.`);
            }

            return;
        }

        if (LoneWolf.syncArmy("STOP_CHECK")) {
            Core.logger(`${ArmyPrismatasGoldFarm_LW.logPrefix} ${this.playerAlias} unexpectedly passed STOP_CHECK.`);
        } else {
            Core.logger(`${ArmyPrismatasGoldFarm_LW.logPrefix} ${this.playerAlias} detected COMPLETE.`);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "GoldPrismatas_LW",
    [
        LoneWolf.player1,
        LoneWolf.player2,
        LoneWolf.player3,
        LoneWolf.player4,
        ArmyPrismatasGoldFarm_LW.player5,
        ArmyPrismatasGoldFarm_LW.player6,
        ArmyPrismatasGoldFarm_LW.player7,
        option.choice(
            "ArmyComposition",
            "Army Composition",
            "Default: LR / SC / AP / LOO / Shaman / Bard / VDK\nStable: AF / SC / AP / LOO / Shaman / Bard / VDK\nUnselected: Current Class / Skua Advanced Skills / No Enhancements or Potions",
            choices(ArmyComposition),
            ArmyComposition.Default,
        ),
        option.int("PrivateRoomNumber", "Private Room Number", "Private room number from 1001 through 99999.", 0),
        option.int(
            "BindingSellQuantity",
            "Binding Sell Quantity",
            "Positive: sell after every player reaches this quantity.\nNegative: keep Bindings and stop at that quantity,\nignoring gold and vouchers.\n\nExamples: -100 keeps 100, -2500 keeps 2500.\nRange: -2500 through -1 or 1 through 2500.",
            100,
        ),
        option.bool(
            "FarmGoldVouchers",
            "Farm Gold Vouchers?",
            "Max Gold Voucher 100k first,\nthen Gold Voucher 500k,\nbefore finishing at 100 million gold\nand 2500 Elemental Bindings on every player.\n\nIgnored when Binding Sell Quantity is negative.",
            false,
        ),
        option.bool(
            "EnableAntiLag",
            "Enable AntiLag",
            "Temporarily enable AntiLag and disable visual effects while the script runs.",
            true,
        ),
        option.bool("UsePotions", "Use Potions", "Prepare and use the assigned potion loadout after each sale.", true),
        option.bool("UseEnhancements", "Use Enhancements", "Prepare the assigned enhancement loadout.", true),
    ],
    true,
);

export default function main(): void {
    const script = new ArmyPrismatasGoldFarm_LW();
    bot.skills.stop();
    bot.options.infiniteRange = true;
    bot.options.aggroMonsters = true;
    bot.config?.configure();

    try {
        script.applyAntiLag();
        script.run();
    } finally {
        LoneWolf.stopSkillEngine();
        bot.skills.stop();
        script.restoreAntiLag();
    }
}

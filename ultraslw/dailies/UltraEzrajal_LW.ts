/*
name: Ultra Ezrajal LW
description: Four-player CoreLoneWolf Army script for Ultra Ezrajal.
tags: ultra, ezrajal, army, corelonewolf
*/
// Port of Dailies/UltraEzrajal_LW.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { CapeSpecial, CoreAdvanced, HelmSpecial, WeaponSpecial } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { type ClassPreset, CoreLoneWolf, SkillEngineMode, UltraRunResult } from "../CoreLoneWolf";

const Advanced = new CoreAdvanced();
const LoneWolf = new CoreLoneWolf();

export enum ArmyComposition {
    Default = "Default",
    Stable = "Stable",
    Reliable = "Reliable",
    Pay2Win = "Pay2Win",
    Abyssal = "Abyssal",
}

export enum FightResult {
    Defeated = "Defeated",
    Reset = "Reset",
    Stopped = "Stopped",
}

export class UltraEzrajal_LW {
    private static readonly logPrefix = "Ultra Ezrajal LW";
    private static readonly syncFileName = "UltraEzrajal_LW.sync";
    private static readonly mapName = "ultraezrajal";
    private static readonly safeCell = "Enter";
    private static readonly safePad = "Spawn";
    private static readonly bossCell = "r2";
    private static readonly bossPad = "Left";
    private static readonly battlestaffName = "Battle Oracle Battlestaff";
    private static readonly skillLockedAura = "Skill Locked";
    private static readonly counterAttackAura = "Counter Attack";
    private static readonly battlestaffShopId = 759;
    private static readonly ultraQuestId = 8152;
    private static readonly prerequisiteQuestId = 8151;
    private static readonly prerequisiteQuestName = "The Engineer";
    private static readonly minimumLevel = 61;
    private static readonly bossMapId = 1;
    private static readonly fightPollDelay = 150;
    private static readonly respawnPollDelay = 500;
    private static readonly manaLockSafeDelay = 2000;
    private static readonly maxFightAttempts = 3;

    private playerAlias: string = "";
    private armyComposition: ArmyComposition = null!;
    private privateRoomNumber: number = 0;
    private normalWeaponId: number = 0;
    private normalWeaponName: string = "";
    private runManaLockValue: boolean = false;
    private masterMode: boolean = false;
    private runResult: UltraRunResult = UltraRunResult.Failed;

    runFromMaster(): UltraRunResult {
        this.masterMode = true;
        this.runResult = UltraRunResult.Failed;
        bot.skills.stop();
        bot.ultraBossHelper.disableCounterAttack();
        bot.options.infiniteRange = true;

        try {
            this.run();
        } finally {
            bot.combat.stopAttacking = false;
            LoneWolf.stopSkillEngine();
            this.masterMode = false;
        }

        return this.runResult;
    }

    run(): void {
        if (!this.validateOptions()) {
            return;
        }

        if (!LoneWolf.startArmySync(UltraEzrajal_LW.syncFileName, 4, this.masterMode ? "Setup" : null)) {
            return;
        }

        if (
            !LoneWolf.validateUltraAccess(
                UltraEzrajal_LW.ultraQuestId,
                UltraEzrajal_LW.prerequisiteQuestId,
                UltraEzrajal_LW.prerequisiteQuestName,
                UltraEzrajal_LW.minimumLevel,
                UltraEzrajal_LW.logPrefix,
                this.getClassPreset().className,
            )
        ) {
            return;
        }

        this.playerAlias = this.getPlayerAlias();
        const preset = this.getClassPreset();

        Core.logger(
            `${UltraEzrajal_LW.logPrefix} started as ${this.playerAlias} using ${this.armyComposition} composition.`,
        );

        LoneWolf.acceptUltraQuest(UltraEzrajal_LW.ultraQuestId);

        if (!this.prepare(preset) || !this.sync("SETUP_DONE")) {
            return;
        }

        if (!this.runFightAttempts(preset) || !this.sync("BOSS_DEFEATED")) {
            return;
        }

        Core.jump(UltraEzrajal_LW.safeCell, UltraEzrajal_LW.safePad);

        LoneWolf.completeUltraQuest(UltraEzrajal_LW.ultraQuestId);

        if (bot.shouldExit || !this.sync("FINISH")) {
            return;
        }

        this.stopArmy();
        this.runResult = UltraRunResult.Completed;
    }

    private runFightAttempts(preset: ClassPreset): boolean {
        for (
            let fightAttempt = 1;
            fightAttempt <= UltraEzrajal_LW.maxFightAttempts && !bot.shouldExit;
            fightAttempt++
        ) {
            Core.join(
                `${UltraEzrajal_LW.mapName}-${this.privateRoomNumber}`,
                UltraEzrajal_LW.safeCell,
                UltraEzrajal_LW.safePad,
            );

            if (this.getSetupOption("UsePotions")) {
                LoneWolf.usePotions(preset.tonic, preset.elixir);
            }

            if (!this.equipManaLockWeapon() || !this.runManaLock()) {
                return false;
            }

            if (!this.prepareSafeRoom(preset) || !this.sync("FIGHT_READY")) {
                return false;
            }

            Core.jump(UltraEzrajal_LW.bossCell, UltraEzrajal_LW.bossPad);

            if (bot.shouldExit || !this.sync("START_FIGHT")) {
                return false;
            }

            const result = this.fight(preset, fightAttempt);
            if (result === FightResult.Defeated) {
                return true;
            }

            if (result !== FightResult.Reset || !this.handleFightReset(fightAttempt)) {
                return false;
            }

            if (fightAttempt >= UltraEzrajal_LW.maxFightAttempts) {
                this.stopArmyAfterFailedAttempts();
                this.runResult = UltraRunResult.AttemptsExhausted;
                return false;
            }
        }

        return false;
    }

    private validateOptions(): boolean {
        this.armyComposition = this.getUltraOption("UltraEzrajalComposition", "ArmyComposition");
        this.privateRoomNumber = this.getSetupOption("PrivateRoomNumber");
        return LoneWolf.validatePrivateRoomNumber(this.privateRoomNumber);
    }

    private prepare(preset: ClassPreset): boolean {
        Core.logger(`${UltraEzrajal_LW.logPrefix} ${this.playerAlias} starting setup.`);

        LoneWolf.equipClass(preset);
        if (bot.shouldExit) {
            return false;
        }

        if (this.getSetupOption("UseEnhancements")) {
            LoneWolf.prepareEnhancements(
                preset.baseEnhancement,
                preset.capeEnhancement,
                preset.helmEnhancement,
                preset.weaponEnhancement,
                undefined,
                preset.weaponEnhancementFallbacks,
            );
        }

        if (this.getSetupOption("UsePotions")) {
            LoneWolf.preparePotions(preset.tonic, preset.elixir, preset.combatPotion);
        }

        if (!this.prepareManaLockWeapon(preset) || bot.shouldExit) {
            return false;
        }

        Core.logger(`${UltraEzrajal_LW.logPrefix} ${this.playerAlias} finished setup.`);
        return true;
    }

    private prepareManaLockWeapon(preset: ClassPreset): boolean {
        this.runManaLockValue = false;

        if (this.getUltraOption("UltraEzrajalSkipManaLock", "SkipManaLock")) {
            Core.logger(`${UltraEzrajal_LW.logPrefix} ${this.playerAlias} skipped Mana Lock preparation.`);
            return true;
        }

        const normalWeapon =
            bot.inventory.items.find(
                (item) => item.equipped && item.equipSlot?.toLowerCase() === "Weapon"?.toLowerCase(),
            ) ?? null;

        if (normalWeapon == null) {
            Core.logger("The currently equipped weapon could not be recorded.", "PrepareManaLock", {
                messageBox: true,
                stopBot: true,
            });
            return false;
        }

        this.normalWeaponId = normalWeapon.id;
        this.normalWeaponName = normalWeapon.name;

        if (this.normalWeaponName?.toLowerCase() === UltraEzrajal_LW.battlestaffName?.toLowerCase()) {
            Core.logger(
                `${UltraEzrajal_LW.battlestaffName} is the normal combat weapon. Mana Vamp would overwrite its enhancement.`,
                "PrepareManaLock",
                { messageBox: true, stopBot: true },
            );
            return false;
        }

        if (!this.ensureBattlestaffInInventory()) {
            return !bot.shouldExit;
        }

        Advanced.enhanceItem(UltraEzrajal_LW.battlestaffName, preset.baseEnhancement, {
            wSpecial: WeaponSpecial.Mana_Vamp,
        });

        const battlestaff =
            bot.inventory.items.find(
                (item) => item.name?.toLowerCase() === UltraEzrajal_LW.battlestaffName?.toLowerCase(),
            ) ?? null;

        if (battlestaff == null || battlestaff.procId !== WeaponSpecial.Mana_Vamp) {
            Core.logger(
                `${UltraEzrajal_LW.battlestaffName} skipped because Mana Vamp was not verified.`,
                "PrepareManaLock",
            );
            return true;
        }

        Core.equip(battlestaff.id);

        if (!bot.inventory.isEquipped(battlestaff.id)) {
            Core.logger(
                `${UltraEzrajal_LW.battlestaffName} could not be equipped. Mana Lock was skipped.`,
                "PrepareManaLock",
            );
            return true;
        }

        this.runManaLockValue = true;
        Core.logger(`${UltraEzrajal_LW.battlestaffName} prepared with Mana Vamp.`, "PrepareManaLock");
        return true;
    }

    private ensureBattlestaffInInventory(): boolean {
        if (bot.inventory.contains(UltraEzrajal_LW.battlestaffName)) {
            return true;
        }

        if (bot.flash.get<string>("ui.mcPopup.currentLabel") !== "Bank") {
            bot.bank.open();
        }

        bot.bank.load(false);
        bot.wait.forTrue(() => bot.bank.contains(UltraEzrajal_LW.battlestaffName), 20);

        if (bot.bank.contains(UltraEzrajal_LW.battlestaffName)) {
            // TEMPORARY Game4000 inventory change. Remove after the client inventory fix.
            if (Core.inventoryBagFreeSlots <= 0) {
                Core.logger(
                    `${UltraEzrajal_LW.battlestaffName} is banked but no inventory slot is available. Mana Lock was skipped.`,
                    "PrepareManaLock",
                );
                return false;
            }

            bot.bank.ensureToInventory(UltraEzrajal_LW.battlestaffName);
            bot.wait.forTrue(() => bot.inventory.contains(UltraEzrajal_LW.battlestaffName), 14);

            if (!bot.inventory.contains(UltraEzrajal_LW.battlestaffName)) {
                Core.logger(
                    `${UltraEzrajal_LW.battlestaffName} could not be moved from bank. Mana Lock was skipped.`,
                    "PrepareManaLock",
                );
                return false;
            }

            Core.logger(`${UltraEzrajal_LW.battlestaffName} moved from bank.`, "PrepareManaLock");
            return true;
        }

        // TEMPORARY Game4000 inventory change. Remove after the client inventory fix.
        if (Core.inventoryBagFreeSlots <= 0) {
            Core.logger(
                `${UltraEzrajal_LW.battlestaffName} could not be purchased because no inventory slot is available. Mana Lock was skipped.`,
                "PrepareManaLock",
            );
            return false;
        }

        Core.buyItem(UltraEzrajal_LW.mapName, UltraEzrajal_LW.battlestaffShopId, UltraEzrajal_LW.battlestaffName);

        if (bot.inventory.contains(UltraEzrajal_LW.battlestaffName)) {
            Core.logger(`${UltraEzrajal_LW.battlestaffName} purchased.`, "PrepareManaLock");
            return true;
        }

        Core.logger(
            `${UltraEzrajal_LW.battlestaffName} could not be purchased from shop ${UltraEzrajal_LW.battlestaffShopId}.`,
            "PrepareManaLock",
            { messageBox: true, stopBot: true },
        );
        return false;
    }

    private runManaLock(): boolean {
        if (!this.runManaLockValue) {
            return !bot.shouldExit;
        }

        Core.jump(UltraEzrajal_LW.bossCell, UltraEzrajal_LW.bossPad);
        Core.logger(`${UltraEzrajal_LW.logPrefix} ${this.playerAlias} started Mana Lock preparation.`);

        while (!bot.shouldExit && !bot.self.hasActiveAura(UltraEzrajal_LW.skillLockedAura)) {
            if (!LoneWolf.isMonsterAlive(UltraEzrajal_LW.bossMapId)) {
                Core.logger(
                    `${UltraEzrajal_LW.logPrefix} ${this.playerAlias} did not receive ${UltraEzrajal_LW.skillLockedAura} before Ultra Ezrajal died.`,
                );
                bot.combat.cancelAutoAttack();
                bot.combat.cancelTarget();
                Core.jump(UltraEzrajal_LW.safeCell, UltraEzrajal_LW.safePad);
                return this.restoreNormalWeapon();
            }

            if (!bot.player.alive) {
                Core.logger(`${UltraEzrajal_LW.logPrefix} ${this.playerAlias} died during Mana Lock preparation.`);

                while (!bot.shouldExit && !bot.player.alive) {
                    bot.sleep(UltraEzrajal_LW.respawnPollDelay);
                }

                if (bot.shouldExit) {
                    return false;
                }

                Core.jump(UltraEzrajal_LW.bossCell, UltraEzrajal_LW.bossPad);
                continue;
            }

            bot.combat.attack(UltraEzrajal_LW.bossMapId);
            bot.sleep(UltraEzrajal_LW.fightPollDelay);
        }

        if (bot.shouldExit) {
            return false;
        }

        bot.combat.cancelAutoAttack();
        bot.combat.cancelTarget();
        Core.jump(UltraEzrajal_LW.safeCell, UltraEzrajal_LW.safePad);
        bot.sleep(UltraEzrajal_LW.manaLockSafeDelay);

        if (!this.restoreNormalWeapon()) {
            return false;
        }

        Core.logger(`${UltraEzrajal_LW.logPrefix} ${this.playerAlias} confirmed ${UltraEzrajal_LW.skillLockedAura}.`);
        return true;
    }

    private equipManaLockWeapon(): boolean {
        if (!this.runManaLockValue) {
            return !bot.shouldExit;
        }

        const battlestaff =
            bot.inventory.items.find(
                (item) =>
                    item.name?.toLowerCase() === UltraEzrajal_LW.battlestaffName?.toLowerCase() &&
                    item.procId === WeaponSpecial.Mana_Vamp,
            ) ?? null;

        if (battlestaff == null) {
            Core.logger(
                `${UltraEzrajal_LW.battlestaffName} with Mana Vamp is missing before Mana Lock.`,
                "RunManaLock",
                { messageBox: true, stopBot: true },
            );
            return false;
        }

        if (!battlestaff.equipped) {
            Core.equip(battlestaff.id);
        }

        if (bot.inventory.isEquipped(battlestaff.id)) {
            return true;
        }

        Core.logger(`${UltraEzrajal_LW.battlestaffName} could not be equipped before Mana Lock.`, "RunManaLock", {
            messageBox: true,
            stopBot: true,
        });
        return false;
    }

    private restoreNormalWeapon(): boolean {
        Core.equip(this.normalWeaponId);

        if (bot.inventory.isEquipped(this.normalWeaponId)) {
            Core.logger(`${this.normalWeaponName} restored.`, "RunManaLock");
            return true;
        }

        Core.logger(`${this.normalWeaponName} could not be restored after Mana Lock.`, "RunManaLock", {
            messageBox: true,
            stopBot: true,
        });
        return false;
    }

    private prepareSafeRoom(preset: ClassPreset): boolean {
        if (this.getSetupOption("UsePotions")) {
            LoneWolf.usePotions(preset.tonic, preset.elixir, preset.combatPotion);
        }

        LoneWolf.genericPrebuff();
        return !bot.shouldExit;
    }

    private fight(preset: ClassPreset, fightAttempt: number): FightResult {
        const useSimpleVdkEngine =
            this.armyComposition === ArmyComposition.Reliable &&
            LoneWolf.isArmyPlayer(1) &&
            this.getUltraOption("UltraEzrajalSkipManaLock", "SkipManaLock");

        LoneWolf.startSkillEngine(
            preset.skills,
            this.playerAlias,
            false,
            UltraEzrajal_LW.logPrefix,
            useSimpleVdkEngine ? SkillEngineMode.Simple : preset.skillMode,
        );
        Core.logger(`${UltraEzrajal_LW.logPrefix} ${this.playerAlias} started fighting.`);

        try {
            while (!bot.shouldExit) {
                if (!LoneWolf.isMonsterAlive(UltraEzrajal_LW.bossMapId)) {
                    break;
                }

                if (LoneWolf.shouldResetFight(fightAttempt)) {
                    return FightResult.Reset;
                }

                if (!bot.player.alive) {
                    bot.combat.stopAttacking = false;
                    Core.logger(`${UltraEzrajal_LW.logPrefix} ${this.playerAlias} died.`);

                    while (!bot.shouldExit && !bot.player.alive) {
                        if (LoneWolf.shouldResetFight(fightAttempt)) {
                            return FightResult.Reset;
                        }

                        bot.sleep(UltraEzrajal_LW.respawnPollDelay);
                    }

                    if (bot.shouldExit) {
                        break;
                    }

                    if (!LoneWolf.isMonsterAlive(UltraEzrajal_LW.bossMapId)) {
                        break;
                    }

                    if (LoneWolf.shouldResetFight(fightAttempt)) {
                        return FightResult.Reset;
                    }

                    Core.logger(`${UltraEzrajal_LW.logPrefix} ${this.playerAlias} respawned.`);

                    if (
                        LoneWolf.isMonsterAlive(UltraEzrajal_LW.bossMapId) &&
                        (bot.player.cell !== UltraEzrajal_LW.bossCell || bot.player.pad !== UltraEzrajal_LW.bossPad)
                    ) {
                        Core.jump(UltraEzrajal_LW.bossCell, UltraEzrajal_LW.bossPad);
                    }

                    continue;
                }

                LoneWolf.maintainTarget(UltraEzrajal_LW.bossMapId);

                if (this.handleCounterAttack(fightAttempt)) {
                    continue;
                }

                bot.sleep(UltraEzrajal_LW.fightPollDelay);
            }
        } finally {
            bot.combat.stopAttacking = false;
            LoneWolf.stopSkillEngine();
        }

        if (bot.shouldExit) {
            return FightResult.Stopped;
        }

        Core.logger(`${UltraEzrajal_LW.logPrefix} ${this.playerAlias} confirmed Ultra Ezrajal defeated.`);
        return FightResult.Defeated;
    }

    private handleCounterAttack(fightAttempt: number): boolean {
        if (
            !bot.player.hasTarget ||
            bot.player.target?.mapId !== UltraEzrajal_LW.bossMapId ||
            !bot.target.hasActiveAura(UltraEzrajal_LW.counterAttackAura)
        ) {
            return false;
        }

        bot.combat.stopAttacking = true;
        bot.combat.cancelAutoAttack();
        Core.logger(
            `${UltraEzrajal_LW.logPrefix} ${this.playerAlias} paused for ${UltraEzrajal_LW.counterAttackAura}.`,
        );
        let resetRequested = false;

        while (
            !bot.shouldExit &&
            bot.player.alive &&
            LoneWolf.isMonsterAlive(UltraEzrajal_LW.bossMapId) &&
            bot.player.hasTarget &&
            bot.player.target?.mapId === UltraEzrajal_LW.bossMapId &&
            bot.target.hasActiveAura(UltraEzrajal_LW.counterAttackAura)
        ) {
            if (LoneWolf.shouldResetFight(fightAttempt)) {
                resetRequested = true;
                LoneWolf.stopSkillEngine();
                break;
            }

            bot.sleep(UltraEzrajal_LW.fightPollDelay);
        }

        bot.combat.stopAttacking = false;

        if (
            !resetRequested &&
            !bot.shouldExit &&
            bot.player.alive &&
            LoneWolf.isMonsterAlive(UltraEzrajal_LW.bossMapId)
        ) {
            bot.combat.attack(UltraEzrajal_LW.bossMapId);
            Core.logger(
                `${UltraEzrajal_LW.logPrefix} ${this.playerAlias} resumed after ${UltraEzrajal_LW.counterAttackAura}.`,
            );
        }

        return true;
    }

    private handleFightReset(fightAttempt: number): boolean {
        bot.combat.stopAttacking = false;
        LoneWolf.stopSkillEngine();
        bot.combat.cancelTarget();

        while (!bot.shouldExit && !bot.player.alive) {
            LoneWolf.shouldResetFight(fightAttempt);
            bot.sleep(UltraEzrajal_LW.respawnPollDelay);
        }

        if (bot.shouldExit) {
            return false;
        }

        LoneWolf.shouldResetFight(fightAttempt);
        Core.jump(UltraEzrajal_LW.safeCell, UltraEzrajal_LW.safePad);

        if (!this.isInSafeRoom()) {
            Core.logger(
                `${UltraEzrajal_LW.logPrefix} ${this.playerAlias} could not reach the safe room after reset.`,
                "HandleFightReset",
                { messageBox: true, stopBot: true },
            );
            return false;
        }

        return this.sync(`FIGHT_RESET_${fightAttempt}_SAFE`);
    }

    private stopArmyAfterFailedAttempts(): void {
        if (this.masterMode) {
            if (LoneWolf.isArmyPlayer(1)) {
                LoneWolf.stopArmySync("ATTEMPTS_EXHAUSTED");
            } else {
                LoneWolf.syncArmy("STOP_CHECK");
            }

            Core.logger(
                `${UltraEzrajal_LW.logPrefix} failed after ${UltraEzrajal_LW.maxFightAttempts} fight attempts.`,
                "RunFightAttempts",
            );
            return;
        }

        if (LoneWolf.isArmyPlayer(1)) {
            LoneWolf.stopArmySync("ATTEMPTS_EXHAUSTED");
        } else {
            LoneWolf.syncArmy("STOP_CHECK");
        }

        Core.logger(
            `${UltraEzrajal_LW.logPrefix} failed after ${UltraEzrajal_LW.maxFightAttempts} fight attempts.`,
            "RunFightAttempts",
            { messageBox: true, stopBot: true },
        );
    }

    private isInSafeRoom(): boolean {
        return bot.player.cell?.toLowerCase() === UltraEzrajal_LW.safeCell?.toLowerCase();
    }

    private getSetupOption<T extends string | number | boolean>(optionName: string): T {
        return (this.masterMode ? bot.config!.get<T>("Setup", optionName) : bot.config!.get<T>(optionName))!;
    }

    private getUltraOption<T extends string | number | boolean>(
        masterOptionName: string,
        standaloneOptionName: string,
    ): T {
        return (
            this.masterMode
                ? bot.config!.get<T>("Daily_Ultras", masterOptionName)
                : bot.config!.get<T>(standaloneOptionName)
        )!;
    }

    private getClassPreset(): ClassPreset {
        if (LoneWolf.isArmyPlayer(1) && this.armyComposition === ArmyComposition.Abyssal) {
            const kathool = LoneWolf.kathoolAdept(true);
            kathool.helmEnhancement = HelmSpecial.Forge;
            return kathool;
        }

        if (LoneWolf.isArmyPlayer(1)) {
            if (this.armyComposition === ArmyComposition.Stable) {
                const preset = LoneWolf.kingsEcho();
                preset.capeEnhancement = CapeSpecial.None;
                return preset;
            }

            if (this.armyComposition === ArmyComposition.Reliable) {
                return LoneWolf.verusDoomKnight();
            }

            if (this.armyComposition === ArmyComposition.Pay2Win) {
                return LoneWolf.guardian();
            }

            return LoneWolf.legionRevenant();
        }

        if (LoneWolf.isArmyPlayer(2)) {
            return this.armyComposition === ArmyComposition.Pay2Win ? LoneWolf.archPaladin() : LoneWolf.stoneCrusher();
        }

        if (LoneWolf.isArmyPlayer(3)) {
            return this.armyComposition === ArmyComposition.Pay2Win
                ? LoneWolf.legionRevenant()
                : LoneWolf.archPaladin();
        }

        return LoneWolf.lordOfOrder();
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

        return "playerFour";
    }

    private sync(step: string): boolean {
        Core.logger(`${UltraEzrajal_LW.logPrefix} ${this.playerAlias} entering ${step}.`);

        if (!LoneWolf.syncArmy(step)) {
            return false;
        }

        Core.logger(`${UltraEzrajal_LW.logPrefix} ${this.playerAlias} continued from ${step}.`);
        return true;
    }

    private stopArmy(): void {
        if (LoneWolf.isArmyPlayer(1)) {
            bot.sleep(2000);

            if (bot.shouldExit) {
                return;
            }

            if (LoneWolf.stopArmySync("COMPLETE")) {
                Core.logger(`${UltraEzrajal_LW.logPrefix} playerOne published COMPLETE.`);
            } else {
                Core.logger(`${UltraEzrajal_LW.logPrefix} playerOne could not publish COMPLETE.`);
            }

            return;
        }

        if (LoneWolf.syncArmy("STOP_CHECK")) {
            Core.logger(`${UltraEzrajal_LW.logPrefix} ${this.playerAlias} unexpectedly passed STOP_CHECK.`);
        } else {
            Core.logger(`${UltraEzrajal_LW.logPrefix} ${this.playerAlias} detected COMPLETE.`);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "UltraEzrajal_LW",
    [
        LoneWolf.player1,
        LoneWolf.player2,
        LoneWolf.player3,
        LoneWolf.player4,
        option.choice(
            "ArmyComposition",
            "Army Composition",
            "Default: LR / SC / AP / LOO\nStable: KE / SC / AP / LOO\nReliable: VDK / SC / AP / LOO\nPay2Win: Guardian / AP / LR / LOO\nAbyssal: Kathool Adept / SC / AP / LOO",
            choices(ArmyComposition),
            ArmyComposition.Default,
        ),
        option.int("PrivateRoomNumber", "Private Room Number", "Private room number from 1001 through 99999.", 0),
        option.bool("UsePotions", "Use Potions", "Prepare and use the assigned potion loadout.", true),
        option.bool("UseEnhancements", "Use Enhancements", "Prepare the assigned enhancement loadout.", true),
        option.bool(
            "SkipManaLock",
            "Skip Mana Lock?",
            "Skip the Battle Oracle Battlestaff Mana Lock preparation.",
            true,
        ),
    ],
    true,
);

export default function main(): void {
    const script = new UltraEzrajal_LW();
    bot.skills.stop();
    bot.ultraBossHelper.disableCounterAttack();
    bot.options.infiniteRange = true;
    LoneWolf.setAntiLag();
    bot.config?.configure();

    try {
        script.run();
    } finally {
        bot.combat.stopAttacking = false;
        LoneWolf.stopSkillEngine();
    }
}

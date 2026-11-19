/*
name: Kathool Depths LW
description: Five-to-seven-player CoreLoneWolf Army script for God of the Depths.
tags: ultra, kathool depths, god of the depths, seven-player, army, corelonewolf
*/
// Port of Extras/SevenPlayerUltras/KathoolDepths_LW.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { type Ref, ref } from "../../LWRef";
import { bot, choices, defineScriptOptions, option } from "turu";
import { HelmSpecial } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";
import { type ClassPreset, CoreLoneWolf } from "../../CoreLoneWolf";

const LoneWolf = new CoreLoneWolf();

export enum ArmyComposition {
    Default = "Default",
    Stable = "Stable",
}

export enum FightResult {
    Defeated = "Defeated",
    Reset = "Reset",
    Stopped = "Stopped",
}

export class KathoolDepths_LW {
    private static readonly logPrefix = "Kathool Depths LW";
    private static readonly syncFileName = "KathoolDepths_LW.sync";
    private static readonly mapName = "kathooldepths";
    private static readonly safeCell = "Enter";
    private static readonly safePad = "Spawn";
    private static readonly bossCell = "r2";
    private static readonly bossPad = "Left";
    private static readonly vigil = "Vigil";
    private static readonly packetCommand = "ct";
    private static readonly resistPacketText = "cannot resist";
    private static readonly ultraQuestId = 9350;
    private static readonly minimumLevel = 80;
    private static readonly vigilShopId = 2322;
    private static readonly vigilRestockThreshold = 100;
    private static readonly vigilMaxStack = 1000;
    private static readonly firstTargetMapId = 3;
    private static readonly secondTargetMapId = 1;
    private static readonly bossMapId = 2;
    private static readonly fightPollDelay = 100;
    private static readonly respawnPollDelay = 500;
    private static readonly maxFightAttempts = 3;
    private static readonly deathResetThreshold = 3;

    private playerAlias: string = "";
    private armyComposition: ArmyComposition = null!;
    private armyPlayerCount: number = 0;
    private privateRoomNumber: number = 0;

    static player6 = option.text("player6", "Player 6 (Optional)", "Player 6 (Optional) account name.", "");
    static player7 = option.text("player7", "Player 7 (Optional)", "Player 7 (Optional) account name.", "");

    run(): void {
        if (!this.validateOptions()) {
            return;
        }

        if (!LoneWolf.startArmySync(KathoolDepths_LW.syncFileName, this.armyPlayerCount)) {
            return;
        }

        const preset = this.getClassPreset();
        if (
            !LoneWolf.validateUltraAccess(
                KathoolDepths_LW.ultraQuestId,
                0,
                "",
                KathoolDepths_LW.minimumLevel,
                KathoolDepths_LW.logPrefix,
                preset.className,
            )
        ) {
            return;
        }

        this.playerAlias = this.getPlayerAlias();
        Core.logger(
            `${KathoolDepths_LW.logPrefix} started as ${this.playerAlias} using ${this.armyComposition} composition.`,
        );

        LoneWolf.acceptUltraQuest(KathoolDepths_LW.ultraQuestId);

        if (!this.prepare(preset) || !this.sync("SETUP_DONE")) {
            return;
        }

        if (!this.runFightAttempts(preset) || !this.sync("BOSS_DEFEATED")) {
            return;
        }

        Core.jump(KathoolDepths_LW.safeCell, KathoolDepths_LW.safePad);
        LoneWolf.completeUltraQuest(KathoolDepths_LW.ultraQuestId);

        if (bot.shouldExit || !this.sync("FINISH")) {
            return;
        }

        this.stopArmy();
    }

    private validateOptions(): boolean {
        this.armyComposition = bot.config!.get<ArmyComposition>("ArmyComposition");
        this.privateRoomNumber = bot.config.get<number>("PrivateRoomNumber");

        const playerSix = bot.config.get<string>("player6")?.trim() ?? "";
        const playerSeven = bot.config.get<string>("player7")?.trim() ?? "";
        if (!playerSix && !!playerSeven) {
            Core.logger("Player 6 is required when Player 7 is configured.", "ValidateOptions", { messageBox: true });
            return false;
        }

        this.armyPlayerCount = !!playerSeven ? 7 : !!playerSix ? 6 : 5;

        return LoneWolf.validatePrivateRoomNumber(this.privateRoomNumber);
    }

    private prepare(preset: ClassPreset): boolean {
        Core.logger(`${KathoolDepths_LW.logPrefix} ${this.playerAlias} starting setup.`);

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

        if (bot.shouldExit || !this.prepareVigil()) {
            return false;
        }

        Core.logger(`${KathoolDepths_LW.logPrefix} ${this.playerAlias} finished setup.`);
        return true;
    }

    private prepareVigil(): boolean {
        if (bot.flash.get<string>("ui.mcPopup.currentLabel") !== "Bank") {
            bot.bank.open();
        }

        bot.bank.load(false);
        bot.wait.forTrue(() => bot.bank.contains(KathoolDepths_LW.vigil), 20);

        if (bot.bank.contains(KathoolDepths_LW.vigil)) {
            if (!Core.hasSpaceFor(bot.bank.getItem(KathoolDepths_LW.vigil))) {
                return this.fatal("Vigil is banked but there is no inventory space to move it.", "PrepareVigil");
            }

            const quantityBefore = bot.inventory.getQuantity(KathoolDepths_LW.vigil);
            bot.bank.ensureToInventory(KathoolDepths_LW.vigil);
            bot.wait.forTrue(() => bot.inventory.getQuantity(KathoolDepths_LW.vigil) > quantityBefore, 14);

            if (!bot.inventory.contains(KathoolDepths_LW.vigil)) {
                return this.fatal("Vigil could not be moved from bank.", "PrepareVigil");
            }

            Core.logger("Vigil moved from bank.", "PrepareVigil");
        }

        Core.join(
            `${KathoolDepths_LW.mapName}-${this.privateRoomNumber}`,
            KathoolDepths_LW.safeCell,
            KathoolDepths_LW.safePad,
        );

        if (bot.inventory.getQuantity(KathoolDepths_LW.vigil) < KathoolDepths_LW.vigilRestockThreshold) {
            Core.buyItem(
                KathoolDepths_LW.mapName,
                KathoolDepths_LW.vigilShopId,
                KathoolDepths_LW.vigil,
                KathoolDepths_LW.vigilMaxStack,
            );
        }

        const quantity = bot.inventory.getQuantity(KathoolDepths_LW.vigil);
        if (quantity <= 0) {
            return this.fatal("Vigil could not be obtained. The fight cannot start.", "PrepareVigil");
        }

        if (quantity < KathoolDepths_LW.vigilRestockThreshold) {
            Core.logger(`Vigil preparation ended at ${quantity}. Continuing.`, "PrepareVigil");
        } else {
            Core.logger(`Vigil available at ${quantity}.`, "PrepareVigil");
        }

        return true;
    }

    private prepareSafeRoom(preset: ClassPreset): boolean {
        if (bot.config!.get<boolean>("UsePotions")) {
            LoneWolf.usePotions(preset.tonic, preset.elixir, preset.combatPotion);
        }

        if (!this.equipVigil()) {
            return false;
        }

        LoneWolf.genericPrebuff();
        return !bot.shouldExit;
    }

    private equipVigil(): boolean {
        if (!bot.inventory.contains(KathoolDepths_LW.vigil)) {
            return this.fatal("Vigil is not in inventory. The fight cannot start.", "EquipVigil");
        }

        if (!bot.inventory.isEquipped(KathoolDepths_LW.vigil)) {
            bot.inventory.equipUsableItem(KathoolDepths_LW.vigil);
            bot.wait.forItemEquip(KathoolDepths_LW.vigil);
        }

        if (!bot.inventory.isEquipped(KathoolDepths_LW.vigil)) {
            return this.fatal("Vigil could not be equipped. The fight cannot start.", "EquipVigil");
        }

        Core.logger("Vigil equipped.", "EquipVigil");
        return true;
    }

    private runFightAttempts(preset: ClassPreset): boolean {
        for (
            let fightAttempt = 1;
            fightAttempt <= KathoolDepths_LW.maxFightAttempts && !bot.shouldExit;
            fightAttempt++
        ) {
            Core.join(
                `${KathoolDepths_LW.mapName}-${this.privateRoomNumber}`,
                KathoolDepths_LW.safeCell,
                KathoolDepths_LW.safePad,
            );

            if (!this.prepareSafeRoom(preset)) {
                return false;
            }

            if (!LoneWolf.startPacketDetector(KathoolDepths_LW.packetCommand, KathoolDepths_LW.resistPacketText)) {
                return this.fatal("The Vigil packet detector could not be started.", "RunFightAttempts");
            }

            let result: FightResult;
            try {
                if (!this.sync("FIGHT_READY")) {
                    return false;
                }

                Core.jump(KathoolDepths_LW.bossCell, KathoolDepths_LW.bossPad);

                if (bot.shouldExit || !this.sync("START_FIGHT")) {
                    return false;
                }

                result = this.fight(preset, fightAttempt);
            } finally {
                LoneWolf.stopPacketDetector();
            }

            if (result === FightResult.Defeated) {
                return true;
            }

            if (result !== FightResult.Reset || !this.handleFightReset(fightAttempt)) {
                return false;
            }

            if (fightAttempt >= KathoolDepths_LW.maxFightAttempts) {
                this.stopArmyAfterFailedAttempts();
                return false;
            }
        }

        return false;
    }

    private fight(preset: ClassPreset, fightAttempt: number): FightResult {
        LoneWolf.startSkillEngine(preset.skills, this.playerAlias, false, KathoolDepths_LW.logPrefix, preset.skillMode);
        Core.logger(`${KathoolDepths_LW.logPrefix} ${this.playerAlias} started fighting attempt ${fightAttempt}.`);

        let bossObservedAlive = false;
        let nextResistDetection = 1;

        while (!bot.shouldExit) {
            if (LoneWolf.shouldResetFight(fightAttempt, KathoolDepths_LW.deathResetThreshold)) {
                this.stopFightCombat();
                return FightResult.Reset;
            }

            if (!bot.player.alive) {
                Core.logger(`${KathoolDepths_LW.logPrefix} ${this.playerAlias} died.`);

                while (!bot.shouldExit && !bot.player.alive) {
                    this.processResistDetections(
                        ref(
                            () => nextResistDetection,
                            (v) => (nextResistDetection = v),
                        ),
                        false,
                    );

                    if (LoneWolf.shouldResetFight(fightAttempt, KathoolDepths_LW.deathResetThreshold)) {
                        this.stopFightCombat();
                        return FightResult.Reset;
                    }

                    bot.sleep(KathoolDepths_LW.respawnPollDelay);
                }

                if (bot.shouldExit) {
                    break;
                }

                if (LoneWolf.shouldResetFight(fightAttempt, KathoolDepths_LW.deathResetThreshold)) {
                    this.stopFightCombat();
                    return FightResult.Reset;
                }

                Core.logger(`${KathoolDepths_LW.logPrefix} ${this.playerAlias} respawned.`);

                if (bot.player.cell !== KathoolDepths_LW.bossCell || bot.player.pad !== KathoolDepths_LW.bossPad) {
                    Core.jump(KathoolDepths_LW.bossCell, KathoolDepths_LW.bossPad);
                }

                continue;
            }

            const bossAlive = LoneWolf.isMonsterAlive(KathoolDepths_LW.bossMapId);
            if (bossAlive) {
                bossObservedAlive = true;
            } else if (bossObservedAlive) {
                break;
            }

            const targetMapId = this.getCurrentTargetMapId();
            if (targetMapId > 0) {
                LoneWolf.maintainTarget(targetMapId);
            }

            this.processResistDetections(
                ref(
                    () => nextResistDetection,
                    (v) => (nextResistDetection = v),
                ),
                true,
            );
            bot.sleep(KathoolDepths_LW.fightPollDelay);
        }

        this.stopFightCombat();

        if (bot.shouldExit || !bossObservedAlive) {
            return FightResult.Stopped;
        }

        Core.logger(`${KathoolDepths_LW.logPrefix} ${this.playerAlias} confirmed God of the Depths defeated.`);
        return FightResult.Defeated;
    }

    private getCurrentTargetMapId(): number {
        const focusBoss =
            this.armyComposition === ArmyComposition.Stable
                ? LoneWolf.isArmyPlayer(1) ||
                  LoneWolf.isArmyPlayer(2) ||
                  LoneWolf.isArmyPlayer(5) ||
                  LoneWolf.isArmyPlayer(6)
                : LoneWolf.isArmyPlayer(2) ||
                  LoneWolf.isArmyPlayer(5) ||
                  LoneWolf.isArmyPlayer(6) ||
                  LoneWolf.isArmyPlayer(7);

        if (focusBoss) {
            return LoneWolf.isMonsterAlive(KathoolDepths_LW.bossMapId) ? KathoolDepths_LW.bossMapId : 0;
        }

        if (LoneWolf.isMonsterAlive(KathoolDepths_LW.firstTargetMapId)) {
            return KathoolDepths_LW.firstTargetMapId;
        }

        if (LoneWolf.isMonsterAlive(KathoolDepths_LW.secondTargetMapId)) {
            return KathoolDepths_LW.secondTargetMapId;
        }

        return LoneWolf.isMonsterAlive(KathoolDepths_LW.bossMapId) ? KathoolDepths_LW.bossMapId : 0;
    }

    private processResistDetections(nextResistDetection: Ref<number>, requestVigil: boolean): void {
        while (LoneWolf.hasPacketDetection(nextResistDetection.value)) {
            if (requestVigil) {
                LoneWolf.requestAbsolutePrioritySkill(5);
                Core.logger(
                    `${KathoolDepths_LW.logPrefix} ${this.playerAlias} requested Vigil for resist detection ${nextResistDetection.value}.`,
                );
            }

            nextResistDetection.value++;
        }
    }

    private handleFightReset(fightAttempt: number): boolean {
        LoneWolf.stopSkillEngine();
        bot.combat.cancelTarget();

        while (!bot.shouldExit && !bot.player.alive) {
            LoneWolf.shouldResetFight(fightAttempt, KathoolDepths_LW.deathResetThreshold);
            bot.sleep(KathoolDepths_LW.respawnPollDelay);
        }

        if (bot.shouldExit) {
            return false;
        }

        LoneWolf.shouldResetFight(fightAttempt, KathoolDepths_LW.deathResetThreshold);
        Core.jump(KathoolDepths_LW.safeCell, KathoolDepths_LW.safePad);

        if (!this.isInSafeRoom()) {
            return this.fatal(
                `${KathoolDepths_LW.logPrefix} ${this.playerAlias} could not reach the safe room after reset.`,
                "HandleFightReset",
            );
        }

        return this.sync(`FIGHT_RESET_${fightAttempt}_SAFE`);
    }

    private stopFightCombat(): void {
        LoneWolf.stopSkillEngine();
        bot.combat.cancelTarget();
    }

    private getClassPreset(): ClassPreset {
        if (LoneWolf.isArmyPlayer(1)) {
            return this.armyComposition === ArmyComposition.Stable ? LoneWolf.kingsEcho() : LoneWolf.legionRevenant();
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
            return LoneWolf.verusDoomKnight();
        }

        if (LoneWolf.isArmyPlayer(6)) {
            return LoneWolf.bard();
        }

        if (this.armyComposition === ArmyComposition.Stable) {
            return LoneWolf.archFiend();
        }

        const shaman = LoneWolf.shaman();
        shaman.helmEnhancement = HelmSpecial.Examen;
        return shaman;
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

    private isInSafeRoom(): boolean {
        return bot.player.cell?.toLowerCase() === KathoolDepths_LW.safeCell?.toLowerCase();
    }

    private sync(step: string): boolean {
        Core.logger(`${KathoolDepths_LW.logPrefix} ${this.playerAlias} entering ${step}.`);

        if (!LoneWolf.syncArmy(step)) {
            return false;
        }

        Core.logger(`${KathoolDepths_LW.logPrefix} ${this.playerAlias} continued from ${step}.`);
        return true;
    }

    private fatal(message: string, caller: string): boolean {
        Core.logger(message, caller, { messageBox: true, stopBot: true });
        return false;
    }

    private stopArmyAfterFailedAttempts(): void {
        if (LoneWolf.isArmyPlayer(1)) {
            LoneWolf.stopArmySync("ATTEMPTS_EXHAUSTED");
        } else {
            LoneWolf.syncArmy("STOP_CHECK");
        }

        Core.logger(
            `${KathoolDepths_LW.logPrefix} failed after ${KathoolDepths_LW.maxFightAttempts} fight attempts.`,
            "RunFightAttempts",
            { messageBox: true, stopBot: true },
        );
    }

    private stopArmy(): void {
        if (LoneWolf.isArmyPlayer(1)) {
            bot.sleep(2000);

            if (bot.shouldExit) {
                return;
            }

            if (LoneWolf.stopArmySync("COMPLETE")) {
                Core.logger(`${KathoolDepths_LW.logPrefix} playerOne published COMPLETE.`);
            } else {
                Core.logger(`${KathoolDepths_LW.logPrefix} playerOne could not publish COMPLETE.`);
            }

            return;
        }

        if (LoneWolf.syncArmy("STOP_CHECK")) {
            Core.logger(`${KathoolDepths_LW.logPrefix} ${this.playerAlias} unexpectedly passed STOP_CHECK.`);
        } else {
            Core.logger(`${KathoolDepths_LW.logPrefix} ${this.playerAlias} detected COMPLETE.`);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "KathoolDepths_LW",
    [
        LoneWolf.player1,
        LoneWolf.player2,
        LoneWolf.player3,
        LoneWolf.player4,
        LoneWolf.player5,
        KathoolDepths_LW.player6,
        KathoolDepths_LW.player7,
        option.choice(
            "ArmyComposition",
            "Army Composition",
            "Default: LR / SC / AP / LOO / VDK / Bard / Shaman\n" + "Stable: KE / SC / AP / LOO / VDK / Bard / AF",
            choices(ArmyComposition),
            ArmyComposition.Default,
        ),
        option.int("PrivateRoomNumber", "Private Room Number", "Private room number from 1001 through 99999.", 0),
        option.bool(
            "UsePotions",
            "Use Potions",
            "Prepare and use the assigned tonic and elixir. Vigil is always required.",
            true,
        ),
        option.bool("UseEnhancements", "Use Enhancements", "Prepare the assigned enhancement loadout.", true),
    ],
    true,
);

export default function main(): void {
    const script = new KathoolDepths_LW();
    bot.skills.stop();
    bot.options.infiniteRange = true;
    LoneWolf.setAntiLag();
    bot.config?.configure();

    try {
        script.run();
    } finally {
        LoneWolf.stopPacketDetector();
        LoneWolf.stopSkillEngine();
    }
}

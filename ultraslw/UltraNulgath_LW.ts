/*
name: Ultra Nulgath LW
description: Four-player CoreLoneWolf Army script for Ultra Nulgath.
tags: ultra, nulgath, weekly, army, corelonewolf
*/
// Port of UltraNulgath_LW.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { type Ref, ref } from "./LWRef";
import { bot, choices, defineScriptOptions, option } from "turu";
import { Core } from "../core/CoreBots";
import { type ClassPreset, CoreLoneWolf, UltraRunResult } from "./CoreLoneWolf";

const LoneWolf = new CoreLoneWolf();

export enum ArmyComposition {
    Default = "Default",
    Stable = "Stable",
    Reliable = "Reliable",
    Optimized = "Optimized",
    Pay2Win = "Pay2Win",
    Fast = "Fast",
}

export enum FightResult {
    Defeated = "Defeated",
    Reset = "Reset",
    Stopped = "Stopped",
}

export class UltraNulgath_LW {
    private static readonly logPrefix = "Ultra Nulgath LW";
    private static readonly syncFileName = "UltraNulgath_LW.sync";
    private static readonly mapName = "ultranulgath";
    private static readonly safeCell = "Enter";
    private static readonly safePad = "Spawn";
    private static readonly bossCell = "Boss";
    private static readonly bossPad = "Right";
    private static readonly enrageScroll = "Scroll of Enrage";
    private static readonly packetCommand = "ct";
    private static readonly abyssPacketText = "Abyss!";
    private static readonly ultraQuestId = 8692;
    private static readonly prerequisiteQuestId = 0;
    private static readonly prerequisiteQuestName = "";
    private static readonly minimumLevel = 80;
    private static readonly bladeMapId = 1;
    private static readonly nulgathMapId = 2;
    private static readonly bladeHealthThreshold = 750000;
    private static readonly taunterOneTauntDelay = 5000;
    private static readonly playerFourTauntDelay = 2000;
    private static readonly fightPollDelay = 150;
    private static readonly respawnPollDelay = 500;
    private static readonly maxFightAttempts = 3;

    private playerAlias: string = "";
    private armyComposition: ArmyComposition = null!;
    private masterMode: boolean = false;
    private runResult: UltraRunResult = UltraRunResult.Failed;
    private isTaunter: boolean = false;
    private isTaunterOne: boolean = false;
    private privateRoomNumber: number = 0;

    runFromMaster(): UltraRunResult {
        this.masterMode = true;
        this.runResult = UltraRunResult.Failed;
        bot.skills.stop();
        bot.options.infiniteRange = true;

        try {
            this.run();
        } finally {
            LoneWolf.stopPacketDetector();
            LoneWolf.stopSkillEngine();
            this.masterMode = false;
        }

        return this.runResult;
    }

    run(): void {
        if (!this.validateOptions()) {
            return;
        }

        if (!LoneWolf.startArmySync(UltraNulgath_LW.syncFileName, 4, this.masterMode ? "Setup" : null)) {
            return;
        }

        if (
            !LoneWolf.validateUltraAccess(
                UltraNulgath_LW.ultraQuestId,
                UltraNulgath_LW.prerequisiteQuestId,
                UltraNulgath_LW.prerequisiteQuestName,
                UltraNulgath_LW.minimumLevel,
                UltraNulgath_LW.logPrefix,
                this.getClassPreset().className,
            )
        ) {
            return;
        }

        this.playerAlias = this.getPlayerAlias();
        this.isTaunterOne =
            this.armyComposition === ArmyComposition.Default ? LoneWolf.isArmyPlayer(1) : LoneWolf.isArmyPlayer(3);
        this.isTaunter = this.isTaunterOne || LoneWolf.isArmyPlayer(4);

        const preset = this.getClassPreset();
        if (this.isTaunter) {
            preset.combatPotion = null;
        }

        Core.logger(
            `${UltraNulgath_LW.logPrefix} started as ${this.playerAlias} using ${this.armyComposition} composition.`,
        );

        LoneWolf.acceptUltraQuest(UltraNulgath_LW.ultraQuestId);

        if (!this.prepare(preset) || !this.sync("SETUP_DONE")) {
            return;
        }

        if (!this.runFightAttempts(preset) || !this.sync("BOSS_DEFEATED")) {
            return;
        }

        Core.jump(UltraNulgath_LW.safeCell, UltraNulgath_LW.safePad);
        LoneWolf.completeUltraQuest(UltraNulgath_LW.ultraQuestId);

        if (bot.shouldExit || !this.sync("FINISH")) {
            return;
        }

        this.stopArmy();
        this.runResult = UltraRunResult.Completed;
    }

    private runFightAttempts(preset: ClassPreset): boolean {
        for (
            let fightAttempt = 1;
            fightAttempt <= UltraNulgath_LW.maxFightAttempts && !bot.shouldExit;
            fightAttempt++
        ) {
            Core.join(
                `${UltraNulgath_LW.mapName}-${this.privateRoomNumber}`,
                UltraNulgath_LW.safeCell,
                UltraNulgath_LW.safePad,
            );

            if (!this.prepareSafeRoom(preset)) {
                return false;
            }

            if (
                LoneWolf.isArmyPlayer(4) &&
                !LoneWolf.startPacketDetector(UltraNulgath_LW.packetCommand, UltraNulgath_LW.abyssPacketText)
            ) {
                Core.logger("The Abyss packet detector could not be started.", "RunFightAttempts", {
                    messageBox: true,
                    stopBot: true,
                });
                return false;
            }

            if (!this.sync("FIGHT_READY")) {
                return false;
            }

            Core.jump(UltraNulgath_LW.bossCell, UltraNulgath_LW.bossPad);

            if (bot.shouldExit || !this.sync("START_FIGHT")) {
                return false;
            }

            const result = this.fight(preset, fightAttempt);
            LoneWolf.stopPacketDetector();

            if (result === FightResult.Defeated) {
                return true;
            }

            if (result !== FightResult.Reset || !this.handleFightReset(fightAttempt)) {
                return false;
            }

            if (fightAttempt >= UltraNulgath_LW.maxFightAttempts) {
                this.stopArmyAfterFailedAttempts();
                this.runResult = UltraRunResult.AttemptsExhausted;
                return false;
            }
        }

        return false;
    }

    private validateOptions(): boolean {
        this.armyComposition = this.getUltraOption("UltraNulgathComposition", "ArmyComposition");
        this.privateRoomNumber = this.getSetupOption("PrivateRoomNumber");
        return LoneWolf.validatePrivateRoomNumber(this.privateRoomNumber);
    }

    private prepare(preset: ClassPreset): boolean {
        Core.logger(`${UltraNulgath_LW.logPrefix} ${this.playerAlias} starting setup.`);

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

        if (this.isTaunter) {
            LoneWolf.prepareScrolls(UltraNulgath_LW.enrageScroll);
        }

        if (bot.shouldExit) {
            return false;
        }

        Core.logger(`${UltraNulgath_LW.logPrefix} ${this.playerAlias} finished setup.`);
        return true;
    }

    private prepareSafeRoom(preset: ClassPreset): boolean {
        if (this.getSetupOption("UsePotions")) {
            LoneWolf.usePotions(preset.tonic, preset.elixir, preset.combatPotion);
        }

        if (this.isTaunter) {
            LoneWolf.equipScroll(UltraNulgath_LW.enrageScroll);
        }

        LoneWolf.genericPrebuff();
        return !bot.shouldExit;
    }

    private fight(preset: ClassPreset, fightAttempt: number): FightResult {
        LoneWolf.startSkillEngine(
            preset.skills,
            this.playerAlias,
            this.isTaunter,
            UltraNulgath_LW.logPrefix,
            preset.skillMode,
            undefined,
            !this.isTaunter && this.getSetupOption("UsePotions") ? preset.combatPotion : null,
        );
        Core.logger(`${UltraNulgath_LW.logPrefix} ${this.playerAlias} started fighting.`);

        const playerFour = LoneWolf.isArmyPlayer(4);
        let tauntScheduled = this.isTaunterOne;
        let openingTaunt = this.isTaunterOne;
        let abyssCycle = 1;
        let tauntAt = this.isTaunterOne ? Date.now() + UltraNulgath_LW.taunterOneTauntDelay : 0;

        while (!bot.shouldExit) {
            if (!LoneWolf.isMonsterAlive(UltraNulgath_LW.nulgathMapId)) {
                break;
            }

            if (LoneWolf.shouldResetFight(fightAttempt)) {
                LoneWolf.stopSkillEngine();
                return FightResult.Reset;
            }

            if (!bot.player.alive) {
                Core.logger(`${UltraNulgath_LW.logPrefix} ${this.playerAlias} died.`);

                while (!bot.shouldExit && !bot.player.alive) {
                    if (LoneWolf.shouldResetFight(fightAttempt)) {
                        LoneWolf.stopSkillEngine();
                        return FightResult.Reset;
                    }

                    bot.sleep(UltraNulgath_LW.respawnPollDelay);
                }

                if (bot.shouldExit) {
                    break;
                }

                if (!LoneWolf.isMonsterAlive(UltraNulgath_LW.nulgathMapId)) {
                    break;
                }

                if (LoneWolf.shouldResetFight(fightAttempt)) {
                    LoneWolf.stopSkillEngine();
                    return FightResult.Reset;
                }

                Core.logger(`${UltraNulgath_LW.logPrefix} ${this.playerAlias} respawned.`);

                if (bot.player.cell !== UltraNulgath_LW.bossCell || bot.player.pad !== UltraNulgath_LW.bossPad) {
                    Core.jump(UltraNulgath_LW.bossCell, UltraNulgath_LW.bossPad);
                }

                continue;
            }

            LoneWolf.maintainTarget(this.getTargetMapId());
            const now = Date.now();

            if (this.isTaunterOne) {
                this.runTaunterOneTaunts(
                    fightAttempt,
                    ref(
                        () => abyssCycle,
                        (v) => (abyssCycle = v),
                    ),
                    ref(
                        () => tauntScheduled,
                        (v) => (tauntScheduled = v),
                    ),
                    ref(
                        () => openingTaunt,
                        (v) => (openingTaunt = v),
                    ),
                    ref(
                        () => tauntAt,
                        (v) => (tauntAt = v),
                    ),
                    now,
                );
            } else if (
                playerFour &&
                !this.runPlayerFourTaunts(
                    fightAttempt,
                    ref(
                        () => abyssCycle,
                        (v) => (abyssCycle = v),
                    ),
                    ref(
                        () => tauntScheduled,
                        (v) => (tauntScheduled = v),
                    ),
                    ref(
                        () => tauntAt,
                        (v) => (tauntAt = v),
                    ),
                    now,
                )
            ) {
                LoneWolf.stopSkillEngine();
                return FightResult.Stopped;
            }

            bot.sleep(UltraNulgath_LW.fightPollDelay);
        }

        LoneWolf.stopSkillEngine();

        if (bot.shouldExit) {
            return FightResult.Stopped;
        }

        Core.logger(`${UltraNulgath_LW.logPrefix} ${this.playerAlias} confirmed Ultra Nulgath defeated.`);
        return FightResult.Defeated;
    }

    private runTaunterOneTaunts(
        fightAttempt: number,
        abyssCycle: Ref<number>,
        tauntScheduled: Ref<boolean>,
        openingTaunt: Ref<boolean>,
        tauntAt: Ref<number>,
        now: number,
    ): void {
        if (tauntScheduled.value) {
            if (now < tauntAt.value) {
                return;
            }

            this.requestNulgathTaunt();

            if (openingTaunt.value) {
                openingTaunt.value = false;
                Core.logger(`${UltraNulgath_LW.logPrefix} ${this.playerAlias} requested the opening Nulgath taunt.`);
            } else {
                Core.logger(
                    `${UltraNulgath_LW.logPrefix} ${this.playerAlias} requested Abyss response taunt ${abyssCycle.value}.`,
                );
                abyssCycle.value++;
            }

            tauntScheduled.value = false;
            return;
        }

        const signal = UltraNulgath_LW.getAbyssTauntSignalName(fightAttempt, abyssCycle.value);
        if (!LoneWolf.hasArmySignal(signal, 4)) {
            return;
        }

        tauntAt.value = now + UltraNulgath_LW.taunterOneTauntDelay;
        tauntScheduled.value = true;
        Core.logger(`${UltraNulgath_LW.logPrefix} ${this.playerAlias} received ${signal}.`);
    }

    private runPlayerFourTaunts(
        fightAttempt: number,
        abyssCycle: Ref<number>,
        tauntScheduled: Ref<boolean>,
        tauntAt: Ref<number>,
        now: number,
    ): boolean {
        if (!tauntScheduled.value) {
            if (!LoneWolf.hasPacketDetection(abyssCycle.value)) {
                return true;
            }

            tauntAt.value = now + UltraNulgath_LW.playerFourTauntDelay;
            tauntScheduled.value = true;
            Core.logger(`${UltraNulgath_LW.logPrefix} playerFour detected Abyss cycle ${abyssCycle.value}.`);
            return true;
        }

        if (now < tauntAt.value) {
            return true;
        }

        this.requestNulgathTaunt();
        const signal = UltraNulgath_LW.getAbyssTauntSignalName(fightAttempt, abyssCycle.value);

        if (!LoneWolf.sendArmySignal(signal)) {
            return false;
        }

        Core.logger(`${UltraNulgath_LW.logPrefix} playerFour requested taunt and sent ${signal}.`);
        abyssCycle.value++;
        tauntScheduled.value = false;
        return true;
    }

    private getTargetMapId(): number {
        if (
            this.armyComposition === ArmyComposition.Optimized ||
            this.armyComposition === ArmyComposition.Pay2Win ||
            this.armyComposition === ArmyComposition.Fast
        ) {
            return UltraNulgath_LW.nulgathMapId;
        }

        if (this.armyComposition === ArmyComposition.Stable || this.armyComposition === ArmyComposition.Reliable) {
            if (LoneWolf.isArmyPlayer(1)) {
                if (this.armyComposition === ArmyComposition.Reliable) {
                    return LoneWolf.isMonsterAlive(UltraNulgath_LW.bladeMapId)
                        ? UltraNulgath_LW.bladeMapId
                        : UltraNulgath_LW.nulgathMapId;
                }

                return LoneWolf.getMonsterHP(UltraNulgath_LW.bladeMapId) > 500000
                    ? UltraNulgath_LW.bladeMapId
                    : UltraNulgath_LW.nulgathMapId;
            }

            if (LoneWolf.isArmyPlayer(2)) {
                return LoneWolf.isMonsterAlive(UltraNulgath_LW.bladeMapId)
                    ? UltraNulgath_LW.bladeMapId
                    : UltraNulgath_LW.nulgathMapId;
            }

            return UltraNulgath_LW.nulgathMapId;
        }

        if (!LoneWolf.isArmyPlayer(2)) {
            return UltraNulgath_LW.nulgathMapId;
        }

        const bladeHealth = LoneWolf.getMonsterHP(UltraNulgath_LW.bladeMapId);
        return LoneWolf.isMonsterAlive(UltraNulgath_LW.bladeMapId) && bladeHealth > UltraNulgath_LW.bladeHealthThreshold
            ? UltraNulgath_LW.bladeMapId
            : UltraNulgath_LW.nulgathMapId;
    }

    private requestNulgathTaunt(): void {
        LoneWolf.requestAbsolutePriorityTaunt(UltraNulgath_LW.nulgathMapId);
    }

    private static getAbyssTauntSignalName(fightAttempt: number, abyssCycle: number): string {
        return `ABYSS_TAUNT_DONE_${fightAttempt}_${abyssCycle}`;
    }

    private handleFightReset(fightAttempt: number): boolean {
        LoneWolf.stopPacketDetector();
        LoneWolf.stopSkillEngine();
        bot.combat.cancelTarget();

        while (!bot.shouldExit && !bot.player.alive) {
            LoneWolf.shouldResetFight(fightAttempt);
            bot.sleep(UltraNulgath_LW.respawnPollDelay);
        }

        if (bot.shouldExit) {
            return false;
        }

        LoneWolf.shouldResetFight(fightAttempt);
        Core.jump(UltraNulgath_LW.safeCell, UltraNulgath_LW.safePad);

        if (!this.isInSafeRoom()) {
            Core.logger(
                `${UltraNulgath_LW.logPrefix} ${this.playerAlias} could not reach the safe room after reset.`,
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
                `${UltraNulgath_LW.logPrefix} failed after ${UltraNulgath_LW.maxFightAttempts} fight attempts.`,
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
            `${UltraNulgath_LW.logPrefix} failed after ${UltraNulgath_LW.maxFightAttempts} fight attempts.`,
            "RunFightAttempts",
            { messageBox: true, stopBot: true },
        );
    }

    private isInSafeRoom(): boolean {
        return bot.player.cell?.toLowerCase() === UltraNulgath_LW.safeCell?.toLowerCase();
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
                ? bot.config!.get<T>("Weekly_Ultras", masterOptionName)
                : bot.config!.get<T>(standaloneOptionName)
        )!;
    }

    private getClassPreset(): ClassPreset {
        if (LoneWolf.isArmyPlayer(1)) {
            if (this.armyComposition === ArmyComposition.Fast) {
                return LoneWolf.arcanaInvoker();
            }

            if (this.armyComposition === ArmyComposition.Pay2Win) {
                return LoneWolf.guardian();
            }

            if (this.armyComposition === ArmyComposition.Optimized) {
                return LoneWolf.dragonOfTime();
            }

            if (this.armyComposition === ArmyComposition.Reliable) {
                return LoneWolf.verusDoomKnight();
            }

            return this.armyComposition === ArmyComposition.Stable ? LoneWolf.kingsEcho() : LoneWolf.legionRevenant();
        }

        if (LoneWolf.isArmyPlayer(2)) {
            if (this.armyComposition === ArmyComposition.Fast || this.armyComposition === ArmyComposition.Pay2Win) {
                return LoneWolf.verusDoomKnight();
            }

            return this.armyComposition === ArmyComposition.Optimized
                ? LoneWolf.dragonOfTime()
                : LoneWolf.stoneCrusher();
        }

        if (LoneWolf.isArmyPlayer(3)) {
            return this.armyComposition === ArmyComposition.Optimized ||
                this.armyComposition === ArmyComposition.Pay2Win ||
                this.armyComposition === ArmyComposition.Fast
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
        Core.logger(`${UltraNulgath_LW.logPrefix} ${this.playerAlias} entering ${step}.`);

        if (!LoneWolf.syncArmy(step)) {
            return false;
        }

        Core.logger(`${UltraNulgath_LW.logPrefix} ${this.playerAlias} continued from ${step}.`);
        return true;
    }

    private stopArmy(): void {
        if (LoneWolf.isArmyPlayer(1)) {
            bot.sleep(2000);

            if (bot.shouldExit) {
                return;
            }

            if (LoneWolf.stopArmySync("COMPLETE")) {
                Core.logger(`${UltraNulgath_LW.logPrefix} playerOne published COMPLETE.`);
            } else {
                Core.logger(`${UltraNulgath_LW.logPrefix} playerOne could not publish COMPLETE.`);
            }

            return;
        }

        if (LoneWolf.syncArmy("STOP_CHECK")) {
            Core.logger(`${UltraNulgath_LW.logPrefix} ${this.playerAlias} unexpectedly passed STOP_CHECK.`);
        } else {
            Core.logger(`${UltraNulgath_LW.logPrefix} ${this.playerAlias} detected COMPLETE.`);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "UltraNulgath_LW",
    [
        LoneWolf.player1,
        LoneWolf.player2,
        LoneWolf.player3,
        LoneWolf.player4,
        option.choice(
            "ArmyComposition",
            "Army Composition",
            "Default: LR / SC / AP / LOO\nStable: KE / SC / AP / LOO\nReliable: VDK / SC / AP / LOO\nOptimized: DOT / DOT / LR / LOO\nPay2Win: Guardian / VDK / LR / LOO\nFast: AI / VDK / LR / LOO",
            choices(ArmyComposition),
            ArmyComposition.Default,
        ),
        option.int("PrivateRoomNumber", "Private Room Number", "Private room number from 1001 through 99999.", 0),
        option.bool("UsePotions", "Use Potions", "Prepare and use the assigned potion loadout.", true),
        option.bool("UseEnhancements", "Use Enhancements", "Prepare the assigned enhancement loadout.", true),
    ],
    true,
);

export default function main(): void {
    const script = new UltraNulgath_LW();
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

/*
name: Victor Matsuri Masakado LW
description: Four-player CoreLoneWolf prerequisite script for Victor of the Festival.
tags: victor, matsuri, masakado, army, corelonewolf
*/
// Port of Extras/TempleShrine/VictorMatsuriMaskado_LW.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { type Ref, discard, ref } from "../../LWRef";
import { bot, choices, defineScriptOptions, option } from "turu";
import { WeaponSpecial } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";
import { type ClassPreset, CoreLoneWolf } from "../../CoreLoneWolf";

const LoneWolf = new CoreLoneWolf();

export enum ArmyComposition {
    Default = "Default",
    Stable = "Stable",
}

export enum FightResult {
    Continue = "Continue",
    Defeated = "Defeated",
    Reset = "Reset",
    Stopped = "Stopped",
}

export class StoryStage {
    constructor(questId: number, nextQuestId: number, monsterName: string, requirementName: string) {
        this.questId = questId;
        this.nextQuestId = nextQuestId;
        this.monsterName = monsterName;
        this.requirementName = requirementName;
    }

    questId!: number;
    nextQuestId!: number;
    monsterName!: string;
    requirementName!: string;
}

export class VictorMatsuriMaskado_LW {
    private static readonly logPrefix = "Victor Matsuri Masakado LW";
    private static readonly syncFileName = "VictorMatsuriMaskado_LW.sync";
    private static readonly mapName = "victormatsuri";
    private static readonly safeCell = "Enter";
    private static readonly safePad = "Spawn";
    private static readonly bossCell = "r8";
    private static readonly bossPad = "Right";
    private static readonly bossName = "Masakado";
    private static readonly victorItem = "Victor of the Festival";
    private static readonly riteOfAscension = "Rite of Ascension";
    private static readonly enrageScroll = "Scroll of Enrage";
    private static readonly focusAura = "Focus";
    private static readonly praxisAura = "Praxis";
    private static readonly counterAttackAura = "Counter Attack";
    private static readonly bossMapId = 6;
    private static readonly bossQuestId = 10295;
    private static readonly focusRefreshMilliseconds = 1500;
    private static readonly fightPollDelay = 150;
    private static readonly respawnPollDelay = 500;

    private static readonly storyStages: StoryStage[] = [
        new StoryStage(10290, 10291, "Kitsune Himawari", "Sunny Fox Tail"),
        new StoryStage(10291, 10292, "NeOni", "NeOni Prop Horn"),
        new StoryStage(10292, 10293, "Narcis Arrhythmia", "Bloodsoaked Omamori"),
        new StoryStage(10293, 10294, "Haruki Matsuoka", "Broken Oni Horn"),
        new StoryStage(10294, 10295, "Lady Laidronette", "Sunrise Amulet"),
    ];

    private playerAlias: string = "";
    private armyComposition: ArmyComposition = null!;
    private privateRoomNumber: number = 0;
    private runMasakado: boolean = false;
    private isTaunter: boolean = false;
    private reportedFightAlive: boolean | null = null;
    private masterMode: boolean = false;
    private runCompleted: boolean = false;
    private skipVictorWork: boolean = false;

    runFromMaster(): boolean {
        this.masterMode = true;
        this.runCompleted = false;
        this.skipVictorWork = false;
        bot.skills.stop();
        bot.options.infiniteRange = true;

        try {
            this.run();
        } finally {
            LoneWolf.setOrdinarySkillsSuppressed(false);
            LoneWolf.stopSkillEngine();
            bot.combat.cancelAutoAttack();
            bot.combat.cancelTarget();
            this.masterMode = false;
        }

        return this.runCompleted;
    }

    run(): void {
        if (!this.validateOptions()) {
            return;
        }

        if (!LoneWolf.startArmySync(VictorMatsuriMaskado_LW.syncFileName, 4, this.masterMode ? "Setup" : null)) {
            return;
        }

        if (!LoneWolf.validateHouseRequirements()) {
            return;
        }

        this.playerAlias = this.getPlayerAlias();
        this.isTaunter = LoneWolf.isArmyPlayer(2) || LoneWolf.isArmyPlayer(4);
        const preset = this.getClassPreset();

        this.loadBank();
        this.skipVictorWork = this.masterMode && this.ownsRite();

        Core.logger(
            `${VictorMatsuriMaskado_LW.logPrefix} started as ${this.playerAlias} using ${this.armyComposition} composition.`,
        );

        LoneWolf.equipClass(preset);
        if (bot.shouldExit || !this.reportMissingStoryStages() || !this.sync("STORY_STATUS_REPORTED")) {
            return;
        }

        if (!this.runStory(preset)) {
            return;
        }

        if (!this.runMasakado) {
            Core.logger(`${VictorMatsuriMaskado_LW.logPrefix} ${this.playerAlias} stopped before Masakado.`);
            this.stopArmy();
            return;
        }

        this.loadBank();
        const ownedVictorAtStart = this.skipVictorWork || this.ownsVictor();
        if (ownedVictorAtStart) {
            LoneWolf.sendArmySignal("VICTOR_ALREADY_OWNED");
        }

        if (!this.sync("VICTOR_STATUS_REPORTED")) {
            return;
        }

        if (this.allPlayersSignaled("VICTOR_ALREADY_OWNED")) {
            Core.logger(
                `${VictorMatsuriMaskado_LW.logPrefix} every account already owns ${VictorMatsuriMaskado_LW.victorItem}.`,
            );
            this.runCompleted = true;
            this.stopArmy();
            return;
        }

        if (!this.prepareBoss(preset, ownedVictorAtStart) || !this.sync("SETUP_DONE")) {
            return;
        }

        if (!this.runBossAttempts(preset) || !this.sync("BOSS_DEFEATED")) {
            return;
        }

        if (!this.completeVictorQuest(ownedVictorAtStart)) {
            return;
        }

        if (!this.sync("VICTOR_OBTAINED")) {
            return;
        }

        this.runCompleted = true;
        this.stopArmy();
    }

    private validateOptions(): boolean {
        this.armyComposition = this.getTempleOption("VictorMatsuriComposition", "ArmyComposition");
        this.privateRoomNumber = this.getSetupOption("PrivateRoomNumber");
        this.runMasakado = this.masterMode || this.getSetupOption("RunMasakado");
        return LoneWolf.validatePrivateRoomNumber(this.privateRoomNumber);
    }

    private reportMissingStoryStages(): boolean {
        if (this.skipVictorWork) {
            return true;
        }

        for (const stage of VictorMatsuriMaskado_LW.storyStages) {
            if (bot.quests.isUnlocked(stage.nextQuestId)) {
                continue;
            }

            if (!LoneWolf.sendArmySignal(`STORY_${stage.questId}_NEEDED`)) {
                return false;
            }

            Core.logger(`${VictorMatsuriMaskado_LW.logPrefix} ${this.playerAlias} needs story quest ${stage.questId}.`);
        }

        return true;
    }

    private runStory(preset: ClassPreset): boolean {
        Core.join(`${VictorMatsuriMaskado_LW.mapName}-${this.privateRoomNumber}`);
        if (bot.shouldExit || !this.isInVictorMatsuri()) {
            return this.failure("The Army could not enter the Victor Matsuri room.", "RunStory");
        }

        this.startStorySkillEngine(preset);

        try {
            for (const stage of VictorMatsuriMaskado_LW.storyStages) {
                if (!this.runStoryStage(stage)) {
                    return false;
                }
            }
        } finally {
            LoneWolf.stopSkillEngine();
            bot.combat.cancelTarget();
        }

        return !bot.shouldExit;
    }

    private runStoryStage(stage: StoryStage): boolean {
        const neededSignal = `STORY_${stage.questId}_NEEDED`;
        const doneSignal = `STORY_${stage.questId}_COMPLETE`;
        const stageNeeded = !this.skipVictorWork && !bot.quests.isUnlocked(stage.nextQuestId);
        let stageComplete = !stageNeeded;
        let stageReported = false;

        if (!this.anyPlayerSignaled(neededSignal)) {
            return true;
        }

        if (stageNeeded) {
            Core.ensureAccept(stage.questId);
            if (!bot.wait.forTrue(() => bot.quests.isInProgress(stage.questId), 20)) {
                return this.failure(
                    `Quest ${stage.questId} could not be accepted for ${this.playerAlias}.`,
                    "RunStoryStage",
                );
            }
        }

        Core.logger(`${VictorMatsuriMaskado_LW.logPrefix} ${this.playerAlias} helping with ${stage.monsterName}.`);

        while (!bot.shouldExit && !this.allNeededPlayersCompleted(neededSignal, doneSignal)) {
            if (stageNeeded && !stageComplete && bot.tempInv.contains(stage.requirementName, 1)) {
                if (!Core.ensureComplete(stage.questId)) {
                    return this.failure(
                        `Quest ${stage.questId} could not be completed for ${this.playerAlias}.`,
                        "RunStoryStage",
                    );
                }

                if (!bot.wait.forTrue(() => bot.quests.isUnlocked(stage.nextQuestId), 20)) {
                    return this.failure(
                        `Quest ${stage.nextQuestId} did not unlock for ${this.playerAlias}.`,
                        "RunStoryStage",
                    );
                }

                stageComplete = true;
            }

            if (stageNeeded && stageComplete && !stageReported) {
                stageReported = LoneWolf.sendArmySignal(doneSignal);
                if (!stageReported) {
                    return false;
                }
            }

            if (this.allNeededPlayersCompleted(neededSignal, doneSignal)) {
                break;
            }

            if (!this.fightStoryMonsterOnce(stage.monsterName)) {
                return false;
            }
        }

        if (bot.shouldExit) {
            return false;
        }

        Core.logger(`${VictorMatsuriMaskado_LW.logPrefix} ${this.playerAlias} completed story stage ${stage.questId}.`);
        return true;
    }

    private fightStoryMonsterOnce(monsterName: string): boolean {
        let seenAlive = false;

        while (!bot.shouldExit) {
            if (!bot.player.alive) {
                Core.logger(
                    `${VictorMatsuriMaskado_LW.logPrefix} ${this.playerAlias} died while helping with ${monsterName}.`,
                );

                while (!bot.shouldExit && !bot.player.alive) {
                    bot.sleep(VictorMatsuriMaskado_LW.respawnPollDelay);
                }

                if (bot.shouldExit) {
                    return false;
                }

                Core.logger(`${VictorMatsuriMaskado_LW.logPrefix} ${this.playerAlias} respawned and resumed helping.`);
            }

            const targetMonster =
                bot.monsters.mapMonsters?.find(
                    (monster) => monster != null && monster.name?.toLowerCase() === monsterName?.toLowerCase(),
                ) ?? null;

            if (targetMonster == null || !targetMonster.cell?.trim()) {
                return this.failure(
                    `${monsterName} could not be found in the Victor Matsuri room.`,
                    "FightStoryMonsterOnce",
                );
            }

            if (bot.player.cell !== targetMonster.cell) {
                Core.jump(targetMonster.cell, "Left");

                if (bot.shouldExit || bot.player.cell !== targetMonster.cell) {
                    return this.failure(`${this.playerAlias} could not reach ${monsterName}.`, "FightStoryMonsterOnce");
                }
            }

            const monsterAlive = targetMonster.hp > 0;

            if (monsterAlive) {
                seenAlive = true;
            } else if (seenAlive) {
                bot.combat.cancelTarget();
                return true;
            }

            bot.combat.attack(targetMonster.mapId);
            bot.sleep(VictorMatsuriMaskado_LW.fightPollDelay);
        }

        return false;
    }

    private startStorySkillEngine(preset: ClassPreset): void {
        const skills =
            LoneWolf.isArmyPlayer(1) && this.armyComposition === ArmyComposition.Default
                ? LoneWolf.legionRevenant().skills
                : preset.skills;

        LoneWolf.startSkillEngine(skills, this.playerAlias, false, VictorMatsuriMaskado_LW.logPrefix, preset.skillMode);
    }

    private prepareBoss(preset: ClassPreset, ownedVictorAtStart: boolean): boolean {
        Core.logger(`${VictorMatsuriMaskado_LW.logPrefix} ${this.playerAlias} starting Masakado setup.`);

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

        if (bot.shouldExit) {
            return false;
        }

        if (LoneWolf.isArmyPlayer(1) && !this.isPraxisEquipped()) {
            return this.failure(
                "Praxis is not enhanced on the Player 1 weapon. Masakado cannot be started.",
                "PrepareBoss",
            );
        }

        if (this.getSetupOption("UsePotions")) {
            LoneWolf.preparePotions(preset.tonic, preset.elixir, preset.combatPotion);
        }

        if (this.isTaunter) {
            LoneWolf.prepareScrolls(VictorMatsuriMaskado_LW.enrageScroll);
        }

        if (bot.shouldExit) {
            return false;
        }

        if (!ownedVictorAtStart) {
            Core.addDrop(VictorMatsuriMaskado_LW.victorItem);
            Core.ensureAccept(VictorMatsuriMaskado_LW.bossQuestId);
            if (!bot.wait.forTrue(() => bot.quests.isInProgress(VictorMatsuriMaskado_LW.bossQuestId), 20)) {
                return this.failure(
                    `Quest ${VictorMatsuriMaskado_LW.bossQuestId} could not be accepted for ${this.playerAlias}.`,
                    "PrepareBoss",
                );
            }
        }

        Core.logger(`${VictorMatsuriMaskado_LW.logPrefix} ${this.playerAlias} finished Masakado setup.`);
        return true;
    }

    private runBossAttempts(preset: ClassPreset): boolean {
        let fightAttempt = 1;

        while (!bot.shouldExit) {
            Core.join(
                `${VictorMatsuriMaskado_LW.mapName}-${this.privateRoomNumber}`,
                VictorMatsuriMaskado_LW.safeCell,
                VictorMatsuriMaskado_LW.safePad,
            );
            if (!this.prepareBossSafeRoom(preset) || !this.sync("FIGHT_READY")) {
                return false;
            }

            if (!this.sync("START_FIGHT") || !this.moveToBossRoom()) {
                return false;
            }

            this.reportedFightAlive = null;
            const result = this.fight(preset, fightAttempt);
            if (result === FightResult.Defeated) {
                return true;
            }

            if (result !== FightResult.Reset || !this.handleFightReset(fightAttempt)) {
                return false;
            }

            fightAttempt++;
        }

        return false;
    }

    private prepareBossSafeRoom(preset: ClassPreset): boolean {
        if (this.getSetupOption("UsePotions")) {
            LoneWolf.usePotions(preset.tonic, preset.elixir, preset.combatPotion);
        }

        if (this.isTaunter) {
            LoneWolf.equipScroll(VictorMatsuriMaskado_LW.enrageScroll);
        }

        return !bot.shouldExit;
    }

    private fight(preset: ClassPreset, fightAttempt: number): FightResult {
        if (this.isTaunter) {
            return this.fightTaunter(preset, fightAttempt);
        }

        return this.fightDamageDealer(preset, fightAttempt);
    }

    private fightDamageDealer(preset: ClassPreset, fightAttempt: number): FightResult {
        if (this.isStablePlayerOne()) {
            LoneWolf.maintainTarget(VictorMatsuriMaskado_LW.bossMapId);
            bot.sleep(1000);

            if (bot.shouldExit) {
                return this.finishFight(FightResult.Stopped);
            }
        }

        this.startBossSkillEngine(preset);
        Core.logger(
            `${VictorMatsuriMaskado_LW.logPrefix} ${this.playerAlias} started fighting attempt ${fightAttempt}.`,
        );

        let bossSeenAlive = false;
        let counterAttackActive = false;

        while (!bot.shouldExit) {
            if (LoneWolf.isMonsterAlive(VictorMatsuriMaskado_LW.bossMapId)) {
                bossSeenAlive = true;
            }

            const recovery = this.recoverFromDeath(fightAttempt, bossSeenAlive, discard());
            if (recovery !== FightResult.Continue) {
                return this.finishFight(recovery);
            }

            LoneWolf.maintainTarget(VictorMatsuriMaskado_LW.bossMapId);
            if (
                this.updateCounterAttack(
                    ref(
                        () => counterAttackActive,
                        (v) => (counterAttackActive = v),
                    ),
                )
            ) {
                bot.sleep(VictorMatsuriMaskado_LW.fightPollDelay);
                continue;
            }

            bot.sleep(VictorMatsuriMaskado_LW.fightPollDelay);
        }

        return this.finishFight(FightResult.Stopped);
    }

    private fightTaunter(preset: ClassPreset, fightAttempt: number): FightResult {
        const isFirstOwner = LoneWolf.isArmyPlayer(2);
        const partnerPlayerNumber = isFirstOwner ? 4 : 2;
        const partnerName = (this.getSetupOption<string>(`player${partnerPlayerNumber}`) ?? "").trim();
        const partnerAlias = isFirstOwner ? "playerFour" : "playerTwo";

        this.startBossSkillEngine(preset);
        Core.logger(
            `${VictorMatsuriMaskado_LW.logPrefix} ${this.playerAlias} started fighting attempt ${fightAttempt}.`,
        );

        let bossSeenAlive = false;
        let counterAttackActive = false;
        let ownsFocusCycle = false;
        let waitingForOwnFocus = isFirstOwner;
        let partnerDeathObserved = false;
        let nextSignalNumber = 1;
        let focusBaseline = this.getFocusExpiry();

        if (isFirstOwner) {
            LoneWolf.requestTaunt(VictorMatsuriMaskado_LW.bossMapId);
            Core.logger(`${VictorMatsuriMaskado_LW.logPrefix} playerTwo requested the first Masakado taunt.`);
        }

        while (!bot.shouldExit) {
            if (LoneWolf.isMonsterAlive(VictorMatsuriMaskado_LW.bossMapId)) {
                bossSeenAlive = true;
            }

            let recovered: boolean = undefined!;

            const recovery = this.recoverFromDeath(
                fightAttempt,
                bossSeenAlive,
                ref(
                    () => recovered,
                    (v) => (recovered = v),
                ),
            );
            if (recovery !== FightResult.Continue) {
                return this.finishFight(recovery);
            }

            LoneWolf.maintainTarget(VictorMatsuriMaskado_LW.bossMapId);
            this.updateCounterAttack(
                ref(
                    () => counterAttackActive,
                    (v) => (counterAttackActive = v),
                ),
            );

            if (recovered) {
                nextSignalNumber = VictorMatsuriMaskado_LW.alignSignalNumber(nextSignalNumber, isFirstOwner);
                ownsFocusCycle = false;
                waitingForOwnFocus = true;
                focusBaseline = this.getFocusExpiry();
                LoneWolf.requestTaunt(VictorMatsuriMaskado_LW.bossMapId);
                Core.logger(
                    `${VictorMatsuriMaskado_LW.logPrefix} ${this.playerAlias} owns the next taunt after returning.`,
                );
            }

            let partnerDead: boolean = undefined!;

            let partnerInBossRoom: boolean = undefined!;

            const partnerFound = this.tryGetPartnerState(
                partnerName,
                ref(
                    () => partnerDead,
                    (v) => (partnerDead = v),
                ),
                ref(
                    () => partnerInBossRoom,
                    (v) => (partnerInBossRoom = v),
                ),
            );

            if (partnerFound && partnerDead && !partnerDeathObserved) {
                const expectedSignal = VictorMatsuriMaskado_LW.getTauntSignalName(fightAttempt, nextSignalNumber);
                if (
                    !ownsFocusCycle &&
                    !waitingForOwnFocus &&
                    LoneWolf.hasArmySignal(expectedSignal, partnerPlayerNumber)
                ) {
                    nextSignalNumber++;
                }

                partnerDeathObserved = true;
                ownsFocusCycle = false;
                waitingForOwnFocus = false;
                Core.logger(
                    `${VictorMatsuriMaskado_LW.logPrefix} ${this.playerAlias} detected its taunt partner died.`,
                );
            }

            if (partnerDeathObserved) {
                if (partnerFound && !partnerDead && partnerInBossRoom) {
                    partnerDeathObserved = false;
                    nextSignalNumber = VictorMatsuriMaskado_LW.alignSignalNumber(nextSignalNumber, !isFirstOwner);
                    ownsFocusCycle = false;
                    waitingForOwnFocus = false;
                    Core.logger(
                        `${VictorMatsuriMaskado_LW.logPrefix} ${this.playerAlias} restored alternating taunts.`,
                    );
                } else {
                    LoneWolf.requestImmediateTaunt(VictorMatsuriMaskado_LW.bossMapId);
                    bot.sleep(VictorMatsuriMaskado_LW.fightPollDelay);
                    continue;
                }
            }

            const focus = bot.target.getAura(VictorMatsuriMaskado_LW.focusAura);
            if (waitingForOwnFocus && focus != null && focus.expiresAt > focusBaseline) {
                focusBaseline = focus.expiresAt;
                waitingForOwnFocus = false;
                ownsFocusCycle = true;
                Core.logger(`${VictorMatsuriMaskado_LW.logPrefix} ${this.playerAlias} confirmed its Focus.`);
            }

            if (waitingForOwnFocus) {
                if (focus == null) {
                    LoneWolf.requestImmediateTaunt(VictorMatsuriMaskado_LW.bossMapId);
                }
            } else if (ownsFocusCycle && focus == null) {
                ownsFocusCycle = false;
                waitingForOwnFocus = true;
                focusBaseline = 0;
                LoneWolf.requestImmediateTaunt(VictorMatsuriMaskado_LW.bossMapId);
            } else if (
                ownsFocusCycle &&
                focus != null &&
                focus.expiresAt - Date.now() <= VictorMatsuriMaskado_LW.focusRefreshMilliseconds
            ) {
                const signal = VictorMatsuriMaskado_LW.getTauntSignalName(fightAttempt, nextSignalNumber);
                if (LoneWolf.sendArmySignal(signal)) {
                    Core.logger(
                        `${VictorMatsuriMaskado_LW.logPrefix} ${this.playerAlias} sent ${signal} to ${partnerAlias}.`,
                    );
                    nextSignalNumber++;
                    ownsFocusCycle = false;
                }
            } else if (!ownsFocusCycle && !waitingForOwnFocus) {
                const signal = VictorMatsuriMaskado_LW.getTauntSignalName(fightAttempt, nextSignalNumber);
                if (LoneWolf.hasArmySignal(signal, partnerPlayerNumber)) {
                    nextSignalNumber++;
                    focusBaseline = this.getFocusExpiry();
                    waitingForOwnFocus = true;
                    LoneWolf.requestTaunt(VictorMatsuriMaskado_LW.bossMapId);
                    Core.logger(
                        `${VictorMatsuriMaskado_LW.logPrefix} ${this.playerAlias} received ${signal} and requested its taunt.`,
                    );
                }
            }

            if (counterAttackActive) {
                bot.combat.cancelAutoAttack();
            }

            bot.sleep(VictorMatsuriMaskado_LW.fightPollDelay);
        }

        return this.finishFight(FightResult.Stopped);
    }

    private startBossSkillEngine(preset: ClassPreset): void {
        const stablePlayerOne = this.isStablePlayerOne();

        LoneWolf.startSkillEngine(
            preset.skills,
            this.playerAlias,
            this.isTaunter,
            VictorMatsuriMaskado_LW.logPrefix,
            preset.skillMode,
            undefined,
            !this.isTaunter && this.getSetupOption("UsePotions") ? preset.combatPotion : null,
            undefined,
            stablePlayerOne ? 1 : 0,
            undefined,
            LoneWolf.isArmyPlayer(1) && !stablePlayerOne ? 1 : 0,
            LoneWolf.isArmyPlayer(1) && !stablePlayerOne ? VictorMatsuriMaskado_LW.praxisAura : "",
            stablePlayerOne ? VictorMatsuriMaskado_LW.praxisAura : "",
        );
    }

    private updateCounterAttack(latched: Ref<boolean>): boolean {
        const active =
            bot.player.alive &&
            bot.player.hasTarget &&
            bot.player.target?.mapId === VictorMatsuriMaskado_LW.bossMapId &&
            bot.target.hasActiveAura(VictorMatsuriMaskado_LW.counterAttackAura);

        LoneWolf.setOrdinarySkillsSuppressed(active);

        if (active) {
            bot.combat.cancelAutoAttack();

            if (!latched.value) {
                Core.logger(
                    `${VictorMatsuriMaskado_LW.logPrefix} ${this.playerAlias} paused for ${VictorMatsuriMaskado_LW.counterAttackAura}.`,
                );
            }

            latched.value = true;
            return true;
        }

        if (latched.value) {
            Core.logger(
                `${VictorMatsuriMaskado_LW.logPrefix} ${this.playerAlias} resumed after ${VictorMatsuriMaskado_LW.counterAttackAura}.`,
            );
            latched.value = false;
        }

        return false;
    }

    private recoverFromDeath(fightAttempt: number, bossSeenAlive: boolean, recovered: Ref<boolean>): FightResult {
        recovered.value = false;
        const deadSignal = `MASAKADO_DEAD_${fightAttempt}`;
        const aliveSignal = `MASAKADO_ALIVE_${fightAttempt}`;
        const resetSignal = `MASAKADO_RESET_${fightAttempt}`;

        if (LoneWolf.hasArmySignal(resetSignal, 1)) {
            return FightResult.Reset;
        }

        if (bot.player.alive) {
            this.reportAliveIfNeeded(aliveSignal);
            return bossSeenAlive && !LoneWolf.isMonsterAlive(VictorMatsuriMaskado_LW.bossMapId)
                ? FightResult.Defeated
                : FightResult.Continue;
        }

        LoneWolf.setOrdinarySkillsSuppressed(false);
        bot.combat.cancelAutoAttack();
        bot.combat.cancelTarget();
        this.reportDeadIfNeeded(deadSignal, fightAttempt);

        while (!bot.shouldExit && !bot.player.alive) {
            if (
                LoneWolf.isArmyPlayer(1) &&
                !LoneWolf.hasArmySignal(resetSignal, 1) &&
                this.areAllPlayersDead(deadSignal, aliveSignal)
            ) {
                if (!LoneWolf.sendArmySignal(resetSignal)) {
                    return FightResult.Stopped;
                }
            }

            if (LoneWolf.hasArmySignal(resetSignal, 1)) {
                return FightResult.Reset;
            }

            bot.sleep(VictorMatsuriMaskado_LW.respawnPollDelay);
        }

        if (bot.shouldExit) {
            return FightResult.Stopped;
        }

        this.reportAliveIfNeeded(aliveSignal);

        if (LoneWolf.hasArmySignal(resetSignal, 1)) {
            return FightResult.Reset;
        }

        if (bossSeenAlive && !LoneWolf.isMonsterAlive(VictorMatsuriMaskado_LW.bossMapId)) {
            return FightResult.Defeated;
        }

        Core.logger(`${VictorMatsuriMaskado_LW.logPrefix} ${this.playerAlias} respawned.`);
        if (!this.moveToBossRoom()) {
            return FightResult.Stopped;
        }

        recovered.value = true;
        return FightResult.Continue;
    }

    private handleFightReset(fightAttempt: number): boolean {
        LoneWolf.setOrdinarySkillsSuppressed(false);
        LoneWolf.stopSkillEngine();
        bot.combat.cancelAutoAttack();
        bot.combat.cancelTarget();

        const aliveSignal = `MASAKADO_ALIVE_${fightAttempt}`;
        while (!bot.shouldExit && !bot.player.alive) {
            bot.sleep(VictorMatsuriMaskado_LW.respawnPollDelay);
        }

        if (bot.shouldExit) {
            return false;
        }

        this.reportAliveIfNeeded(aliveSignal);
        Core.jump(VictorMatsuriMaskado_LW.safeCell, VictorMatsuriMaskado_LW.safePad);

        if (!this.isInSafeRoom()) {
            return this.failure(`${this.playerAlias} could not reach the Masakado reset room.`, "HandleFightReset");
        }

        Core.logger(`${VictorMatsuriMaskado_LW.logPrefix} ${this.playerAlias} handling full wipe ${fightAttempt}.`);
        return this.sync(`MASAKADO_RESET_READY_${fightAttempt}`);
    }

    private finishFight(result: FightResult): FightResult {
        LoneWolf.setOrdinarySkillsSuppressed(false);
        LoneWolf.stopSkillEngine();
        bot.combat.cancelAutoAttack();
        bot.combat.cancelTarget();

        if (result !== FightResult.Defeated) {
            return result;
        }

        Core.jump(VictorMatsuriMaskado_LW.safeCell, VictorMatsuriMaskado_LW.safePad);
        Core.logger(
            `${VictorMatsuriMaskado_LW.logPrefix} ${this.playerAlias} confirmed ${VictorMatsuriMaskado_LW.bossName} defeated.`,
        );
        return FightResult.Defeated;
    }

    private completeVictorQuest(ownedVictorAtStart: boolean): boolean {
        if (!ownedVictorAtStart) {
            if (!Core.ensureCompleteChoose(VictorMatsuriMaskado_LW.bossQuestId, [VictorMatsuriMaskado_LW.victorItem])) {
                return this.failure(
                    `Quest ${VictorMatsuriMaskado_LW.bossQuestId} could not be completed for ${this.playerAlias}.`,
                    "CompleteVictorQuest",
                );
            }

            bot.wait.forTrue(this.ownsVictor.bind(this), 20);
        }

        if (!this.ownsVictor()) {
            return this.failure(
                `${VictorMatsuriMaskado_LW.victorItem} was not obtained for ${this.playerAlias}.`,
                "CompleteVictorQuest",
            );
        }

        Core.logger(
            `${VictorMatsuriMaskado_LW.logPrefix} ${this.playerAlias} confirmed ${VictorMatsuriMaskado_LW.victorItem}.`,
        );
        return true;
    }

    private isPraxisEquipped(): boolean {
        return bot.inventory.items.some(
            (item) =>
                item.equipped &&
                item.equipSlot?.toLowerCase() === "Weapon"?.toLowerCase() &&
                item.procId === WeaponSpecial.Praxis,
        );
    }

    private ownsVictor(): boolean {
        return Core.checkInventory(VictorMatsuriMaskado_LW.victorItem, 1, { toInv: false });
    }

    private ownsRite(): boolean {
        return Core.checkInventory(VictorMatsuriMaskado_LW.riteOfAscension, 1, { toInv: false });
    }

    private loadBank(): void {
        if (bot.bank.loaded) {
            return;
        }

        if (bot.flash.get<string>("ui.mcPopup.currentLabel") !== "Bank") {
            bot.bank.open();
        }

        bot.bank.load(false);
        bot.wait.forBankLoad(20);
    }

    private allPlayersSignaled(signal: string): boolean {
        for (let playerNumber = 1; playerNumber <= 4; playerNumber++) {
            if (!LoneWolf.hasArmySignal(signal, playerNumber)) {
                return false;
            }
        }

        return true;
    }

    private anyPlayerSignaled(signal: string): boolean {
        for (let playerNumber = 1; playerNumber <= 4; playerNumber++) {
            if (LoneWolf.hasArmySignal(signal, playerNumber)) {
                return true;
            }
        }

        return false;
    }

    private allNeededPlayersCompleted(neededSignal: string, completedSignal: string): boolean {
        for (let playerNumber = 1; playerNumber <= 4; playerNumber++) {
            if (
                LoneWolf.hasArmySignal(neededSignal, playerNumber) &&
                !LoneWolf.hasArmySignal(completedSignal, playerNumber)
            ) {
                return false;
            }
        }

        return true;
    }

    private areAllPlayersDead(deadSignal: string, aliveSignal: string): boolean {
        for (let playerNumber = 1; playerNumber <= 4; playerNumber++) {
            const deadAt = LoneWolf.getArmyTimestamp(deadSignal, playerNumber);
            const aliveAt = LoneWolf.getArmyTimestamp(aliveSignal, playerNumber);
            if (deadAt <= 0 || deadAt <= aliveAt) {
                return false;
            }
        }

        return true;
    }

    private reportDeadIfNeeded(deadSignal: string, fightAttempt: number): void {
        if (this.reportedFightAlive === false) {
            return;
        }

        if (LoneWolf.sendArmyTimestamp(deadSignal, Date.now())) {
            this.reportedFightAlive = false;
            Core.logger(`${VictorMatsuriMaskado_LW.logPrefix} ${this.playerAlias} died in attempt ${fightAttempt}.`);
        }
    }

    private reportAliveIfNeeded(aliveSignal: string): void {
        if (this.reportedFightAlive !== false) {
            return;
        }

        if (LoneWolf.sendArmyTimestamp(aliveSignal, Date.now())) {
            this.reportedFightAlive = true;
        }
    }

    private tryGetPartnerState(partnerName: string, dead: Ref<boolean>, inBossRoom: Ref<boolean>): boolean {
        dead.value = false;
        inBossRoom.value = false;

        const players = bot.map.players;
        if (players == null) {
            return false;
        }

        for (const player of players) {
            if (!(player.name?.toLowerCase() === partnerName?.toLowerCase())) {
                continue;
            }

            dead.value = player.state === 0;
            inBossRoom.value =
                !dead.value && player.cell?.toLowerCase() === VictorMatsuriMaskado_LW.bossCell?.toLowerCase();
            return true;
        }

        return false;
    }

    private moveToBossRoom(): boolean {
        if (
            bot.player.cell === VictorMatsuriMaskado_LW.bossCell &&
            bot.player.pad === VictorMatsuriMaskado_LW.bossPad
        ) {
            return true;
        }

        Core.jump(VictorMatsuriMaskado_LW.bossCell, VictorMatsuriMaskado_LW.bossPad);
        return (
            !bot.shouldExit &&
            bot.player.cell === VictorMatsuriMaskado_LW.bossCell &&
            bot.player.pad === VictorMatsuriMaskado_LW.bossPad
        );
    }

    private getFocusExpiry(): number {
        return bot.target.getAura(VictorMatsuriMaskado_LW.focusAura)?.expiresAt ?? 0;
    }

    private static getTauntSignalName(fightAttempt: number, signalNumber: number): string {
        return `MASAKADO_TAUNT_${fightAttempt}_${signalNumber}`;
    }

    private static alignSignalNumber(signalNumber: number, senderIsFirstOwner: boolean): number {
        const signalIsFirstOwner = signalNumber % 2 !== 0;
        return signalIsFirstOwner === senderIsFirstOwner ? signalNumber : signalNumber + 1;
    }

    private getClassPreset(): ClassPreset {
        return this.armyComposition === ArmyComposition.Default
            ? this.getDefaultClassPreset()
            : this.armyComposition === ArmyComposition.Stable
              ? this.getStableClassPreset()
              : this.getDefaultClassPreset();
    }

    private getSetupOption<T extends string | number | boolean>(optionName: string): T {
        return (this.masterMode ? bot.config!.get<T>("Setup", optionName) : bot.config!.get<T>(optionName))!;
    }

    private getTempleOption<T extends string | number | boolean>(
        masterOptionName: string,
        standaloneOptionName: string,
    ): T {
        return (
            this.masterMode
                ? bot.config!.get<T>("Temple_Shrine", masterOptionName)
                : bot.config!.get<T>(standaloneOptionName)
        )!;
    }

    private getDefaultClassPreset(): ClassPreset {
        if (LoneWolf.isArmyPlayer(1)) {
            const preset = LoneWolf.legionRevenant();
            preset.skills = [3, 2, 1, 4];
            preset.weaponEnhancement = WeaponSpecial.Praxis;
            preset.weaponEnhancementFallbacks = [];
            return preset;
        }

        if (LoneWolf.isArmyPlayer(2)) {
            const preset = LoneWolf.stoneCrusher();
            preset.combatPotion = null;
            return preset;
        }

        if (LoneWolf.isArmyPlayer(3)) {
            return LoneWolf.archPaladin();
        }

        const lordOfOrder = LoneWolf.lordOfOrder();
        lordOfOrder.combatPotion = null;
        return lordOfOrder;
    }

    private getStableClassPreset(): ClassPreset {
        if (!LoneWolf.isArmyPlayer(1)) {
            return this.getDefaultClassPreset();
        }

        const preset = LoneWolf.verusDoomKnight();
        preset.weaponEnhancement = WeaponSpecial.Praxis;
        preset.weaponEnhancementFallbacks = [];
        return preset;
    }

    private isStablePlayerOne(): boolean {
        return this.armyComposition === ArmyComposition.Stable && LoneWolf.isArmyPlayer(1);
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

    private isInVictorMatsuri(): boolean {
        return bot.map.name?.toLowerCase() === VictorMatsuriMaskado_LW.mapName?.toLowerCase();
    }

    private isInSafeRoom(): boolean {
        return bot.player.cell?.toLowerCase() === VictorMatsuriMaskado_LW.safeCell?.toLowerCase();
    }

    private sync(step: string): boolean {
        Core.logger(`${VictorMatsuriMaskado_LW.logPrefix} ${this.playerAlias} entering ${step}.`);

        if (!LoneWolf.syncArmy(step)) {
            return false;
        }

        Core.logger(`${VictorMatsuriMaskado_LW.logPrefix} ${this.playerAlias} continued from ${step}.`);
        return true;
    }

    private stopArmy(): void {
        LoneWolf.stopSkillEngine();

        if (LoneWolf.isArmyPlayer(1)) {
            bot.sleep(2000);

            if (bot.shouldExit) {
                return;
            }

            if (LoneWolf.stopArmySync("COMPLETE")) {
                Core.logger(`${VictorMatsuriMaskado_LW.logPrefix} playerOne published COMPLETE.`);
            } else {
                Core.logger(`${VictorMatsuriMaskado_LW.logPrefix} playerOne could not publish COMPLETE.`);
            }

            return;
        }

        if (LoneWolf.syncArmy("STOP_CHECK")) {
            Core.logger(`${VictorMatsuriMaskado_LW.logPrefix} ${this.playerAlias} unexpectedly passed STOP_CHECK.`);
        } else {
            Core.logger(`${VictorMatsuriMaskado_LW.logPrefix} ${this.playerAlias} detected COMPLETE.`);
        }
    }

    private failure(message: string, source: string): boolean {
        Core.logger(message, source, { messageBox: true, stopBot: true });
        return false;
    }
}

export const scriptOptions = defineScriptOptions(
    "VictorMatsuriMaskado_LW",
    [
        LoneWolf.player1,
        LoneWolf.player2,
        LoneWolf.player3,
        LoneWolf.player4,
        option.choice(
            "ArmyComposition",
            "Army Composition",
            "Default: LR / SC / AP / LOO\nStable: VDK / SC / AP / LOO",
            choices(ArmyComposition),
            ArmyComposition.Default,
        ),
        option.int("PrivateRoomNumber", "Private Room Number", "Private room number from 1001 through 99999.", 0),
        option.bool("UsePotions", "Use Potions", "Prepare and use the assigned Masakado potion loadout.", true),
        option.bool(
            "UseEnhancements",
            "Use Enhancements",
            "Prepare the assigned enhancements. Player 1 Praxis is always required.",
            true,
        ),
        option.bool(
            "RunMasakado",
            "Run Masakado",
            "Fight Masakado after all four accounts finish the storyline.",
            true,
        ),
    ],
    true,
);

export default function main(): void {
    const script = new VictorMatsuriMaskado_LW();
    bot.skills.stop();
    bot.options.infiniteRange = true;
    LoneWolf.setAntiLag();
    bot.config?.configure();

    try {
        script.run();
    } finally {
        LoneWolf.setOrdinarySkillsSuppressed(false);
        LoneWolf.stopSkillEngine();
        bot.combat.cancelAutoAttack();
        bot.combat.cancelTarget();
    }
}

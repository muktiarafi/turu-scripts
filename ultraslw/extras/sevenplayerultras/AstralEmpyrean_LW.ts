/*
name: Astral Empyrean LW
description: Seven-player CoreLoneWolf Army script for Astral Empyrean.
tags: ultra, astral empyrean, seven-player, army, corelonewolf
*/
// Port of Extras/SevenPlayerUltras/AstralEmpyrean_LW.cs from UltrasLW by l0newolf12 (https://github.com/l0newolf12/UltrasLW, 8e48a9e).
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { type Ref, ref } from "../../LWRef";
import { bot, choices, defineScriptOptions, type EventMap, option } from "turu";
import { CapeSpecial, HelmSpecial } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";
import { type ClassPreset, CoreLoneWolf } from "../../CoreLoneWolf";

const LoneWolf = new CoreLoneWolf();

export enum ArmyComposition {
    Default = "Default",
    Stable = "Stable",
    Fast = "Fast",
}

export enum FightResult {
    Defeated = "Defeated",
    Reset = "Reset",
    Stopped = "Stopped",
}

export class AstralEmpyrean_LW {
    private static readonly logPrefix = "Astral Empyrean LW";
    private static readonly syncFileName = "AstralEmpyrean_LW.sync";
    private static readonly mapName = "astralshrine";
    private static readonly safeCell = "Enter";
    private static readonly safePad = "Spawn";
    private static readonly bossCell = "r2";
    private static readonly bossPad = "Left";
    private static readonly enrageScroll = "Scroll of Enrage";
    private static readonly packetCommand = "ct";
    private static readonly starfirePacketText = "starfire";
    private static readonly bossPacketText = '"cInf":"m:1"';
    private static readonly stardustBreathPacketText = '"animStr":"Attack2"';
    private static readonly ultraQuestId = 9803;
    private static readonly prerequisiteQuestId = 9802;
    private static readonly prerequisiteQuestName = "Hoshiyoru";
    private static readonly minimumLevel = 95;
    private static readonly bossMapId = 1;
    private static readonly fightPollDelay = 100;
    private static readonly respawnPollDelay = 500;
    private static readonly maxFightAttempts = 3;
    private static readonly deathResetThreshold = 3;
    private static readonly zoneBTargetX = 240;
    private static readonly zoneBTargetY = 200;
    private static readonly zoneATargetX = 600;
    private static readonly zoneATargetY = 430;

    private readonly pendingZones: string[] = [];
    // C#'s zoneLock: the zone queue is only touched on the script thread here.

    private playerAlias: string = "";
    private armyComposition: ArmyComposition = null!;
    private armyPlayerCount: number = 0;
    private isTaunter: boolean = false;
    private isTimedHealer: boolean = false;
    private privateRoomNumber: number = 0;

    private get usesStableRoleLayout(): boolean {
        return this.armyComposition === ArmyComposition.Stable;
    }

    static player6 = option.text("player6", "Player 6 (Optional)", "Player 6 (Optional) account name.", "");
    static player7 = option.text("player7", "Player 7 (Optional)", "Player 7 (Optional) account name.", "");

    run(): void {
        if (!this.validateOptions()) {
            return;
        }

        if (!LoneWolf.startArmySync(AstralEmpyrean_LW.syncFileName, this.armyPlayerCount)) {
            return;
        }

        if (this.armyPlayerCount < 6 && LoneWolf.isArmyPlayer(1)) {
            Core.logger("Bard is not configured. Astral Empyrean may fail without it.", "Run", { messageBox: true });
        }

        const preset = this.getClassPreset();
        if (
            !LoneWolf.validateUltraAccess(
                AstralEmpyrean_LW.ultraQuestId,
                AstralEmpyrean_LW.prerequisiteQuestId,
                AstralEmpyrean_LW.prerequisiteQuestName,
                AstralEmpyrean_LW.minimumLevel,
                AstralEmpyrean_LW.logPrefix,
                preset.className,
            )
        ) {
            return;
        }

        this.playerAlias = this.getPlayerAlias();
        this.isTaunter = this.usesStableRoleLayout
            ? LoneWolf.isArmyPlayer(3) || LoneWolf.isArmyPlayer(5)
            : LoneWolf.isArmyPlayer(1) || LoneWolf.isArmyPlayer(5);
        this.isTimedHealer = LoneWolf.isArmyPlayer(4);

        this.applyAstralOverrides(preset);
        Core.logger(
            `${AstralEmpyrean_LW.logPrefix} started as ${this.playerAlias} using ${this.armyComposition} composition.`,
        );

        LoneWolf.acceptUltraQuest(AstralEmpyrean_LW.ultraQuestId);

        if (!this.prepare(preset) || !this.sync("SETUP_DONE")) {
            return;
        }

        if (!this.runFightAttempts(preset) || !this.sync("BOSS_DEFEATED")) {
            return;
        }

        Core.jump(AstralEmpyrean_LW.safeCell, AstralEmpyrean_LW.safePad);
        LoneWolf.completeUltraQuest(AstralEmpyrean_LW.ultraQuestId);

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
        Core.logger(`${AstralEmpyrean_LW.logPrefix} ${this.playerAlias} starting setup.`);

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

        if (this.isTaunter) {
            LoneWolf.prepareScrolls(AstralEmpyrean_LW.enrageScroll);
        }

        if (bot.shouldExit) {
            return false;
        }

        this.warnIfVaingloryCapeIsEquipped();
        Core.logger(`${AstralEmpyrean_LW.logPrefix} ${this.playerAlias} finished setup.`);
        return true;
    }

    private prepareSafeRoom(preset: ClassPreset): boolean {
        if (bot.config!.get<boolean>("UsePotions")) {
            LoneWolf.usePotions(preset.tonic, preset.elixir, preset.combatPotion);
        }

        if (this.isTaunter) {
            LoneWolf.equipScroll(AstralEmpyrean_LW.enrageScroll);
        }

        LoneWolf.genericPrebuff();
        return !bot.shouldExit;
    }

    private runFightAttempts(preset: ClassPreset): boolean {
        for (
            let fightAttempt = 1;
            fightAttempt <= AstralEmpyrean_LW.maxFightAttempts && !bot.shouldExit;
            fightAttempt++
        ) {
            Core.join(
                `${AstralEmpyrean_LW.mapName}-${this.privateRoomNumber}`,
                AstralEmpyrean_LW.safeCell,
                AstralEmpyrean_LW.safePad,
            );

            if (!this.prepareSafeRoom(preset)) {
                return false;
            }

            this.startZoneListener();
            if (!this.startFightPacketDetector()) {
                Core.logger("The Astral fight packet detector could not be started.", "RunFightAttempts", {
                    messageBox: true,
                    stopBot: true,
                });
                this.stopZoneListener();
                return false;
            }

            let result: FightResult;
            try {
                if (!this.sync("FIGHT_READY")) {
                    return false;
                }

                Core.jump(AstralEmpyrean_LW.bossCell, AstralEmpyrean_LW.bossPad);

                if (bot.shouldExit || !this.sync("START_FIGHT")) {
                    return false;
                }

                result = this.fight(preset, fightAttempt);
            } finally {
                LoneWolf.stopPacketDetector();
                this.stopZoneListener();
            }

            if (result === FightResult.Defeated) {
                return true;
            }

            if (result !== FightResult.Reset || !this.handleFightReset(fightAttempt)) {
                return false;
            }

            if (fightAttempt >= AstralEmpyrean_LW.maxFightAttempts) {
                this.stopArmyAfterFailedAttempts();
                return false;
            }
        }

        return false;
    }

    private fight(preset: ClassPreset, fightAttempt: number): FightResult {
        LoneWolf.startSkillEngine(
            preset.skills,
            this.playerAlias,
            this.isTaunter,
            AstralEmpyrean_LW.logPrefix,
            preset.skillMode,
            !this.usesStableRoleLayout || !LoneWolf.isArmyPlayer(1),
            !this.isTaunter && bot.config!.get<boolean>("UsePotions") ? preset.combatPotion : null,
        );
        Core.logger(`${AstralEmpyrean_LW.logPrefix} ${this.playerAlias} started fighting attempt ${fightAttempt}.`);

        let bossObservedAlive = false;
        let nextStarfireCycle = 1;
        let nextStardustBreath = 1;
        const openingTauntAt = Date.now() + 1500;
        let openingTauntRequested = !LoneWolf.isArmyPlayer(5);

        while (!bot.shouldExit) {
            this.drainZoneEvents(bot.player.alive);

            if (LoneWolf.shouldResetFight(fightAttempt, AstralEmpyrean_LW.deathResetThreshold)) {
                this.stopFightCombat();
                return FightResult.Reset;
            }

            if (!bot.player.alive) {
                Core.logger(`${AstralEmpyrean_LW.logPrefix} ${this.playerAlias} died.`);

                while (!bot.shouldExit && !bot.player.alive) {
                    this.drainZoneEvents(false);
                    this.processStarfireDetections(
                        ref(
                            () => nextStarfireCycle,
                            (v) => (nextStarfireCycle = v),
                        ),
                        false,
                    );
                    this.processStardustBreathDetections(
                        ref(
                            () => nextStardustBreath,
                            (v) => (nextStardustBreath = v),
                        ),
                        false,
                    );

                    if (LoneWolf.shouldResetFight(fightAttempt, AstralEmpyrean_LW.deathResetThreshold)) {
                        this.stopFightCombat();
                        return FightResult.Reset;
                    }

                    bot.sleep(AstralEmpyrean_LW.respawnPollDelay);
                }

                if (bot.shouldExit) {
                    break;
                }

                if (LoneWolf.shouldResetFight(fightAttempt, AstralEmpyrean_LW.deathResetThreshold)) {
                    this.stopFightCombat();
                    return FightResult.Reset;
                }

                Core.logger(`${AstralEmpyrean_LW.logPrefix} ${this.playerAlias} respawned.`);

                if (bot.player.cell !== AstralEmpyrean_LW.bossCell || bot.player.pad !== AstralEmpyrean_LW.bossPad) {
                    Core.jump(AstralEmpyrean_LW.bossCell, AstralEmpyrean_LW.bossPad);
                }

                continue;
            }

            const bossAlive = LoneWolf.isMonsterAlive(AstralEmpyrean_LW.bossMapId);
            if (bossAlive) {
                bossObservedAlive = true;
            } else if (bossObservedAlive) {
                break;
            }

            if (!openingTauntRequested && bossAlive && Date.now() >= openingTauntAt) {
                openingTauntRequested = true;
                LoneWolf.requestAbsolutePriorityTaunt(AstralEmpyrean_LW.bossMapId);
                Core.logger(`${AstralEmpyrean_LW.logPrefix} ${this.playerAlias} requested the opening taunt.`);
            }

            LoneWolf.maintainTarget(AstralEmpyrean_LW.bossMapId);
            this.processStarfireDetections(
                ref(
                    () => nextStarfireCycle,
                    (v) => (nextStarfireCycle = v),
                ),
                true,
            );
            this.processStardustBreathDetections(
                ref(
                    () => nextStardustBreath,
                    (v) => (nextStardustBreath = v),
                ),
                true,
            );
            bot.sleep(AstralEmpyrean_LW.fightPollDelay);
        }

        this.stopFightCombat();

        if (bot.shouldExit || !bossObservedAlive) {
            return FightResult.Stopped;
        }

        Core.logger(`${AstralEmpyrean_LW.logPrefix} ${this.playerAlias} confirmed Astral Empyrean defeated.`);
        return FightResult.Defeated;
    }

    private processStarfireDetections(nextStarfireCycle: Ref<number>, requestTaunt: boolean): void {
        if (!this.isTaunter) {
            return;
        }

        while (LoneWolf.hasPacketDetection(nextStarfireCycle.value)) {
            const ownsCycle =
                nextStarfireCycle.value % 2 === 1
                    ? LoneWolf.isArmyPlayer(this.usesStableRoleLayout ? 3 : 1)
                    : LoneWolf.isArmyPlayer(5);

            if (ownsCycle && requestTaunt) {
                LoneWolf.requestAbsolutePriorityTaunt(AstralEmpyrean_LW.bossMapId);
                Core.logger(
                    `${AstralEmpyrean_LW.logPrefix} ${this.playerAlias} requested absolute priority Starfire taunt ${nextStarfireCycle.value}.`,
                );
            }

            nextStarfireCycle.value++;
        }
    }

    private startFightPacketDetector(): boolean {
        if (this.isTaunter) {
            return LoneWolf.startPacketDetector(AstralEmpyrean_LW.packetCommand, AstralEmpyrean_LW.starfirePacketText);
        }

        if (this.isTimedHealer) {
            return LoneWolf.startPacketDetector(AstralEmpyrean_LW.packetCommand, [
                AstralEmpyrean_LW.bossPacketText,
                AstralEmpyrean_LW.stardustBreathPacketText,
            ]);
        }

        return true;
    }

    private processStardustBreathDetections(nextStardustBreath: Ref<number>, requestHeal: boolean): void {
        if (!this.isTimedHealer) {
            return;
        }

        while (LoneWolf.hasPacketDetection(nextStardustBreath.value)) {
            if (requestHeal) {
                LoneWolf.requestAbsolutePrioritySkill(2);
                Core.logger(
                    `${AstralEmpyrean_LW.logPrefix} ${this.playerAlias} requested timed Stardust Breath heal ${nextStardustBreath.value}.`,
                );
            }

            nextStardustBreath.value++;
        }
    }

    private startZoneListener(): void {
        {
            this.pendingZones.splice(0);
        }

        bot.events.off("runToArea", this.onRunToArea);
        bot.events.on("runToArea", this.onRunToArea);
    }

    stopZoneListener(): void {
        bot.events.off("runToArea", this.onRunToArea);

        {
            this.pendingZones.splice(0);
        }
    }

    private onRunToArea = ({ zone }: EventMap["runToArea"]): void => {
        if (zone !== "A" && zone !== "B") {
            return;
        }

        {
            this.pendingZones.push(zone);
        }
    };

    private drainZoneEvents(move: boolean): void {
        while (true) {
            let zone: string;
            {
                if (this.pendingZones.length === 0) {
                    return;
                }

                zone = this.pendingZones.shift()!;
            }

            if (!move) {
                continue;
            }

            if (zone === "B") {
                bot.player.walkTo(AstralEmpyrean_LW.zoneBTargetX, AstralEmpyrean_LW.zoneBTargetY);
            } else {
                bot.player.walkTo(AstralEmpyrean_LW.zoneATargetX, AstralEmpyrean_LW.zoneATargetY);
            }
        }
    }

    private handleFightReset(fightAttempt: number): boolean {
        LoneWolf.stopSkillEngine();
        bot.combat.cancelTarget();

        while (!bot.shouldExit && !bot.player.alive) {
            LoneWolf.shouldResetFight(fightAttempt, AstralEmpyrean_LW.deathResetThreshold);
            bot.sleep(AstralEmpyrean_LW.respawnPollDelay);
        }

        if (bot.shouldExit) {
            return false;
        }

        LoneWolf.shouldResetFight(fightAttempt, AstralEmpyrean_LW.deathResetThreshold);
        Core.jump(AstralEmpyrean_LW.safeCell, AstralEmpyrean_LW.safePad);

        if (!this.isInSafeRoom()) {
            Core.logger(
                `${AstralEmpyrean_LW.logPrefix} ${this.playerAlias} could not reach the safe room after reset.`,
                "HandleFightReset",
                { messageBox: true, stopBot: true },
            );
            return false;
        }

        return this.sync(`FIGHT_RESET_${fightAttempt}_SAFE`);
    }

    private stopFightCombat(): void {
        LoneWolf.stopSkillEngine();
        bot.combat.cancelTarget();
    }

    private warnIfVaingloryCapeIsEquipped(): void {
        for (const item of bot.inventory.items) {
            if (
                !item.equipped ||
                !(item.category?.toLowerCase() === "Cape"?.toLowerCase()) ||
                item.enhancementPatternId !== CapeSpecial.Vainglory
            ) {
                continue;
            }

            Core.logger("Vainglory is enhanced on the cape. Astral Empyrean will fail.", "Prepare", {
                messageBox: true,
            });
            return;
        }
    }

    private applyAstralOverrides(preset: ClassPreset): void {
        if (preset.capeEnhancement === CapeSpecial.Vainglory) {
            preset.capeEnhancement = CapeSpecial.Lament;
        }

        if (this.armyComposition === ArmyComposition.Fast && LoneWolf.isArmyPlayer(7)) {
            preset.helmEnhancement = HelmSpecial.Forge;
        }

        if (this.isTimedHealer) {
            preset.capeEnhancement = CapeSpecial.Absolution;
            preset.skills = [3, 1, 4];
        }

        if (this.isTaunter) {
            preset.combatPotion = null;
        }
    }

    private getClassPreset(): ClassPreset {
        if (this.usesStableRoleLayout) {
            if (LoneWolf.isArmyPlayer(1)) {
                return LoneWolf.kingsEcho();
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

            return LoneWolf.archFiend();
        }

        if (LoneWolf.isArmyPlayer(1)) {
            return LoneWolf.legionRevenant();
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

        return this.armyComposition === ArmyComposition.Fast ? LoneWolf.arcanaInvoker() : LoneWolf.shaman();
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
        return bot.player.cell?.toLowerCase() === AstralEmpyrean_LW.safeCell?.toLowerCase();
    }

    private sync(step: string): boolean {
        Core.logger(`${AstralEmpyrean_LW.logPrefix} ${this.playerAlias} entering ${step}.`);

        if (!LoneWolf.syncArmy(step)) {
            return false;
        }

        Core.logger(`${AstralEmpyrean_LW.logPrefix} ${this.playerAlias} continued from ${step}.`);
        return true;
    }

    private stopArmyAfterFailedAttempts(): void {
        if (LoneWolf.isArmyPlayer(1)) {
            LoneWolf.stopArmySync("ATTEMPTS_EXHAUSTED");
        } else {
            LoneWolf.syncArmy("STOP_CHECK");
        }

        Core.logger(
            `${AstralEmpyrean_LW.logPrefix} failed after ${AstralEmpyrean_LW.maxFightAttempts} fight attempts.`,
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
                Core.logger(`${AstralEmpyrean_LW.logPrefix} playerOne published COMPLETE.`);
            } else {
                Core.logger(`${AstralEmpyrean_LW.logPrefix} playerOne could not publish COMPLETE.`);
            }

            return;
        }

        if (LoneWolf.syncArmy("STOP_CHECK")) {
            Core.logger(`${AstralEmpyrean_LW.logPrefix} ${this.playerAlias} unexpectedly passed STOP_CHECK.`);
        } else {
            Core.logger(`${AstralEmpyrean_LW.logPrefix} ${this.playerAlias} detected COMPLETE.`);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "AstralEmpyrean_LW",
    [
        LoneWolf.player1,
        LoneWolf.player2,
        LoneWolf.player3,
        LoneWolf.player4,
        LoneWolf.player5,
        AstralEmpyrean_LW.player6,
        AstralEmpyrean_LW.player7,
        option.choice(
            "ArmyComposition",
            "Army Composition",
            "Default: LR / SC / AP / LOO / VDK / Bard / Shaman\nStable: KE / SC / AP / LOO / VDK / Bard / AF\nFast: LR / SC / AP / LOO / VDK / Bard / AI",
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
    const script = new AstralEmpyrean_LW();
    bot.skills.stop();
    bot.options.infiniteRange = true;
    LoneWolf.setAntiLag();
    bot.config?.configure();

    try {
        script.run();
    } finally {
        LoneWolf.stopPacketDetector();
        script.stopZoneListener();
        LoneWolf.stopSkillEngine();
    }
}

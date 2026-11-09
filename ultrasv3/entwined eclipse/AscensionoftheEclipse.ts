/*
name: Ascend Eclipse Test
description: Tests the Ascension of the Eclipse dungeon in a loop. Handles dual final bosses (Ascended Solstice + Ascended Midnight) with HP-balanced targeting, alternating convergence taunts, and Daybreak/Nightfall cross-cancel mechanic.
tags: greatblade, entwined, eclipse, ascend, ascendeclipse, army, taunt, test
*/
// Port of Scripts/Ultrasv3/Entwined Eclipse/AscensionoftheEclipse.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, type EventMap, defineScriptOptions, option } from "turu";
import { CoreArmyLite } from "../../army/CoreArmyLite";
import { CapeSpecial, CoreAdvanced, EnhancementType, HelmSpecial, WeaponSpecial } from "../../core/CoreAdvanced";
import { Core, rethrowIfStopped } from "../../core/CoreBots";
import { tasks } from "../../core/CoreTasks";
import { auraRemainingTime, CoreEngine } from "./CoreEngine";
import { CoreUltra } from "./CoreUltra";

const Engine = new CoreEngine();
const Ultra = new CoreUltra();
const Adv = new CoreAdvanced();
const sArmy = new CoreArmyLite();

export class AscendEclipseTest {
    // Fixed 4-class lineup
    static readonly player1Class = "Legion Revenant";
    // moon/Midnight side
    static readonly player2Class = "StoneCrusher";
    // sun/Solstice side
    static readonly player3Class = "ArchPaladin";
    // sun/Solstice side
    static readonly player4Class = "Lord of Order";
    // moon/Midnight side

    readonly lrSkillList: number[] = [3, 4, 2, 1];
    readonly scSkillList: number[] = [3, 2, 4, 1];
    readonly apSkillList: number[] = [2, 3, 1, 4];
    readonly looSkillList: number[] = [2, 3, 1, 4];

    // Final boss names
    static readonly ascendedSolstice = "Ascended Solstice";
    // sun — Solar Charge  → "The Sun Converges"
    static readonly ascendedMidnight = "Ascended Midnight";
    // moon — Lunar Charge → "The Moon Converges"

    // Usable-slot taunt item
    static readonly tauntItem = "Scroll of Enrage";

    autoEnhance: boolean = false;
    autoGetEnrage: boolean = false;
    usePotions: boolean = false;
    oracleClassTauntReset: boolean = false;
    runCount: number = 0;
    syncFilesClearedOnStartup: boolean = false;

    /**
     * Optional orchestration hook: when > 0, the main loop exits once the account holds
     * at least this many Ecliptic Offering. Leave 0 for the normal "loop forever" behavior.
     */
    targetEclipticOfferingCount: number = 0;
    static readonly eclipticOffering = "Ecliptic Offering";

    /**
     * Orchestration hook: when true, skip Core.SetOptions(true/false). Used when this
     * script is invoked from a parent orchestrator that runs its own SetOptions.
     */
    skipSetOptions: boolean = false;
    /**
     * The private room when run by another script (`skipSetOptions`), which doesn't have this
     * script's options: 0 picks one from the army. Run on its own, the privateRoomNumber option.
     */
    privateRoomNumber: number = 0;

    // ── Dungeon run ───────────────────────────────────────────────────────────

    runAscendEclipse(): void {
        const run = ++this.runCount;
        const runCheckpoint = `AscendEclipse_${run}`;

        this.resetReusableSyncFiles();

        this.resetDungeonInstance("ascendeclipse", runCheckpoint);

        // Enter room — focus Fallen Star, swap to Blessless Deer while Solar Flare is active
        this.armyKillStarWithDeerCleanse("ascendeclipse", "Enter", "Left", `${runCheckpoint}_01`);

        // r1 — everyone rotates taunt on Suffocated Light
        this.armyKillMonsterWithRotatingAuraTaunt(
            "ascendeclipse",
            "r1",
            "Left",
            "Suffocated Light",
            "Gathering Light",
            `${runCheckpoint}_03`,
            "Imprisoned Fairy",
        );

        // r2 — SC focuses/taunts Sunset Knight, everyone else attacks Moon Haze with LR taunting it
        this.armyKillRoom2SplitTaunt("ascendeclipse", "r2", "Left", `${runCheckpoint}_05`);

        // r3 — dual final boss fight (Ascended Solstice + Ascended Midnight simultaneously)
        this.armyKillDualBoss("ascendeclipse", "r3", "Left", `${runCheckpoint}_07`);

        // Daily quest completion
        this.tryCompleteDailyQuest(9305, "Ecliptic Offering");
    }

    getConfiguredClassForCurrentAccount(): string {
        const username = Core.username();

        if (username.toLowerCase() === bot.config!.get<string>("player1").toLowerCase()) {
            return AscendEclipseTest.player1Class;
        }
        if (username.toLowerCase() === bot.config.get<string>("player2").toLowerCase()) {
            return AscendEclipseTest.player2Class;
        }
        if (username.toLowerCase() === bot.config.get<string>("player3").toLowerCase()) {
            return AscendEclipseTest.player3Class;
        }
        if (username.toLowerCase() === bot.config.get<string>("player4").toLowerCase()) {
            return AscendEclipseTest.player4Class;
        }

        return bot.player.currentClass ?? "";
    }

    resetClassStateWithOracle(originalClass: string): void {
        const resetClass = "Oracle";

        bot.skills.pause();
        try {
            if (Core.checkInventory(resetClass)) {
                this.equipClassByName(resetClass);
                bot.sleep(1000);
            } else {
                Core.logger(
                    "[Taunt Check] Oracle is missing, so class-state reset is limited to re-equipping the original class.",
                );
            }

            if (!!originalClass?.trim()) {
                this.equipClassByName(originalClass);
                bot.sleep(1000);
            }
        } finally {
            bot.skills.resume();
        }
    }

    oracleResetBeforeRoomFight(checkpoint: string): void {
        const assignedClass = this.getConfiguredClassForCurrentAccount();
        const logPrefix = `[Taunt Setup ${checkpoint}]`;

        this.syncArmy(`${checkpoint}_oracle_reset_ready.sync`);

        if (this.oracleClassTauntReset) {
            Core.logger(`[Oracle Reset] Resetting class state before ${checkpoint}: Oracle -> ${assignedClass}.`);
            this.resetClassStateWithOracle(assignedClass);
            Core.logger(`[Oracle Reset] Class state reset complete before ${checkpoint}.`);
        } else {
            Core.logger(`[Oracle Reset] Skipped before ${checkpoint}; option is OFF.`);
        }

        this.ensureTauntItemEquipped(logPrefix);

        this.syncArmy(`${checkpoint}_oracle_reset_done.sync`);
        Core.logger(`[Oracle Reset] Class state reset complete before ${checkpoint}.`);
    }

    ensureTauntItemEquipped(logPrefix: string): void {
        if (!Core.checkInventory(AscendEclipseTest.tauntItem)) {
            Core.logger(`${logPrefix} ${AscendEclipseTest.tauntItem} is missing; boss charges will NOT be redirected.`);
            return;
        }

        if (!bot.inventory.isEquipped(AscendEclipseTest.tauntItem)) {
            bot.inventory.equipUsableItem(AscendEclipseTest.tauntItem);
            bot.sleep(750);
        }

        if (bot.inventory.isEquipped(AscendEclipseTest.tauntItem)) {
            Core.logger(`${logPrefix} ${AscendEclipseTest.tauntItem} equipped.`);
        } else {
            Core.logger(
                `${logPrefix} Tried to equip ${AscendEclipseTest.tauntItem}, but it is not showing as equipped.`,
            );
        }
    }

    // ── Army helpers ──────────────────────────────────────────────────────────

    /**
     * C#'s `LogR3Debug(cell, ref lastStatusLogAt, ref lastAuraLogAt, ref lastTarget)`: returns the new
     * `lastStatusLogAt` (the only one it writes).
     */
    logR3Debug(cell: string, lastStatusLogAt: number, _lastAuraLogAt: number, _lastTarget: string): number {
        const now = Date.now();

        if (now - lastStatusLogAt <= 3000) {
            return lastStatusLogAt;
        }

        const solstice =
            bot.monsters.mapMonsters.find(
                (m) =>
                    m != null &&
                    m.name?.toLowerCase() === AscendEclipseTest.ascendedSolstice?.toLowerCase() &&
                    m.cell?.toLowerCase() === cell?.toLowerCase() &&
                    m.hp > 0 &&
                    m.state > 0,
            ) ?? null;

        const midnight =
            bot.monsters.mapMonsters.find(
                (m) =>
                    m != null &&
                    m.name?.toLowerCase() === AscendEclipseTest.ascendedMidnight?.toLowerCase() &&
                    m.cell?.toLowerCase() === cell?.toLowerCase() &&
                    m.hp > 0 &&
                    m.state > 0,
            ) ?? null;

        const solsticeText =
            solstice == null
                ? "dead/missing"
                : `${solstice.hp}/${solstice.maxHp} (${this.getHpPercent(solstice.hp, solstice.maxHp).toFixed(1)}%)`;

        const midnightText =
            midnight == null
                ? "dead/missing"
                : `${midnight.hp}/${midnight.maxHp} (${this.getHpPercent(midnight.hp, midnight.maxHp).toFixed(1)}%)`;

        Core.logger(
            `[r3 Status] HP: Solstice=${solsticeText}, Midnight=${midnightText}; ` +
                `Me: HP=${bot.player.health}, Alive=${bot.player.alive}, Cell=${bot.player.cell}, ` +
                `HasTarget=${bot.player.hasTarget}`,
        );

        return now;
    }

    getHpPercent(hp: number, maxHp: number): number {
        if (maxHp <= 0) {
            return 0;
        }

        return (hp * 100) / maxHp;
    }

    armyKillStarWithDeerCleanse(map: string, cell: string, pad: string, checkpoint: string): void {
        this.joinAndFocus(map, cell, pad);
        this.syncArmy(`${checkpoint}_ready.sync`);

        let noTargetSince = 0;

        while (!bot.shouldExit) {
            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);

                if (!(bot.player.cell?.toLowerCase() === cell?.toLowerCase())) {
                    bot.map.jump(cell, pad, false);
                    bot.wait.forCellChange(cell);
                }

                bot.player.setSpawnPoint();
                bot.sleep(500);
                continue;
            }

            if (!(bot.player.cell?.toLowerCase() === cell?.toLowerCase())) {
                bot.map.jump(cell, pad, false);
                bot.wait.forCellChange(cell);
                bot.player.setSpawnPoint();
            }

            const isDeerFocusPlayer = this.isConfiguredAccount(bot.config!.get<string>("player4") ?? "");
            const hasSolarFlare = bot.self.hasActiveAura("Solar Flare");

            const target = this.pickEnterRoomTarget(isDeerFocusPlayer, hasSolarFlare, cell);

            bot.combat.attack(target);
            this.useClassSkills();
            bot.sleep(400);

            const fallenStarAlive = this.monsterAvailable("Fallen Star", cell);
            const blesslessDeerAlive = this.monsterAvailable("Blessless Deer", cell);

            if (!fallenStarAlive && !blesslessDeerAlive) {
                noTargetSince = noTargetSince === 0 ? Date.now() : noTargetSince;

                if (Date.now() - noTargetSince > 1800) {
                    break;
                }
            } else {
                noTargetSince = 0;
            }
        }

        this.syncArmy(`${checkpoint}_done.sync`);
    }

    armyKillRoom2SplitTaunt(map: string, cell: string, pad: string, checkpoint: string): void {
        this.joinAndFocus(map, cell, pad);
        this.syncArmy(`${checkpoint}_ready.sync`);
        this.oracleResetBeforeRoomFight(checkpoint);

        this.killRoom2SplitTaunt(cell, pad);

        this.syncArmy(`${checkpoint}_done.sync`);
    }

    pickEnterRoomTarget(isDeerFocusPlayer: boolean, hasSolarFlare: boolean, cell: string): string {
        const fallenStarAlive = this.monsterAvailable("Fallen Star", cell);
        const blesslessDeerAlive = this.monsterAvailable("Blessless Deer", cell);

        if (!fallenStarAlive && !blesslessDeerAlive) {
            return "";
        }

        if (isDeerFocusPlayer && blesslessDeerAlive) {
            return "Blessless Deer";
        }

        if (hasSolarFlare && blesslessDeerAlive) {
            return "Blessless Deer";
        }

        if (fallenStarAlive) {
            return "Fallen Star";
        }

        return "Blessless Deer";
    }

    armyKillMonster(map: string, cell: string, pad: string, monster: string, checkpoint: string): void {
        this.joinAndFocus(map, cell, pad);
        this.syncArmy(`${checkpoint}_ready.sync`);
        this.killFocusedMonster(monster, cell, pad);
        this.syncArmy(`${checkpoint}_done.sync`);
    }

    armyKillMonsterWithRotatingAuraTaunt(
        map: string,
        cell: string,
        pad: string,
        monster: string,
        auraName: string,
        checkpoint: string,
        nextMonster: string | null = null,
    ): void {
        this.joinAndFocus(map, cell, pad);
        this.syncArmy(`${checkpoint}_ready.sync`);
        this.oracleResetBeforeRoomFight(checkpoint);

        this.killFocusedMonsterWithLrApAuraTaunt(monster, auraName, cell, pad, nextMonster);

        this.syncArmy(`${checkpoint}_done.sync`);
    }

    armyKillWithDelayedTaunt(
        map: string,
        cell: string,
        pad: string,
        monster: string,
        checkpoint: string,
        sunSide: boolean,
        enrageMessage: string,
        tauntOffsetSeconds = 6,
    ): void {
        this.joinAndFocus(map, cell, pad);
        this.syncArmy(`${checkpoint}_ready.sync`);
        const isTaunter = sunSide ? this.isSunTaunter() : this.isMoonTaunter();
        const startingTaunterConfig = sunSide ? "player1" : "player3";
        this.bossFight(monster, cell, enrageMessage, isTaunter, tauntOffsetSeconds, startingTaunterConfig);
        this.syncArmy(`${checkpoint}_done.sync`);
    }

    /**
     * Fights both Ascended Solstice and Ascended Midnight simultaneously.
     * - Sun taunters (player2+3 / SC+AP) redirect "The Sun Converges" onto Solstice.
     * - Moon taunters (player1+4 / LR+LoO) redirect "The Moon Converges" onto Midnight.
     * - SC + AP focus Ascended Solstice.
     * - LR + LoO focus Ascended Midnight.
     * - Hollowed Eclipse (both convergences active = -5000% defenses) is avoided because
     * the 10s charge cooldown naturally spaces the two convergences apart.
     */
    armyKillDualBoss(map: string, cell: string, pad: string, checkpoint: string): void {
        let resetCount = 0;

        while (!bot.shouldExit) {
            const attemptCheckpoint = resetCount === 0 ? checkpoint : `${checkpoint}_retry_${resetCount}`;
            this.joinAndFocus(map, cell, pad);
            this.syncArmy(`${attemptCheckpoint}_ready.sync`);
            this.oracleResetBeforeRoomFight(attemptCheckpoint);

            if (this.dualBossFight(cell, pad, attemptCheckpoint)) {
                break;
            }

            resetCount++;
            Core.logger(`[r3 Reset] Player death detected; resetting dual boss fight. Attempt #${resetCount}.`);
            this.resetR3Fight(map, "r3a", "Left", cell, pad, `${attemptCheckpoint}_soft_reset`);
        }

        this.syncArmy(`${checkpoint}_done.sync`);
    }

    // ── Dual boss fight ───────────────────────────────────────────────────────

    dualBossFight(cell: string, pad: string, checkpoint: string): boolean {
        const RequestDeathReset = (): void => {
            Core.logger("[r3 Death Reset] I died; requesting r3 reset.");

            this.updateSyncLines(deathResetPath, (lines) => [
                ...lines.filter((l) => !l.toLowerCase().startsWith(`${checkpoint}:`.toLowerCase())),
                `${checkpoint}:${Core.username().toLowerCase()}:${Math.floor(Date.now() / 1000)}`,
            ]);
        };
        const DeathResetRequested = (): boolean => {
            const now = Math.floor(Date.now() / 1000);

            return this.readSyncLines(deathResetPath)
                .map((l) => l.split(":"))
                .some(
                    (p) =>
                        p.length >= 3 &&
                        p[0].toLowerCase() === checkpoint.toLowerCase() &&
                        /^-?\d+$/.test(p[2]) &&
                        now - Number(p[2]) <= 120,
                );
        };
        const ReturnToFightCell = (): void => {
            if (bot.player.cell?.toLowerCase() === cell?.toLowerCase()) {
                if (!fightSpawnSet) {
                    bot.player.setSpawnPoint();
                    fightSpawnSet = true;
                }

                return;
            }

            Core.logger(`[Recover] Returning to ${cell} after respawn/desync.`);
            bot.map.jump(cell, pad, false);
            bot.wait.forCellChange(cell);
            bot.player.setSpawnPoint();
            fightSpawnSet = true;
            bot.sleep(500);
        };
        const Listener = (packet: EventMap["extensionPacket"]): void => {
            try {
                // C# listens to Bot.Flash.FlashCall ("pext" or "packetFromServer") and skips packets
                // whose raw text lacks "Converges" before parsing; Turu's extensionPacket event gives
                // the parsed packet, a JSON packet's data object as `params.dataObj` (C#'s `b.o`).
                const data: any | null = packet?.["params"]?.type === "json" ? packet["params"].dataObj : null;

                if (data == null || data!["cmd"]?.toString() !== "ct") {
                    return;
                }

                let sunTriggered = false;
                let moonTriggered = false;

                if (data!["anims"] != null) {
                    for (const a of data!.anims) {
                        if (a?.msg == null) {
                            continue;
                        }

                        const msg = a.msg;

                        if (msg.indexOf("The Sun Converges") >= 0) {
                            sunTriggered = true;
                        }

                        if (msg.indexOf("The Moon Converges") >= 0) {
                            moonTriggered = true;
                        }
                    }
                }

                if ((!sunTriggered || !moonTriggered) && data["a"] != null) {
                    for (const a of data.a) {
                        if (a == null || a!["cmd"]?.toString() !== "aura+" || a!["auras"] == null) {
                            continue;
                        }

                        for (const aura of a!["auras"]) {
                            if (aura?.msgOn == null || !aura!.isNew) {
                                continue;
                            }

                            const msg = aura!.msgOn;

                            if (msg.indexOf("The Sun Converges") >= 0) {
                                sunTriggered = true;
                            }

                            if (msg.indexOf("The Moon Converges") >= 0) {
                                moonTriggered = true;
                            }
                        }
                    }
                }

                const now = Date.now();

                if (sunTriggered && now - lastSunTriggerAt > 1500) {
                    lastSunTriggerAt = now;
                    sunCycle++;
                    sunNeedsEnrage = true;
                    sunHandledThisCycle = false;

                    const assignedSunSlot = sunCycle % 2 === 1 ? 2 : 3;
                    Core.logger(
                        `[Sun Taunt] 'The Sun Converges' detected. Sun cycle #${sunCycle}; assigned to player${assignedSunSlot}.`,
                    );
                }

                if (moonTriggered && now - lastMoonTriggerAt > 1500) {
                    lastMoonTriggerAt = now;
                    moonCycle++;
                    moonNeedsEnrage = true;
                    moonHandledThisCycle = false;

                    const assignedMoonSlot = moonCycle % 2 === 1 ? 1 : 4;
                    Core.logger(
                        `[Moon Taunt] 'The Moon Converges' detected. Moon cycle #${moonCycle}; assigned to player${assignedMoonSlot}.`,
                    );
                }
            } catch (error) {
                rethrowIfStopped(error);

                // Ignore malformed combat packets.
            }
        };
        // r3 uses local convergence-cycle ownership instead of "last taunter" memory.
        // Sun cycle odd/even: player2(SC) / player3(AP)
        // Moon cycle odd/even: player1(LR) / player4(LoO)
        let lastR3StatusLogAt = 0;
        let lastR3AuraLogAt = 0;
        let lastR3Target = "";

        let sunCycle = 0;
        let moonCycle = 0;

        let sunNeedsEnrage = false;
        let moonNeedsEnrage = false;
        let sunHandledThisCycle = true;
        let moonHandledThisCycle = true;

        let lastSunTriggerAt = 0;
        let lastMoonTriggerAt = 0;

        let lastSunWaitingLogCycle = 0;
        let lastMoonWaitingLogCycle = 0;

        let fightSpawnSet = false;
        let noTargetSince = 0;
        const solsticeFocusUntil = Date.now() + 0;
        const deathResetPath = this.syncGroupPath(`${checkpoint}_death_reset.signal`);
        let splitPhaseAnnounced = false;

        Core.logger("[r3 Focus] No all-Solstice opener; using split target with HP balance guard.");

        bot.events.on("extensionPacket", Listener);
        try {
            while (!bot.shouldExit) {
                if (DeathResetRequested()) {
                    Core.logger("[r3 Reset] Another player died; resetting dual boss fight.");
                    return false;
                }

                if (!bot.player.alive) {
                    RequestDeathReset();
                    bot.wait.forTrue(() => bot.player.alive, 20);
                    return false;
                }

                ReturnToFightCell();

                const mySlot = this.getMyPlayerSlot();

                lastR3StatusLogAt = this.logR3Debug(cell, lastR3StatusLogAt, lastR3AuraLogAt, lastR3Target);

                const solsticeAliveNow = this.monsterAvailable(AscendEclipseTest.ascendedSolstice, cell);
                const midnightAliveNow = this.monsterAvailable(AscendEclipseTest.ascendedMidnight, cell);

                if (!solsticeAliveNow && !midnightAliveNow) {
                    noTargetSince = noTargetSince === 0 ? Date.now() : noTargetSince;

                    if (Date.now() - noTargetSince > 500) {
                        return true;
                    }
                } else {
                    noTargetSince = 0;
                }

                // Clear stale convergence flags before processing taunts.
                // This prevents a late packet from forcing Scroll attempts after a boss is already dead.
                if (!solsticeAliveNow) {
                    sunNeedsEnrage = false;
                    sunHandledThisCycle = true;
                }

                if (!midnightAliveNow) {
                    moonNeedsEnrage = false;
                    moonHandledThisCycle = true;
                }

                // Keep opposite-side packet flags from polluting each account's logs.
                if (!this.isSunTaunter()) {
                    sunNeedsEnrage = false;
                    sunHandledThisCycle = true;
                }

                if (!this.isMoonTaunter()) {
                    moonNeedsEnrage = false;
                    moonHandledThisCycle = true;
                }

                // ── Sun convergence taunt (player2+3 / SC+AP on Ascended Solstice) ──────
                if (this.isSunTaunter() && sunNeedsEnrage && !sunHandledThisCycle) {
                    const assignedSunSlot = sunCycle % 2 === 1 ? 2 : 3;

                    if (mySlot === assignedSunSlot) {
                        Core.logger(`[Sun Taunt] Sun cycle #${sunCycle}; my slot player${mySlot} is assigned.`);
                        const taunted = this.tryR3Taunt("[Sun Taunt]", AscendEclipseTest.ascendedSolstice, cell);

                        if (taunted) {
                            sunNeedsEnrage = false;
                            sunHandledThisCycle = true;
                        }
                    } else {
                        if (lastSunWaitingLogCycle !== sunCycle) {
                            Core.logger(
                                `[Sun Taunt] Sun cycle #${sunCycle}; assigned to player${assignedSunSlot}, my slot is player${mySlot}. Continuing fight.`,
                            );
                            lastSunWaitingLogCycle = sunCycle;
                        }

                        sunNeedsEnrage = false;
                        sunHandledThisCycle = true;
                    }
                }

                // ── Moon convergence taunt (player1+4 / LR+LoO on Ascended Midnight) ─────
                if (this.isMoonTaunter() && moonNeedsEnrage && !moonHandledThisCycle) {
                    const assignedMoonSlot = moonCycle % 2 === 1 ? 1 : 4;

                    if (mySlot === assignedMoonSlot) {
                        Core.logger(`[Moon Taunt] Moon cycle #${moonCycle}; my slot player${mySlot} is assigned.`);
                        const taunted = this.tryR3Taunt("[Moon Taunt]", AscendEclipseTest.ascendedMidnight, cell);

                        if (taunted) {
                            moonNeedsEnrage = false;
                            moonHandledThisCycle = true;
                        }
                    } else {
                        if (lastMoonWaitingLogCycle !== moonCycle) {
                            Core.logger(
                                `[Moon Taunt] Moon cycle #${moonCycle}; assigned to player${assignedMoonSlot}, my slot is player${mySlot}. Continuing fight.`,
                            );
                            lastMoonWaitingLogCycle = moonCycle;
                        }

                        moonNeedsEnrage = false;
                        moonHandledThisCycle = true;
                    }
                }

                // ── r3 focus targets ───────────────────────────────────────────────
                // No opener by default.
                // Normal split:
                // SC + AP focus Ascended Solstice.
                // LR + LoO focus Ascended Midnight.
                // Balance guard in GetR3FocusTarget() temporarily shifts damage to Midnight
                // if Solstice gets too far ahead/lower.
                if (!splitPhaseAnnounced && Date.now() >= solsticeFocusUntil) {
                    Core.logger("[r3 Focus] Split target with HP balance guard active.");
                    splitPhaseAnnounced = true;
                }

                const target =
                    Date.now() < solsticeFocusUntil && this.monsterAvailable(AscendEclipseTest.ascendedSolstice, cell)
                        ? AscendEclipseTest.ascendedSolstice
                        : this.getR3FocusTarget(cell);

                if (!!target) {
                    bot.combat.attack(target);
                    this.useClassSkills();
                }

                bot.sleep(300);

                const solsticeAlive = this.monsterAvailable(AscendEclipseTest.ascendedSolstice, cell);
                const midnightAlive = this.monsterAvailable(AscendEclipseTest.ascendedMidnight, cell);

                if (!solsticeAlive && !midnightAlive) {
                    noTargetSince = noTargetSince === 0 ? Date.now() : noTargetSince;
                    if (Date.now() - noTargetSince > 1800) {
                        return true;
                    }
                } else {
                    noTargetSince = 0;
                }
            }
        } finally {
            bot.events.off("extensionPacket", Listener);
        }

        return false;
    }

    tryR3Taunt(logPrefix: string, bossName: string, cell: string): boolean {
        if (!this.monsterAvailable(bossName, cell)) {
            Core.logger(`${logPrefix} ${bossName} is not available; cannot taunt.`);
            return false;
        }

        Core.logger(`${logPrefix} Targeting ${bossName} for Scroll of Enrage.`);
        Core.logger(`${logPrefix} Force-using Scroll of Enrage on ${bossName}; skipping CanUseSkill(5) gate.`);

        bot.skills.pause();

        try {
            for (let attempt = 1; attempt <= 10 && !bot.shouldExit; attempt++) {
                if (!this.monsterAvailable(bossName, cell)) {
                    Core.logger(
                        `${logPrefix} ${bossName} died/disappeared during taunt attempts; treating taunt as handled.`,
                    );
                    return true;
                }

                Core.logger(`${logPrefix} Scroll attempt ${attempt}/10.`);

                // Retarget every attempt so a stale target or desync cannot make all retries hit the wrong target.
                bot.combat.attack(bossName);
                bot.sleep(100);
                bot.combat.cancelAutoAttack();

                Core.usePotion();

                const confirmEnd = Date.now() + 500;

                while (!bot.shouldExit && Date.now() < confirmEnd) {
                    bot.sleep(100);

                    if (!this.monsterAvailable(bossName, cell)) {
                        Core.logger(
                            `${logPrefix} ${bossName} died/disappeared while confirming Enrage; treating taunt as handled.`,
                        );
                        return true;
                    }

                    if (
                        bot.player.hasTarget &&
                        bot.target != null &&
                        bot.target.auras.some(
                            (x) =>
                                (x.name.toLowerCase() === "Focus".toLowerCase() ||
                                    x.name.toLowerCase() === "Reckless".toLowerCase()) &&
                                auraRemainingTime(x) > 4,
                        )
                    ) {
                        Core.logger(`${logPrefix} Enrage confirmed on ${bossName}.`);
                        return true;
                    }
                }

                bot.sleep(150);
            }

            Core.logger(`${logPrefix} Scroll force-use attempts failed; Enrage was not confirmed on ${bossName}.`);
            return false;
        } finally {
            bot.skills.resume();
        }
    }

    resetR3Fight(
        map: string,
        safeCell: string,
        safePad: string,
        bossCell: string,
        bossPad: string,
        checkpoint: string,
    ): void {
        bot.skills.pause();

        try {
            Core.logger(`[r3 Death Reset] Stopping combat and moving to ${safeCell}.`);

            bot.combat.cancelAutoAttack();

            if (!bot.player.alive) {
                Core.logger("[r3 Death Reset] I am dead; waiting to respawn before moving to safe cell.");
                bot.wait.forTrue(() => bot.player.alive, 30);
                bot.sleep(1000);
            }

            if (!(bot.map.name?.toLowerCase() === map?.toLowerCase())) {
                this.joinShrineDungeon(map, safeCell, safePad);
            }

            if (!(bot.player.cell?.toLowerCase() === safeCell?.toLowerCase())) {
                bot.map.jump(safeCell, safePad, false);
                bot.wait.forCellChange(safeCell);
            }

            bot.player.setSpawnPoint();

            Core.logger(`[r3 Death Reset] Reached ${safeCell}; waiting for all accounts.`);
            this.syncArmy(`${checkpoint}_all_in_safe_cell.sync`);

            if (!bot.player.alive) {
                Core.logger("[r3 Death Reset] I died during retreat; waiting to respawn again.");
                bot.wait.forTrue(() => bot.player.alive, 30);
                bot.sleep(1000);

                if (!(bot.player.cell?.toLowerCase() === safeCell?.toLowerCase())) {
                    bot.map.jump(safeCell, safePad, false);
                    bot.wait.forCellChange(safeCell);
                }

                bot.player.setSpawnPoint();
            }

            this.syncArmy(`${checkpoint}_all_alive_safe.sync`);

            Core.logger(`[r3 Death Reset] Everyone synced in ${safeCell}; returning to ${bossCell}.`);

            bot.map.jump(bossCell, bossPad, false);
            bot.wait.forCellChange(bossCell);
            bot.player.setSpawnPoint();

            bot.sleep(1000);

            this.syncArmy(`${checkpoint}_all_returned_to_r3.sync`);

            Core.logger("[r3 Death Reset] r3 retry ready.");
        } finally {
            bot.skills.resume();
        }
    }

    /**
     * Returns the r3 focus target with a balance guard.
     * Normal split: SC + AP focus Ascended Solstice, LR + LoO focus Ascended Midnight.
     * If Solstice is getting too far lower than Midnight, SC temporarily helps Midnight.
     * If Solstice is dangerously far lower, everyone temporarily helps Midnight catch down.
     */
    getR3FocusTarget(cell: string): string {
        const solstice =
            bot.monsters.mapMonsters.find(
                (m) =>
                    m != null &&
                    m.name?.toLowerCase() === AscendEclipseTest.ascendedSolstice?.toLowerCase() &&
                    m.cell?.toLowerCase() === cell?.toLowerCase() &&
                    m.hp > 0 &&
                    m.state > 0,
            ) ?? null;

        const midnight =
            bot.monsters.mapMonsters.find(
                (m) =>
                    m != null &&
                    m.name?.toLowerCase() === AscendEclipseTest.ascendedMidnight?.toLowerCase() &&
                    m.cell?.toLowerCase() === cell?.toLowerCase() &&
                    m.hp > 0 &&
                    m.state > 0,
            ) ?? null;

        if (solstice == null && midnight == null) {
            return "";
        }

        if (solstice == null) {
            return AscendEclipseTest.ascendedMidnight;
        }

        if (midnight == null) {
            return AscendEclipseTest.ascendedSolstice;
        }

        const solsticePct = this.getHpPercent(solstice.hp, solstice.maxHp);
        const midnightPct = this.getHpPercent(midnight.hp, midnight.maxHp);
        const gap = midnightPct - solsticePct;
        const mySlot = this.getMyPlayerSlot();

        // Emergency correction:
        // Solstice is much lower than Midnight, so pause Solstice damage entirely.
        if (gap >= 7) {
            return AscendEclipseTest.ascendedMidnight;
        }

        // Mild correction:
        // SC swaps to Midnight, AP stays on Solstice. LR + LoO continue Midnight.
        if (gap >= 4) {
            if (mySlot === 2) {
                return AscendEclipseTest.ascendedMidnight;
            }

            if (mySlot === 3) {
                return AscendEclipseTest.ascendedSolstice;
            }

            if (mySlot === 1 || mySlot === 4) {
                return AscendEclipseTest.ascendedMidnight;
            }
        }

        // Normal split:
        // SC + AP focus Solstice. LR + LoO focus Midnight.
        if (mySlot === 2 || mySlot === 3) {
            return AscendEclipseTest.ascendedSolstice;
        }

        if (mySlot === 1 || mySlot === 4) {
            return AscendEclipseTest.ascendedMidnight;
        }

        return solsticePct >= midnightPct ? AscendEclipseTest.ascendedSolstice : AscendEclipseTest.ascendedMidnight;
    }
    pickHigherHpBoss(cell: string): string {
        const solstice =
            bot.monsters.mapMonsters.find(
                (m) =>
                    m != null &&
                    m.name?.toLowerCase() === AscendEclipseTest.ascendedSolstice?.toLowerCase() &&
                    m.cell?.toLowerCase() === cell?.toLowerCase() &&
                    m.hp > 0 &&
                    m.state > 0,
            ) ?? null;

        const midnight =
            bot.monsters.mapMonsters.find(
                (m) =>
                    m != null &&
                    m.name?.toLowerCase() === AscendEclipseTest.ascendedMidnight?.toLowerCase() &&
                    m.cell?.toLowerCase() === cell?.toLowerCase() &&
                    m.hp > 0 &&
                    m.state > 0,
            ) ?? null;

        if (solstice == null && midnight == null) {
            return "";
        }
        if (solstice == null) {
            return AscendEclipseTest.ascendedMidnight;
        }
        if (midnight == null) {
            return AscendEclipseTest.ascendedSolstice;
        }

        const solsticePct = solstice.maxHp > 0 ? solstice.hp / solstice.maxHp : 0;
        const midnightPct = midnight.maxHp > 0 ? midnight.hp / midnight.maxHp : 0;

        return solsticePct >= midnightPct ? AscendEclipseTest.ascendedSolstice : AscendEclipseTest.ascendedMidnight;
    }

    // ── Single-target boss fight (r2 taunt bosses) ────────────────────────────

    bossFight(
        monster: string,
        cell: string,
        enrageMessage: string,
        isTaunter: boolean,
        tauntOffsetSeconds = 0,
        startingTaunterConfig = "player2",
    ): void {
        const ReturnToFightCell = (targetCell: string): void => {
            if (bot.player.cell?.toLowerCase() === targetCell?.toLowerCase()) {
                if (!fightSpawnSet) {
                    bot.player.setSpawnPoint();
                    fightSpawnSet = true;
                }
                return;
            }
            Core.logger(`[Recover] Returning to ${targetCell} after respawn/desync.`);
            bot.map.jump(targetCell, "Left", false);
            bot.wait.forCellChange(targetCell);
            bot.player.setSpawnPoint();
            fightSpawnSet = true;
            bot.sleep(500);
        };
        const Listener = (packet: EventMap["extensionPacket"]): void => {
            try {
                // C# listens to Bot.Flash.FlashCall ("pext" or "packetFromServer"); Turu's extensionPacket event
                // gives a JSON packet's data object as `params.dataObj` (C#'s `b.o`).
                const data: any | null = packet?.["params"]?.type === "json" ? packet["params"].dataObj : null;

                if (data == null || data!["cmd"]?.toString() !== "ct") {
                    return;
                }

                let triggered = false;
                if (data!["anims"] != null) {
                    for (const a of data!.anims) {
                        if (a?.msg != null && a!.msg.indexOf(enrageMessage) >= 0) {
                            triggered = true;
                            break;
                        }
                    }
                }

                if (!triggered && data!["a"] != null) {
                    for (const a of data!.a) {
                        if (a != null && a!["cmd"]?.toString() === "aura+" && a!["auras"] != null) {
                            for (const aura of a!["auras"]) {
                                if (aura?.msgOn != null && aura!.msgOn.indexOf(enrageMessage) >= 0 && aura!.isNew) {
                                    triggered = true;
                                    break;
                                }
                            }
                        }
                    }
                }

                if (!triggered) {
                    return;
                }
                needsEnrage = true;
                usedEnrage = false;
                if (tauntOffsetSeconds > 0) {
                    tauntTime = Date.now() + tauntOffsetSeconds * 1000;
                }
                Core.logger(
                    `[Taunt] '${enrageMessage}' — ${tauntOffsetSeconds > 0 ? `enraging in ${tauntOffsetSeconds}s` : "enraging now"}.`,
                );
            } catch (error) {
                rethrowIfStopped(error);
            }
        };
        let needsEnrage = false;
        let usedEnrage = false;
        let usedLastEnrage =
            isTaunter &&
            bot.player.username.toLowerCase() === (bot.config!.get<string>(startingTaunterConfig) ?? "").toLowerCase();
        let tauntTime = 0;
        let noTargetSince = 0;
        let fightSpawnSet = false;

        bot.events.on("extensionPacket", Listener);
        try {
            while (!bot.shouldExit) {
                if (!bot.player.alive) {
                    bot.wait.forTrue(() => bot.player.alive, 20);
                    ReturnToFightCell(cell);
                    bot.sleep(500);
                    continue;
                }

                ReturnToFightCell(cell);

                if (isTaunter && needsEnrage && !usedEnrage) {
                    if (
                        !usedLastEnrage &&
                        bot.player.hasTarget &&
                        (tauntOffsetSeconds <= 0 || Date.now() > tauntTime)
                    ) {
                        Core.logger(`[Taunt] '${enrageMessage}' — my turn, applying Scroll of Enrage...`);
                        bot.skills.pause();
                        while (!bot.shouldExit && bot.player.hasTarget && needsEnrage && !usedEnrage) {
                            bot.combat.cancelAutoAttack();
                            Core.usePotion();
                            bot.sleep(200);
                            if (
                                bot.player.hasTarget &&
                                (bot.target.auras.some(
                                    (x) => x.name.toLowerCase() === "Focus".toLowerCase() && auraRemainingTime(x) > 4,
                                ) ||
                                    bot.target.auras.some(
                                        (x) =>
                                            x.name.toLowerCase() === "Reckless".toLowerCase() &&
                                            auraRemainingTime(x) > 4,
                                    ))
                            ) {
                                usedEnrage = true;
                                needsEnrage = false;
                                usedLastEnrage = true;
                                Core.logger("[Taunt] Enrage confirmed!");
                            } else {
                                bot.sleep(200);
                            }
                        }
                        bot.skills.resume();
                    } else if (usedLastEnrage) {
                        Core.logger(`[Taunt] '${enrageMessage}' — other taunter's turn.`);
                        usedEnrage = true;
                        needsEnrage = false;
                        usedLastEnrage = false;
                    }
                }

                if (!needsEnrage || usedEnrage || !bot.player.hasTarget) {
                    bot.combat.attack(monster);
                    this.useClassSkills();
                }

                bot.sleep(300);

                if (bot.player.hasTarget) {
                    noTargetSince = 0;
                } else if (!this.monsterAvailable(monster, cell)) {
                    noTargetSince = noTargetSince === 0 ? Date.now() : noTargetSince;
                    if (Date.now() - noTargetSince > 1800) {
                        break;
                    }
                } else {
                    noTargetSince = 0;
                }
            }
        } finally {
            bot.events.off("extensionPacket", Listener);
        }
    }

    // ── Infrastructure ────────────────────────────────────────────────────────
    setupPartyFromPlayer1(): void {
        const player1 = bot.config!.get<string>("player1") ?? "";
        const player2 = bot.config.get<string>("player2") ?? "";
        const player3 = bot.config.get<string>("player3") ?? "";
        const player4 = bot.config.get<string>("player4") ?? "";

        if (!player1?.trim()) {
            Core.logger("[Party] No player1 configured; skipping party setup.");
            return;
        }

        bot.events.on("extensionPacket", this.partyInviteListener);

        try {
            this.syncArmy("party_setup_ready.sync");

            this.ensurePartyInvites();

            if (this.isConfiguredAccount(player1)) {
                Core.logger("[Party] I am player1; inviting the other accounts.");

                //PartyOn();

                this.partyInvite(player2);
                bot.sleep(750);

                this.partyInvite(player3);
                bot.sleep(750);

                this.partyInvite(player4);
                bot.sleep(750);
            } else {
                Core.logger("[Party] Waiting for player1 party invite.");
            }

            bot.sleep(5000);
            this.syncArmy("party_setup_done.sync");
        } finally {
            bot.events.off("extensionPacket", this.partyInviteListener);
        }
    }
    ensurePartyInvites(): boolean {
        const partyEnabled = bot.flash.get<boolean>("uoPref.bParty");
        if (!partyEnabled) {
            Core.logger("Party invites enabled");
            bot.send.packet("%xt%zm%cmd%1%uopref%bParty%true%");
            bot.sleep(500);
            return true;
        }
        Core.logger("Party invites already enabled");
        return true;
    }

    partyInvite(name: string): void {
        if (!name?.trim()) {
            return;
        }

        if (name.toLowerCase() === Core.username().toLowerCase()) {
            return;
        }

        Core.logger("[Party] Sending invite to configured account.");
        bot.send.packet(`%xt%zm%gp%1%pi%${name}%`);
    }

    partyAccept(partyID: number): void {
        bot.send.packet(`%xt%zm%gp%1%pa%${partyID}%`);
    }

    partyOn(): void {
        bot.send.packet("%xt%zm%cmd%1%partyon%");
    }

    /** C# listens to Bot.Flash.FlashCall's "pext"; Turu's extensionPacket event is that packet. */
    partyInviteListener = (packet: EventMap["extensionPacket"]): void => {
        try {
            if (packet?.["params"]?.["type"]?.toString() !== "json") {
                return;
            }

            const data = packet["params"]["dataObj"];

            if (data?.["cmd"]?.toString() !== "pi") {
                return;
            }

            const partyID = data.pid;

            this.partyAccept(partyID);
            Core.logger("[Party] Accepted player1's party invite.");

            // C# sleeps a second inside the listener; the re-jump waits in a task.
            tasks.start("EclipsePartyJump", function* () {
                yield 1000;
                bot.map.jump(bot.player.cell, bot.player.pad);
            });
        } catch (error) {
            rethrowIfStopped(error);

            // Ignore malformed or unrelated packets.
        }
    };

    syncGroupPath(syncFile: string): string {
        const group = this.getSyncGroup(syncFile);
        return Ultra.resolveSyncPath(`AscendEclipse_${Core.privateRoomNumber}_${group}.sync`);
    }

    getSyncGroup(syncFile: string): string {
        const name = syncFile.toLowerCase();

        if (name.includes("party")) {
            return "setup";
        }

        if (
            name.includes("reset") ||
            name.includes("whitemap") ||
            name.includes("rejoined") ||
            name.includes("restock")
        ) {
            return "reset";
        }

        return "run";
    }

    resetReusableSyncFiles(): void {
        // Sync files are cleared at startup only; stale lines from earlier runs are
        // pruned by SyncArmy, so per-run clearing is unnecessary.
        if (this.syncFilesClearedOnStartup) {
            return;
        }

        Core.logger("[Sync] Moving to /whitemap before clearing startup sync files.");
        Core.join("whitemap", "Enter", "Spawn");
        this.waitForMapName("whitemap", 8000);
        bot.sleep(1000);

        const isPlayer1 = this.isConfiguredAccount(bot.config!.get<string>("player1") ?? "");

        if (!isPlayer1) {
            Core.logger("[Sync] Waiting briefly while player1 clears startup sync files.");
            bot.sleep(1500);
            this.syncFilesClearedOnStartup = true;
            Core.logger("[Sync] Done waiting for player1 startup sync clear.");
            return;
        }

        Core.logger("[Sync] Player1 is clearing startup sync files for AscendEclipse.");

        this.resetSyncFile(this.syncGroupPath("AscendEclipse_reset_ready.sync"));
        this.resetSyncFile(this.syncGroupPath("AscendEclipse_run_ready.sync"));

        this.syncFilesClearedOnStartup = true;

        Core.logger("[Sync] Startup sync files cleared.");
        bot.sleep(1500);
    }

    resetSyncFile(path: string): void {
        try {
            bot.army.clearLog(path);
        } catch (error) {
            rethrowIfStopped(error);

            bot.sleep(100);
        }
    }

    syncArmy(syncFile: string): void {
        const partySize = sArmy.players().length;
        if (partySize <= 1) {
            return;
        }

        const path = this.syncGroupPath(syncFile);
        const username = Core.username().toLowerCase();
        const checkpoint = syncFile.replaceAll(":", "_");

        while (!bot.shouldExit) {
            const now = Math.floor(Date.now() / 1000);

            this.updateSyncLines(path, (lines) => [
                ...lines
                    .filter((l) => !l.toLowerCase().startsWith(`${checkpoint}:${username}:`.toLowerCase()))
                    .filter((l) => !this.isStaleSyncLine(l, now)),
                `${checkpoint}:${username}:ready:${now}`,
            ]);

            const ready = [
                ...new Set(
                    this.readSyncLines(path)
                        .map((l) => l.split(":"))
                        .filter(
                            (p) =>
                                p.length >= 4 &&
                                p[0].toLowerCase() === checkpoint.toLowerCase() &&
                                /^-?\d+$/.test(p[3]) &&
                                now - Number(p[3]) <= 120,
                        )
                        .map((p) => p[1]),
                ),
            ].length;

            if (ready >= partySize) {
                return;
            }

            bot.sleep(250);
        }
    }

    readSyncLines(path: string): string[] {
        try {
            return bot.army.readLog(path).filter((l) => !!l?.trim());
        } catch (error) {
            rethrowIfStopped(error);

            bot.sleep(100);
            return [];
        }
    }

    writeSyncLines(path: string, lines: string[]): void {
        try {
            bot.army.writeLog(path, lines);
        } catch (error) {
            rethrowIfStopped(error);

            bot.sleep(100);
        }
    }

    /**
     * Reads, changes and writes the sync lines under the log's lock (Turu: C# relies on timing),
     * so another member's line written at the same time isn't lost.
     */
    updateSyncLines(path: string, change: (lines: string[]) => string[]): void {
        try {
            bot.army.withLock(path, () => this.writeSyncLines(path, change(this.readSyncLines(path))));
        } catch (error) {
            rethrowIfStopped(error);

            bot.sleep(100);
        }
    }

    /**
     * True when a sync line's trailing unix timestamp is older than 10 minutes.
     * Handles both ready lines (checkpoint:user:ready:ts) and death-reset signals
     * (checkpoint:user:ts); lines without a parseable timestamp are kept.
     */
    isStaleSyncLine(line: string, now: number): boolean {
        const maxAgeSeconds = 600;

        const lastColon = line.lastIndexOf(":");

        if (lastColon < 0 || lastColon === line.length - 1) {
            return false;
        }

        const ts = line.slice(lastColon + 1);
        if (!/^-?\d+$/.test(ts)) {
            return false;
        }

        return now - Number(ts) > maxAgeSeconds;
    }

    useClassSkills(): void {
        const className = bot.player.currentClass ?? "";

        switch (className.toLowerCase()) {
            case "legion revenant":
                this.useFirstAvailableSkill(this.lrSkillList);
                break;
            case "stonecrusher":

            case "infinity titan":
                this.useFirstAvailableSkill(this.scSkillList);
                break;
            case "archpaladin":
                this.useFirstAvailableSkill(this.apSkillList);
                break;
            case "lord of order":
                this.useFirstAvailableSkill(this.looSkillList);
                break;
        }
    }

    useFirstAvailableSkill(skillPriority: number[]): void {
        if (!bot.player.hasTarget || (bot.player.target?.hp ?? 1) <= 0) {
            return;
        }

        for (const skill of skillPriority) {
            if (bot.skills.canUseSkill(skill)) {
                bot.skills.useSkill(skill);
                return;
            }
        }
    }

    /** C#'s `UseStrictSkillRotation(int[], ref int skillIndex)` (unused): returns the new index. */
    useStrictSkillRotation(skillList: number[], skillIndex: number): number {
        if (bot.player.hasTarget && (bot.player.target?.hp ?? 0) > 0) {
            const skill = skillList[skillIndex];

            if (bot.skills.canUseSkill(skill)) {
                bot.skills.useSkill(skill);
                skillIndex = (skillIndex + 1) % skillList.length;
            }
        }
        return skillIndex;
    }

    killFocusedMonster(monster: string, cell: string, pad: string): void {
        let noTargetSince = 0;
        while (!bot.shouldExit) {
            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);
                if (bot.player.cell !== cell) {
                    bot.map.jump(cell, pad, false);
                    bot.wait.forCellChange(cell);
                }
                bot.player.setSpawnPoint();
                bot.sleep(500);
                continue;
            }
            if (bot.player.cell !== cell) {
                bot.map.jump(cell, pad, false);
                bot.wait.forCellChange(cell);
            }

            bot.combat.attack(monster);
            this.useClassSkills();
            bot.sleep(400);

            if (bot.player.hasTarget) {
                noTargetSince = 0;
                continue;
            }
            if (!this.monsterAvailable(monster, cell)) {
                noTargetSince = noTargetSince === 0 ? Date.now() : noTargetSince;
                if (Date.now() - noTargetSince > 1800) {
                    break;
                }
            } else {
                noTargetSince = 0;
                bot.sleep(300);
            }
        }
    }

    killRoom2SplitTaunt(cell: string, pad: string): void {
        let noTargetSince = 0;

        let lrMoonlightGazeArmed = false;
        let lrMoonlightGazeTaunted = false;
        let lrTauntAt = 0;

        let scSunsWarmthArmed = false;
        let scSunsWarmthTaunted = false;
        let scTauntAt = 0;

        while (!bot.shouldExit) {
            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);

                if (bot.player.cell !== cell) {
                    bot.map.jump(cell, pad, false);
                    bot.wait.forCellChange(cell);
                }

                bot.player.setSpawnPoint();
                bot.sleep(500);
                continue;
            }

            if (bot.player.cell !== cell) {
                bot.map.jump(cell, pad, false);
                bot.wait.forCellChange(cell);
                bot.player.setSpawnPoint();
            }

            const isStoneCrusher =
                bot.player.currentClass?.toLowerCase() === "StoneCrusher"?.toLowerCase() ||
                bot.player.currentClass?.toLowerCase() === "Infinity Titan"?.toLowerCase();

            const isLegionRevenant = bot.player.currentClass?.toLowerCase() === "Legion Revenant"?.toLowerCase();

            const sunsetKnightAlive = this.monsterAvailable("Sunset Knight", cell);
            const moonHazeAlive = this.monsterAvailable("Moon Haze", cell);

            let target: string;

            if (isStoneCrusher) {
                target = sunsetKnightAlive ? "Sunset Knight" : "Moon Haze";
            } else {
                target = moonHazeAlive ? "Moon Haze" : "Sunset Knight";
            }

            if (!!target?.trim()) {
                bot.combat.attack(target);
            }

            if (isLegionRevenant && target === "Moon Haze" && moonHazeAlive) {
                const moonlightGazeActive = bot.self.hasActiveAura("Moonlight Gaze");

                if (moonlightGazeActive && !lrMoonlightGazeArmed) {
                    lrMoonlightGazeArmed = true;
                    lrMoonlightGazeTaunted = false;
                    lrTauntAt = Date.now() + 6000;
                    Core.logger("[r2 LR Taunt] Moonlight Gaze detected on Moon Haze. Taunting in 6 seconds.");
                }

                if (lrMoonlightGazeArmed && !lrMoonlightGazeTaunted && Date.now() >= lrTauntAt) {
                    lrMoonlightGazeTaunted = this.tauntCurrentTarget("[r2 LR Taunt]", "Moon Haze");
                } else {
                    this.useClassSkills();
                    bot.sleep(400);
                }

                if (!moonlightGazeActive && lrMoonlightGazeTaunted) {
                    lrMoonlightGazeArmed = false;
                    lrMoonlightGazeTaunted = false;
                    lrTauntAt = 0;
                }
            } else if (isStoneCrusher && target === "Sunset Knight" && sunsetKnightAlive) {
                const sunsWarmthActive = bot.self.hasActiveAura("Sun's Warmth");

                if (sunsWarmthActive && !scSunsWarmthArmed) {
                    scSunsWarmthArmed = true;
                    scSunsWarmthTaunted = false;
                    scTauntAt = Date.now() + 6000;
                    Core.logger("[r2 SC Taunt] Sun's Warmth detected on Sunset Knight. Taunting in 6 seconds.");
                }

                if (scSunsWarmthArmed && !scSunsWarmthTaunted && Date.now() >= scTauntAt) {
                    scSunsWarmthTaunted = this.tauntCurrentTarget("[r2 SC Taunt]", "Sunset Knight");
                } else {
                    this.useClassSkills();
                    bot.sleep(400);
                }

                if (!sunsWarmthActive && scSunsWarmthTaunted) {
                    scSunsWarmthArmed = false;
                    scSunsWarmthTaunted = false;
                    scTauntAt = 0;
                }
            } else {
                this.useClassSkills();
                bot.sleep(400);
            }

            if (!sunsetKnightAlive && !moonHazeAlive) {
                noTargetSince = noTargetSince === 0 ? Date.now() : noTargetSince;

                if (Date.now() - noTargetSince > 1800) {
                    break;
                }
            } else {
                noTargetSince = 0;
            }
        }
    }

    tauntCurrentTarget(logPrefix: string, expectedTarget: string, maxAttempts = 10): boolean {
        if (!bot.player.hasTarget || (bot.player.target?.hp ?? 1) <= 0) {
            bot.sleep(300);
            return false;
        }

        Core.logger(`${logPrefix} Targeting ${expectedTarget} for Scroll of Enrage.`);
        Core.logger(`${logPrefix} Force-using Scroll of Enrage on ${expectedTarget}; skipping CanUseSkill(5) gate.`);

        bot.skills.pause();

        try {
            bot.combat.cancelAutoAttack();

            for (let attempt = 1; attempt <= maxAttempts && !bot.shouldExit; attempt++) {
                Core.logger(`${logPrefix} Scroll attempt ${attempt}/${maxAttempts}.`);

                Core.usePotion();

                const confirmEnd = Date.now() + 500;

                while (!bot.shouldExit && Date.now() < confirmEnd) {
                    bot.sleep(100);

                    if (
                        bot.player.hasTarget &&
                        bot.target != null &&
                        bot.target.auras.some(
                            (x) =>
                                (x.name.toLowerCase() === "Focus".toLowerCase() ||
                                    x.name.toLowerCase() === "Reckless".toLowerCase()) &&
                                auraRemainingTime(x) > 4,
                        )
                    ) {
                        Core.logger(`${logPrefix} Enrage confirmed on ${expectedTarget}.`);
                        return true;
                    }
                }

                bot.sleep(150);
            }

            Core.logger(
                `${logPrefix} Scroll force-use attempts failed; Enrage was not confirmed on ${expectedTarget}.`,
            );
            return false;
        } finally {
            bot.skills.resume();
        }
    }

    killFocusedMonsterWithLrApAuraTaunt(
        monster: string,
        auraName: string,
        cell: string,
        pad: string,
        nextMonster: string | null = null,
    ): void {
        let noTargetSince = 0;
        let auraWasActive = false;
        let auraCycle = 0;

        while (!bot.shouldExit) {
            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);

                if (bot.player.cell !== cell) {
                    bot.map.jump(cell, pad, false);
                    bot.wait.forCellChange(cell);
                }

                bot.player.setSpawnPoint();
                bot.sleep(500);
                continue;
            }

            if (bot.player.cell !== cell) {
                bot.map.jump(cell, pad, false);
                bot.wait.forCellChange(cell);
                bot.player.setSpawnPoint();
            }

            const mainAlive = this.monsterAvailable(monster, cell);
            const nextAlive = !!nextMonster?.trim() && this.monsterAvailable(nextMonster, cell);

            if (!mainAlive && !nextAlive) {
                noTargetSince = noTargetSince === 0 ? Date.now() : noTargetSince;

                if (Date.now() - noTargetSince > 1800) {
                    break;
                }

                bot.sleep(300);
                continue;
            }

            noTargetSince = 0;

            const target = mainAlive ? monster : nextMonster!;
            bot.combat.attack(target);

            const fightingMainMonster = target.toLowerCase() === monster.toLowerCase();

            const auraActive =
                fightingMainMonster &&
                bot.player.hasTarget &&
                bot.target != null &&
                bot.target.auras.some((a) => a.name.toLowerCase() === auraName.toLowerCase());

            if (fightingMainMonster && auraActive && !auraWasActive) {
                auraWasActive = true;
                auraCycle++;

                const lrTurn = auraCycle % 2 === 1;
                const apTurn = auraCycle % 2 === 0;
                const isLegionRevenant = bot.player.currentClass?.toLowerCase() === "Legion Revenant"?.toLowerCase();
                const isArchPaladin = bot.player.currentClass?.toLowerCase() === "ArchPaladin"?.toLowerCase();

                if ((lrTurn && isLegionRevenant) || (apTurn && isArchPaladin)) {
                    const role = isLegionRevenant ? "LR" : "AP";
                    Core.logger(
                        `[r1 Taunt] ${auraName} detected on ${monster}. Cycle #${auraCycle}; ${role}'s turn to taunt.`,
                    );
                    this.tauntCurrentTarget("[r1 Taunt]", monster);
                } else {
                    if (isLegionRevenant || isArchPaladin) {
                        const waitingFor = lrTurn ? "LR" : "AP";
                        Core.logger(
                            `[r1 Taunt] ${auraName} detected on ${monster}. Cycle #${auraCycle}; waiting for ${waitingFor}.`,
                        );
                    }

                    this.useClassSkills();
                    bot.sleep(400);
                }
            } else {
                this.useClassSkills();
                bot.sleep(400);
            }

            if (!auraActive) {
                auraWasActive = false;
            }
        }
    }

    getMyPlayerSlot(): number {
        const username = Core.username();

        if (username.toLowerCase() === bot.config!.get<string>("player1").toLowerCase()) {
            return 1;
        }
        if (username.toLowerCase() === bot.config.get<string>("player2").toLowerCase()) {
            return 2;
        }
        if (username.toLowerCase() === bot.config.get<string>("player3").toLowerCase()) {
            return 3;
        }
        if (username.toLowerCase() === bot.config.get<string>("player4").toLowerCase()) {
            return 4;
        }

        return 0;
    }

    monsterAvailable(monster: string, cell: string): boolean {
        try {
            return bot.monsters.mapMonsters.some(
                (m) =>
                    m != null &&
                    m.cell?.toLowerCase() === cell?.toLowerCase() &&
                    (monster === "*" || m.name?.toLowerCase() === monster?.toLowerCase()) &&
                    m.hp > 0 &&
                    m.state > 0,
            );
        } catch (error) {
            rethrowIfStopped(error);

            return true;
        }
    }

    resetDungeonInstance(nextMap: string, checkpoint: string): void {
        this.syncArmy(`${checkpoint}_reset_ready.sync`);
        Core.logger("Resetting dungeon...");
        Core.join("whitemap", "Enter", "Spawn");
        this.waitForMapName("whitemap", 8000);
        bot.sleep(1000);
        this.syncArmy(`${checkpoint}_all_in_whitemap.sync`);
        this.sellHallowedRemainsIfMax();
        this.refreshPotionsIfAurasMissing();
        this.restockEnrageIfLow(`Before ${checkpoint}`, 80);
        this.ensureTauntItemEquipped("[Restock]");

        this.syncArmy(`${checkpoint}_restock_done.sync`);

        this.joinShrineDungeon(nextMap, "Enter", "Left", true);
        bot.sleep(1000);
        this.syncArmy(`${checkpoint}_all_rejoined_dungeon.sync`);
    }

    getInventoryQuantity(itemName: string): number {
        return (
            (bot.inventory.items.find((item) => item.name.toLowerCase() === itemName.toLowerCase()) ?? null)
                ?.quantity ?? 0
        );
    }

    sellHallowedRemainsIfMax(): void {
        const itemName = "Hallowed Remains";
        const maxStack = 500;

        const quantity = bot.inventory.getQuantity(itemName);

        if (quantity < maxStack) {
            return;
        }

        Core.logger(`[Inventory] ${itemName} is at max stack (${quantity}/${maxStack}). Selling all.`);

        Core.sellItem(itemName, undefined, { all: true });

        bot.sleep(1000);
    }

    restockEnrageIfLow(context: string, minimumCount = 80): void {
        if (!this.autoGetEnrage) {
            return;
        }

        const count = this.getInventoryQuantity(AscendEclipseTest.tauntItem);
        Core.logger(`[Taunt] ${context}: ${count} ${AscendEclipseTest.tauntItem} remaining.`);

        if (count >= minimumCount) {
            return;
        }

        Core.logger(`[Taunt] ${AscendEclipseTest.tauntItem} is below ${minimumCount}. Restocking before continuing.`);

        Ultra.getScrollOfEnrage();

        const newCount = this.getInventoryQuantity(AscendEclipseTest.tauntItem);
        Core.logger(`[Taunt] Restock complete: ${newCount} ${AscendEclipseTest.tauntItem} remaining.`);

        this.ensureTauntItemEquipped("[Taunt Restock]");
    }

    joinAndFocus(map: string, cell: string, pad: string): void {
        this.joinShrineDungeon(map, cell, pad);

        if (!(bot.player.cell?.toLowerCase() === cell?.toLowerCase())) {
            bot.map.jump(cell, pad, false);
            bot.wait.forCellChange(cell);
        }

        bot.player.setSpawnPoint();
        bot.options.aggroMonsters = false;
        bot.options.aggroAllMonsters = false;
    }

    joinShrineDungeon(map: string, cell: string, pad: string, force = false): void {
        const target = `${map}-${Core.privateRoomNumber}`;
        for (let attempt = 1; attempt <= 5 && !bot.shouldExit && (force || bot.map.name !== map); attempt++) {
            force = false;
            Core.logger(`Joining /${target} (${attempt}/5)...`);
            bot.send.packet(`%xt%zm%dungeonQueue%${bot.map.roomId}%${target}%`);
            this.waitForMapName(map, 8000);
            if (bot.map.name === map) {
                break;
            }
            bot.send.packet(`%xt%zm%cmd%${bot.map.roomId}%tfer%${bot.player.username}%${target}%${cell}%${pad}%`);
            this.waitForMapName(map, 8000);
            bot.sleep(500);
        }
        if (bot.map.name !== map) {
            Core.logger(`Could not join /${target}. Retrying next loop.`);
            return;
        }
        bot.wait.forTrue(() => bot.player.loaded, 10);
    }

    waitForMapName(map: string, timeoutMs: number): void {
        const end = Date.now() + timeoutMs;
        while (!bot.shouldExit && bot.map.name !== map && Date.now() < end) {
            bot.sleep(250);
        }
    }

    // ── Taunter checks ────────────────────────────────────────────────────────

    isSunTaunter(): boolean {
        return (
            this.isConfiguredAccount(bot.config!.get<string>("player2") ?? "") ||
            this.isConfiguredAccount(bot.config!.get<string>("player3") ?? "")
        );
    }

    isMoonTaunter(): boolean {
        return (
            this.isConfiguredAccount(bot.config!.get<string>("player1") ?? "") ||
            this.isConfiguredAccount(bot.config!.get<string>("player4") ?? "")
        );
    }

    isConfiguredAccount(account: string): boolean {
        return !!account?.trim() && Core.username()?.toLowerCase() === account?.toLowerCase();
    }

    // ── Setup ─────────────────────────────────────────────────────────────────

    tryAcceptDailyQuest(questId: number, questName: string): void {
        const quest = Core.initializeWithRetries(() => Core.ensureLoad(questId));

        if (quest == null) {
            Core.logger(`[Daily] Failed to load ${questName} [${questId}]. Skipping.`);
            return;
        }

        if (bot.quests.isDailyComplete(questId)) {
            Core.logger(`[Daily] ${quest.name} [${quest.id}] is not available right now.`);
            return;
        }

        Core.logger(`[Daily] Accepting ${quest.name} [${quest.id}].`);
        Core.ensureAccept(questId);
        Core.addDrop(...quest.rewards.map((x) => x.name));
        Core.addDrop(...quest.requirements.map((x) => x.name));
    }

    tryCompleteDailyQuest(questId: number, rewardName: string): void {
        if (!bot.quests.isInProgress(questId)) {
            return;
        }

        Core.logger(`[Daily] Attempting to complete daily quest ${questId}.`);

        Core.ensureComplete(questId);
        bot.wait.forPickup(rewardName);

        Core.logger(`[Daily] Completed daily quest ${questId}.`);
    }

    equipArmyClasses(): void {
        const username = Core.username();
        const p1 = bot.config!.get<string>("player1");
        const p2 = bot.config!.get<string>("player2");
        const p3 = bot.config!.get<string>("player3");
        const p4 = bot.config!.get<string>("player4");

        if (username.toLowerCase() === p1.toLowerCase()) {
            this.equipClassByName(AscendEclipseTest.player1Class);
        } else if (username.toLowerCase() === p2.toLowerCase()) {
            this.equipClassByName(AscendEclipseTest.player2Class);
        } else if (username.toLowerCase() === p3.toLowerCase()) {
            this.equipClassByName(AscendEclipseTest.player3Class);
        } else if (username.toLowerCase() === p4.toLowerCase()) {
            this.equipClassByName(AscendEclipseTest.player4Class);
        } else {
            Core.logger("This account was not matched to a player slot — keeping current class.");
        }
    }

    equipClassByName(className: string): void {
        if (!className?.trim()) {
            return;
        }

        let classToEquip = className;

        if (!Core.checkInventory(classToEquip)) {
            if (className.toLowerCase() === "StoneCrusher".toLowerCase() && Core.checkInventory("Infinity Titan")) {
                Core.logger(
                    "This account is assigned to use StoneCrusher, but StoneCrusher is missing. Using Infinity Titan instead.",
                );
                classToEquip = "Infinity Titan";
            } else {
                Core.logger(`Missing required class: ${className}.`, undefined, { stopBot: true });
                return;
            }
        }

        if (!this.isClassEquipped(classToEquip)) {
            Core.equip(classToEquip);
            bot.wait.forItemEquip(classToEquip);
            bot.sleep(1000);
        }

        Core.logger(`Equipped ${classToEquip}; using custom skill rotation.`);
    }

    isClassEquipped(className: string): boolean {
        return !!className?.trim() && bot.player.currentClass?.toLowerCase() === className?.toLowerCase();
    }

    applyEnhancements(): void {
        const className = bot.player.currentClass ?? "";
        Core.logger(`Applying enhancements for ${className}...`);

        switch (className.toLowerCase()) {
            case "legion revenant":
                Adv.enhanceEquipped(EnhancementType.Wizard, {
                    hSpecial: HelmSpecial.None,
                    wSpecial: Adv.uElysium() ? WeaponSpecial.Elysium : WeaponSpecial.Valiance,
                    cSpecial: CapeSpecial.Penitence,
                });
                break;
            case "lord of order":
                Adv.enhanceEquipped(EnhancementType.Lucky, {
                    hSpecial: HelmSpecial.None,
                    wSpecial: WeaponSpecial.Valiance,
                    cSpecial: CapeSpecial.Penitence,
                });
                break;
            case "archpaladin":
                Adv.enhanceEquipped(EnhancementType.Lucky, {
                    hSpecial: HelmSpecial.None,
                    wSpecial: WeaponSpecial.Valiance,
                    cSpecial: CapeSpecial.Penitence,
                });
                break;
            case "stonecrusher":

            case "infinity titan":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    hSpecial: HelmSpecial.None,
                    wSpecial: WeaponSpecial.Valiance,
                    cSpecial: CapeSpecial.Absolution,
                });
                break;
            default:
                Core.logger(`[Enhance] No profile for '${className}' — skipping.`);
                break;
        }
    }

    useClassPotions(): void {
        const className = bot.player.currentClass ?? "";

        Core.logger(`Using potions for ${className}...`);

        switch (className.toLowerCase()) {
            case "legion revenant":
                this.usePotionSet("Sage Tonic", "Potent Malevolence Elixir");
                break;
            case "stonecrusher":

            case "infinity titan":
                this.usePotionSet("Might Tonic", "Potent Battle Elixir");
                break;
            case "archpaladin":
                this.usePotionSet("Fate Tonic", "Potent Battle Elixir");
                break;
            case "lord of order":
                this.usePotionSet("Fate Tonic", "Potent Destruction Elixir");
                break;
            default:
                Core.logger(`[Potions] No potion profile for '${className}' — skipping.`);
                break;
        }
    }

    usePotionSet(tonic: string, elixir: string): void {
        this.usePotionItem(tonic);
        this.usePotionItem(elixir);
    }

    usePotionItem(itemName: string): void {
        if (!Core.checkInventory(itemName)) {
            this.buyAlchemyPotion(itemName);
        }

        if (!Core.checkInventory(itemName)) {
            Core.logger(`[Potions] Failed to get ${itemName}; skipping.`);
            return;
        }

        if (!bot.inventory.isEquipped(itemName)) {
            bot.inventory.equipUsableItem(itemName);
            bot.sleep(500);
        }

        Core.usePotion();
        bot.sleep(1000);
    }

    buyAlchemyPotion(itemName: string): void {
        const NeedVoucher = (wanted: number): void => {
            const missing = Math.max(0, wanted - bot.inventory.getQuantity(voucher));

            if (missing > 0) {
                Core.logger(`[Potions] Buying ${missing}x ${voucher}.`);
                Engine.buyItem(voucher, shopId, map, missing);
                bot.sleep(500);
            }
        };
        const BuyPotion = (count: number): void => {
            Core.logger(`[Potions] Buying ${count}x ${itemName}.`);
            Engine.buyItem(itemName, shopId, map, count, { calculateRemaining: false });
            bot.sleep(500);
        };
        if (!itemName?.trim() || Core.checkInventory(itemName)) {
            if (!!itemName?.trim()) {
                Core.logger(`[Potions] Have: ${itemName}`);
            }
            return;
        }

        const shopId = 2036;
        const map = "alchemyacademy";
        const voucher = "Gold Voucher 500k";

        switch (itemName) {
            case "Might Tonic":

            case "Sage Tonic":

            case "Fate Tonic":
                if (!Engine.faction("Alchemy", 8)) {
                    Core.logger("[Potions] Alchemy rank 8 required for tonic.");
                    return;
                }
                NeedVoucher(2);
                BuyPotion(10);
                break;
            case "Potent Malevolence Elixir":

            case "Potent Battle Elixir":

            case "Potent Destruction Elixir":
                NeedVoucher(4);
                BuyPotion(8);
                break;
            default:
                Core.logger(`[Potions] Unknown potion: ${itemName}`);
                return;
        }
    }

    refreshPotionsIfAurasMissing(): void {
        if (!this.usePotions) {
            return;
        }

        if (this.oracleClassTauntReset) {
            Core.logger("[Potions] Skipping potion refresh because Oracle Class Taunt Reset is ON.");
            return;
        }

        const hasTonic =
            bot.self.hasActiveAura("Sage") || bot.self.hasActiveAura("Might") || bot.self.hasActiveAura("Fate");

        const hasElixir =
            bot.self.hasActiveAura("Potent Malevolence Elixir") ||
            bot.self.hasActiveAura("Potent Battle Elixir") ||
            bot.self.hasActiveAura("Potent Destruction Elixir");

        if (hasTonic && hasElixir) {
            Core.logger("[Potions] Potion auras still active. Skipping potion refresh.");
            return;
        }

        Core.logger("[Potions] Missing potion aura. Refreshing class potions.");
        this.useClassPotions();
    }

    prepareTauntRole(): void {
        if (this.autoGetEnrage) {
            Core.logger(`Auto-crafting ${AscendEclipseTest.tauntItem}...`);
            Ultra.getScrollOfEnrage();
        }

        if (!Core.checkInventory(AscendEclipseTest.tauntItem)) {
            Core.logger(`No ${AscendEclipseTest.tauntItem} found — boss charges will NOT be redirected.`);
            return;
        }

        if (!bot.inventory.isEquipped(AscendEclipseTest.tauntItem)) {
            bot.inventory.equipUsableItem(AscendEclipseTest.tauntItem);
        }

        Core.logger(`${AscendEclipseTest.tauntItem} is equipped.`);
    }

    /**
     * C#'s `ScriptMain`, a method so that GreatbladeOfTheEntwinedEclipse can run this script with
     * its own options (`skipSetOptions`).
     */
    scriptMain(): void {
        const script = this;
        if (!script.skipSetOptions) {
            Core.setOptions(undefined, { disableClassSwap: true });
        }
        if (sArmy.players().length < 4) {
            Core.logger("Add 4 account names in the script options before starting.");

            if (!script.skipSetOptions) {
                Core.setOptions(false);
            }

            return;
        }

        Core.privateRooms = true;
        // Turu: another script running this one (skipSetOptions) doesn't declare this script's
        // options, so they are read only when it runs on its own; the caller sets the fields.
        const configuredRoom = script.skipSetOptions
            ? script.privateRoomNumber
            : bot.config.get<number>("privateRoomNumber");
        if (configuredRoom >= 1000 && configuredRoom <= 99999) {
            Core.privateRoomNumber = configuredRoom;
        } else {
            Core.logger(`Invalid private room number '${configuredRoom}'. Generating a fallback room number.`);
            Core.privateRoomNumber = sArmy.getRoomNr();
        }

        Core.logger(`Army mode enabled: ${sArmy.players().length} accounts, private room #${Core.privateRoomNumber}.`);

        script.autoEnhance = bot.config!.get<boolean>("autoEnhance");
        script.autoGetEnrage = true;
        if (!script.skipSetOptions) {
            script.oracleClassTauntReset = bot.config.get<boolean>("oracleClassTauntReset");
            script.usePotions = bot.config.get<boolean>("usePotions");
        }

        script.setupPartyFromPlayer1();

        script.equipArmyClasses();

        if (script.autoEnhance) {
            script.applyEnhancements();
        }

        if (script.usePotions && !script.oracleClassTauntReset) {
            script.useClassPotions();
        } else if (script.usePotions && script.oracleClassTauntReset) {
            Core.logger("[Potions] Skipping tonic/elixir usage because Oracle Class Taunt Reset is ON.");
        }

        script.prepareTauntRole();

        script.tryAcceptDailyQuest(9305, "Frozen Cycle");

        try {
            if (script.targetEclipticOfferingCount > 0) {
                Core.addDrop(AscendEclipseTest.eclipticOffering);
            }

            while (!bot.shouldExit) {
                if (
                    script.targetEclipticOfferingCount > 0 &&
                    Core.checkInventory(AscendEclipseTest.eclipticOffering, script.targetEclipticOfferingCount)
                ) {
                    Core.logger(
                        `[AscendEclipse] Reached target of ${script.targetEclipticOfferingCount} ${AscendEclipseTest.eclipticOffering}; stopping.`,
                    );
                    break;
                }

                script.runAscendEclipse();
            }
        } finally {
            if (!script.skipSetOptions) {
                Core.setOptions(false);
            }
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "AscendEclipse_Test",
    [
        option.text("player1", "LR Account", "Name of the account that will use Legion Revenant.", ""),
        option.text("player2", "SC Account", "Name of the account that will use StoneCrusher.", ""),
        option.text("player3", "AP Account", "Name of the account that will use ArchPaladin.", ""),
        option.text("player4", "LoO Account", "Name of the account that will use Lord of Order.", ""),
        option.int(
            "privateRoomNumber",
            "Private Room Number (IMPORTANT)",
            "Private room number used by all 4 accounts. Set the same number on every account!",
            69420,
        ),
        sArmy.packetDelay,
        Core.skipOptions,
        option.bool(
            "autoEnhance",
            "Auto-Apply Enhancements",
            "ON: each account automatically applies the correct enhancements for its fixed class.\n" +
                "Slot 1 (LR): Wizard/Wizard Helm/Elysium/Penitence\n" +
                "Slot 2 (SC): Fighter/Fighter Helm/Valiance/Absolution\n" +
                "Slot 3 (AP): Lucky/Lucky Helm/Valiance/Penitence\n" +
                "Slot 4 (LoO): Lucky/Lucky Helm/Valiance/Penitence",
            true,
        ),
        option.bool(
            "oracleClassTauntReset",
            "Oracle Class Taunt Reset",
            "ON: swaps to Oracle then back before taunt fights to clear the class taunt bug. (DOESNT USE POTIONS WHEN ON) \n" +
                "OFF: skips the Oracle swap and only ensures Scroll of Enrage is equipped.",
            true,
        ),
        option.bool(
            "usePotions",
            "Use Potions",
            "DOESNT WORK WHEN Oracle Class Taunt Reset IS ON. (this is by design) \n" +
                "ON: equips and uses configured class potion sets before starting the dungeon loop. (TONICS and ELIXIRS ONLY) \n" +
                "OFF: skips tonic/elixir usage.",
            false,
        ),
    ],
    true,
);

export default function main(): void {
    new AscendEclipseTest().scriptMain();
}

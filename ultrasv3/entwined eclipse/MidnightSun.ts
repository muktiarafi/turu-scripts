/*
name: Midnight Sun (Sun Side Test)
description: Farms Sliver of Sunlight by running /midnightsun in a loop. 4-account army script with alternating Scroll of Enrage taunt. Slot 1 = Legion Revenant, Slot 2 = StoneCrusher, Slot 3 = ArchPaladin, Slot 4 = Lord of Order.
tags: greatblade, entwined, eclipse, midnight, sun, farm, test, army
*/
// Port of Scripts/Ultrasv3/Entwined Eclipse/MidnightSun.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, type EventMap, defineScriptOptions, option } from "turu";
import { CoreArmyLite } from "../../army/CoreArmyLite";
import { CapeSpecial, CoreAdvanced, EnhancementType, HelmSpecial, WeaponSpecial } from "../../core/CoreAdvanced";
import { Core, rethrowIfStopped } from "../../core/CoreBots";
import { auraRemainingTime, CoreEngine } from "./CoreEngine";
import { CoreUltra } from "./CoreUltra";

const Engine = new CoreEngine();
const Ultra = new CoreUltra();
const Adv = new CoreAdvanced();
const sArmy = new CoreArmyLite();

export class MidnightSunTest {
    // Fixed 4-class lineup
    static readonly player1Class = "Legion Revenant";
    // Dying Light + Hollow Solstice taunter
    static readonly player2Class = "StoneCrusher";
    // Dawn Knight + Hollow Solstice taunter
    static readonly player3Class = "ArchPaladin";
    // Dying Light taunter
    static readonly player4Class = "Lord of Order";
    // Support

    readonly lrSkillList: number[] = [3, 4, 2, 1];
    readonly scSkillList: number[] = [3, 2, 4, 1];
    readonly apSkillList: number[] = [2, 3, 1, 4];
    readonly looSkillList: number[] = [2, 3, 1, 4];

    static readonly sliverSunlight = "Sliver of Sunlight";

    autoEnhance: boolean = false;
    autoGetEnrage: boolean = false;
    usePotions: boolean = false;
    runCount: number = 0;
    syncFilesClearedOnStartup: boolean = false;

    /**
     * Optional orchestration hook: when > 0, the main loop exits once the account holds
     * at least this many Sliver of Sunlight. Leave 0 for the normal "loop forever" behavior.
     */
    targetSliverCount: number = 0;

    /**
     * Orchestration hook: when true, skip Core.SetOptions(true/false). Used when this
     * script is invoked from a parent orchestrator that runs its own SetOptions.
     */
    skipSetOptions: boolean = false;

    // Route:
    // Enter: Dying Light -> Shining Star
    // r1: Dawn Knight -> Shining Star
    // r2: SC handles Dawn Knight while LR/AP/LoO handle Dying Light
    // r3: Hollow Solstice, LR/SC alternate on The Sun Converges

    // ── Dungeon run ───────────────────────────────────────────────────────────

    runMidnightSun(): void {
        const run = ++this.runCount;
        const runCheckpoint = `MidnightSun_${run}`;

        this.resetReusableSyncFiles();

        this.resetDungeonInstance("midnightsun", runCheckpoint);

        // Enter: Dying Light first, then Shining Star after Dying Light dies.
        this.armyKillMonsterWithRotatingAuraTaunt(
            "midnightsun",
            "Enter",
            "Left",
            "Dying Light",
            "Gathering Light",
            `${runCheckpoint}_01`,
            "Shining Star",
        );

        // r1: Dawn Knight first, then Shining Star after Dawn Knight dies.
        this.armyKillMonsterWithSelfAuraDelayedTaunt(
            "midnightsun",
            "r1",
            "Left",
            "Dawn Knight",
            "Sun's Warmth",
            `${runCheckpoint}_03`,
            "Shining Star",
        );

        // r2: SC focuses/taunts Dawn Knight, everyone else focuses Dying Light.
        // Once either mob dies, all accounts swap to whichever mob is still alive.
        this.armyKillRoom2SplitFocusTaunt("midnightsun", "r2", "Left", `${runCheckpoint}_05`);

        // Shrine boss: Hollow Solstice — player1+2 alternate on "The Sun Converges"
        this.armyKillShrineBoss("midnightsun", "r3", "Left", "Hollow Solstice", `${runCheckpoint}_06`);

        this.tryCompleteDailyQuest(9304, "Sliver of Sunlight");
    }

    // ── Army helpers ──────────────────────────────────────────────────────────

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

        this.killFocusedMonsterWithLrApAuraTaunt(monster, auraName, cell, pad, nextMonster);

        this.syncArmy(`${checkpoint}_done.sync`);
    }

    armyKillMonsterWithSelfAuraDelayedTaunt(
        map: string,
        cell: string,
        pad: string,
        monster: string,
        auraName: string,
        checkpoint: string,
        nextMonster: string | null = null,
        tauntDelayMs = 6000,
    ): void {
        this.joinAndFocus(map, cell, pad);
        this.syncArmy(`${checkpoint}_ready.sync`);

        this.killFocusedMonsterWithSunSelfAuraDelayedTaunt(monster, auraName, cell, pad, nextMonster, tauntDelayMs);

        this.syncArmy(`${checkpoint}_done.sync`);
    }

    armyKillRoom2SplitFocusTaunt(map: string, cell: string, pad: string, checkpoint: string): void {
        this.joinAndFocus(map, cell, pad);
        this.syncArmy(`${checkpoint}_ready.sync`);

        this.killRoom2SplitFocusTaunt(cell, pad);

        this.syncArmy(`${checkpoint}_done.sync`);
    }

    armyKillWithDelayedTaunt(
        map: string,
        cell: string,
        pad: string,
        monster: string,
        checkpoint: string,
        enrageMessage: string,
        tauntOffsetSeconds = 6,
    ): void {
        this.joinAndFocus(map, cell, pad);

        const isTaunter = this.isSunTaunter();
        this.syncArmy(`${checkpoint}_ready.sync`);

        // player1+2 alternate — player1 "starts" so player2 fires first
        this.bossFight(monster, cell, enrageMessage, isTaunter, tauntOffsetSeconds, "player1");

        this.syncArmy(`${checkpoint}_done.sync`);
    }

    armyKillShrineBoss(map: string, cell: string, pad: string, monster: string, checkpoint: string): void {
        this.joinAndFocus(map, cell, pad);

        const isTaunter = this.isSunTaunter();
        this.syncArmy(`${checkpoint}_ready.sync`);

        // player1+2 alternate — player2 is "starting" so player1 fires first
        this.bossFight(monster, cell, "The Sun Converges", isTaunter, 0, "player2");

        Core.logger(`[r3] ${monster} fight complete. Waiting for army done sync.`);

        this.syncArmy(`${checkpoint}_done.sync`);
    }

    syncGroupPath(syncFile: string): string {
        const group = this.getSyncGroup(syncFile);
        return Ultra.resolveSyncPath(`MidnightSun_${Core.privateRoomNumber}_${group}.sync`);
    }

    getSyncGroup(syncFile: string): string {
        const name = syncFile.toLowerCase();

        if (name.includes("party")) {
            return "setup";
        }

        if (name.includes("reset") || name.includes("whitemap") || name.includes("rejoined")) {
            return "reset";
        }

        return "run";
    }

    resetReusableSyncFiles(): void {
        Core.logger("[Sync] Moving to /whitemap before clearing reusable sync files.");
        Core.join("whitemap", "Enter", "Spawn");
        this.waitForMapName("whitemap", 8000);
        bot.sleep(1000);

        const isPlayer1 = this.isConfiguredAccount(bot.config!.get<string>("player1") ?? "");

        if (!isPlayer1) {
            if (!this.syncFilesClearedOnStartup) {
                Core.logger("[Sync] Waiting briefly while player1 clears startup sync files.");
            } else {
                Core.logger("[Sync] Waiting briefly while player1 resets reusable reset sync file.");
            }

            bot.sleep(1500);

            if (!this.syncFilesClearedOnStartup) {
                this.syncFilesClearedOnStartup = true;
                Core.logger("[Sync] Done waiting for player1 startup sync clear.");
            } else {
                Core.logger("[Sync] Done waiting for player1 sync reset.");
            }

            return;
        }

        if (!this.syncFilesClearedOnStartup) {
            Core.logger("[Sync] Player1 is clearing startup sync files for MidnightSun.");

            this.resetSyncFile(this.syncGroupPath("MidnightSun_reset_ready.sync"));
            this.resetSyncFile(this.syncGroupPath("MidnightSun_run_ready.sync"));

            this.syncFilesClearedOnStartup = true;

            Core.logger("[Sync] Startup sync files cleared.");
            bot.sleep(1500);
            return;
        }

        Core.logger("[Sync] Player1 is resetting reusable reset sync file for the new MidnightSun run.");

        this.resetSyncFile(this.syncGroupPath("MidnightSun_reset_ready.sync"));

        Core.logger("[Sync] Reusable reset sync file reset complete.");
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
            this.updateSyncLines(path, (lines) => [
                ...lines.filter((l) => !l.toLowerCase().startsWith(`${checkpoint}:${username}:`.toLowerCase())),
                `${checkpoint}:${username}:ready:${Math.floor(Date.now() / 1000)}`,
            ]);

            const now = Math.floor(Date.now() / 1000);

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

    // ── Combat helpers ────────────────────────────────────────────────────────

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
                        `[Dying Light Taunt] ${auraName} detected on ${monster}. Cycle #${auraCycle}; ${role}'s turn to taunt.`,
                    );
                    this.tauntCurrentTarget("[Dying Light Taunt]", monster);
                } else {
                    if (isLegionRevenant || isArchPaladin) {
                        const waitingFor = lrTurn ? "LR" : "AP";
                        Core.logger(
                            `[Dying Light Taunt] ${auraName} detected on ${monster}. Cycle #${auraCycle}; waiting for ${waitingFor}.`,
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

    killFocusedMonsterWithSunSelfAuraDelayedTaunt(
        monster: string,
        auraName: string,
        cell: string,
        pad: string,
        nextMonster: string | null = null,
        tauntDelayMs = 6000,
    ): void {
        let noTargetSince = 0;
        let auraWasActive = false;
        let auraCycle = 0;
        let tauntArmed = false;
        let tauntAttempted = false;
        let tauntAt = 0;

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
            const auraActive = fightingMainMonster && bot.self.hasActiveAura(auraName);

            if (auraActive && !auraWasActive) {
                auraWasActive = true;
                auraCycle++;

                // Match the old Dawn Knight ordering: player2 taunts first, then player1, then repeats.
                const assignedConfig = auraCycle % 2 === 1 ? "player2" : "player1";
                const assignedLabel = auraCycle % 2 === 1 ? "SC" : "LR";
                const isAssignedTaunter = this.isConfiguredAccount(bot.config!.get<string>(assignedConfig) ?? "");

                if (isAssignedTaunter) {
                    tauntArmed = true;
                    tauntAttempted = false;
                    tauntAt = Date.now() + tauntDelayMs;
                    Core.logger(
                        `[Dawn Knight Taunt] ${auraName} detected. Cycle #${auraCycle}; ${assignedLabel}'s turn. Taunting in ${formatTenths(tauntDelayMs / 1000.0)} seconds.`,
                    );
                } else if (this.isSunTaunter()) {
                    Core.logger(
                        `[Dawn Knight Taunt] ${auraName} detected. Cycle #${auraCycle}; waiting for ${assignedLabel}.`,
                    );
                }
            }

            if (tauntArmed && !tauntAttempted && Date.now() >= tauntAt) {
                tauntAttempted = this.tauntCurrentTarget("[Dawn Knight Taunt]", monster);
            } else {
                this.useClassSkills();
                bot.sleep(400);
            }

            if (!auraActive) {
                auraWasActive = false;

                if (tauntAttempted) {
                    tauntArmed = false;
                    tauntAttempted = false;
                    tauntAt = 0;
                }
            }
        }
    }

    killRoom2SplitFocusTaunt(cell: string, pad: string): void {
        const dyingLight = "Dying Light";
        const dawnKnight = "Dawn Knight";
        const dyingAura = "Gathering Light";
        const dawnAura = "Sun's Warmth";
        const dawnTauntDelayMs = 6000;

        let noTargetSince = 0;

        let dyingAuraWasActive = false;
        let dyingAuraCycle = 0;

        let dawnAuraWasActive = false;
        let dawnTauntArmed = false;
        let dawnTauntAttempted = false;
        let dawnTauntAt = 0;

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
            const isArchPaladin = bot.player.currentClass?.toLowerCase() === "ArchPaladin"?.toLowerCase();

            const dawnKnightAlive = this.monsterAvailable(dawnKnight, cell);
            const dyingLightAlive = this.monsterAvailable(dyingLight, cell);

            let target = "";

            if (isStoneCrusher) {
                target = dawnKnightAlive ? dawnKnight : dyingLightAlive ? dyingLight : "";
            } else {
                target = dyingLightAlive ? dyingLight : dawnKnightAlive ? dawnKnight : "";
            }

            if (!!target?.trim()) {
                bot.combat.attack(target);
            }

            let handledTauntWindow = false;

            if (target === dyingLight && dyingLightAlive) {
                const auraActive =
                    bot.player.hasTarget &&
                    bot.target != null &&
                    bot.target.auras.some((a) => a.name.toLowerCase() === dyingAura.toLowerCase());

                if (auraActive && !dyingAuraWasActive) {
                    dyingAuraWasActive = true;
                    dyingAuraCycle++;

                    const lrTurn = dyingAuraCycle % 2 === 1;
                    const apTurn = dyingAuraCycle % 2 === 0;

                    if ((lrTurn && isLegionRevenant) || (apTurn && isArchPaladin)) {
                        const role = isLegionRevenant ? "LR" : "AP";
                        Core.logger(
                            `[r2 Dying Light Taunt] ${dyingAura} detected. Cycle #${dyingAuraCycle}; ${role}'s turn to taunt.`,
                        );
                        this.tauntCurrentTarget("[r2 Dying Light Taunt]", dyingLight);
                        handledTauntWindow = true;
                    } else if (isLegionRevenant || isArchPaladin) {
                        const waitingFor = lrTurn ? "LR" : "AP";
                        Core.logger(
                            `[r2 Dying Light Taunt] ${dyingAura} detected. Cycle #${dyingAuraCycle}; waiting for ${waitingFor}.`,
                        );
                    }
                }

                if (!auraActive) {
                    dyingAuraWasActive = false;
                }
            } else {
                dyingAuraWasActive = false;
            }

            if (isStoneCrusher && target === dawnKnight && dawnKnightAlive) {
                const auraActive = bot.self.hasActiveAura(dawnAura);

                if (auraActive && !dawnAuraWasActive) {
                    dawnAuraWasActive = true;
                    dawnTauntArmed = true;
                    dawnTauntAttempted = false;
                    dawnTauntAt = Date.now() + dawnTauntDelayMs;
                    Core.logger(
                        `[r2 SC Dawn Taunt] ${dawnAura} detected. Taunting in ${formatTenths(dawnTauntDelayMs / 1000.0)} seconds.`,
                    );
                }

                if (dawnTauntArmed && !dawnTauntAttempted && Date.now() >= dawnTauntAt) {
                    dawnTauntAttempted = this.tauntCurrentTarget("[r2 SC Dawn Taunt]", dawnKnight);
                    handledTauntWindow = true;
                }

                if (!auraActive) {
                    dawnAuraWasActive = false;
                    dawnTauntArmed = false;
                    dawnTauntAttempted = false;
                    dawnTauntAt = 0;
                }
            } else {
                dawnAuraWasActive = false;
                dawnTauntArmed = false;
                dawnTauntAttempted = false;
                dawnTauntAt = 0;
            }

            if (!handledTauntWindow) {
                this.useClassSkills();
                bot.sleep(400);
            }

            if (!dawnKnightAlive && !dyingLightAlive) {
                noTargetSince = noTargetSince === 0 ? Date.now() : noTargetSince;

                if (Date.now() - noTargetSince > 1800) {
                    break;
                }
            } else {
                noTargetSince = 0;
            }
        }
    }

    bossFight(
        monster: string,
        cell: string,
        enrageMessage: string,
        isTaunter: boolean,
        tauntOffsetSeconds = 0,
        startingTaunterConfig = "player2",
    ): void {
        const ReturnToFightCell = (targetCell: string): void => {
            if (!targetCell?.trim()) {
                return;
            }

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

                if (data == null || data?.["cmd"]?.toString() !== "ct") {
                    return;
                }

                let triggered = false;
                if (data?.["anims"] != null) {
                    for (const a of data.anims) {
                        if (a?.msg != null && a!.msg.indexOf(enrageMessage) >= 0) {
                            triggered = true;
                            break;
                        }
                    }
                }

                if (!triggered && data?.["a"] != null) {
                    for (const a of data!.a) {
                        if (a != null && a!["cmd"]?.toString() === "aura+" && a?.["auras"] != null) {
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

                        if (this.tauntCurrentTargetForMessage(enrageMessage, 10)) {
                            usedEnrage = true;
                            needsEnrage = false;
                            usedLastEnrage = true;
                        }
                    } else if (usedLastEnrage) {
                        Core.logger(`[Taunt] '${enrageMessage}' — other taunter's turn.`);

                        const waitUntil = Date.now() + 2500;
                        while (
                            !bot.shouldExit &&
                            bot.player.hasTarget &&
                            !this.targetHasEnrageAura() &&
                            Date.now() < waitUntil
                        ) {
                            bot.sleep(100);
                        }

                        if (this.targetHasEnrageAura()) {
                            Core.logger("[Taunt] Other taunter's Enrage confirmed.");
                        } else {
                            Core.logger("[Taunt] Other taunter turn complete; rotating.");
                        }

                        usedEnrage = true;
                        needsEnrage = false;
                        usedLastEnrage = false;
                    }
                }

                if (!needsEnrage || usedEnrage || !bot.player.hasTarget) {
                    bot.combat.attack(monster);
                }

                this.useClassSkills();
                bot.sleep(300);

                if (
                    bot.player.hasTarget &&
                    bot.player.target != null &&
                    bot.player.target.name?.toLowerCase() === monster?.toLowerCase() &&
                    bot.player.target.hp <= 0
                ) {
                    noTargetSince = noTargetSince === 0 ? Date.now() : noTargetSince;

                    if (Date.now() - noTargetSince > 1800) {
                        break;
                    }
                } else if (bot.player.hasTarget) {
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

    targetHasEnrageAura(): boolean {
        return (
            bot.player.hasTarget &&
            (bot.target.auras.some((x) => x.name.toLowerCase() === "Focus".toLowerCase() && auraRemainingTime(x) > 4) ||
                bot.target.auras.some(
                    (x) => x.name.toLowerCase() === "Reckless".toLowerCase() && auraRemainingTime(x) > 4,
                ))
        );
    }

    ensureEnrageEquipped(context: string): boolean {
        if (!Core.checkInventory("Scroll of Enrage")) {
            Core.logger(`[Taunt] ${context}: missing Scroll of Enrage.`);
            return false;
        }

        if (!bot.inventory.isEquipped("Scroll of Enrage")) {
            Core.logger(`[Taunt] ${context}: Scroll of Enrage was not equipped; re-equipping usable slot.`);
            bot.inventory.equipUsableItem("Scroll of Enrage");
            bot.sleep(600);
        }

        return bot.inventory.isEquipped("Scroll of Enrage");
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
                if (!bot.player.hasTarget) {
                    return false;
                }

                this.ensureEnrageEquipped(expectedTarget);

                Core.logger(`${logPrefix} Scroll attempt ${attempt}/${maxAttempts}.`);

                Core.usePotion();

                const confirmEnd = Date.now() + 1000;

                while (!bot.shouldExit && Date.now() < confirmEnd) {
                    bot.sleep(100);

                    if (this.targetHasEnrageAura()) {
                        Core.logger(`${logPrefix} Enrage confirmed on ${expectedTarget}.`);
                        return true;
                    }
                }

                bot.sleep(500);
            }

            Core.logger(
                `${logPrefix} Scroll force-use attempts failed; Enrage was not confirmed on ${expectedTarget}.`,
            );
            return false;
        } finally {
            bot.skills.resume();
        }
    }

    /** C#'s `TauntCurrentTarget(string enrageMessage, int maxAttempts = 10)` overload. */
    tauntCurrentTargetForMessage(enrageMessage: string, maxAttempts = 10): boolean {
        bot.skills.pause();

        try {
            for (let attempt = 1; attempt <= maxAttempts && !bot.shouldExit; attempt++) {
                if (!bot.player.hasTarget) {
                    return false;
                }

                if (this.targetHasEnrageAura()) {
                    return true;
                }

                this.ensureEnrageEquipped(enrageMessage);

                if (!bot.skills.canUseSkill(5)) {
                    bot.wait.forTrue(() => bot.skills.canUseSkill(5), 3);
                }

                Core.logger(`[Taunt] '${enrageMessage}' — Scroll of Enrage attempt ${attempt}/${maxAttempts}.`);

                bot.combat.cancelAutoAttack();
                Core.usePotion();
                bot.sleep(350);

                if (this.targetHasEnrageAura()) {
                    Core.logger("[Taunt] Enrage confirmed!");
                    return true;
                }
            }

            Core.logger(`[Taunt] WARNING: '${enrageMessage}' was not confirmed after ${maxAttempts} attempts.`);
            return false;
        } finally {
            bot.skills.resume();
        }
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

    resetDungeonInstance(nextMap: string, checkpoint: string): void {
        this.syncArmy(`${checkpoint}_reset_ready.sync`);
        Core.logger(`Resetting dungeon...`);
        Core.join("whitemap", "Enter", "Spawn");
        this.waitForMapName("whitemap", 8000);
        bot.sleep(1000);
        this.syncArmy(`${checkpoint}_all_in_whitemap.sync`);
        this.sellHallowedRemainsIfMax();
        this.refreshPotionsIfAurasMissing();
        this.restockEnrageIfLow(`Before ${checkpoint}`, 80);
        this.ensureEnrageEquipped("Restock");
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

    refreshPotionsIfAurasMissing(): void {
        if (!this.usePotions) {
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

    restockEnrageIfLow(context: string, minimumCount = 80): void {
        const needsEnrage =
            this.isConfiguredAccount(bot.config!.get<string>("player1") ?? "") ||
            this.isConfiguredAccount(bot.config!.get<string>("player2") ?? "") ||
            this.isConfiguredAccount(bot.config!.get<string>("player3") ?? "") ||
            this.isConfiguredAccount(bot.config!.get<string>("player4") ?? "");

        if (!needsEnrage) {
            return;
        }

        const count = this.getInventoryQuantity("Scroll of Enrage");
        Core.logger(`[Taunt] ${context}: ${count} Scroll of Enrage remaining.`);

        if (count >= minimumCount) {
            return;
        }

        Core.logger(`[Taunt] Scroll of Enrage is below ${minimumCount}. Restocking before continuing.`);

        Ultra.getScrollOfEnrage();

        const newCount = this.getInventoryQuantity("Scroll of Enrage");
        Core.logger(`[Taunt] Restock complete: ${newCount} Scroll of Enrage remaining.`);

        this.ensureEnrageEquipped("restock");
    }

    joinAndFocus(map: string, cell: string, pad: string): void {
        this.joinShrineDungeon(map, cell, pad);

        if (bot.map.playerNames != null && bot.map.playerNames.length < sArmy.players().length) {
            Core.logger(
                `Only ${bot.map.playerNames.length}/${sArmy.players().length} players in /${map}-${Core.privateRoomNumber}; retrying.`,
            );
            this.joinShrineDungeon(map, cell, pad, true);
            bot.sleep(1000);
        }

        if (bot.player.cell !== cell) {
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
            this.isConfiguredAccount(bot.config!.get<string>("player1") ?? "") ||
            this.isConfiguredAccount(bot.config!.get<string>("player2") ?? "")
        );
    }

    isConfiguredAccount(account: string): boolean {
        return !!account?.trim() && Core.username()?.toLowerCase() === account?.toLowerCase();
    }

    // ── Setup ─────────────────────────────────────────────────────────────────

    equipArmyClasses(): void {
        const username = Core.username();
        const p1 = bot.config!.get<string>("player1");
        const p2 = bot.config!.get<string>("player2");
        const p3 = bot.config!.get<string>("player3");
        const p4 = bot.config!.get<string>("player4");

        if (username.toLowerCase() === p1.toLowerCase()) {
            this.equipClassByName(MidnightSunTest.player1Class);
        } else if (username.toLowerCase() === p2.toLowerCase()) {
            this.equipClassByName(MidnightSunTest.player2Class);
        } else if (username.toLowerCase() === p3.toLowerCase()) {
            this.equipClassByName(MidnightSunTest.player3Class);
        } else if (username.toLowerCase() === p4.toLowerCase()) {
            this.equipClassByName(MidnightSunTest.player4Class);
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
            case "stonecrusher":

            case "infinity titan":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    hSpecial: HelmSpecial.None,
                    wSpecial: WeaponSpecial.Valiance,
                    cSpecial: CapeSpecial.Absolution,
                });
                break;
            case "archpaladin":
                Adv.enhanceEquipped(EnhancementType.Lucky, {
                    hSpecial: HelmSpecial.None,
                    wSpecial: WeaponSpecial.Valiance,
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
            default:
                Core.logger(`[Enhance] No profile for '${className}' — skipping.`);
                break;
        }
    }
    prepareTauntRole(): void {
        if (this.autoGetEnrage) {
            Core.logger("Auto-crafting Scroll of Enrage...");
            Ultra.getScrollOfEnrage();
        }

        if (!this.ensureEnrageEquipped("setup")) {
            Core.logger("No Scroll of Enrage found — boss charges will NOT be redirected.");
            return;
        }

        Core.logger("Scroll of Enrage is equipped.");
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
            Core.setOptions(false);
            return;
        }

        Core.privateRooms = true;
        const configuredRoom = bot.config!.get<number>("privateRoomNumber");
        if (configuredRoom >= 1000 && configuredRoom <= 99999) {
            Core.privateRoomNumber = configuredRoom;
        } else {
            Core.logger(`Invalid private room number '${configuredRoom}'. Generating a fallback room number.`);
            Core.privateRoomNumber = sArmy.getRoomNr();
        }

        Core.logger(`Army mode enabled: ${sArmy.players().length} accounts, private room #${Core.privateRoomNumber}.`);

        script.autoEnhance = bot.config!.get<boolean>("autoEnhance");
        script.autoGetEnrage = true;
        script.usePotions = bot.config.get<boolean>("usePotions");

        script.equipArmyClasses();

        if (script.autoEnhance) {
            script.applyEnhancements();
        }

        if (script.usePotions) {
            script.useClassPotions();
        }

        script.prepareTauntRole();

        script.tryAcceptDailyQuest(9304, "Dawn Breaks");

        Core.addDrop(MidnightSunTest.sliverSunlight);

        try {
            while (!bot.shouldExit) {
                if (
                    script.targetSliverCount > 0 &&
                    Core.checkInventory(MidnightSunTest.sliverSunlight, script.targetSliverCount)
                ) {
                    Core.logger(
                        `[MidnightSun] Reached target of ${script.targetSliverCount} ${MidnightSunTest.sliverSunlight}; stopping.`,
                    );
                    break;
                }
                script.runMidnightSun();
            }
        } finally {
            if (!script.skipSetOptions) {
                Core.setOptions(false);
            }
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "MidnightSunTest",
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
            "usePotions",
            "Use Potions",
            "ON: equips and uses configured class potion sets before starting the dungeon loop. (TONICS and ELIXIRS ONLY)\n" +
                "OFF: skips potion usage.",
            false,
        ),
    ],
    true,
);

export default function main(): void {
    new MidnightSunTest().scriptMain();
}

/** C#'s `{x:0.#}`: at most one decimal, none when it's zero. */
function formatTenths(x: number): string {
    return String(Math.round(x * 10) / 10);
}

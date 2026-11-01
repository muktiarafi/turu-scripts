/*
name: UltraSpeakerv3
description: Ultra First Speaker v3 — chat-driven taunt system with position management and stasis handling.
tags: null
*/
// Port of Scripts/Ultrasv3/IndividualUltras/10UltraSpeakerv3.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.
//
// Turu: C#'s fire-and-forget `async Task`s and `Task.Run` walks are tasks of core/CoreTasks.ts.

import { bot, type EventMap } from "turu";
import { Core, randomInt, rethrowIfStopped } from "../../core/CoreBots";
import { type TaskStep, tasks, until } from "../../core/CoreTasks";
import { CoreEnginev3 } from "../dependenciesultras/CoreEnginev3";
import { CoreUltrav3 } from "../dependenciesultras/CoreUltrav3";
import { GetScrolls } from "../dependenciesultras/GetScrolls";
import { UltraCustomClassSync } from "../dependenciesultras/UltraCustomClassSync";
import { UltraEnhancements } from "../dependenciesultras/UltraEnhancements";
import { UltraGeneral } from "../dependenciesultras/UltraGeneral";
import { UltraPotions } from "../dependenciesultras/UltraPotions";
import { UltraWaitForArmy } from "../dependenciesultras/UltraWaitForArmy";

const Engine = CoreEnginev3.instance;
const Ultra = new CoreUltrav3();
const Enh = new UltraEnhancements();
const Pots = new UltraPotions();
const Scrolls = new GetScrolls();

export class UltraSpeakerv3 {
    // Chat-driven taunt roles — 1 ListenTaunter, 3 TruthTaunters
    private static readonly listenTaunterClass = "ArchPaladin";
    private static readonly truthTaunter1Class = "Lord of Order";
    private static readonly truthTaunter2Class = "StoneCrusher";
    private static readonly truthTaunter3Class = "Verus DoomKnight";

    private static readonly ultraClassesByRole: string[][] = [
        [UltraSpeakerv3.listenTaunterClass],
        [UltraSpeakerv3.truthTaunter1Class],
        [UltraSpeakerv3.truthTaunter2Class],
        [UltraSpeakerv3.truthTaunter3Class],
    ];

    // Chat-listener state
    private truthTauntTurn: number = 0;
    private lastTruthTauntActedTurn: number = 0;
    private static readonly truthTurnSyncFile = "UltraSpeakerTruthTurn.sync";
    private listenTauntTurn: number = 0;
    private lastListenTauntActedTurn: number = 0;
    private static readonly listenTurnSyncFile = "UltraSpeakerListenTurn.sync";
    private equalizeCount: number = 0;
    private _movingToEqualize: boolean = false;
    private _positioned: boolean = false;

    private static readonly equalizeX = 200;
    private static readonly equalizeY = 380;

    runBoss(): void {
        Core.setOptions(true);

        Engine.boot(); // Use CoreEngine auto-rotation

        bot.events.on("extensionPacket", this.speakerMessageListener);
        bot.events.on("extensionPacket", this.speakerFlashListener);
        try {
            this.prep();
            this.fight();
        } finally {
            bot.events.off("extensionPacket", this.speakerMessageListener);
            bot.events.off("extensionPacket", this.speakerFlashListener);

            Engine.disableSkills();
            Core.setOptions(false);
        }
    }

    private isTaunter(): boolean {
        const className = bot.player.currentClass;
        return (
            className === UltraSpeakerv3.listenTaunterClass ||
            className === UltraSpeakerv3.truthTaunter1Class ||
            className === UltraSpeakerv3.truthTaunter2Class ||
            className === UltraSpeakerv3.truthTaunter3Class
        );
    }

    private isListenTaunter(): boolean {
        return bot.player.currentClass === UltraSpeakerv3.listenTaunterClass;
    }

    isTruthTaunter1(): boolean {
        return bot.player.currentClass === UltraSpeakerv3.truthTaunter1Class;
    }

    isTruthTaunter2(): boolean {
        return bot.player.currentClass === UltraSpeakerv3.truthTaunter2Class;
    }

    isTruthTaunter3(): boolean {
        return bot.player.currentClass === UltraSpeakerv3.truthTaunter3Class;
    }

    private myTruthIndex(): number {
        const className = bot.player.currentClass;
        if (className === UltraSpeakerv3.truthTaunter1Class) {
            return 0;
        }
        if (className === UltraSpeakerv3.truthTaunter2Class) {
            return 1;
        }
        if (className === UltraSpeakerv3.truthTaunter3Class) {
            return 2;
        }
        return -1;
    }

    private myListenIndex(): number {
        return bot.player.currentClass === UltraSpeakerv3.listenTaunterClass ? 0 : -1;
    }

    private myRoleIndex(): number {
        const className = bot.player.currentClass;
        if (className === UltraSpeakerv3.listenTaunterClass) {
            return 0;
        }
        if (className === UltraSpeakerv3.truthTaunter1Class) {
            return 1;
        }
        if (className === UltraSpeakerv3.truthTaunter2Class) {
            return 2;
        }
        if (className === UltraSpeakerv3.truthTaunter3Class) {
            return 3;
        }
        return -1;
    }

    private equipPresetClasses(): void {
        const armySize = 4;
        const allowDuplicates = armySize > UltraSpeakerv3.ultraClassesByRole.length;

        Core.logger(`[UltraSpeaker-v3] Equipping role-based ultra classes for army size ${armySize}.`);
        const classSlots = new Array(armySize).fill(null);

        for (let i = 0; i < armySize; i++) {
            classSlots[i] =
                i < UltraSpeakerv3.ultraClassesByRole.length
                    ? UltraSpeakerv3.ultraClassesByRole[i]
                    : UltraSpeakerv3.ultraClassesByRole[0];
        }

        UltraCustomClassSync.customClassSync(
            Ultra,
            bot,
            classSlots,
            armySize,
            "ultra_speaker_class-v3.sync",
            allowDuplicates,
        );
    }

    private prep(): void {
        UltraGeneral.equipWarriorClass();
        bot.sleep(2000);
        this.equipPresetClasses();
        bot.sleep(2000);

        Enh.applySpeaker();

        const roleNames = ["ListenTaunter", "TruthTaunter1", "TruthTaunter2", "TruthTaunter3"];
        const roleIdx = this.myRoleIndex();
        Core.logger(`[UltraSpeaker-v3] Role: ${roleIdx >= 0 ? roleNames[roleIdx] : "Unknown"}`);
    }

    private fight(): void {
        const map = "ultraspeaker";
        const boss = "The First Speaker";
        const bossDefeatedTemp = "The First Speaker Silenced";

        const waitSyncFile = "ultra_speaker.sync";
        const completionSyncFile = "UltraSpeakerCompletion.sync";
        const armySize = 4;

        const questId = 9173;

        if (!UltraGeneral.isQuestGreen(bot, questId)) {
            UltraGeneral.ensureAcceptOnce(bot, questId);
        }

        if (!bot.quests.isUnlocked(questId)) {
            bot.quests.updateQuest(9125);
        }

        bot.options.disableCollisions = true;
        Ultra.clearSyncFile(Ultra.resolveSyncPath(UltraSpeakerv3.truthTurnSyncFile));
        Ultra.clearSyncFile(Ultra.resolveSyncPath(UltraSpeakerv3.listenTurnSyncFile));
        Ultra.clearSyncFile(Ultra.resolveSyncPath(completionSyncFile));

        const skipThird = this.isTaunter();
        Pots.ensureRecommendedPotions(undefined, skipThird, "Speaker");
        Scrolls.getScrollOfEnrage();

        Core.join("Whitemap");
        UltraWaitForArmy.instance.newWaitForArmy(armySize - 1, waitSyncFile, undefined, undefined, false);

        Pots.useRecommendedPotions(undefined, skipThird, "Speaker", false);

        if (skipThird) {
            Core.logger("[UltraSpeaker-v3] Taunter detected, equipping Scroll of Enrage.");
            Engine.equipEnrage();
        }

        Engine.join(map);
        bot.sleep(2500);
        UltraWaitForArmy.instance.newWaitForArmy(armySize - 1, waitSyncFile, undefined, undefined, true);

        Engine.chooseBestCell(boss);
        bot.player.setSpawnPoint();

        const _username = bot.player.username;
        const _className = bot.player.currentClass;
        if (!!_username?.trim() && !!_className?.trim()) {
            const _myKey = `${_username}|${_className}`.replaceAll(":", "-");
            Ultra.updateEntry(Ultra.resolveSyncPath(completionSyncFile), _myKey, "0");
        }

        while (!bot.shouldExit) {
            if (bot.player?.alive !== true) {
                bot.wait.forTrue(() => bot.player?.alive === true, 20);
                // Just respawned — re-sync truth taunt turn counter from sync file
                try {
                    const syncFile = Ultra.resolveSyncPath(UltraSpeakerv3.truthTurnSyncFile);
                    const lines = Ultra.readLines(syncFile);
                    let maxTurn = 0;
                    for (const line of lines) {
                        const parts = line.split(":");
                        const turn = /^-?\d+$/.test(parts[1] ?? "") ? Number(parts[1]) : NaN;
                        if (parts.length >= 3 && turn > maxTurn) {
                            maxTurn = turn;
                        }
                    }
                    if (maxTurn > this.truthTauntTurn) {
                        this.truthTauntTurn = maxTurn;
                        this.lastTruthTauntActedTurn = maxTurn;
                        Core.logger(
                            `[UltraSpeaker-v3] Re-synced truth taunt turn to ${this.truthTauntTurn} after respawn.`,
                        );
                    }
                } catch (error) {
                    rethrowIfStopped(error);
                }
                // Re-sync listen taunt turn counter from sync file
                try {
                    const syncFile = Ultra.resolveSyncPath(UltraSpeakerv3.listenTurnSyncFile);
                    const lines = Ultra.readLines(syncFile);
                    let maxTurn = 0;
                    for (const line of lines) {
                        const parts = line.split(":");
                        const turn = /^-?\d+$/.test(parts[1] ?? "") ? Number(parts[1]) : NaN;
                        if (parts.length >= 3 && turn > maxTurn) {
                            maxTurn = turn;
                        }
                    }
                    if (maxTurn > this.listenTauntTurn) {
                        this.listenTauntTurn = maxTurn;
                        this.lastListenTauntActedTurn = maxTurn;
                        Core.logger(
                            `[UltraSpeaker-v3] Re-synced listen taunt turn to ${this.listenTauntTurn} after respawn.`,
                        );
                    }
                } catch (error) {
                    rethrowIfStopped(error);
                }
                // Reset position flag so we walk to safe box again after respawn
                this._positioned = false;
                continue;
            }

            // Position management — walk to safe box once on first enter or after death
            if (!this._positioned && !this._movingToEqualize && bot.player?.cell === "Boss") {
                const minX = 0,
                    maxX = 100;
                const minY = 485,
                    maxY = 500;

                const randomX = randomInt(minX, maxX + 1);
                const randomY = randomInt(minY, maxY + 1);
                bot.player.walkTo(randomX, randomY);
                bot.wait.forTrue(() => Math.abs(bot.player.x - randomX) < 40, 10);
                this._positioned = true;
            }

            if (Ultra.checkArmyProgressBool(() => bot.inventory.contains(bossDefeatedTemp, 1), completionSyncFile)) {
                Core.logger("The First Speaker defeated. Finishing quest.");
                Engine.disableSkills();
                Engine.join(map);
                Ultra.persistentJoinHouse();
                UltraGeneral.completeQuest(bot, questId);
                bot.sleep(3000);
                break;
            }

            bot.combat.attack(boss);
            Pots.activateEquippedPotion();

            bot.sleep(500);
        }
    }

    private speakerMessageListener = (packet: EventMap["extensionPacket"]): void => {
        try {
            const type = packet["params"].type;
            if (!(type === "json")) {
                return;
            }

            if (!bot.player.alive) {
                return;
            }

            const data = packet["params"].dataObj;
            const cmd = String(data.cmd);

            if (cmd !== "ct") {
                return;
            }

            if (data.anims == null) {
                return;
            }

            for (const anim of data.anims) {
                if (anim === null || anim.msg == null) {
                    continue;
                }

                const message = anim.msg;

                // Energy Draw — ListenTaunters (cascade 1-2-1-2-1-2)
                if (message.toLowerCase().includes("You shall listen.".toLowerCase())) {
                    this.listenTauntTurn++;
                    Core.logger(`Detected: 'You shall listen.' (turn ${this.listenTauntTurn})`);
                    if (this.listenTauntTurn % 2 === this.myListenIndex()) {
                        try {
                            const myKey = `${bot.player.username}|${bot.player.currentClass ?? "Unknown"}`.replaceAll(
                                ":",
                                "-",
                            );
                            Ultra.updateEntry(
                                Ultra.resolveSyncPath(UltraSpeakerv3.listenTurnSyncFile),
                                myKey,
                                String(this.listenTauntTurn),
                            );
                        } catch (error) {
                            rethrowIfStopped(error);
                        }
                    }
                    this.listenTauntAsync();
                }

                // Magia Draw — TruthTaunters (cascade 1-2-1-2-1-2)
                if (message.toLowerCase().includes("I will make you see the truth.".toLowerCase())) {
                    this.truthTauntTurn++;
                    // Only write to sync file when it's our turn — 1 writer per truth taunt
                    if (this.truthTauntTurn % 3 === this.myTruthIndex()) {
                        try {
                            const myKey = `${bot.player.username}|${bot.player.currentClass ?? "Unknown"}`.replaceAll(
                                ":",
                                "-",
                            );
                            Ultra.updateEntry(
                                Ultra.resolveSyncPath(UltraSpeakerv3.truthTurnSyncFile),
                                myKey,
                                String(this.truthTauntTurn),
                            );
                        } catch (error) {
                            rethrowIfStopped(error);
                        }
                    }
                    // Fire immediately — no Fight loop latency
                    this.truthTauntAsync();
                }
            }
        } catch (error) {
            rethrowIfStopped(error);
        }
    };

    /**
     * C# listens to `Bot.Flash.FlashCall`'s "packetFromServer" and reads the packet's `b.o`; Turu's
     * `extensionPacket` event gives that object as `params.dataObj` of a JSON packet.
     */
    private speakerFlashListener = (packet: EventMap["extensionPacket"]): void => {
        try {
            if (packet?.["params"]?.type !== "json") {
                return;
            }

            const data: any | null = packet["params"].dataObj;

            if (data == null || data!["cmd"]?.toString() !== "ct") {
                return;
            }

            // FlashCall version: check anim messages
            if (data!["anims"] != null) {
                for (const anim of data["anims"]) {
                    if (anim?.msg != null) {
                        const msg = anim.msg;
                        if (
                            msg.toLowerCase().includes("All stand equal beneath the eyes of the Eternal.".toLowerCase())
                        ) {
                            this.equalizeCount++;
                            Core.logger(
                                `[UltraSpeaker-v3] Detected 'All stand equal beneath the eyes of the Eternal.' (count ${this.equalizeCount})`,
                            );

                            // Fire Decay for VDK (removes Scintillation)
                            this.decayAsync();

                            // Check auras synchronously before spawning background task
                            if (!bot.player.alive) {
                                return;
                            }

                            const health = bot.player.health;
                            const corruptionStacks = Engine.getAuraStacksFloat("Corruption", true);
                            const somberStacks = Engine.getAuraStacksFloat("Somber", true);
                            const hasMagiaBurn = Engine.hasAura("Magia Burn", true);
                            const hasStasis = Engine.hasAura("Stasis", true);
                            const hasSanctity = Engine.hasAura("Sanctity", true);
                            const hasLowHp = health < 5100;

                            if (
                                !(
                                    (corruptionStacks > 0 || somberStacks > 0) &&
                                    !hasMagiaBurn &&
                                    !hasStasis &&
                                    !hasSanctity &&
                                    !hasLowHp
                                )
                            ) {
                                Core.logger(
                                    `[UltraSpeaker-v3] Skipping equalize zone: hp=${health.toFixed(0)} corruption=${corruptionStacks.toFixed(2)} somber=${somberStacks.toFixed(2)} magiaBurn=${hasMagiaBurn} stasis=${hasStasis} sanctity=${hasSanctity}`,
                                );
                                return;
                            }

                            Core.logger(
                                `[UltraSpeaker-v3] Stepping into equalize zone: corruption=${corruptionStacks.toFixed(2)} somber=${somberStacks.toFixed(2)}`,
                            );
                            this._movingToEqualize = true;

                            // Same pattern as UltraDageListener — Task.Run keeps blocking WalkTo/Wait/Sleep off the game thread
                            const self = this;
                            tasks.start("UltraSpeakerEqualize", function* () {
                                bot.player.walkTo(UltraSpeakerv3.equalizeX, UltraSpeakerv3.equalizeY);
                                yield until(() => Math.abs(bot.player.x - UltraSpeakerv3.equalizeX) < 40, 10);

                                // Wait for Equalize to hit (3s charge + buffer)
                                yield 6000;

                                // Walk back to bottom-left safe box
                                Core.logger("[UltraSpeaker-v3] Returning to bottom-left safe box after Equalize.");
                                const homeX = randomInt(0, 100);
                                const homeY = randomInt(485, 500);
                                bot.player.walkTo(homeX, homeY);
                                yield until(() => Math.abs(bot.player.x - homeX) < 40, 10);
                                self._movingToEqualize = false;
                            });
                        }
                    }
                }
            }
        } catch (error) {
            rethrowIfStopped(error);
        }
    };

    /**
     * C#'s `ListenTauntAsync`: the guard runs at once (C#'s part before the first await), the 60
     * presses in a task.
     */
    private listenTauntAsync(): void {
        if (!bot.player.alive || !bot.player.hasTarget || !this.isListenTaunter()) {
            return;
        }

        // Guard: only act once per turn (single listen taunter always acts)
        if (this.listenTauntTurn <= this.lastListenTauntActedTurn) {
            return;
        }

        this.lastListenTauntActedTurn = this.listenTauntTurn;

        tasks.start("UltraSpeakerListenTaunt", () => castMany(5));
    }

    /** C#'s `TruthTauntAsync`, like {@link listenTauntAsync}. */
    private truthTauntAsync(): void {
        const myIndex = this.myTruthIndex();
        if (myIndex < 0 || !bot.player.alive || !bot.player.hasTarget) {
            return;
        }

        // Guard: only act if this turn is ours (3-way rotation) and we haven't acted yet
        if (this.truthTauntTurn % 3 !== myIndex || this.truthTauntTurn <= this.lastTruthTauntActedTurn) {
            return;
        }

        this.lastTruthTauntActedTurn = this.truthTauntTurn;

        tasks.start("UltraSpeakerTruthTaunt", () => castMany(5));
    }

    /** C#'s `DecayAsync`, like {@link listenTauntAsync}. */
    private decayAsync(): void {
        if (bot.player.currentClass !== "Verus DoomKnight" || !bot.player.alive) {
            return;
        }

        tasks.start("UltraSpeakerDecay", () => castMany(4));
    }
}

/** Casts skill `index` 60 times, 50 ms apart (C#'s `for` with `await Task.Delay(50)`). */
function* castMany(index: number): Generator<TaskStep, void, boolean> {
    for (let i = 0; i < 60; i++) {
        Engine.cast(index);
        yield 50;
    }
}

export default function main(): void {
    const script = new UltraSpeakerv3();
    script.runBoss();
    bot.stop();
}

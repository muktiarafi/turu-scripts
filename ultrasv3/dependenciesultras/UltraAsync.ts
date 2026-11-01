/*
name: UltraAsync
description: Pulse-driven taunt loop for Ultra boss scripts.
tags: ultra, async, taunt, pulse
*/
// Port of Scripts/Ultrasv3/DependenciesUltras/UltraAsync.cs.
//
// Turu: C#'s taunt thread (`StartTauntLoop`) and `Task.Run` loops are tasks of core/CoreTasks.ts,
// stepped between the script's bot calls; their `Thread.Sleep`s are `yield`s, and the 50 ms
// spin-waits between taunt presses too, so a press waits for the next task tick (handlers run every
// 100 ms of a `bot.sleep`). The fight start time is written to the sync log as Unix milliseconds
// (C# writes `DateTime.Ticks` to the file); only Turu clients read it.

import { bot } from "turu";
import { type CoreBots } from "../../core/CoreBots";
import { type CancellationToken, noCancellation, type TaskStep, tasks } from "../../core/CoreTasks";
import { type CoreEnginev3 } from "./CoreEnginev3";
import { type CoreUltrav3 } from "./CoreUltrav3";
import { UltraPulse } from "./UltraPulse";

/** C#'s `{time:HH:mm:ss.fff}` of a UTC time. */
function clock(ms: number): string {
    return new Date(ms).toISOString().substring(11, 23);
}

let taskCount = 0;

export class UltraAsync {
    /** Writes the fight start (now) to the sync log for the other taunters and returns it (Unix ms). */
    static setFightTime(C: CoreBots, syncPath: string): number {
        const now = Date.now();
        bot.army.writeLog(syncPath, [String(now)]);
        C.logger(`[FightTime] Primary set fight start: ${clock(now)} UTC`);
        return now;
    }

    /** Waits for the Primary's fight start in the sync log (fresher than 10 s) and returns it (Unix ms). */
    static getFightTime(ultra: CoreUltrav3, C: CoreBots, syncPath: string, timeoutSecs = 60): number {
        C.logger(`[FightTime] Waiting for Primary to set fight start (timeout: ${timeoutSecs}s)...`);
        const start = Date.now();
        while ((Date.now() - start) / 1000 < timeoutSecs) {
            const lines = ultra.readLines(syncPath);
            const time = lines.length > 0 && /^-?\d+$/.test(lines[0].trim()) ? Number(lines[0].trim()) : 0;
            if (time > 0) {
                const ageSecs = (Date.now() - time) / 1000;
                if (ageSecs > 10) {
                    C.logger(
                        `[FightTime] Skipping stale timestamp (${ageSecs.toFixed(0)}s old) — waiting for fresh write...`,
                    );
                    bot.sleep(500);
                    continue;
                }
                C.logger(`[FightTime] Read fight start: ${clock(time)} UTC`);
                return time;
            }
            bot.sleep(500);
        }
        C.logger("[FightTime] TIMEOUT — Primary never set fight time. Falling back to UtcNow.");
        return Date.now();
    }

    /**
     * Starts this client's taunt loop (C#'s background thread): taunter `taunterIndex` of
     * `taunterCount` taunts on its pulses (`pulseIntervalSec` apart from `fightStart`). Returns the
     * task's name; cancel `cancellationToken` (or the task) to end it.
     */
    static startTauntLoop(
        _bot: unknown,
        C: CoreBots,
        engine: CoreEnginev3,
        fightStart: number,
        taunterIndex: number,
        taunterCount = 2,
        shouldSkipTaunt: (() => boolean) | null = null,
        pulseIntervalSec = 5,
        cancellationToken: CancellationToken = noCancellation,
    ): string {
        const name = `UltraTauntLoop${++taskCount}`;
        tasks.start(name, () =>
            UltraAsync.tauntPulseLoop(
                C,
                engine,
                fightStart,
                taunterIndex,
                taunterCount,
                shouldSkipTaunt,
                pulseIntervalSec,
                cancellationToken,
            ),
        );
        return name;
    }

    private static *tauntPulseLoop(
        C: CoreBots,
        engine: CoreEnginev3,
        fightStart: number,
        taunterIndex: number,
        taunterCount: number,
        shouldSkipTaunt: (() => boolean) | null = null,
        pulseIntervalSec = 5,
        cancellationToken: CancellationToken = noCancellation,
    ): Generator<TaskStep, void, boolean> {
        let lastPulse = -1;
        const label = UltraAsync.getTaunterLabel(taunterIndex);
        const firstPulseSec = taunterIndex * pulseIntervalSec;
        const intervalSec = taunterCount * pulseIntervalSec;
        C.logger(
            `[${label}] Pulse taunt loop started. Fires every ${intervalSec}s (first at t=${firstPulseSec}s, interval=${pulseIntervalSec}s).${shouldSkipTaunt != null ? " Skip condition enabled." : ""}`,
        );

        while (!bot.shouldExit && !cancellationToken.isCancellationRequested) {
            if (!bot.player.alive) {
                yield 500;
                continue;
            }

            const currentPulse = UltraPulse.currentPulse(fightStart, pulseIntervalSec);

            if (currentPulse !== lastPulse) {
                lastPulse = currentPulse;

                if (currentPulse % taunterCount === taunterIndex) {
                    // Check skip condition before taunting
                    if (shouldSkipTaunt != null && shouldSkipTaunt()) {
                        const elapsed = (Date.now() - fightStart) / 1000;
                        C.logger(
                            `[${label}] Pulse ${currentPulse} at t=${elapsed.toFixed(1)}s — SKIPPED (skip condition met).`,
                        );
                        // C# `continue`s straight into the next check without sleeping.
                        yield;
                        continue;
                    }

                    const elapsed2 = (Date.now() - fightStart) / 1000;
                    C.logger(`[${label}] Pulse ${currentPulse} — taunting at t=${elapsed2.toFixed(1)}s.`);
                    yield* UltraAsync.tauntPresses(null, C, engine, cancellationToken);
                }
            }

            yield 250;
        }
    }

    private static getTaunterLabel(index: number): string {
        switch (index) {
            case 0:
                return "Primary";
            case 1:
                return "Secondary";
            case 2:
                return "Tertiary";
            case 3:
                return "Quaternary";
            default:
                return `Taunter-${index}`;
        }
    }

    /** Presses the taunt (skill 5) 60 times, 50 ms apart; run it in a task (`yield*`). */
    static *tauntPresses(
        _bot: unknown,
        C: CoreBots,
        engine: CoreEnginev3,
        cancellationToken: CancellationToken = noCancellation,
    ): Generator<TaskStep, void, boolean> {
        const start = Date.now();
        C.logger("[Taunt] Starting 60 presses...");
        let pressed = 0;
        for (let i = 0; i < 60 && !bot.shouldExit && !cancellationToken.isCancellationRequested; i++) {
            if (!bot.player.alive) {
                C.logger("[Taunt] Died during taunt — aborting.");
                return;
            }
            if (cancellationToken.isCancellationRequested) {
                C.logger("[Taunt] Cancellation requested — aborting presses.");
                return;
            }
            engine.cast(5);
            pressed++;

            yield 50;
        }
        const took = (Date.now() - start) / 1000;
        C.logger(`[Taunt] Done — ${pressed} presses in ${took.toFixed(2)}s.`);
    }

    /** C#'s `PrimaryTauntLoopAsync`: taunter 0's loop as a task; returns its name. */
    static primaryTauntLoopAsync(
        _bot: unknown,
        C: CoreBots,
        engine: CoreEnginev3,
        fightStart: number,
        taunterCount = 2,
        pulseIntervalSec = 5,
    ): string {
        return UltraAsync.startTauntLoop(null, C, engine, fightStart, 0, taunterCount, null, pulseIntervalSec);
    }

    static secondaryTauntLoopAsync(
        _bot: unknown,
        C: CoreBots,
        engine: CoreEnginev3,
        fightStart: number,
        taunterCount = 2,
        pulseIntervalSec = 5,
    ): string {
        return UltraAsync.startTauntLoop(null, C, engine, fightStart, 1, taunterCount, null, pulseIntervalSec);
    }

    static tertiaryTauntLoopAsync(
        _bot: unknown,
        C: CoreBots,
        engine: CoreEnginev3,
        fightStart: number,
        taunterCount = 3,
        pulseIntervalSec = 5,
    ): string {
        return UltraAsync.startTauntLoop(null, C, engine, fightStart, 2, taunterCount, null, pulseIntervalSec);
    }

    static quaternaryTauntLoopAsync(
        _bot: unknown,
        C: CoreBots,
        engine: CoreEnginev3,
        fightStart: number,
        taunterCount = 4,
        pulseIntervalSec = 5,
    ): string {
        return UltraAsync.startTauntLoop(null, C, engine, fightStart, 3, taunterCount, null, pulseIntervalSec);
    }

    /** C#'s `TauntAsync`: the 60 presses as a task; returns its name. */
    static tauntAsync(_bot: unknown, C: CoreBots, engine: CoreEnginev3): string {
        const name = `UltraTaunt${++taskCount}`;
        tasks.start(name, () => UltraAsync.tauntPresses(null, C, engine));
        return name;
    }
}

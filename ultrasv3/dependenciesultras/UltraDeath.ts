/*
name: null
description: null
tags: null
*/
// Port of Scripts/Ultrasv3/DependenciesUltras/UltraDeath.cs.
//
// Turu: C#'s background thread (`StartWipeMonitor`) and async loops are tasks of core/CoreTasks.ts.
// The wipe monitor runs `onWipe` (the retreat: going home and waiting for the army) inside its task
// step, which holds the script for that long; C#'s main loop is waiting on `retreatComplete` then
// anyway.

import { bot } from "turu";
import { Core, type CoreBots, rethrowIfStopped } from "../../core/CoreBots";
import {
    type CancellationToken,
    type CancellationTokenSource,
    type ManualResetEvent,
    noCancellation,
    type TaskStep,
    tasks,
} from "../../core/CoreTasks";
import { CoreUltrav3, nowSeconds } from "./CoreUltrav3";
import { UltraWaitForArmy } from "./UltraWaitForArmy";

const DeathSyncFile = "ultra_death.sync";

let monitorCount = 0;

export class UltraDeath {
    private _ultra: CoreUltrav3 | null = null;
    private get ultra(): CoreUltrav3 {
        return (this._ultra ??= new CoreUltrav3());
    }

    /** Signals that this player has died. Writes the death timestamp to the sync file. */
    signalDeath(): void {
        const path = this.ultra.resolveSyncPath(DeathSyncFile);
        const key = `${bot.player.username}|death`;
        this.ultra.updateEntry(path, key, String(nowSeconds()));
    }

    /** Returns true if any army member has died recently (within the stale threshold). */
    hasDeathOccurred(): boolean {
        const path = this.ultra.resolveSyncPath(DeathSyncFile);
        const lines = this.ultra.readLines(path);
        const now = nowSeconds();
        const staleThreshold = 30;

        for (const line of lines) {
            const parts = line.split(":");
            if (parts.length < 2) continue;

            if (!/^-?\d+$/.test(parts[1])) continue;

            if (now - Number(parts[1]) <= staleThreshold) return true;
        }

        return false;
    }

    /** Counts how many unique army members have died recently (within the stale threshold). */
    countDeadPlayers(staleThresholdSec = 30): number {
        const path = this.ultra.resolveSyncPath(DeathSyncFile);
        const lines = this.ultra.readLines(path);
        const now = nowSeconds();
        // Lowercase names: C#'s OrdinalIgnoreCase set.
        const deadPlayers = new Set<string>();

        for (const line of lines) {
            const parts = line.split(":");
            if (parts.length < 2) continue;

            const username = parts[0]?.trim();
            if (!username) continue;

            // Extract just the username from "username|death" format
            const keyParts = username.split("|");
            if (keyParts.length < 1 || !keyParts[0]) continue;

            if (!/^-?\d+$/.test(parts[1])) continue;

            if (now - Number(parts[1]) <= staleThresholdSec) deadPlayers.add(keyParts[0].toLowerCase());
        }

        return deadPlayers.size;
    }

    /**
     * Returns true when at least `requiredDead` unique army members have died within the stale
     * threshold. Use this for army-wipe detection.
     */
    isArmyWiped(requiredDead: number, staleThresholdSec = 15): boolean {
        return this.countDeadPlayers(staleThresholdSec) >= requiredDead;
    }

    /** Clears all death entries from the sync file. */
    clearDeaths(): void {
        this.ultra.clearSyncFile(this.ultra.resolveSyncPath(DeathSyncFile));
    }

    /**
     * Loop that monitors this player's death and signals the army; run it in a task
     * (`tasks.start(name, () => death.monitorDeathAsync(token))`). Cancel `token` to stop it.
     */
    *monitorDeathAsync(token: CancellationToken): Generator<TaskStep, void, boolean> {
        while (!token.isCancellationRequested) {
            if (!bot.player.alive) {
                this.signalDeath();
                Core.logger("[UltraDeath] Death detected, signaling army.");
            }

            yield 500;
        }
    }

    /**
     * Waits (polling) until any player in the army has died, up to `timeoutSecs`; run it in a task
     * (`const died = yield* death.waitForDeathAsync(...)`). Returns true if a death was detected,
     * false on timeout.
     */
    *waitForDeathAsync(
        timeoutSecs = 60,
        token: CancellationToken = noCancellation,
    ): Generator<TaskStep, boolean, boolean> {
        const start = Date.now();

        while (!token.isCancellationRequested) {
            if (this.hasDeathOccurred()) return true;

            if ((Date.now() - start) / 1000 >= timeoutSecs) return false;

            yield 500;
        }

        return false;
    }

    /**
     * Starts a background task that:
     * 1. Monitors this player's death and signals it via {@link signalDeath}
     * 2. Checks if the full army is wiped
     * 3. On wipe: cancels `wipeCts` and runs `onWipe`
     * Signals `retreatComplete` when done.
     */
    static startWipeMonitor(
        C: CoreBots,
        armySize: number,
        wipeCts: CancellationTokenSource,
        retreatComplete: ManualResetEvent,
        onWipe: (() => void) | null = null,
    ): void {
        tasks.start(`UltraWipeMonitor${++monitorCount}`, () =>
            UltraDeath.wipeMonitorLoop(C, armySize, wipeCts, retreatComplete, onWipe),
        );
    }

    private static *wipeMonitorLoop(
        C: CoreBots,
        armySize: number,
        wipeCts: CancellationTokenSource,
        retreatComplete: ManualResetEvent,
        onWipe: (() => void) | null,
    ): Generator<TaskStep, void, boolean> {
        const death = new UltraDeath();

        while (!wipeCts.isCancellationRequested) {
            try {
                // Signal this player's death if dead
                if (!bot.player.alive) {
                    death.signalDeath();
                    C.logger("[UltraDeath] Death detected, signaling army.");
                }

                // Check for army wipe
                if (death.isArmyWiped(armySize)) {
                    C.logger("[UltraDeath] Army wipe detected — running retreat.");
                    wipeCts.cancel();

                    onWipe?.();

                    return;
                }
            } catch (ex) {
                rethrowIfStopped(ex);
                C.logger(`[UltraDeath] WipeMonitor error: ${ex instanceof Error ? ex.message : String(ex)}`);
            } finally {
                if (wipeCts.isCancellationRequested) retreatComplete.set();
            }

            yield 500;
        }

        retreatComplete.set();
    }

    /**
     * Performs the retreat sequence. Call this as the `onWipe` callback from
     * {@link startWipeMonitor}.
     */
    static performRetreat(
        C: CoreBots,
        armySize: number,
        maxRetries: number,
        retryCount: RetryCounter,
        retreatSyncFile: string,
    ): void {
        const currentRetries = ++retryCount.value;
        C.logger(`[UltraDeath] Retreating. Retry ${currentRetries}/${maxRetries}.`);

        new CoreUltrav3().persistentJoinHouse();

        if (currentRetries >= maxRetries) {
            C.logger(`${maxRetries} Retries, Stopping the scripts.`, undefined, { messageBox: true, stopBot: true });
            return;
        }

        new UltraDeath().clearDeaths();
        UltraWaitForArmy.instance.newWaitForArmy(armySize - 1, retreatSyncFile, undefined, undefined, false);
        C.logger("[UltraDeath] All retreated. Restarting fight.");
    }
}

/**
 * Lightweight mutable wrapper for an integer, so it can be captured in lambdas and modified by
 * the wipe monitor (C#'s `UltraDeath.RetryCounter`).
 */
export class RetryCounter {
    value = 0;
}

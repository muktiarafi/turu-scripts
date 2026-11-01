/*
name: null
description: null
tags: null
*/
// Port of Scripts/Ultrasv3/DependenciesUltras/UltraWaitForArmy.cs.
//
// Turu: a sync file is `bot.army`'s shared log of that file name (C#'s `FindHome` puts it in Skua's
// folder), so `Slurp` and `Yeet` read and replace the log's lines and need no retries. "Older than
// 15 minutes" is "no line newer than 15 minutes".

import { bot } from "turu";
import { rethrowIfStopped } from "../../core/CoreBots";

/** C#'s `DateTimeOffset.UtcNow.ToUnixTimeSeconds()`. */
function nowSeconds(): number {
    return Math.floor(Date.now() / 1000);
}

/** The sync log's name: the path's file name (C#'s `FindHome`). */
function findHome(path: string): string {
    return path.split(/[\\/]/).at(-1) ?? path;
}

/** The log's non-empty lines. */
function slurp(path: string): string[] {
    return bot.army
        .readLog(path)
        .flatMap((l) => l.split(/[\r\n]/))
        .filter((l) => l.length > 0);
}

function yeet(path: string, lines: string[]): void {
    bot.army.writeLog(path, lines);
}

/** Each line: `username|class:ready:timestamp`. */
function poke(path: string, key: string, ready: boolean): void {
    if (!key?.trim()) return;

    const keyParts = key.split("|");
    if (keyParts.length < 2 || !keyParts[0]?.trim()) return;

    const username = keyParts[0];
    const className = keyParts[1];

    // purge broken historical entries (|Peasant etc.)
    const lines = slurp(path).filter((l) => !l.startsWith("|"));

    const entry = `${username}|${className}:${ready ? 1 : 0}:${nowSeconds()}`;

    const idx = lines.findIndex((l) => {
        const parts = l.split(":");
        if (parts.length < 1) return false;

        const existingKey = parts[0].split("|");
        return existingKey.length >= 1 && existingKey[0] === username;
    });

    if (idx >= 0) lines[idx] = entry;
    else lines.push(entry);

    yeet(path, lines);
}

/** Counts the ready lines, dropping lines older than `staleSec` (0 or less: none) from the log. */
function howMany(path: string, staleSec: number): number {
    const lines = slurp(path);
    const now = nowSeconds();
    const valid: string[] = [];

    for (const line of lines) {
        const parts = line.split(":");
        if (parts.length < 3) continue;

        if (!/^-?\d+$/.test(parts[2])) continue;
        const ts = Number(parts[2]);

        if (staleSec > 0 && now - ts > staleSec) continue;

        valid.push(line);
    }

    // Rewrite file only if we cleaned something out
    if (valid.length !== lines.length) yeet(path, valid);

    return valid.filter((l) => l.split(":")[1] === "1").length;
}

/** `username|class` of this client, with `:` replaced (the log's separator). */
function me(): string {
    return `${bot.player?.username ?? "Nobody"}|${bot.player?.currentClass ?? "Peasant"}`.replaceAll(":", "-");
}

export class UltraWaitForArmy {
    private static _instance: UltraWaitForArmy | null = null;
    static get instance(): UltraWaitForArmy {
        return (UltraWaitForArmy._instance ??= new UltraWaitForArmy());
    }

    /**
     * Waits for `quantity` other army members (total = quantity + 1) to signal readiness via a
     * shared sync file. Once all are ready (or timeout is reached), breaks and does a brief warmup
     * skill spam to keep the client responsive.
     */
    waitForArmySkills(
        quantity: number,
        syncFilePath = "army_sync.sync",
        _bufferTimeMs = 3000,
        tickMs = 500,
        timeoutMs = 0,
    ): void {
        if (bot?.map == null) return;

        // --- Initialize sync file ---
        const syncFile = findHome(syncFilePath);
        try {
            const lines = slurp(syncFile);
            const times = lines.map((l) => l.split(":")[2]).filter((t) => /^-?\d+$/.test(t ?? ""));
            const newest = times.length > 0 ? Math.max(...times.map(Number)) : null;
            if (
                lines.length === 0 ||
                (newest != null && (nowSeconds() - newest) / 60 > 15) ||
                lines.every((l) => l.endsWith(":1"))
            )
                bot.army.clearLog(syncFile);
        } catch (ex) {
            rethrowIfStopped(ex);
            bot.log(`[WaitForArmySkills] Sync file setup failed: ${ex instanceof Error ? ex.message : String(ex)}`);
        }

        const self = me();
        const need = quantity === 0 ? 1 : Math.max(1, quantity) + 1;

        poke(syncFile, self, false);

        const start = Date.now();
        let lastReady = -1;

        // --- Wait for army readiness ---
        while (!bot.shouldExit) {
            const ready = howMany(syncFile, 600); // 10 minutes
            if (ready !== lastReady) {
                lastReady = ready;
                bot.log(`[WaitForArmySkills] Ready: ${ready}/${need}`);
            }

            if (ready >= need) {
                bot.log("[WaitForArmySkills] All members ready!");
                break;
            }

            poke(syncFile, self, true);

            if (timeoutMs > 0 && Date.now() - start >= timeoutMs) {
                bot.log("[WaitForArmySkills] Timeout reached — continuing anyway.");
                break;
            }

            bot.sleep(tickMs);
        }

        if (bot.shouldExit) {
            try {
                bot.army.clearLog(syncFile);
            } catch (error) {
                rethrowIfStopped(error);
            }
            return;
        }

        // --- Warmup spam to keep clients responsive ---
        const spam = Date.now() + 2000;
        while (!bot.shouldExit && Date.now() < spam) {
            bot.skills.useSkill(3);
            bot.sleep(300);
            bot.skills.useSkill(2);
            bot.sleep(300);
            bot.skills.useSkill(1);
            bot.sleep(300);
        }
    }

    /**
     * Clears the sync file at start (fresh slate), then waits for the whole army to signal
     * readiness before proceeding. No timeout — waits for all members indefinitely.
     *
     * @param quantity Number of OTHER army members to wait for (total = quantity + 1).
     * @param syncFilePath Shared sync file path.
     * @param tickMs Milliseconds between readiness checks.
     * @param staleThresholdSec Entries older than this many seconds are ignored. 0 or negative =
     * no age check (all entries counted).
     * @param useSkill Spam skills 3, 2, 1 for the 2 s after everyone is ready.
     */
    newWaitForArmy(
        quantity: number,
        syncFilePath = "army_sync.sync",
        tickMs = 500,
        staleThresholdSec = 0,
        useSkill = false,
    ): void {
        if (bot?.map == null) return;

        // --- Fresh slate: clear the file ---
        const syncFile = findHome(syncFilePath);
        try {
            bot.army.clearLog(syncFile);
        } catch (ex) {
            rethrowIfStopped(ex);
            bot.log(`[NewWaitForArmy] Sync file setup failed: ${ex instanceof Error ? ex.message : String(ex)}`);
        }

        const self = me();
        const need = quantity === 0 ? 1 : Math.max(1, quantity) + 1;

        // Write self as ready immediately
        poke(syncFile, self, true);

        let lastReady = -1;

        // --- Wait for army readiness ---
        while (!bot.shouldExit) {
            const ready = howMany(syncFile, staleThresholdSec);
            if (ready !== lastReady) {
                lastReady = ready;
                bot.log(`[NewWaitForArmy] Ready: ${ready}/${need}`);
            }

            if (ready >= need) {
                bot.log("[NewWaitForArmy] All members ready!");
                break;
            }

            // Re-poke to keep our entry fresh
            poke(syncFile, self, true);

            bot.sleep(tickMs);
        }

        if (bot.shouldExit) {
            try {
                bot.army.clearLog(syncFile);
            } catch (error) {
                rethrowIfStopped(error);
            }
            return;
        }

        // --- Brief pause to let army members breathe ---
        const waitTill = Date.now() + 2000;
        while (!bot.shouldExit && Date.now() < waitTill) {
            if (useSkill) {
                bot.skills.useSkill(3);
                bot.sleep(300);
                bot.skills.useSkill(2);
                bot.sleep(300);
                bot.skills.useSkill(1);
                bot.sleep(300);
            } else bot.sleep(500);
        }
    }
}

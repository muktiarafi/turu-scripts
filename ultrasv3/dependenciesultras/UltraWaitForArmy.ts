/*
name: null
description: null
tags: null
*/
// Port of Scripts/Ultrasv3/DependenciesUltras/UltraWaitForArmy.cs.
//
// Turu: a sync file is `bot.army`'s shared log of that file name (C#'s `FindHome` puts it in Skua's
// folder). Both waits are `bot.army.barrier` on that name: C# polls `username|class:ready:timestamp`
// lines and clears the file at the start (and when every line is ready), which can wipe out the
// members already waiting, or strand one that looks after the others went on.

import { bot } from "turu";

/** The sync log's name: the path's file name (C#'s `FindHome`). */
function findHome(path: string): string {
    return path.split(/[\\/]/).at(-1) ?? path;
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
        _tickMs = 500,
        timeoutMs = 0,
    ): void {
        if (bot?.map == null) return;

        const syncFile = findHome(syncFilePath);
        const need = quantity === 0 ? 1 : Math.max(1, quantity) + 1;

        bot.log(`[WaitForArmySkills] Waiting for ${need} members...`);
        if (bot.army.barrier(syncFile, need, timeoutMs)) bot.log("[WaitForArmySkills] All members ready!");
        else bot.log("[WaitForArmySkills] Timeout reached — continuing anyway.");

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
     * Waits for the whole army to signal readiness before proceeding. No timeout — waits for all
     * members indefinitely. Turu: C# clears the sync file first; the barrier needs no fresh slate.
     *
     * @param quantity Number of OTHER army members to wait for (total = quantity + 1).
     * @param syncFilePath Shared sync file path.
     * @param _tickMs Milliseconds between readiness checks (Turu: the barrier keeps its own pace).
     * @param _staleThresholdSec Entries older than this many seconds are ignored (Turu: a member
     * that left the barrier 15 s ago no longer counts).
     * @param useSkill Spam skills 3, 2, 1 for the 2 s after everyone is ready.
     */
    newWaitForArmy(
        quantity: number,
        syncFilePath = "army_sync.sync",
        _tickMs = 500,
        _staleThresholdSec = 0,
        useSkill = false,
    ): void {
        if (bot?.map == null) return;

        const syncFile = findHome(syncFilePath);
        const need = quantity === 0 ? 1 : Math.max(1, quantity) + 1;

        bot.log(`[NewWaitForArmy] Waiting for ${need} members...`);
        bot.army.barrier(syncFile, need);
        bot.log("[NewWaitForArmy] All members ready!");

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

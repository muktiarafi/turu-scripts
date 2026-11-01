/*
name: null
description: null
tags: null
*/
// Port of Scripts/Ultrasv3/DependenciesUltras/UltraQueue.cs.
//
// Turu: a sync file is `bot.army`'s shared log, so the participant file's age is the age of its
// newest line (C#'s file write time), and rewriting it is `bot.army.writeLog`.

import { type Bot, bot as theBot } from "turu";
import { type CoreBots, rethrowIfStopped } from "../../core/CoreBots";
import { type CoreUltrav3, lineTime, newGuid, nowSeconds, syncFileAgeMinutes } from "./CoreUltrav3";

export class UltraQueue {
    /**
     * Publishes which `bosses` this client has done, waits for the 4-player army to register, and
     * returns the bosses not every client has done.
     */
    static getSharedBossQueue(
        ultra: CoreUltrav3,
        _bot: Bot,
        C: CoreBots,
        bosses: string[],
        bossSyncFile: string,
        participantSyncFile: string,
        isBossComplete: (boss: string) => boolean,
    ): string[] {
        // Ultras-v3 are designed for a fixed 4-player army queue.
        const armySize = 4;
        const syncPath = ultra.resolveSyncPath(bossSyncFile);
        const user = theBot.player?.username ?? newGuid();

        const payload = bosses.map((b) => `${b}=${isBossComplete(b) ? "true" : "false"}`).join(",");
        ultra.updateEntry(syncPath, user, payload);

        const participantPath = ultra.resolveSyncPath(participantSyncFile);
        if (UltraQueue.shouldClearParticipantSync(ultra, participantPath)) ultra.clearSyncFile(participantPath);
        else UltraQueue.cleanupStaleParticipants(ultra, C, participantPath);

        ultra.updateEntry(participantPath, user, "1");

        let lastCount = -1;
        const staleThreshold = 600;
        const waitStarted = Date.now();
        const timeoutMs = 60000;

        while (!theBot.shouldExit) {
            let count = 0;
            for (const line of ultra.readLines(participantPath)) {
                const parts = line.split(":");
                if (parts.length < 3) continue;

                const ts = lineTime(parts);
                if (ts == null) continue;

                if (nowSeconds() - ts > staleThreshold) continue;

                count++;
            }

            if (count !== lastCount) {
                lastCount = count;
                C.logger(`[AllUltras-v3] Registered participants: ${count}/${armySize}`, "Info");
            }

            if (count >= armySize) break;

            if (Date.now() - waitStarted >= timeoutMs && count > 0) {
                C.logger(
                    `[AllUltras-v3] Wait timeout reached — proceeding with ${count}/${armySize} registered clients.`,
                    "Warning",
                );
                break;
            }

            ultra.updateEntry(syncPath, user, payload);
            ultra.updateEntry(participantPath, user, "1");
            theBot.sleep(250);
        }

        if (theBot.shouldExit) return bosses;

        // Ensure all accounts have written their latest payload before reading
        ultra.updateEntry(syncPath, user, payload);
        theBot.sleep(3000);

        // Keyed by lowercase boss name (C#'s OrdinalIgnoreCase dictionary).
        const allBossComplete = new Map(bosses.map((b) => [b.toLowerCase(), true]));
        const now = nowSeconds();

        for (const line of ultra.readLines(syncPath)) {
            const parts = line.split(":");
            if (parts.length < 3) continue;

            const ts = lineTime(parts);
            if (ts == null) continue;

            if (now - ts > staleThreshold) continue;

            const payloadLine = parts[1];
            const statuses = new Map<string, string>();
            for (const p of payloadLine.split(",").filter((x) => x.length > 0)) {
                const eq = p.indexOf("=");
                if (eq < 0) continue;
                // C#'s ToDictionary throws on a repeated key; the boss names are distinct.
                statuses.set(p.substring(0, eq).trim().toLowerCase(), p.substring(eq + 1).trim());
            }

            for (const boss of bosses) {
                // C#'s bool.TryParse: "true"/"false" in any case.
                const rawValue = statuses.get(boss.toLowerCase());
                if (rawValue == null || rawValue.toLowerCase() !== "true") {
                    allBossComplete.set(boss.toLowerCase(), false);
                }
            }
        }

        return bosses.filter((b) => !allBossComplete.get(b.toLowerCase()));
    }

    private static shouldClearParticipantSync(ultra: CoreUltrav3, path: string): boolean {
        try {
            const age = syncFileAgeMinutes(ultra, path);
            if (age == null) return true;

            return age > 10;
        } catch (error) {
            rethrowIfStopped(error);
            return false;
        }
    }

    private static cleanupStaleParticipants(ultra: CoreUltrav3, C: CoreBots, path: string): void {
        try {
            const lines = ultra.readLines(path);
            if (lines.length === 0) return;

            const now = nowSeconds();
            const staleThreshold = 600;
            const freshLines: string[] = [];

            for (const line of lines) {
                if (!line.trim()) continue;

                const parts = line.split(":");
                if (parts.length < 3) continue;

                const ts = lineTime(parts);
                if (ts == null) continue;

                if (now - ts <= staleThreshold) freshLines.push(line);
            }

            if (freshLines.length === 0) {
                ultra.clearSyncFile(path);
                return;
            }

            if (freshLines.length !== lines.length) {
                theBot.army.writeLog(path, freshLines);
                C.logger(`[AllUltras-v3] Cleaned stale participant entries; ${freshLines.length} remain.`, "Info");
            }
        } catch (ex) {
            rethrowIfStopped(ex);
            C.logger(
                `[AllUltras-v3] Failed to cleanup participant sync: ${ex instanceof Error ? ex.message : String(ex)}`,
                "Warning",
            );
        }
    }
}

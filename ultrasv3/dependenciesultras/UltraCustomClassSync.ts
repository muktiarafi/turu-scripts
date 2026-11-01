/*
name: null
description: null
tags: null
*/
// Port of Scripts/Ultrasv3/DependenciesUltras/UltraCustomClassSync.cs.
//
// Turu: C# passes the script's `IScriptInterface`; there is one `bot` here, so the parameter is kept
// but the global is read. A sync file is `bot.army`'s shared log, so "older than 15 minutes" is "no
// line newer than 15 minutes".

import { type Bot, bot as theBot } from "turu";
import { Core, rethrowIfStopped } from "../../core/CoreBots";
import { compareIgnoreCase, type CoreUltrav3, lineTime, nowSeconds, syncFileAgeMinutes } from "./CoreUltrav3";

export class UltraCustomClassSync {
    /**
     * Gives every member of the army one class from `classSlots` (each slot lists the classes it
     * accepts, in preference order; or one class per slot, C#'s `string[]` overload) and equips this
     * client's. Every member registers the classes it owns and computes the same assignment.
     * Stops the script if the army doesn't register within 5 minutes or this client gets no class.
     * Returns the class equipped, or "".
     */
    static customClassSync(
        ultra: CoreUltrav3,
        _bot: Bot,
        classSlots: string[][] | string[],
        armySize: number,
        syncFilePath = "class_assign.sync",
        allowDuplicates = false,
        preferredUsernameAssignments: Map<string, string> | null = null,
    ): string {
        const slots: string[][] = classSlots?.map((s) => (typeof s === "string" ? [s] : s)) ?? [];
        if (slots.length === 0 || armySize < 1) return "";

        const syncFile = ultra.resolveSyncPath(syncFilePath);

        // Clear stale file (>15 min old)
        try {
            const age = syncFileAgeMinutes(ultra, syncFile);
            if (age != null && age > 15) theBot.army.clearLog(syncFile);
        } catch (error) {
            rethrowIfStopped(error);
        }

        // Collect every unique class name across all slots (lowercase keys, first spelling kept)
        const allNeeded = new Map<string, string>();
        for (const slot of slots)
            for (const cls of slot) if (!allNeeded.has(cls.toLowerCase())) allNeeded.set(cls.toLowerCase(), cls);

        // Check which of those this client owns (inventory + bank)
        const myClasses: string[] = [];
        for (const cls of allNeeded.values()) {
            if (Core.checkInventory(cls, undefined, { toInv: true })) myClasses.push(cls);
        }

        const username = theBot.player.username;
        const payload = `READY|${myClasses.join(",")}`;
        ultra.updateEntry(syncFile, username, payload);
        theBot.log(
            "[CustomClassSync] Account owns: " +
                (myClasses.length > 0 ? myClasses.join(",") : "NONE of the needed classes"),
        );

        // Wait for all members to register (with 5 min timeout)
        const staleThreshold = 600; // 10 minutes
        const registrationTimeoutSec = 300;
        const waitStart = Date.now();
        let lastCount = -1;

        while (!theBot.shouldExit) {
            if ((Date.now() - waitStart) / 1000 > registrationTimeoutSec) {
                theBot.log(
                    `[CustomClassSync] Timed out after ${registrationTimeoutSec}s waiting for ${armySize} clients (got ${lastCount}). Aborting.`,
                );
                theBot.stop();
            }

            const lines = ultra.readLines(syncFile);
            const now = nowSeconds();
            let validCount = 0;

            for (const line of lines) {
                const parts = line.split(":");
                if (parts.length < 3) continue;
                if (!parts[1].toUpperCase().startsWith("READY|")) continue;
                const ts = lineTime(parts);
                if (ts == null) continue;
                if (now - ts <= staleThreshold) validCount++;
            }

            if (validCount !== lastCount) {
                lastCount = validCount;
                theBot.log(`[CustomClassSync] Registered: ${validCount}/${armySize}`);
            }

            if (validCount >= armySize) break;

            // Re-poke to keep entry fresh
            ultra.updateEntry(syncFile, username, payload);
            theBot.sleep(500);
        }

        if (theBot.shouldExit) return "";

        // Small buffer to ensure file system has flushed all writes
        theBot.sleep(500);

        // Build sorted account list once for friendly log labels
        const sortedAccounts: string[] = [];
        for (const n of ultra.readLines(syncFile).map((l) => l.split(":")[0])) {
            if (n?.trim() && !sortedAccounts.some((a) => a.toLowerCase() === n.toLowerCase())) sortedAccounts.push(n);
        }
        sortedAccounts.sort(compareIgnoreCase);

        const accountLabel = (user: string): string => {
            const idx = sortedAccounts.findIndex((a) => a.toLowerCase() === user.toLowerCase());
            return idx >= 0 ? `Account-${idx + 1}` : user;
        };

        // Parse entries: player - owned classes. Keyed by lowercase name; `name` keeps the first
        // spelling, as C#'s dictionary keeps its key.
        const playerClasses = new Map<string, { name: string; classes: string[] }>();
        {
            const lines = ultra.readLines(syncFile);
            const now = nowSeconds();

            for (const line of lines) {
                const parts = line.split(":");
                if (parts.length < 3) continue;

                const playerName = parts[0];
                const payloadPart = parts[1];

                const ts = lineTime(parts);
                if (ts == null) continue;
                if (now - ts > staleThreshold) continue;

                // Handle both formats: "READY|class1,class2" or "class1,class2"
                let classListStr = payloadPart;
                if (payloadPart.toUpperCase().startsWith("READY|")) classListStr = payloadPart.substring(6); // Remove "READY|" prefix

                const prev = playerClasses.get(playerName.toLowerCase());
                playerClasses.set(playerName.toLowerCase(), {
                    name: prev?.name ?? playerName,
                    classes: classListStr.split(",").filter((c) => c.length > 0),
                });
            }
        }

        theBot.log(`[CustomClassSync] ${playerClasses.size} player(s) registered. Assigning classes...`);

        const owns = (playerKey: string, cls: string): boolean =>
            playerClasses.get(playerKey)?.classes.some((c) => c.toLowerCase() === cls.toLowerCase()) ?? false;

        // Pre-count how many times each class appears across all slot definitions
        // This determines the max allowed duplicates for each class (lowercase keys)
        const classMaxCount = new Map<string, number>();
        if (allowDuplicates) {
            for (const slot of slots) {
                for (const cls of slot) {
                    classMaxCount.set(cls.toLowerCase(), (classMaxCount.get(cls.toLowerCase()) ?? 0) + 1);
                }
            }
        }

        // Lowercase player and class keys.
        const assignments = new Map<string, string>();
        const assignedPlayers = new Set<string>();
        const classUsedCount = new Map<string, number>();
        const filledSlots = new Set<number>();

        if (preferredUsernameAssignments != null && preferredUsernameAssignments.size > 0) {
            for (const [user, cls] of preferredUsernameAssignments) {
                const preferredUser = user.trim();
                const preferredClass = cls.trim();

                if (!preferredUser || !preferredClass) continue;

                const userKey = preferredUser.toLowerCase();
                if (!playerClasses.has(userKey)) {
                    theBot.log(
                        `[CustomClassSync] Preferred assignment requested for '${preferredUser}' but that user is not registered.`,
                    );
                    continue;
                }

                if (!owns(userKey, preferredClass)) {
                    theBot.log(
                        `[CustomClassSync] Preferred assignment for '${preferredUser}' cannot be honored because they do not own '${preferredClass}'.`,
                    );
                    continue;
                }

                for (let s = 0; s < slots.length; s++) {
                    if (filledSlots.has(s)) continue;

                    if (!slots[s].some((c) => c.toLowerCase() === preferredClass.toLowerCase())) continue;

                    const used = classUsedCount.get(preferredClass.toLowerCase()) ?? 0;
                    if (!allowDuplicates && used >= 1) continue;

                    if (allowDuplicates) {
                        const max = classMaxCount.get(preferredClass.toLowerCase()) ?? 0;
                        if (used >= max) continue;
                    }

                    assignments.set(userKey, preferredClass);
                    assignedPlayers.add(userKey);
                    classUsedCount.set(preferredClass.toLowerCase(), used + 1);
                    filledSlots.add(s);
                    theBot.log(
                        `[CustomClassSync] Preferred slot ${s} > ${accountLabel(preferredUser)} (${preferredClass})`,
                    );
                    break;
                }
            }
        }

        // Deterministic greedy assignment
        // Alpha-sort players so every client computes the identical result.
        const sortedPlayers = [...playerClasses.keys()].sort((a, b) =>
            compareIgnoreCase(playerClasses.get(a)!.name, playerClasses.get(b)!.name),
        );

        for (let s = 0; s < slots.length; s++) {
            if (filledSlots.has(s)) continue;

            let filled = false;

            // Try each accepted class in preference order
            for (const acceptedClass of slots[s]) {
                // Check if this class can still be used
                const used = classUsedCount.get(acceptedClass.toLowerCase()) ?? 0;
                if (allowDuplicates) {
                    const max = classMaxCount.get(acceptedClass.toLowerCase()) ?? 0;
                    if (used >= max) continue;
                } else {
                    // No duplicates: each class used at most once
                    if (used >= 1) continue;
                }

                const candidates = sortedPlayers.filter((p) => !assignedPlayers.has(p) && owns(p, acceptedClass));

                if (candidates.length === 0) continue;

                // Most-constrained candidate first (fewest open slots it can fill),
                // tiebreak alphabetical (candidates are already in name order).
                const canFill = (p: string): number => {
                    let count = 0;
                    for (let s2 = 0; s2 < slots.length; s2++) {
                        if (filledSlots.has(s2)) continue;
                        if (slots[s2].some((c) => owns(p, c))) count++;
                    }
                    return count;
                };
                let best = candidates[0];
                let bestFill = canFill(best);
                for (const p of candidates.slice(1)) {
                    const fill = canFill(p);
                    if (fill < bestFill) {
                        best = p;
                        bestFill = fill;
                    }
                }

                assignments.set(best, acceptedClass);
                assignedPlayers.add(best);
                classUsedCount.set(acceptedClass.toLowerCase(), used + 1);
                filledSlots.add(s);
                theBot.log(
                    `[CustomClassSync] Slot ${s} > ${accountLabel(playerClasses.get(best)!.name)} (${acceptedClass})`,
                );
                filled = true;
                break;
            }

            if (!filled) theBot.log(`[CustomClassSync] WARNING: No candidate for slot ${s} (${slots[s].join("/")})!`);
        }

        // Find this client's assignment
        const myClass = assignments.get(username.toLowerCase()) ?? "";
        if (!myClass) {
            Core.logger(
                `[CustomClassSync] ${accountLabel(username)} was not assigned any class! Check that all of your accounts own the required classes.`,
                "CustomClassSync",
                { messageBox: true, stopBot: true },
            );
            theBot.stop();
        }

        theBot.log(`[CustomClassSync] - Equipping: ${myClass}`);
        Core.equip(myClass);
        theBot.sleep(1000);

        // Clear sync file for next run
        try {
            theBot.army.clearLog(syncFile);
        } catch (error) {
            rethrowIfStopped(error);
        }

        return myClass;
    }
}

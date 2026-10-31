/*
name: null
description: null
tags: null
*/
// Port of the parts of Scripts/Ultrasv3/DependenciesUltras/CoreUltrav3.cs that the ported Ultras
// reach: the army sync (WaitForArmy, CheckArmyProgressBool, ClearSyncFile, ResolveSyncPath,
// ReadLines, UpdateEntry), EquipClassSync, JoinHouse, GetBestTonicPotion and GetBestElixirPotion.
// The rest (taunts, scrolls, buying alchemy potions, listeners, ArmyHandler) isn't ported yet; port
// it in C# order when a script needs it.
//
// Turu: the sync members are army/CoreArmySync.ts's (the Entwined Eclipse copy of CoreUltra, which
// differs from this one only in how it locks and retries the file). A sync file is `bot.army`'s
// shared log of that name, so EquipClassSync's "file older than 15 minutes" is "no line newer than
// 15 minutes".

import { bot, type EventMap } from "turu";
import { CoreArmySync } from "../../army/CoreArmySync";
import { Core, rethrowIfStopped } from "../../core/CoreBots";
import { CoreEnginev3 } from "./CoreEnginev3";

/** C#'s `DateTimeOffset.UtcNow.ToUnixTimeSeconds()`. */
function nowSeconds(): number {
    return Math.floor(Date.now() / 1000);
}

/** C#'s `long.TryParse` of a line's last `:` field, the time it was written; null if it isn't one. */
function lineTime(parts: string[]): number | null {
    const last = parts[parts.length - 1];
    return /^-?\d+$/.test(last) ? Number(last) : null;
}

/** C#'s `StringComparer.OrdinalIgnoreCase` ordering. */
function compareIgnoreCase(a: string, b: string): number {
    const x = a.toUpperCase();
    const y = b.toUpperCase();
    return x < y ? -1 : x > y ? 1 : 0;
}

function sameText(a: string, b: string): boolean {
    return a.toLowerCase() === b.toLowerCase();
}

export class CoreUltrav3 extends CoreArmySync {
    /**
     * Gives every member of the army one class from `classSlots` (each slot lists the classes it
     * accepts, in preference order) and equips this client's: each member registers the classes it
     * owns, waits for all `armySize`, and computes the same assignment. `classSlots` may also be one
     * class per slot (C#'s `string[]` overload). Returns the class equipped, or "" if none.
     */
    equipClassSync(
        classSlots: string[][] | string[],
        armySize: number,
        syncFilePath = "class_assign.sync",
        allowDuplicates = false,
        preferredUsernameAssignments: Map<string, string> | null = null,
    ): string {
        const slots: string[][] = classSlots.map((s) => (typeof s === "string" ? [s] : s));
        if (slots.length === 0 || armySize < 1) return "";

        const syncFile = this.resolveSyncPath(syncFilePath);

        // Clear stale file (>15 min old)
        try {
            const times = this.readLines(syncFile)
                .map((l) => lineTime(l.split(":")))
                .filter((t) => t != null);
            if (times.length > 0 && nowSeconds() - Math.max(...times) > 15 * 60) bot.army.clearLog(syncFile);
        } catch (error) {
            rethrowIfStopped(error);
        }

        // Collect every unique class name across all slots
        const allNeeded: string[] = [];
        for (const slot of slots) {
            for (const cls of slot) {
                if (!allNeeded.some((c) => sameText(c, cls))) allNeeded.push(cls);
            }
        }

        // Check which of those this client owns (inventory + bank)
        const myClasses: string[] = [];
        for (const cls of allNeeded) {
            if (Core.checkInventory(cls, 1, { toInv: true })) myClasses.push(cls);
        }

        const username = bot.player.username;
        const payload = myClasses.join(",");
        this.updateEntry(syncFile, username, payload);
        bot.log("[EquipClassSync] Account owns: " + (myClasses.length > 0 ? payload : "NONE of the needed classes"));

        const formatAccountName = (user: string): string => {
            const users: string[] = [];
            for (const line of this.readLines(syncFile)) {
                const name = line.split(":")[0];
                if (!users.some((u) => sameText(u, name))) users.push(name);
            }
            users.sort(compareIgnoreCase);

            const i = users.findIndex((u) => sameText(u, user));
            return i >= 0 ? `Account-${i + 1}` : user;
        };

        // Wait for all members to register
        const staleThreshold = 600;
        let lastCount = -1;

        while (!bot.shouldExit) {
            const now = nowSeconds();
            let validCount = 0;

            for (const line of this.readLines(syncFile)) {
                const parts = line.split(":");
                if (parts.length < 3) continue;
                const ts = lineTime(parts);
                if (ts == null) continue;
                if (now - ts <= staleThreshold) validCount++;
            }

            if (validCount !== lastCount) {
                lastCount = validCount;
                bot.log(`[EquipClassSync] Registered: ${validCount}/${armySize}`);
            }

            if (validCount >= armySize) break;

            // Re-poke to keep entry fresh
            this.updateEntry(syncFile, username, payload);
            bot.sleep(500);
        }

        if (bot.shouldExit) return "";

        // Phase 2: Mark self as READY with classes preserved
        // Format: username:READY|class1,class2,...:timestamp
        const readyPayload = `READY|${myClasses.join(",")}`;
        this.updateEntry(syncFile, username, readyPayload);
        bot.log(`[EquipClassSync] ${formatAccountName(username)} marked READY, waiting for all...`);

        // Wait for all clients to be READY (ensures no more class-list writes)
        while (!bot.shouldExit) {
            const now = nowSeconds();
            let readyCount = 0;

            for (const line of this.readLines(syncFile)) {
                const parts = line.split(":");
                if (parts.length < 3) continue;
                // Check if payload starts with "READY|"
                if (!parts[1].toUpperCase().startsWith("READY|")) continue;
                const ts = lineTime(parts);
                if (ts == null) continue;
                if (now - ts <= staleThreshold) readyCount++;
            }

            if (readyCount >= armySize) {
                bot.log(`[EquipClassSync] All ${readyCount} clients READY. Reading final state...`);
                break;
            }

            bot.sleep(300);
        }

        if (bot.shouldExit) return "";

        // Small buffer to ensure file system has flushed all writes
        bot.sleep(500);

        // Parse entries: player - owned classes (keys compare without case, as C#'s dictionary)
        const playerClasses = new Map<string, string[]>();
        const playerKey = (name: string): string => [...playerClasses.keys()].find((k) => sameText(k, name)) ?? name;
        {
            const now = nowSeconds();

            for (const line of this.readLines(syncFile)) {
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

                playerClasses.set(
                    playerKey(playerName),
                    classListStr.split(",").filter((c) => c.length > 0),
                );
            }
        }

        bot.log(`[EquipClassSync] ${playerClasses.size} player(s) registered. Assigning classes...`);

        // Counts keyed by the lowercase class name (C#'s OrdinalIgnoreCase dictionaries).
        const count = (map: Map<string, number>, cls: string): number => map.get(cls.toLowerCase()) ?? 0;

        // Pre-count how many times each class appears across all slot definitions
        // This determines the max allowed duplicates for each class
        const classMaxCount = new Map<string, number>();
        if (allowDuplicates) {
            for (const slot of slots) {
                for (const cls of slot) classMaxCount.set(cls.toLowerCase(), count(classMaxCount, cls) + 1);
            }
        }

        const assignments = new Map<string, string>();
        const assignedPlayers = new Set<string>();
        const classUsedCount = new Map<string, number>();
        const filledSlots = new Set<number>();

        if (preferredUsernameAssignments != null && preferredUsernameAssignments.size > 0) {
            for (const [key, value] of preferredUsernameAssignments) {
                const preferredUser = key.trim();
                const preferredClass = value.trim();

                if (!preferredUser || !preferredClass) continue;

                const userClasses = playerClasses.get(playerKey(preferredUser));
                if (userClasses == null) {
                    bot.log(
                        `[EquipClassSync] Preferred assignment requested for '${preferredUser}' but that user is not registered.`,
                    );
                    continue;
                }

                if (!userClasses.some((c) => sameText(c, preferredClass))) {
                    bot.log(
                        `[EquipClassSync] Preferred assignment for '${preferredUser}' cannot be honored because they do not own '${preferredClass}'.`,
                    );
                    continue;
                }

                for (let s = 0; s < slots.length; s++) {
                    if (filledSlots.has(s)) continue;

                    if (!slots[s].some((c) => sameText(c, preferredClass))) continue;

                    const used = count(classUsedCount, preferredClass);
                    if (!allowDuplicates && used >= 1) continue;

                    if (allowDuplicates) {
                        const max = count(classMaxCount, preferredClass);
                        if (used >= max) continue;
                    }

                    assignments.set(preferredUser.toLowerCase(), preferredClass);
                    assignedPlayers.add(preferredUser.toLowerCase());
                    classUsedCount.set(preferredClass.toLowerCase(), used + 1);
                    filledSlots.add(s);
                    bot.log(
                        `[EquipClassSync] Preferred slot ${s} > ${formatAccountName(preferredUser)} (${preferredClass})`,
                    );
                    break;
                }
            }
        }

        // Deterministic greedy assignment
        // Alpha-sort players so every client computes the identical result.
        const sortedPlayers = [...playerClasses.keys()].sort(compareIgnoreCase);
        const owns = (player: string, cls: string): boolean => playerClasses.get(player)!.some((c) => sameText(c, cls));

        for (let s = 0; s < slots.length; s++) {
            if (filledSlots.has(s)) continue;

            let filled = false;

            // Try each accepted class in preference order
            for (const acceptedClass of slots[s]) {
                // Check if this class can still be used
                const used = count(classUsedCount, acceptedClass);
                if (allowDuplicates) {
                    const max = count(classMaxCount, acceptedClass);
                    if (used >= max) continue;
                } else {
                    // No duplicates: each class used at most once
                    if (used >= 1) continue;
                }

                const candidates = sortedPlayers.filter(
                    (p) => !assignedPlayers.has(p.toLowerCase()) && owns(p, acceptedClass),
                );

                if (candidates.length === 0) continue;

                // Most-constrained candidate first (fewest open slots it can fill),
                // tiebreak alphabetical.
                const canFill = (p: string): number => {
                    let n = 0;
                    for (let s2 = 0; s2 < slots.length; s2++) {
                        if (filledSlots.has(s2)) continue;
                        if (slots[s2].some((c) => owns(p, c))) n++;
                    }
                    return n;
                };
                const best = candidates
                    .map((p) => ({ p, n: canFill(p) }))
                    .sort((a, b) => a.n - b.n || compareIgnoreCase(a.p, b.p))[0].p;

                assignments.set(best.toLowerCase(), acceptedClass);
                assignedPlayers.add(best.toLowerCase());
                classUsedCount.set(acceptedClass.toLowerCase(), used + 1);
                filledSlots.add(s);
                bot.log(`[EquipClassSync] Slot ${s} > ${formatAccountName(best)} (${acceptedClass})`);
                filled = true;
                break;
            }

            if (!filled) bot.log(`[EquipClassSync] WARNING: No candidate for slot ${s} (${slots[s].join("/")})!`);
        }

        // Find this client's assignment
        const myClass = assignments.get(username.toLowerCase());
        if (!myClass) {
            Core.logger(
                `[EquipClassSync] ${formatAccountName(username)} was not assigned any class! Check that all of your accounts own the required classes.`,
                "EquipClassSync",
                { messageBox: true, stopBot: true },
            );
            return "";
        }

        bot.log(`[EquipClassSync] - Equipping: ${myClass}`);
        Core.equip(myClass);
        bot.sleep(1000);

        // Clear sync file for next run
        try {
            bot.army.clearLog(syncFile);
        } catch (error) {
            rethrowIfStopped(error);
        }

        return myClass;
    }

    /** Goes to your house (or Yulgar if you have none), sending the game the house's map packet. */
    joinHouse(): void {
        if (bot.player.inCombat || bot.player.hasTarget) Core.jumpWait();

        try {
            if (bot.house.items.some((h) => h.equipped)) {
                let toSend: string | null = null;

                const modifyPacket = (packet: EventMap["extensionPacket"]): void => {
                    try {
                        const type = packet["params"].type;
                        const data = packet["params"].dataObj;
                        if (type === "json" && data.houseData != null) toSend = JSON.stringify(packet);
                    } catch (error) {
                        rethrowIfStopped(error);
                    }
                };

                const tryJoin = (): void => {
                    bot.events.on("extensionPacket", modifyPacket);
                    bot.send.packet(`%xt%zm%house%1%${bot.player.username}%`);

                    if (bot.wait.forTrue(() => toSend != null, 20)) bot.send.clientPacket(toSend!, "json");

                    bot.wait.forMapLoad("house");
                    bot.events.off("extensionPacket", modifyPacket);

                    for (let i = 0; i < 7; i++) bot.send.clientServer(" ", "");
                };
                const inHouse = (): boolean => bot.map.name?.toLowerCase() === "house";

                tryJoin();

                for (let attempt = 0; attempt < 3 && !inHouse(); attempt++) {
                    bot.sleep(1000);
                    Core.jumpWait();

                    toSend = null;
                    tryJoin();
                }

                if (!inHouse())
                    Core.logger("[CoreUltra] House join did not succeed after retries. Staying in current map.");
            } else {
                Core.logger("[CoreUltra] No house available, falling back to Yulgar.");
                Core.join("yulgar-100000");
            }
        } catch (ex) {
            rethrowIfStopped(ex);
            Core.logger(
                `[CoreUltra] JoinHouse failed: ${ex instanceof Error ? ex.message : String(ex)}. Falling back to Yulgar.`,
            );
            Core.join("yulgar-100000");
        }
    }

    /** Might Tonic for a STR build, else Sage Tonic. */
    getBestTonicPotion(): string {
        const engine = CoreEnginev3.instance;
        const str = engine.getStatValue("STR");
        const intel = engine.getStatValue("INT");
        const pick = str > intel ? "Might Tonic" : "Sage Tonic";
        engine.log("Potion", `🧪 Tonic → ${pick} (STR ${str}, INT ${intel})`);
        return pick;
    }

    /** Potent Battle Elixir for a STR build, else Potent Malevolence Elixir. */
    getBestElixirPotion(): string {
        const engine = CoreEnginev3.instance;
        const str = engine.getStatValue("STR");
        const intel = engine.getStatValue("INT");
        const pick = str > intel ? "Potent Battle Elixir" : "Potent Malevolence Elixir";
        engine.log("Potion", `🧪 Elixir → ${pick} (STR ${str}, INT ${intel})`);
        return pick;
    }
}

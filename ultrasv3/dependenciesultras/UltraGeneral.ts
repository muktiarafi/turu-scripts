/*
name: null
description: null
tags: null
*/
// Port of Scripts/Ultrasv3/DependenciesUltras/UltraGeneral.cs.
//
// Turu: C# passes the script's `IScriptInterface`; there is one `bot` here, so the members keep the
// parameter (cs2ts passes `bot`) but read the global.

import { type Bot, bot as theBot } from "turu";
import { Core, rethrowIfStopped } from "../../core/CoreBots";
import { compareIgnoreCase, type CoreUltrav3, lineTime, newGuid, nowSeconds } from "./CoreUltrav3";

export class UltraGeneral {
    static equipPresetClasses(ultra: CoreUltrav3, bot: Bot, syncFilePath: string): void {
        UltraGeneral.equipUltraDailyPresetClasses(ultra, bot, syncFilePath);
    }

    /**
     * Equips the classes of the script's `Class1`..`Class7` options across the army (`ArmySize`
     * members) with {@link CoreUltrav3.equipClassSync}. An option is `ClassName` or
     * `ClassName,Username` (that account gets that class).
     */
    static equipUltraDailyPresetClasses(ultra: CoreUltrav3, _bot: Bot, syncFilePath: string, armySize = 0): void {
        if (ultra == null || !syncFilePath?.trim()) return;

        armySize = armySize > 0 ? armySize : Math.max(1, theBot.config.get<number>("ArmySize"));

        const presetEntries = ["Class1", "Class2", "Class3", "Class4", "Class5", "Class6", "Class7"]
            .map((name) => theBot.config.get<string>(name)?.trim())
            .filter((cl): cl is string => !!cl)
            .map(parseClassOption)
            .filter((entry) => !!entry.className);

        if (presetEntries.length === 0) return;

        const presetClasses = presetEntries.map((entry) => entry.className);
        // The first entry for a user wins (C#'s keys compare without case).
        const preferredAssignments = new Map<string, string>();

        for (const entry of presetEntries) {
            const user = entry.username;
            if (user && ![...preferredAssignments.keys()].some((u) => u.toLowerCase() === user.toLowerCase()))
                preferredAssignments.set(user, entry.className);
        }

        const distinct = new Set(presetClasses.map((c) => c.toLowerCase())).size;
        const allowDuplicates = presetClasses.length < armySize || distinct < presetClasses.length;

        const classSlots: string[][] =
            presetEntries.length >= armySize
                ? presetEntries.slice(0, armySize).map((entry) => [entry.className])
                : Array.from({ length: armySize }, () => presetClasses);

        ultra.equipClassSync(
            classSlots,
            armySize,
            syncFilePath,
            allowDuplicates,
            preferredAssignments.size > 0 ? preferredAssignments : null,
        );
    }

    /**
     * {@link equipUltraDailyPresetClasses} with its own registration (each member publishes the
     * classes it owns, then READY) that gives up waiting after `timeoutMs` and goes on with whoever
     * registered.
     */
    static equipUltraDailyPresetClassesSafe(
        ultra: CoreUltrav3,
        _bot: Bot,
        syncFilePath: string,
        armySize = 0,
        timeoutMs = 90000,
    ): void {
        if (ultra == null || !syncFilePath?.trim()) return;

        armySize = armySize > 0 ? armySize : Math.max(1, theBot.config.get<number>("ArmySize"));

        const presetEntries = ["Class1", "Class2", "Class3", "Class4", "Class5", "Class6", "Class7"]
            .map((name) => theBot.config.get<string>(name)?.trim())
            .filter((cl): cl is string => !!cl)
            .map(parseClassOption)
            .filter((entry) => !!entry.className);

        if (presetEntries.length === 0) return;

        const presetClasses = presetEntries.map((entry) => entry.className);
        // Keyed by lowercase user name (C#'s OrdinalIgnoreCase); the first entry for a user wins.
        const preferredAssignments = new Map<string, { user: string; className: string }>();

        for (const entry of presetEntries) {
            if (entry.username && !preferredAssignments.has(entry.username.toLowerCase()))
                preferredAssignments.set(entry.username.toLowerCase(), {
                    user: entry.username,
                    className: entry.className,
                });
        }

        const distinct = new Set(presetClasses.map((c) => c.toLowerCase())).size;
        const allowDuplicates = presetClasses.length < armySize || distinct < presetClasses.length;

        const classSlots: string[][] =
            presetEntries.length >= armySize
                ? presetEntries.slice(0, armySize).map((entry) => [entry.className])
                : Array.from({ length: armySize }, () => presetClasses);

        const syncFile = ultra.resolveSyncPath(syncFilePath);

        // Clear stale file (>15 min old). Turu: a sync file is `bot.army`'s log; "older than 15
        // minutes" is "no line newer than 15 minutes".
        try {
            const times = ultra
                .readLines(syncFile)
                .map((l) => lineTime(l.split(":")))
                .filter((t) => t != null);
            if (times.length > 0 && nowSeconds() - Math.max(...times) > 15 * 60) theBot.army.clearLog(syncFile);
        } catch (error) {
            rethrowIfStopped(error);
        }

        // Lowercase keys: C#'s OrdinalIgnoreCase set; the first spelling is kept.
        const allNeeded = new Map<string, string>();
        for (const slot of classSlots)
            for (const cls of slot) if (!allNeeded.has(cls.toLowerCase())) allNeeded.set(cls.toLowerCase(), cls);

        const myClasses: string[] = [];
        for (const cls of allNeeded.values()) {
            if (Core.checkInventory(cls, undefined, { toInv: true })) myClasses.push(cls);
        }

        const username = theBot.player?.username ?? newGuid();
        const payload = myClasses.join(",");
        theBot.log(
            `[EquipClassSync] ${username} owns: ${myClasses.length > 0 ? payload : "NONE of the needed classes"}`,
        );

        ultra.updateEntry(syncFile, username, payload);

        const staleThreshold = 600;
        let lastCount = -1;
        let waitStartMs = Date.now();

        while (!theBot.shouldExit) {
            const lines = ultra.readLines(syncFile);
            const now = nowSeconds();
            let validCount = 0;

            for (const line of lines) {
                const parts = line.split(":");
                if (parts.length < 3) continue;
                const ts = lineTime(parts);
                if (ts == null) continue;
                if (now - ts <= staleThreshold) validCount++;
            }

            if (validCount !== lastCount) {
                lastCount = validCount;
                theBot.log(`[EquipClassSync] Registered: ${validCount}/${armySize}`);
            }

            if (validCount >= armySize) break;

            if (Date.now() - waitStartMs >= timeoutMs) {
                theBot.log(
                    `[EquipClassSync] Timeout waiting for class registration after ${Math.trunc(timeoutMs / 1000)}s; continuing with ${validCount}/${armySize}.`,
                );
                break;
            }

            ultra.updateEntry(syncFile, username, payload);
            theBot.sleep(500);
        }

        if (theBot.shouldExit) return;

        const readyPayload = `READY|${myClasses.join(",")}`;
        ultra.updateEntry(syncFile, username, readyPayload);
        theBot.log(`[EquipClassSync] ${username} marked READY, waiting for all...`);

        waitStartMs = Date.now();

        while (!theBot.shouldExit) {
            const lines = ultra.readLines(syncFile);
            const now = nowSeconds();
            let readyCount = 0;

            for (const line of lines) {
                const parts = line.split(":");
                if (parts.length < 3) continue;
                if (!parts[1].toUpperCase().startsWith("READY|")) continue;
                const ts = lineTime(parts);
                if (ts == null) continue;
                if (now - ts <= staleThreshold) readyCount++;
            }

            if (readyCount >= armySize) {
                theBot.log(`[EquipClassSync] All ${readyCount} clients READY. Reading final state...`);
                break;
            }

            if (Date.now() - waitStartMs >= timeoutMs) {
                theBot.log(
                    `[EquipClassSync] Timeout waiting for READY state after ${Math.trunc(timeoutMs / 1000)}s; continuing with ${readyCount}/${armySize}.`,
                );
                break;
            }

            theBot.sleep(300);
        }

        if (theBot.shouldExit) return;

        theBot.sleep(500);

        // Keyed by lowercase player name; `name` keeps the spelling of the latest line.
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

                let classListStr = payloadPart;
                if (payloadPart.toUpperCase().startsWith("READY|")) classListStr = payloadPart.substring(6);

                const prev = playerClasses.get(playerName.toLowerCase());
                playerClasses.set(playerName.toLowerCase(), {
                    name: prev?.name ?? playerName,
                    classes: classListStr.split(",").filter((c) => c.length > 0),
                });
            }
        }

        theBot.log(`[EquipClassSync] ${playerClasses.size} player(s) registered. Assigning classes...`);

        const owns = (playerKey: string, cls: string): boolean =>
            playerClasses.get(playerKey)?.classes.some((c) => c.toLowerCase() === cls.toLowerCase()) ?? false;

        // Lowercase class keys.
        const classMaxCount = new Map<string, number>();
        if (allowDuplicates) {
            for (const slot of classSlots) {
                for (const cls of slot) {
                    classMaxCount.set(cls.toLowerCase(), (classMaxCount.get(cls.toLowerCase()) ?? 0) + 1);
                }
            }
        }

        // Lowercase player keys.
        const assignments = new Map<string, string>();
        const assignedPlayers = new Set<string>();
        const classUsedCount = new Map<string, number>();
        const filledSlots = new Set<number>();

        if (preferredAssignments.size > 0) {
            for (const kvp of preferredAssignments.values()) {
                const preferredUser = kvp.user.trim();
                const preferredClass = kvp.className.trim();

                if (!preferredUser || !preferredClass) continue;

                const userKey = preferredUser.toLowerCase();
                if (!playerClasses.has(userKey)) {
                    theBot.log(
                        `[EquipClassSync] Preferred assignment requested for '${preferredUser}' but that user is not registered.`,
                    );
                    continue;
                }

                if (!owns(userKey, preferredClass)) {
                    theBot.log(
                        `[EquipClassSync] Preferred assignment for '${preferredUser}' cannot be honored because they do not own '${preferredClass}'.`,
                    );
                    continue;
                }

                for (let s = 0; s < classSlots.length; s++) {
                    if (filledSlots.has(s)) continue;

                    if (!classSlots[s].some((c) => c.toLowerCase() === preferredClass.toLowerCase())) continue;

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
                    theBot.log(`[EquipClassSync] Preferred slot ${s} > ${preferredUser} (${preferredClass})`);
                    break;
                }
            }
        }

        const sortedPlayers = [...playerClasses.keys()].sort((a, b) =>
            compareIgnoreCase(playerClasses.get(a)!.name, playerClasses.get(b)!.name),
        );

        for (let s = 0; s < classSlots.length; s++) {
            if (filledSlots.has(s)) continue;

            let filled = false;

            for (const acceptedClass of classSlots[s]) {
                const used = classUsedCount.get(acceptedClass.toLowerCase()) ?? 0;
                if (allowDuplicates) {
                    const max = classMaxCount.get(acceptedClass.toLowerCase()) ?? 0;
                    if (used >= max) continue;
                } else {
                    if (used >= 1) continue;
                }

                const candidates = sortedPlayers.filter((p) => !assignedPlayers.has(p) && owns(p, acceptedClass));

                if (candidates.length === 0) continue;

                const canFill = (p: string): number => {
                    let count = 0;
                    for (let s2 = 0; s2 < classSlots.length; s2++) {
                        if (filledSlots.has(s2)) continue;
                        if (classSlots[s2].some((c) => owns(p, c))) count++;
                    }
                    return count;
                };
                // C#'s OrderBy(canFill).ThenBy(name): candidates are already in name order.
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
                theBot.log(`[EquipClassSync] Slot ${s} > ${playerClasses.get(best)!.name} (${acceptedClass})`);
                filled = true;
                break;
            }

            if (!filled)
                theBot.log(`[EquipClassSync] WARNING: No candidate for slot ${s} (${classSlots[s].join("/")})!`);
        }

        const myClass = assignments.get(username.toLowerCase());
        if (!myClass) {
            Core.logger(
                `[EquipClassSync] ${username} was not assigned any class! Check that all of your accounts own the required classes.`,
                "EquipClassSync",
                { messageBox: true, stopBot: true },
            );
            return;
        }

        theBot.log(`[EquipClassSync] - Equipping: ${myClass}`);
        Core.equip(myClass);
        theBot.sleep(1000);

        try {
            theBot.army.clearLog(syncFile);
        } catch (error) {
            rethrowIfStopped(error);
        }
    }

    static publishUltraDailyBossNeeds(
        ultra: CoreUltrav3,
        _bot: Bot,
        syncFilePath: string,
        neededBosses: Iterable<string | null>,
    ): void {
        if (ultra == null || !syncFilePath?.trim()) return;

        const path = ultra.resolveSyncPath(syncFilePath);
        const username = theBot.player?.username ?? newGuid();
        const payload = [...neededBosses]
            .map((b) => b?.trim())
            .filter((b): b is string => !!b)
            .join(",");

        ultra.updateEntry(path, username, payload);
    }

    static publishUltraDailyBossStatuses(
        ultra: CoreUltrav3,
        _bot: Bot,
        syncFilePath: string,
        bossStatuses: Iterable<[string, boolean]>,
    ): void {
        if (ultra == null || !syncFilePath?.trim()) return;

        const path = ultra.resolveSyncPath(syncFilePath);
        const username = theBot.player?.username ?? newGuid();
        const payload = [...bossStatuses].map(([key, value]) => `${key}=${value ? "true" : "false"}`).join(",");

        ultra.updateEntry(path, username, payload);
    }

    static getUltraDailyBossParticipantCount(
        ultra: CoreUltrav3,
        _bot: Bot,
        syncFilePath: string,
        defaultCount: number,
    ): number {
        if (ultra == null || !syncFilePath?.trim()) return Math.max(1, defaultCount);

        const path = ultra.resolveSyncPath(syncFilePath);
        const lines = ultra.readLines(path);
        const now = nowSeconds();
        const staleThreshold = 600;

        let count = 0;
        for (const line of lines) {
            const parts = line.split(":");
            if (parts.length < 3) continue;

            const ts = lineTime(parts);
            if (ts == null) continue;

            if (now - ts > staleThreshold) continue;

            count++;
        }

        return count > 0 ? Math.max(1, count) : Math.max(1, defaultCount);
    }

    static ensureCompleteDailyQuestSafe(_bot: Bot, questId: number): boolean {
        if (questId <= 0) return false;

        const quest = theBot.quests.ensureLoad(questId);
        if (quest == null) return false;

        if (theBot.quests.isDailyComplete(questId)) return true;

        if (quest.once && theBot.quests.hasBeenCompleted(questId)) return true;

        if (!theBot.quests.isInProgress(questId) && !theBot.quests.canComplete(questId)) {
            if (!Core.ensureAccept(questId)) return false;
        }

        return Core.ensureComplete(questId);
    }

    static ensureAcceptOnce(_bot: Bot, questId: number): boolean {
        if (questId <= 0) return false;

        const quest = theBot.quests.ensureLoad(questId);
        if (quest == null) return false;

        if (theBot.quests.isDailyComplete(questId)) return true;

        if (quest.once && theBot.quests.hasBeenCompleted(questId)) return true;

        if (theBot.quests.isInProgress(questId)) return true;

        const maxAttempts = 5;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            if (Core.ensureAccept(questId)) return true;

            if (attempt < maxAttempts) theBot.sleep(1000);
        }

        return false;
    }

    static ensureCompleteOnce(bot: Bot, questId: number, itemId = -1): boolean {
        if (questId <= 0) return false;

        const quest = theBot.quests.ensureLoad(questId);
        if (quest == null) return false;

        if (theBot.quests.isDailyComplete(questId)) return true;

        if (quest.once && theBot.quests.hasBeenCompleted(questId)) return true;

        if (!theBot.quests.isInProgress(questId) && !theBot.quests.canComplete(questId)) {
            if (!UltraGeneral.ensureAcceptOnce(bot, questId)) return false;
        }

        const maxAttempts = 5;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            if (Core.ensureComplete(questId, itemId)) return true;

            if (attempt < maxAttempts) theBot.sleep(1000);
        }

        return false;
    }

    /** Whether every member of the army is dead (each member writes its state to the sync file). */
    static isWholeArmyDead(ultra: CoreUltrav3, _bot: Bot, syncFilePath: string): boolean {
        return updateAndCheckWholeArmyState(ultra, syncFilePath, !theBot.player.alive, "1");
    }

    /** Whether every member of the army is alive. */
    static isWholeArmyAlive(ultra: CoreUltrav3, _bot: Bot, syncFilePath: string): boolean {
        return updateAndCheckWholeArmyState(ultra, syncFilePath, theBot.player.alive, "1");
    }

    static isQuestGreen(_bot: Bot, questId: number): boolean {
        if (questId <= 0) return false;

        const quest = theBot.quests.ensureLoad(questId);
        if (quest == null) return false;

        if (theBot.quests.isDailyComplete(questId)) return false;

        if (quest.once && theBot.quests.hasBeenCompleted(questId)) return false;

        if (!theBot.quests.isInProgress(questId)) return false;

        return theBot.quests.canComplete(questId);
    }

    static isQuestComplete(_bot: Bot, questId: number): boolean {
        if (questId <= 0) return false;

        if (theBot.quests.isDailyComplete(questId)) return true;

        const quest = theBot.quests.ensureLoad(questId);
        if (quest == null) return false;

        // Skua's Quest.Active (Status != null).
        if (quest.status != null) {
            if (theBot.quests.canComplete(questId)) return true;

            if (quest.slot > 0 && quest.value > 0) {
                const currentValue = Number(theBot.flash.callGameFunction("world.getQuestValue", quest.slot)) || 0;
                return currentValue >= quest.value;
            }

            return false;
        }

        return quest.once && theBot.quests.hasBeenCompleted(questId);
    }

    //#region New
    /**
     * C#'s `ArmyWipeHelperWithTaunters(..., ref armyWipeDetected, ref fightStartTime, ref
     * lastTauntTime)`: the `ref` arguments are the fields of `state` (times in Unix milliseconds;
     * C#'s `DateTime.MinValue` is 0). Returns true while a wipe is being handled (skip the fight
     * step).
     */
    static armyWipeHelperWithTaunters(
        ultra: CoreUltrav3,
        bot: Bot,
        wipeDeadSyncFile: string,
        wipeAliveSyncFile: string,
        state: ArmyWipeState & { fightStartTime: number; lastTauntTime: number },
    ): boolean {
        if (ultra == null || !wipeDeadSyncFile?.trim() || !wipeAliveSyncFile?.trim()) return false;

        const allDead = UltraGeneral.isWholeArmyDead(ultra, bot, wipeDeadSyncFile);
        if (allDead) {
            if (!state.armyWipeDetected) Core.logger("Army wipe detected — all clients dead.");
            state.armyWipeDetected = true;
        }

        if (!state.armyWipeDetected) return false;

        const allAlive = UltraGeneral.isWholeArmyAlive(ultra, bot, wipeAliveSyncFile);
        if (allAlive) {
            Core.logger("Army wipe recovered — all clients alive again.");
            ultra.clearSyncFile(wipeDeadSyncFile);
            ultra.clearSyncFile(wipeAliveSyncFile);
            theBot.combat.cancelTarget();
            state.armyWipeDetected = false;
            state.fightStartTime = Date.now();
            state.lastTauntTime = 0;
            return true;
        }

        theBot.combat.cancelTarget();
        Core.logger("Army wipe active — waiting for everyone to respawn before fighting.");
        theBot.sleep(250);
        return true;
    }

    /** C#'s `ArmyWipeHelperWithNoTaunters(..., ref armyWipeDetected)`: `ref` is `state`'s field. */
    static armyWipeHelperWithNoTaunters(
        ultra: CoreUltrav3,
        bot: Bot,
        wipeDeadSyncFile: string,
        wipeAliveSyncFile: string,
        state: ArmyWipeState,
    ): boolean {
        if (ultra == null || !wipeDeadSyncFile?.trim() || !wipeAliveSyncFile?.trim()) return false;

        const allDead = UltraGeneral.isWholeArmyDead(ultra, bot, wipeDeadSyncFile);
        if (allDead) {
            if (!state.armyWipeDetected) Core.logger("Army wipe detected — all clients dead.");
            state.armyWipeDetected = true;
        }

        if (!state.armyWipeDetected) return false;

        const allAlive = UltraGeneral.isWholeArmyAlive(ultra, bot, wipeAliveSyncFile);
        if (allAlive) {
            Core.logger("Army wipe recovered — all clients alive again.");
            ultra.clearSyncFile(wipeDeadSyncFile);
            ultra.clearSyncFile(wipeAliveSyncFile);
            theBot.combat.cancelTarget();
            state.armyWipeDetected = false;
            return true;
        }

        theBot.combat.cancelTarget();
        Core.logger("Army wipe active — waiting for everyone to respawn before fighting.");
        theBot.sleep(250);
        return true;
    }
    //#endregion

    static isQuestTurnable(_bot: Bot, questId: number): boolean {
        if (questId <= 0) return false;

        return theBot.quests.canComplete(questId);
    }

    /**
     * Completes a quest without loading it or checking requirements. Retries up to 5 times with
     * 1-second intervals on failure.
     */
    static completeQuest(_bot: Bot, questId: number, itemId = -1): boolean {
        if (questId <= 0) return false;

        const maxAttempts = 5;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            if (theBot.quests.ensureComplete(questId, itemId)) return true;

            if (attempt < maxAttempts) theBot.sleep(1000);
        }

        return false;
    }

    static equipWarriorClass(): void {
        Core.equip("Warrior");
    }
}

/** The `ref bool armyWipeDetected` of C#'s wipe helpers. */
export interface ArmyWipeState {
    armyWipeDetected: boolean;
}

function updateAndCheckWholeArmyState(
    ultra: CoreUltrav3,
    syncFilePath: string,
    localState: boolean,
    expectedValue: string,
): boolean {
    if (ultra == null || !syncFilePath?.trim()) return false;

    const username = theBot.player?.username;
    if (!username?.trim()) return false;

    const key = username.replaceAll(":", "-");
    const syncFile = ultra.resolveSyncPath(syncFilePath);
    ultra.updateEntry(syncFile, key, localState ? "1" : "0");

    const lines = ultra.readLines(syncFile);
    const now = nowSeconds();
    const staleThreshold = 600;
    let activeMembers = 0;
    let matchingMembers = 0;

    for (const line of lines) {
        const parts = line.split(":");
        if (parts.length < 3) continue;
        if (!/^-?\d+$/.test(parts[2])) continue;
        if (now - Number(parts[2]) > staleThreshold) continue;

        activeMembers++;
        if (parts[1] === expectedValue) matchingMembers++;
    }

    return activeMembers > 0 && activeMembers === matchingMembers;
}

/** `ClassName` or `ClassName,Username` (C#'s `ParseClassOption`). */
function parseClassOption(raw: string | null): { className: string; username: string | null } {
    if (!raw?.trim()) return { className: "", username: null };

    // C#'s Split(',', 2, RemoveEmptyEntries): at most two parts, the second keeps any later commas.
    const comma = raw.indexOf(",");
    const parts = (comma < 0 ? [raw] : [raw.substring(0, comma), raw.substring(comma + 1)])
        .map((part) => part.trim())
        .filter((part) => part.length > 0);

    if (parts.length === 0) return { className: "", username: null };

    return parts.length === 1 ? { className: parts[0], username: null } : { className: parts[0], username: parts[1] };
}

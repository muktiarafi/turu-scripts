/*
name: null
description: null
tags: null
*/
// Port of the parts of Scripts/Ultrasv3/DependenciesUltras/UltraGeneral.cs that the ported Ultras
// reach: EquipPresetClasses, EquipUltraDailyPresetClasses, IsWholeArmyDead, IsWholeArmyAlive. The
// rest (the daily boss sync, the quest helpers, the wipe helpers, EquipWarriorClass) isn't ported
// yet; port it in C# order when a script needs it.
//
// Turu: C# passes the script's `IScriptInterface`; there is one `bot` here, so the members keep the
// parameter (cs2ts passes `bot`) but read the global.

import { type Bot, bot as theBot } from "turu";
import type { CoreUltrav3 } from "./CoreUltrav3";

/** C#'s `DateTimeOffset.UtcNow.ToUnixTimeSeconds()`. */
function nowSeconds(): number {
    return Math.floor(Date.now() / 1000);
}

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

    /** Whether every member of the army is dead (each member writes its state to the sync file). */
    static isWholeArmyDead(ultra: CoreUltrav3, _bot: Bot, syncFilePath: string): boolean {
        return updateAndCheckWholeArmyState(ultra, syncFilePath, !theBot.player.alive, "1");
    }

    /** Whether every member of the army is alive. */
    static isWholeArmyAlive(ultra: CoreUltrav3, _bot: Bot, syncFilePath: string): boolean {
        return updateAndCheckWholeArmyState(ultra, syncFilePath, theBot.player.alive, "1");
    }
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

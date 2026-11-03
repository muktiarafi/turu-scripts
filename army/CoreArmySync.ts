/*
name: Army Sync
description: The army sync helpers of the Ultras' CoreUltra (WaitForArmy, CheckArmyProgress) and CoreEngine (Join, Boot), which the Army scripts use.
tags: army, sync, library
*/
// Port of the army sync members of Scripts/Ultrasv3/Entwined Eclipse/CoreUltra.cs (WaitForArmy,
// CheckArmyProgress, CheckArmyProgressBool, ClearSyncFile, ResolveSyncPath, ReadLines,
// UpdateEntry), and of Scripts/Ultrasv3/Entwined Eclipse/CoreEngine.cs (Join, Chill, Boot). The
// Ultras folders aren't ported; the Army scripts only need these.
//
// Turu: C#'s sync file in Skua's folder is `bot.army`'s shared log of the same name (every client
// of this machine reads it). C#'s machine-wide mutex around UpdateEntry is the log's lock
// (`bot.army.withLock`). WaitForArmy is `bot.army.barrier`: C# polls ready lines and the first
// member through clears the file, which strands a member that looks only after that.

import { bot } from "turu";
import { Core } from "../core/CoreBots";

/** C#'s `DateTimeOffset.UtcNow.ToUnixTimeSeconds()`. */
function nowSeconds(): number {
    return Math.floor(Date.now() / 1000);
}

/** C#'s `Split(new[] { '\r', '\n' }, RemoveEmptyEntries)` of the file's text. */
function nonEmpty(lines: string[]): string[] {
    return lines.filter((l) => l.length > 0);
}

export class CoreArmySync {
    /** Waits for `quantity` + 1 members (`quantity` + self), so for 1 player, wait for 0(+1). */
    waitForArmy(
        quantity: number,
        syncFilePath = "army_sync.sync",
        bufferTimeMs = 3000,
        _tickMs = 500,
        timeoutMs = 0,
    ): void {
        // --- Wait for army readiness ---
        // Turu: C# polls `username|class:ready:timestamp` lines every `tickMs`; the barrier keeps
        // its own file (`<name>.barrier`) and its own pace.
        const syncFile = this.resolveSyncPath(syncFilePath);
        const need = quantity === 0 ? 1 : Math.max(1, quantity) + 1;

        bot.log(`[WaitForArmy] Waiting for ${need} members...`);
        if (bot.army.barrier(syncFile, need, timeoutMs)) bot.log("[WaitForArmy] All members ready!");
        else bot.log("[WaitForArmy] Timeout reached — continuing anyway.");

        // --- Warmup spam to keep clients responsive ---
        const spamUntil = Date.now() + 2000;
        while (!bot.shouldExit && Date.now() < spamUntil) {
            bot.skills.useSkill(3);
            bot.sleep(300);
            bot.skills.useSkill(2);
            bot.sleep(300);
            bot.skills.useSkill(1);
            bot.sleep(300);
        }

        bot.sleep(bufferTimeMs);

        // C# empties the sync file here, which also drops CheckArmyProgress's lines.
        bot.army.clearLog(syncFile);
    }

    /**
     * Writes this member's progress on an item and returns whether every active member has the
     * target quantity. Line format: `KEY:current:target:TYPE:timestamp`.
     */
    checkArmyProgress(
        itemName: string,
        targetQuantity: number,
        isTemp: boolean,
        syncFilePath = "army_sync.sync",
    ): boolean {
        if (!bot.player.alive) bot.wait.forTrue(() => bot.player.alive, 20);

        const syncFile = this.resolveSyncPath(syncFilePath);
        const myKey = `${bot.player.username}|${bot.player.currentClass ?? "Peasant"}`.replaceAll(":", "-");
        const myQty = isTemp ? bot.tempInv.getQuantity(itemName) : bot.inventory.getQuantity(itemName);

        // Update my progress
        this.updateEntry(syncFile, myKey, `${myQty}:${targetQuantity}:${isTemp ? "TEMP" : "INV"}`);

        // Read file and check all members
        const lines = this.readLines(syncFile);
        const now = nowSeconds();
        const staleThreshold = 600; // 10 min

        let activeMembers = 0;
        let completedMembers = 0;

        for (const line of lines) {
            const parts = line.split(":");
            // Format: KEY:current:target:TYPE:timestamp (5 parts minimum)
            if (parts.length < 5) continue;
            if (!/^-?\d+$/.test(parts[1]) || !/^-?\d+$/.test(parts[2]) || !/^\d+$/.test(parts[4])) continue;

            // Skip stale entries
            if (now - Number(parts[4]) > staleThreshold) continue;

            activeMembers++;
            if (Number(parts[1]) >= Number(parts[2])) completedMembers++;
        }

        return activeMembers > 0 && completedMembers === activeMembers;
    }

    /** Writes whether `condition` holds for this member and returns whether it holds for every active member. */
    checkArmyProgressBool(condition: () => boolean, syncFilePath = "army_sync.sync"): boolean {
        if (!bot.player.alive) {
            if (bot.player.username?.trim()) {
                const deadKey = `${bot.player.username}|PlaceHolder`.replaceAll(":", "-");
                this.updateEntry(this.resolveSyncPath(syncFilePath), deadKey, "0");
            }

            bot.wait.forTrue(() => bot.player.alive, 20);
        }

        if (!bot.player.username?.trim()) bot.wait.forTrue(() => !!bot.player.username?.trim(), 20);

        const username = bot.player.username;
        const className = bot.player.currentClass;

        if (!username?.trim() || !className?.trim()) return false;

        const syncFile = this.resolveSyncPath(syncFilePath);
        const myKey = `${username}|${className}`.replaceAll(":", "-");

        const myCondition = condition();
        this.updateEntry(syncFile, myKey, myCondition ? "1" : "0");

        const lines = this.readLines(syncFile);
        const now = nowSeconds();
        const staleThreshold = 600;

        let activeMembers = 0;
        let completedMembers = 0;

        for (const line of lines) {
            const parts = line.split(":");
            if (parts.length < 3) continue;

            const keyParts = parts[0].split("|");
            if (keyParts.length < 1 || !keyParts[0].trim()) continue;

            if (!/^-?\d+$/.test(parts[1]) || !/^\d+$/.test(parts[2])) continue;
            if (now - Number(parts[2]) > staleThreshold) continue;

            activeMembers++;
            if (Number(parts[1]) === 1) completedMembers++;
        }

        return activeMembers > 0 && completedMembers === activeMembers;
    }

    clearSyncFile(filePath: string): void {
        if (this.readLines(filePath).length === 0) {
            bot.log("[ArmySync] Sync file already empty — no action needed.");
            return;
        }
        bot.army.clearLog(filePath);
        bot.log("[ArmySync] Sync file cleared.");
    }

    /**
     * The sync file's name: the shared log `bot.army` keeps it in. C# returns a path in Skua's
     * options folder (or the path itself when its folder exists); only the file name is kept here.
     */
    resolveSyncPath(path: string): string {
        return path.split(/[\\/]/).at(-1) ?? path;
    }

    /** The sync file's non-empty lines. */
    readLines(path: string): string[] {
        return nonEmpty(bot.army.readLog(path));
    }

    /** Inserts or updates `key`'s line: `key:payload:timestamp`. */
    updateEntry(path: string, key: string, payload: string): void {
        if (!key.trim()) return;

        bot.army.withLock(path, () => {
            const lines = this.readLines(path).filter((l) => l.trim());
            const entry = `${key}:${payload}:${nowSeconds()}`;

            const idx = lines.findIndex((l) => {
                const parts = l.split(":");
                return parts.length > 0 && parts[0].toLowerCase() === key.toLowerCase();
            });

            if (idx >= 0) lines[idx] = entry;
            else lines.push(entry);

            bot.army.writeLog(path, lines);
        });
    }
}

/**
 * What the Army scripts use of the Ultras' CoreEngine (C# `public CoreEngine Core`): its `Join`
 * into the machine's private room, and `Boot`.
 */
export class CoreArmyEngine {
    D1 = 250;
    D3 = 1400;

    /**
     * C# starts CoreEngine's own skill loop (a Task) and logs its signals; Turu starts the
     * equipped class's saved rotation instead. The rest is C#'s.
     */
    boot(): void {
        bot.ultraBossHelper.disableCounterAttack();
        if (!bot.skills.timerRunning) bot.skills.startAdvanced(bot.player.currentClass ?? undefined, false);

        this.log("SKUA", "System online");

        this.chill();

        bot.bank.open();

        if (bot.bank.items.length === 0) {
            bot.bank.load();
            bot.wait.forTrue(() => bot.bank.items.length > 0, 20);
        }

        bot.options.safeTimings = true;
        bot.options.infiniteRange = true;
        bot.options.skipCutscenes = true;
        bot.lite.set("bHidePlayers", true);
        bot.drops.start();
        Core.join("whitemap-100000");
    }

    /** C# `Log(category, message)`: `Boot` routes it to the script log. */
    log(category: string, message: string): void {
        if (!category.trim() || !message.trim()) return;
        bot.log(`[${category}] ${message}`);
    }

    isInCell(cellName: string): boolean {
        if (!bot.player.alive) bot.wait.forTrue(() => bot.player.alive, 20);
        if (!cellName.trim()) return false;
        return bot.player.cell?.toLowerCase() === cellName.toLowerCase();
    }

    inLoadedMap(name: string): boolean {
        return bot.map.loaded && bot.map.name?.toLowerCase() === name.toLowerCase();
    }

    /**
     * Joins `map` in this machine's private room (the same for every client of it) unless
     * `publicRoom`, a room is given, or the name has one.
     */
    join(map: string, cell = "Enter", pad = "Spawn", publicRoom = false, roomNumber: number | null = null): void {
        if (!map.trim()) return;

        if (!bot.player.alive) bot.wait.forTrue(() => bot.player.alive, 20);

        const mapName = map.split("-")[0].trim();
        const target = publicRoom
            ? mapName
            : roomNumber != null
              ? `${mapName}-${roomNumber}`
              : map.includes("-")
                ? map
                : `${mapName}-${bot.army.machineRoomNumber()}`;

        if (this.inLoadedMap(mapName)) {
            if (cell.trim() && !this.isInCell(cell)) bot.map.jump(cell, pad);
            return;
        }

        this.chill();

        for (let i = 0; i < 5 && !bot.shouldExit && !this.inLoadedMap(mapName); i++) {
            bot.send.packet(`%xt%zm%cmd%${bot.map.roomId}%tfer%${bot.player.username}%${target}%${cell}%${pad}%`);

            const end = Date.now() + 8000; // up to 8s per try
            while (!bot.shouldExit && !this.inLoadedMap(mapName) && Date.now() < end) bot.sleep(100);

            if (!this.inLoadedMap(mapName)) bot.sleep(300);
        }

        if (this.inLoadedMap(mapName)) {
            this.log("MAP", `🌍 Joined ${mapName} (${target})`);
            if (cell.trim() && !this.isInCell(cell)) bot.map.jump(cell, pad);
        } else {
            this.log("MAP", `❌ Failed to join ${mapName} (${target})`);
        }
    }

    /** Leaves combat for the cell with the fewest monsters. */
    chill(sleepMore = true): void {
        bot.combat.cancelAutoAttack();
        bot.combat.cancelTarget();

        const cells = bot.map.cells;
        const mobs = bot.monsters.mapMonsters;

        const safeCell =
            cells
                .filter(
                    (c) =>
                        !!c.trim() &&
                        c.toLowerCase() !== "wait" &&
                        c.toLowerCase() !== "blank" &&
                        !c.toLowerCase().startsWith("cut"),
                )
                .map((c, i) => ({ c, i, n: mobs.filter((m) => m.cell === c).length }))
                .sort((a, b) => a.n - b.n || a.i - b.i)[0]?.c ?? bot.player.cell;

        const pad = bot.player.pad?.trim() ? bot.player.pad : "Left";

        this.log("CHILL", `🍃 Safe cell: ${safeCell} (${pad})`);

        while (!bot.shouldExit && bot.player.state === 2) {
            if (!this.isInCell(safeCell)) bot.map.jump(safeCell, pad);

            bot.sleep(this.D1);
        }

        if (sleepMore) bot.sleep(this.D3);
    }
}

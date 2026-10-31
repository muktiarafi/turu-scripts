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
// of this machine reads it). C# guards UpdateEntry with a machine-wide mutex; here the lines are
// read and written back at once (`bot.army.writeLog`), and as every member rewrites its own line
// on each check, an update another client overwrote comes back on the next one.

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
        tickMs = 500,
        timeoutMs = 0,
    ): void {
        // --- File I/O Helpers ---
        const slurp = (path: string): string[] => nonEmpty(bot.army.readLog(path));
        const yeet = (path: string, lines: string[]): void => bot.army.writeLog(path, lines);

        // Each line: username|class:ready:timestamp
        const poke = (path: string, key: string, ready: boolean): void => {
            if (!key.trim()) return;

            const keyParts = key.split("|");
            if (keyParts.length < 2 || !keyParts[0].trim()) return;

            const username = keyParts[0];
            const className = keyParts[1];

            // purge broken historical entries (|Peasant etc.)
            const lines = slurp(path).filter((l) => !l.startsWith("|"));

            const entry = `${username}|${className}:${ready ? 1 : 0}:${nowSeconds()}`;

            const idx = lines.findIndex((l) => {
                const existingKey = l.split(":")[0].split("|");
                return existingKey.length >= 1 && existingKey[0] === username;
            });

            if (idx >= 0) lines[idx] = entry;
            else lines.push(entry);

            yeet(path, lines);
        };

        const howMany = (path: string): number => {
            const lines = slurp(path);
            const now = nowSeconds();
            const staleThreshold = 600; // 10 minutes
            const valid: string[] = [];

            for (const line of lines) {
                const parts = line.split(":");
                if (parts.length < 3) continue;
                if (!/^\d+$/.test(parts[2])) continue;
                if (now - Number(parts[2]) <= staleThreshold) valid.push(line);
            }

            // Rewrite file only if we cleaned something out
            if (valid.length !== lines.length) yeet(path, valid);

            return valid.filter((l) => l.split(":")[1] === "1").length;
        };

        // --- Initialize sync file ---
        const syncFile = this.resolveSyncPath(syncFilePath);
        // C# also empties a file not written for 15 minutes; Turu's log has no write time, and its
        // stale lines (10 minutes) are dropped by howMany anyway.
        const existing = slurp(syncFile);
        if (existing.length === 0 || existing.every((l) => l.endsWith(":1"))) yeet(syncFile, []);

        const me = `${bot.player.username || "Nobody"}|${bot.player.currentClass || "Peasant"}`.replaceAll(":", "-");
        const need = quantity === 0 ? 1 : Math.max(1, quantity) + 1;

        poke(syncFile, me, false);

        const started = Date.now();
        let lastReady = -1;

        // --- Wait for army readiness ---
        while (!bot.shouldExit) {
            const ready = howMany(syncFile);
            if (ready !== lastReady) {
                lastReady = ready;
                bot.log(`[WaitForArmy] Ready: ${ready}/${need}`);
            }

            if (ready >= need) {
                bot.log("[WaitForArmy] All members ready!");
                break;
            }

            poke(syncFile, me, true);

            if (timeoutMs > 0 && Date.now() - started >= timeoutMs) {
                bot.log("[WaitForArmy] Timeout reached — continuing anyway.");
                break;
            }

            bot.sleep(tickMs);
        }

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

        yeet(syncFile, []);
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

        const lines = this.readLines(path).filter((l) => l.trim());
        const entry = `${key}:${payload}:${nowSeconds()}`;

        const idx = lines.findIndex((l) => {
            const parts = l.split(":");
            return parts.length > 0 && parts[0].toLowerCase() === key.toLowerCase();
        });

        if (idx >= 0) lines[idx] = entry;
        else lines.push(entry);

        bot.army.writeLog(path, lines);
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

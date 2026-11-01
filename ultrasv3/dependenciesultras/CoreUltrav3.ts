/*
name: null
description: null
tags: null
*/
// Port of Scripts/Ultrasv3/DependenciesUltras/CoreUltrav3.cs.
//
// Turu: the sync members are army/CoreArmySync.ts's (the Entwined Eclipse copy of CoreUltra, which
// differs from this one only in how it locks and retries the file). A sync file is `bot.army`'s
// shared log of that name, so EquipClassSync's "file older than 15 minutes" is "no line newer than
// 15 minutes".

import { bot, type EventMap } from "turu";
import { CoreArmySync } from "../../army/CoreArmySync";
import { CapeSpecial, CoreAdvanced, EnhancementType, HelmSpecial, WeaponSpecial } from "../../core/CoreAdvanced";
import { Core, rethrowIfStopped } from "../../core/CoreBots";
import { CoreEnginev3 } from "./CoreEnginev3";

const Adv = new CoreAdvanced();

/** C#'s `DateTimeOffset.UtcNow.ToUnixTimeSeconds()`. */
export function nowSeconds(): number {
    return Math.floor(Date.now() / 1000);
}

/** C#'s `long.TryParse` of a line's last `:` field, the time it was written; null if it isn't one. */
export function lineTime(parts: string[]): number | null {
    const last = parts[parts.length - 1];
    return /^-?\d+$/.test(last) ? Number(last) : null;
}

/**
 * Minutes since the sync file was last written (C#'s `File.GetLastWriteTimeUtc`), or null for a
 * file with no lines (C#'s missing file). Turu: a sync file is `bot.army`'s log, so this is the age
 * of its newest timestamped line.
 */
export function syncFileAgeMinutes(ultra: CoreArmySync, path: string): number | null {
    const times = ultra
        .readLines(path)
        .map((l) => lineTime(l.split(":")))
        .filter((t) => t != null);
    if (times.length === 0) return null;
    return (nowSeconds() - Math.max(...times)) / 60;
}

/** C#'s `Guid.NewGuid().ToString()`, the name used when there's no username. */
export function newGuid(): string {
    const hex = (n: number): string =>
        Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    return `${hex(8)}-${hex(4)}-4${hex(3)}-${hex(4)}-${hex(12)}`;
}

/** C#'s `StringComparer.OrdinalIgnoreCase` ordering. */
export function compareIgnoreCase(a: string, b: string): number {
    const x = a.toUpperCase();
    const y = b.toUpperCase();
    return x < y ? -1 : x > y ? 1 : 0;
}

export function sameText(a: string, b: string): boolean {
    return a.toLowerCase() === b.toLowerCase();
}

export class CoreUltrav3 extends CoreArmySync {
    /**
     * C#'s `Core`, the engine these members use: CoreEnginev3's instance here; Entwined Eclipse's
     * CoreUltra uses its own CoreEngine.
     */
    protected get engine(): UltraEngine {
        return CoreEnginev3.instance;
    }

    test(): void {
        bot.log("NewCore interface OK!");
    }

    /**
     * C#'s two `Taunt` overloads (target by name or by map ID): attacks `target` and, with your
     * `className` on, taunts on the `"aura"` (the aura about to run out) or `"charge"` mode.
     */
    taunt(className: string, target: string | number, mode: string, delayMs = 0, aura: string | null = null): void {
        if (!className?.trim() || (typeof target === "number" ? target <= 0 : !target?.trim())) {
            return;
        }

        if (!bot.player.alive) {
            bot.wait.forTrue(() => bot.player.alive, 20);
        }

        if (!bot.inventory.isEquipped(className)) {
            return;
        }

        bot.combat.attack(target);
        if (delayMs > 0) {
            bot.sleep(delayMs);
        }

        switch (mode) {
            case "aura":
                if (aura?.trim() && this.engine.getAuraSecondsRemaining(aura) < 1) {
                    bot.log("UseTaunt");
                    this.useTaunt();
                }
                break;

            case "charge":
                // The by-name overload watches `aura`; the by-ID one watches "Focus".
                if (typeof target === "string") {
                    if (
                        aura?.trim() &&
                        this._chargeDetected &&
                        !bot.target.auras.some((x) => x != null && x.name.toLowerCase() === aura.toLowerCase())
                    ) {
                        this.useTaunt();
                    }
                } else if (this._chargeDetected && !hasFocus()) {
                    this.useTaunt();
                }
                break;
        }
    }

    killWithPriority(
        primaryName: string,
        primaryMapId: number,
        priorityName1: string,
        priorityMapId1: number,
        priorityName2: string,
        priorityMapId2: number,
    ): void {
        const engine = this.engine;
        if (!primaryName?.trim()) {
            return;
        }
        if (priorityName1?.trim() && engine.isAliveByMapId(priorityMapId1, priorityName1)) {
            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);
            }
            this.killByMapId(priorityMapId1, priorityName1);
        } else if (priorityName2?.trim() && engine.isAliveByMapId(priorityMapId2, priorityName2)) {
            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);
            }
            this.killByMapId(priorityMapId2, priorityName2);
        } else {
            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);
            }
            this.killByMapId(primaryMapId, primaryName);
        }
        bot.sleep(engine.d1);
    }

    killByMapId(mapId: number, name: string | null = null, id: number | null = null): void {
        if (!bot.player.alive) {
            bot.wait.forTrue(() => bot.player.alive, 20);
        }

        if (this.engine.isAliveByMapId(mapId, name, id)) {
            bot.combat.attack(mapId);
            bot.sleep(250);
        }
    }

    monsterAlive(name: string): boolean {
        return (
            (bot.player.alive || bot.wait.forTrue(() => bot.player.alive, 20)) &&
            !!name?.trim() &&
            (bot.monsters?.mapMonsters?.some((m) => (m?.name ?? "").toLowerCase() === name.toLowerCase() && m.hp > 0) ??
                false)
        );
    }

    ultraWardenTaunter(): void {
        const mob = "Ultra Warden";
        bot.combat.attack(mob);

        const t = bot.player.target;
        if (t == null) {
            return;
        }
        if (t.hp <= 0) {
            return;
        }
        if (t.maxHp <= 0) {
            return;
        }

        const hp = t.hp;
        const max = t.maxHp;

        const pct = Math.trunc((hp * 100) / max);
        const band5 = Math.trunc(pct / 5) * 5;

        const key = "warden.bands";
        const seen = (appData.get(key) as Set<number> | undefined) ?? new Set<number>();

        if (!seen.has(band5)) {
            seen.add(band5);
            appData.set(key, seen);

            while (!bot.shouldExit && this.monsterAlive(mob) && !hasFocus()) {
                this.engine.usePotion();
            }
        }

        bot.sleep(150);
    }

    drakathTaunter(): void {
        bot.combat.attack("Champion Drakath");
        const dummy = bot.player.target;
        if (dummy == null || dummy.hp <= 0) {
            return;
        }

        const bands = [90, 80, 70, 60, 50, 40, 30, 20, 10];
        const wiggle = 1.5;
        let lastBand = Number.MAX_SAFE_INTEGER;
        let oldPct = 100.0;
        let oldMs = 0;

        let tmp = appData.get("drakath.lastThreshold");
        if (tmp != null) {
            lastBand = tmp as number;
        }

        tmp = appData.get("drakath.prevPercentage");
        if (tmp != null) {
            oldPct = tmp as number;
        }

        tmp = appData.get("drakath.lastFireTicks");
        if (tmp != null) {
            oldMs = tmp as number;
        }

        const nowPct = this.engine.getTargetHealthPercentage();
        const nowMs = Date.now();
        const cooledDown = nowMs - oldMs >= 1200;

        let triggered = false;
        let hitBand = 0;

        for (const band of bands) {
            if (band < lastBand) {
                const hi = band + wiggle;
                const lo = band - wiggle;
                const wasHigh = oldPct > hi;
                const inZone = nowPct >= lo && nowPct <= hi;

                if (wasHigh && inZone) {
                    triggered = true;
                    hitBand = band;
                    break;
                }
            }
        }

        if (cooledDown && triggered) {
            appData.set("drakath.lastThreshold", hitBand);
            appData.set("drakath.lastFireTicks", nowMs);

            const giveUp = Date.now() + 3000;

            while (!bot.shouldExit && Date.now() < giveUp) {
                if (!bot.player.hasTarget) {
                    bot.combat.attack("Champion Drakath");
                }
                this.useTaunt();
                if (!bot.player.hasTarget) {
                    bot.combat.attack("Champion Drakath");
                }
                if (hasFocus()) {
                    break;
                }
                bot.sleep(120);
            }
        }

        appData.set("drakath.prevPercentage", nowPct);
        bot.sleep(120);
    }

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

    // --- next set ---------------------------------------------------------------

    getScrollOfEnrage(): void {
        const engine = this.engine;
        const desiredCount = 200;

        if (!engine.faction("SpellCrafting", 5)) {
            return;
        }

        const parchment = "Mystic Parchment";
        const ink = "Zealous Ink";
        const scroll = "Scroll of Enrage";

        while (!Core.checkInventory(scroll, desiredCount)) {
            // Mats
            engine.forItem("Undead Infantry", "underworld", parchment, 2);
            engine.buyItem(ink, 549, "dragonrune", 5, { calculateRemaining: false });

            // Craft
            engine.join("spellcraft");
            bot.drops.add(scroll);
            bot.send.packet("%xt%zm%crafting%1%spellOnStart%7%1555%Spell%");
            bot.sleep(5000);
            bot.send.packet("%xt%zm%crafting%1%spellComplete%7%2330%Enrage%");

            engine.waitForDrop(scroll, 10000);
            engine.pickup(scroll);
            bot.drops.remove(scroll);

            if (bot.shouldExit) {
                break;
            }
        }

        engine.equipEnrage();
    }

    /** C#'s `UseTaunt()` and `UseTaunt(int target)`: casts skill 5 until the target has Focus. */
    useTaunt(target?: number): void {
        const engine = this.engine;
        if (target === undefined) {
            // Dead → wait for respawn
            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);
            }

            while (!bot.shouldExit && !hasFocus()) {
                engine.cast(5);
                bot.sleep(100);
            }
            return;
        }

        // Attack the target first
        bot.combat.attack(target);
        bot.sleep(200);

        // Then apply taunt
        while (!bot.shouldExit && !hasFocus()) {
            engine.cast(5);
            bot.sleep(200);
        }
    }

    getScrollOfDecay(): void {
        const engine = this.engine;
        if (!engine.faction("SpellCrafting", 5)) {
            return;
        }

        const parchment = "Mystic Parchment";
        const ink = "Zealous Ink";
        const scroll = "Scroll of Decay";

        while (!Core.checkInventory(scroll, 20)) {
            engine.forItem("Undead Infantry", "underworld", parchment, 2);
            engine.buyItem(ink, 549, "dragonrune", 5, { calculateRemaining: false });

            engine.join("spellcraft");
            bot.drops.add(scroll);
            bot.send.packet("%xt%zm%crafting%1%spellOnStart%7%1555%Spell%");
            bot.sleep(5000);
            bot.send.packet("%xt%zm%crafting%1%spellComplete%7%2331%Decay%");

            engine.waitForDrop(scroll, 5000);
            engine.pickup(scroll);
        }

        engine.equipConsumable(scroll);
    }

    getDivineElixir(): void {
        const engine = this.engine;
        engine.forItem("Xavier Lionfang", "poisonforest", "Divine Elixir");
        engine.equipConsumable("Divine Elixir");
        engine.usePotion();
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

    //#region Alchemy
    useAlchemyPotions(...names: string[]): void {
        const engine = this.engine;
        if (names.length === 0) {
            return;
        }

        const auraOf = (x: string): string => (x === "Might Tonic" ? "Might" : x === "Sage Tonic" ? "Sage" : x);
        const hasAura = (aura: string): boolean => bot.self.auras.some((a) => a != null && a.name === aura);

        const seen = new Set<string>();
        for (const raw of names) {
            if (!raw?.trim()) {
                continue;
            }
            if (seen.has(raw.toLowerCase())) {
                continue;
            }
            seen.add(raw.toLowerCase());

            const aura = auraOf(raw);
            if (hasAura(aura)) {
                engine.log("POTION", `🟢 Already on: ${aura}`);
                continue;
            }

            engine.log("POTION", `🧪 Queueing: ${raw} (${aura})`);
            this.buyAlchemyPotion(raw);

            for (let tries = 0; tries < 3 && !hasAura(aura) && !bot.shouldExit; tries++) {
                engine.equipConsumable(raw);
                if (bot.inventory.isEquipped(raw)) {
                    engine.usePotion();
                    const t0 = Date.now();
                    while (!bot.shouldExit && !hasAura(aura) && Date.now() - t0 < 1500) {
                        bot.sleep(50);
                    }
                } else {
                    bot.sleep(200);
                }
            }

            if (hasAura(aura)) {
                engine.log("POTION", `✅ Applied: ${aura}`);
            } else {
                engine.log("POTION", `❌ Nope: ${raw} (${aura})`);
            }
        }
    }

    buyAlchemyPotion(n: string): void {
        const engine = this.engine;
        if (!n?.trim() || Core.checkInventory(n)) {
            if (n?.trim()) {
                engine.log("POTION", `🧴 Have: ${n}`);
            }
            return;
        }

        const shop = 2036;
        const map = "alchemyacademy";
        const voucher = "Gold Voucher 500k";

        const needV = (want: number): void => {
            const miss = Math.max(0, want - bot.inventory.getQuantity(voucher));
            if (miss > 0) {
                engine.log("POTION", `💰 Need ${miss}× ${voucher}`);
                engine.buyItem(voucher, shop, map, miss);
            }
        };

        const grab = (count: number): void => {
            engine.log("POTION", `🛒 ${n} ×${count}`);
            engine.buyItem(n, shop, map, count, { calculateRemaining: false });
        };

        switch (n) {
            case "Might Tonic":
                if (!engine.faction("Alchemy", 8)) {
                    engine.log("POTION", "⛔ Alchemy rep 8 required");
                    return;
                }
                needV(2);
                grab(10);
                break;

            case "Sage Tonic":
                if (!engine.faction("Alchemy", 8)) {
                    engine.log("POTION", "⛔ Alchemy rep 8 required");
                    return;
                }
                needV(2);
                grab(10);
                break;

            case "Potent Malevolence Elixir":
                needV(4);
                grab(8);
                break;

            case "Potent Battle Elixir":
                needV(4);
                grab(8);
                break;

            case "Potent Honor Potion":
                if (!engine.faction("Good", 10)) {
                    engine.log("POTION", "⛔ Good rep 10 required");
                    return;
                }
                needV(1);
                grab(5);
                break;

            default:
                engine.log("POTION", `❓ Unknown: ${n}`);
                return;
        }
    }

    /** Might Tonic for a STR build, else Sage Tonic. */
    getBestTonicPotion(): string {
        const engine = this.engine;
        const str = engine.getStatValue("STR");
        const intel = engine.getStatValue("INT");
        const pick = str > intel ? "Might Tonic" : "Sage Tonic";
        engine.log("Potion", `🧪 Tonic → ${pick} (STR ${str}, INT ${intel})`);
        return pick;
    }

    /** Potent Battle Elixir for a STR build, else Potent Malevolence Elixir. */
    getBestElixirPotion(): string {
        const engine = this.engine;
        const str = engine.getStatValue("STR");
        const intel = engine.getStatValue("INT");
        const pick = str > intel ? "Potent Battle Elixir" : "Potent Malevolence Elixir";
        engine.log("Potion", `🧪 Elixir → ${pick} (STR ${str}, INT ${intel})`);
        return pick;
    }

    //#endregion

    // --- next set ---------------------------------------------------------------

    //#region Listeners
    private _chargeDetected = false;
    private _chargeSeq = 0;

    /**
     * Subscribe with `bot.events.on("extensionPacket", ultra.genericChargeListener)`: a "Charge"
     * animation in a `ct` packet sets the charge flag `Taunt`'s "charge" mode reads, for 3 s after
     * the latest one. Turu: C#'s `await Task.Delay(3000)` is a one-off handler.
     */
    genericChargeListener = (packet: EventMap["extensionPacket"]): void => {
        try {
            if (String(packet?.["params"]?.type ?? "") !== "json") {
                return;
            }
            const data = packet["params"].dataObj;
            if (String(data?.cmd ?? "") !== "ct") {
                return;
            }

            const anims = data?.anims;
            if (anims == null || typeof anims !== "object") {
                return;
            }

            for (const anim of Object.values(anims) as { animStr?: unknown }[]) {
                if (String(anim?.animStr ?? "").toLowerCase() === "charge") {
                    this._chargeDetected = true;

                    // mark this as the latest charge
                    const mySeq = ++this._chargeSeq;

                    // wait 3s; only clear if no newer charge happened
                    bot.handlers.once(`UltraCharge${mySeq}`, 3000, () => {
                        if (mySeq === this._chargeSeq) {
                            this._chargeDetected = false;
                        }
                    });

                    break;
                }
            }
        } catch (error) {
            rethrowIfStopped(error);
        }
    };

    enhancements(): void {
        const playerName = bot.player?.username;
        if (!playerName?.trim()) {
            Core.logger("[ERROR] Unable to determine player name.", undefined, { stopBot: true });
            return;
        }

        // Cache currently equipped items
        const weaponItem = bot.inventory?.items?.find(
            (x) => x?.equipped === true && Adv.weaponCatagories.includes(x.category),
        );
        const helmItem = bot.inventory?.items?.find((x) => x?.equipped === true && x.category === "Helm");
        const capeItem = bot.inventory?.items?.find((x) => x?.equipped === true && x.category === "Cape");
        const weapon = weaponItem?.name ?? "";
        const helm = helmItem?.name ?? "";
        const cape = capeItem?.name ?? "";
        const className = bot.player?.currentClass ?? "";
        Core.logger(`[Enhancement]\nClass: ${className}\nWeapon: ${weapon}\nHelm: ${helm}\nCape: ${cape}`, "info");
        // Apply enhancement rules per role
        switch (className.toLowerCase()) {
            case "chaos avenger":
                Adv.enhanceItem(helm, EnhancementType.Lucky, { hSpecial: HelmSpecial.Anima });
                Adv.enhanceItem(className, EnhancementType.Lucky);
                Adv.enhanceItem(weapon, EnhancementType.Lucky, { wSpecial: WeaponSpecial.Dauntless });
                Adv.enhanceItem(cape, EnhancementType.Lucky, { cSpecial: CapeSpecial.Vainglory });
                break;

            case "archpaladion":
                Adv.enhanceItem(helm, EnhancementType.Lucky, { hSpecial: HelmSpecial.Forge });
                Adv.enhanceItem(className, EnhancementType.Lucky);
                Adv.enhanceItem(weapon, EnhancementType.Lucky, { wSpecial: WeaponSpecial.Dauntless });
                Adv.enhanceItem(cape, EnhancementType.Lucky, { cSpecial: CapeSpecial.Lament });
                break;

            case "legion revenant":
                Adv.enhanceItem(helm, EnhancementType.Lucky, { hSpecial: HelmSpecial.Pneuma });
                Adv.enhanceItem(className, EnhancementType.Wizard);
                Adv.enhanceItem(weapon, EnhancementType.Wizard, { wSpecial: WeaponSpecial.Dauntless });
                Adv.enhanceItem(cape, EnhancementType.Wizard, { cSpecial: CapeSpecial.Vainglory });
                break;

            case "archfiend":
                Adv.enhanceItem(helm, EnhancementType.Lucky, { hSpecial: HelmSpecial.Forge });
                Adv.enhanceItem(className, EnhancementType.Lucky);
                Adv.enhanceItem(weapon, EnhancementType.Lucky, { wSpecial: WeaponSpecial.Dauntless });
                Adv.enhanceItem(cape, EnhancementType.Lucky, { cSpecial: CapeSpecial.Vainglory });
                break;

            case "arachnomancer":
                Adv.enhanceItem(helm, EnhancementType.Lucky, { hSpecial: HelmSpecial.Anima });
                Adv.enhanceItem(className, EnhancementType.Lucky);
                Adv.enhanceItem(weapon, EnhancementType.Lucky, { wSpecial: WeaponSpecial.Dauntless });
                Adv.enhanceItem(cape, EnhancementType.Lucky, { cSpecial: CapeSpecial.Vainglory });
                break;

            case "king's echo":
                Adv.enhanceItem(helm, EnhancementType.Lucky, { hSpecial: HelmSpecial.Pneuma });
                Adv.enhanceItem(className, EnhancementType.Lucky);
                Adv.enhanceItem(weapon, EnhancementType.Lucky, { wSpecial: WeaponSpecial.Dauntless });
                Adv.enhanceItem(cape, EnhancementType.Lucky, { cSpecial: CapeSpecial.Lament });
                break;

            case "chrono shadowslayer":
            case "chrono shadowhunter":
                Adv.enhanceItem(helm, EnhancementType.Lucky, { hSpecial: HelmSpecial.Vim });
                Adv.enhanceItem(className, EnhancementType.Lucky);
                Adv.enhanceItem(weapon, EnhancementType.Lucky, { wSpecial: WeaponSpecial.Health_Vamp });
                Adv.enhanceItem(cape, EnhancementType.Lucky, { cSpecial: CapeSpecial.Lament });
                break;

            case "quantum chronomancer":
                Adv.enhanceItem(helm, EnhancementType.Lucky, { hSpecial: HelmSpecial.Anima });
                Adv.enhanceItem(className, EnhancementType.Lucky);
                Adv.enhanceItem(weapon, EnhancementType.Lucky, { wSpecial: WeaponSpecial.Dauntless });
                Adv.enhanceItem(cape, EnhancementType.Lucky, { cSpecial: CapeSpecial.Vainglory });
                break;

            case "phantom chronomancer":
                Adv.enhanceItem(helm, EnhancementType.Wizard, { hSpecial: HelmSpecial.Pneuma });
                Adv.enhanceItem(className, EnhancementType.Wizard);
                Adv.enhanceItem(weapon, EnhancementType.Wizard, { wSpecial: WeaponSpecial.Dauntless });
                Adv.enhanceItem(cape, EnhancementType.Wizard, { cSpecial: CapeSpecial.Vainglory }); // or Lament if needed
                break;

            case "infinity knight":
                Adv.enhanceItem(helm, EnhancementType.Lucky, { hSpecial: HelmSpecial.Pneuma });
                Adv.enhanceItem(className, EnhancementType.Wizard);
                Adv.enhanceItem(weapon, EnhancementType.Lucky, { wSpecial: WeaponSpecial.Dauntless });
                Adv.enhanceItem(cape, EnhancementType.Wizard, { cSpecial: CapeSpecial.Vainglory });
                break;

            case "lich":
                Adv.enhanceItem(helm, EnhancementType.Lucky, { hSpecial: HelmSpecial.Examen });
                Adv.enhanceItem(className, EnhancementType.Lucky);
                Adv.enhanceItem(weapon, EnhancementType.Lucky, { wSpecial: WeaponSpecial.Ravenous });
                Adv.enhanceItem(cape, EnhancementType.Lucky, { cSpecial: CapeSpecial.Penitence });
                break;

            case "verus doomknight":
                Adv.enhanceItem(helm, EnhancementType.Lucky, { hSpecial: HelmSpecial.Anima });
                Adv.enhanceItem(className, EnhancementType.Lucky);
                Adv.enhanceItem(weapon, EnhancementType.Lucky, { wSpecial: WeaponSpecial.Dauntless });
                Adv.enhanceItem(cape, EnhancementType.Lucky, { cSpecial: CapeSpecial.Vainglory });
                break;

            case "hollowborn vindicator":
                Adv.enhanceItem(helm, EnhancementType.Lucky, { hSpecial: HelmSpecial.Forge });
                Adv.enhanceItem(className, EnhancementType.Lucky);
                Adv.enhanceItem(weapon, EnhancementType.Lucky, { wSpecial: WeaponSpecial.Dauntless });
                Adv.enhanceItem(cape, EnhancementType.Lucky, { cSpecial: CapeSpecial.Penitence });
                break;

            case "great thief":
                Adv.enhanceItem(helm, EnhancementType.Lucky, { hSpecial: HelmSpecial.Forge }); // or Vim if needed
                Adv.enhanceItem(className, EnhancementType.Lucky);
                Adv.enhanceItem(weapon, EnhancementType.Lucky, { wSpecial: WeaponSpecial.Dauntless }); // or Lucky HealthVamp
                Adv.enhanceItem(cape, EnhancementType.Lucky, { cSpecial: CapeSpecial.Vainglory });
                break;

            case "dragon of time":
                Adv.enhanceItem(helm, EnhancementType.Wizard, { hSpecial: HelmSpecial.Pneuma }); // or Vim if needed
                Adv.enhanceItem(className, EnhancementType.Wizard);
                Adv.enhanceItem(weapon, EnhancementType.Lucky, { wSpecial: WeaponSpecial.Elysium }); // or Lucky HealthVamp
                Adv.enhanceItem(cape, EnhancementType.Lucky, { cSpecial: CapeSpecial.Vainglory });
                break;

            case "arcana invoker":
                Adv.enhanceItem(helm, EnhancementType.Wizard, { hSpecial: HelmSpecial.Examen }); // or Vim if needed
                Adv.enhanceItem(className, EnhancementType.Lucky);
                Adv.enhanceItem(weapon, EnhancementType.Lucky, {
                    wSpecial: Adv.uRavenous() ? WeaponSpecial.Ravenous : WeaponSpecial.Valiance,
                }); // or Lucky HealthVamp
                Adv.enhanceItem(cape, EnhancementType.Lucky, { cSpecial: CapeSpecial.Vainglory });
                break;
        }
    }

    // You can either make a secondary void or add all of the below to the first one under the first item.
    armyHandler(
        map: string,
        questIds: number[],
        waitForArmySyncPath: string,
        aggroCell: string,
        checkType: CheckType,
        itemName: string | null = null,
        quant = 0,
        isTemp = false,
        useBool = false,
        condition: (() => boolean) | null = null,
        playerCount = 0,
        questReward: string | null = null,
    ): void {
        // Sync file used to keep track of what accs are done.
        const syncPath = this.resolveSyncPath(waitForArmySyncPath);
        this.clearSyncFile(waitForArmySyncPath);

        // Log Players in current army.
        Core.logger(`Players in Curreny Army: ${playerCount}`);

        // Uncomment below, and add any questids that are used for this portion
        // Core.registerQuests(1,2,3);
        if (questReward != null) {
            Core.addDrop(questReward);
        }

        this.engine.join(map);

        Core.jump(aggroCell, "Left");

        // Don't Touch vv
        if (playerCount > 1) {
            // Dont make this the same as the syncPath
            this.waitForArmy(playerCount - 1, waitForArmySyncPath);
        }
        bot.player.setSpawnPoint();
        bot.sleep(1500);
        bot.options.aggroMonsters = true;
        // Pick a variant below ( multiple can be used as long as the sync files are different.)

        if (useBool && condition != null) {
            // Bool variant
            while (!bot.shouldExit) {
                // Replace the `bot.player.level >= 100` below with the bool
                // you want want all accs to have true, leave the rest of this alone.
                if (this.checkArmyProgressBool(condition, syncPath)) {
                    bot.options.aggroMonsters = false;
                    Core.jump("Enter", "Spawn");
                    Core.logger("All players finished farm.");
                    break;
                }
                // Dead → wait for respawn
                if (!bot.player.alive) {
                    bot.wait.forTrue(() => bot.player.alive, 20);
                    continue;
                }

                bot.combat.attack("*");
                bot.sleep(500);
            }
            return;
        }

        if (itemName != null) {
            //Int variant
            while (!bot.shouldExit) {
                // Replace `itemName` with the wanted item
                // Replace the 500 with the quantity you desire
                // Replace `false` if the item is a temp item with `true` or leave as `false` for non-temp items.
                if (this.checkArmyProgress(itemName, quant, false, syncPath)) {
                    bot.options.aggroMonsters = false;
                    Core.jump("Enter", "Spawn");
                    Core.logger("All players finished farm.");
                    break;
                }

                // Dead → wait for respawn
                if (!bot.player.alive) {
                    bot.wait.forTrue(() => bot.player.alive, 20);
                    continue;
                }

                bot.combat.attack("*");
                bot.sleep(500);
            }
            return;
        }
    }

    //#endregion

    /**
     * Joins the player's house and keeps retrying until successful. Unlike {@link joinHouse}, this
     * never gives up — it loops until the map is "house". Call this when you absolutely must land
     * in the house before proceeding.
     */
    persistentJoinHouse(): void {
        if (bot.player.inCombat || bot.player.hasTarget) {
            Core.jumpWait();
        }

        // No house equipped → fall back to Yulgar (can't retry what doesn't exist)
        if (!bot.house.items.some((h) => h.equipped)) {
            Core.logger("[CoreUltra] No house available, falling back to Yulgar.");
            Core.join("yulgar-100000");
            return;
        }

        while (!bot.shouldExit) {
            try {
                // Go to whitemap to disengage from combat/boss map
                Core.join("whitemap-100000");
                // De-aggro after joining safe map
                Core.jumpWait();

                let toSend: string | null = null;

                const modifyPacket = (packet: EventMap["extensionPacket"]): void => {
                    try {
                        const type = packet["params"].type;
                        const data = packet["params"].dataObj;
                        if (type === "json" && data.houseData != null) {
                            toSend = JSON.stringify(packet);
                        }
                    } catch (error) {
                        rethrowIfStopped(error);
                    }
                };

                bot.events.on("extensionPacket", modifyPacket);
                bot.send.packet(`%xt%zm%house%1%${bot.player.username}%`);

                if (bot.wait.forTrue(() => toSend != null, 20)) {
                    bot.send.clientPacket(toSend!, "json");
                }

                bot.wait.forMapLoad("house");
                bot.events.off("extensionPacket", modifyPacket);

                for (let i = 0; i < 7; i++) {
                    bot.send.clientServer(" ", "");
                }

                if (bot.map.name?.toLowerCase() === "house") {
                    return; // success
                }
            } catch (ex) {
                rethrowIfStopped(ex);
                Core.logger(`[CoreUltra] PersistentJoinHouse failed: ${ex instanceof Error ? ex.message : String(ex)}`);
            }

            bot.sleep(1000);
        }
    }
}

/** What CoreUltrav3 uses of its engine (CoreEnginev3, or Entwined Eclipse's CoreEngine). */
export type UltraEngine = Pick<
    CoreEnginev3,
    | "buyItem"
    | "cast"
    | "d1"
    | "equipConsumable"
    | "equipEnrage"
    | "faction"
    | "forItem"
    | "getAuraSecondsRemaining"
    | "getStatValue"
    | "getTargetHealthPercentage"
    | "isAliveByMapId"
    | "join"
    | "log"
    | "pickup"
    | "usePotion"
    | "waitForDrop"
>;

/** C#'s `CoreUltrav3.CheckType`. */
export enum CheckType {
    Bool = 1,
    Item = 2,
}

/** C#'s `AppDomain.CurrentDomain.GetData/SetData` slots the taunters keep between calls. */
const appData = new Map<string, unknown>();

/** The target has the Focus aura (a taunt landed). */
function hasFocus(): boolean {
    return bot.target.auras.some((a) => a != null && a.name === "Focus");
}

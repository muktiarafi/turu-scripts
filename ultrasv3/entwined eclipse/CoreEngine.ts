/*
name: null
description: null
tags: null
*/
// Port of Scripts/Ultrasv3/Entwined Eclipse/CoreEngine.cs, the older engine the Entwined Eclipse
// scripts run on (Ultrasv3/DependenciesUltras/CoreEnginev3.cs is its newer copy).
//
// Turu: C#'s `Task.Run(() => SkillsAsync(token))` is the `UltraSkills` task of core/CoreTasks.ts,
// stepped every 100 ms (`skillsDelay`) between the script's bot calls; DisableSkills cancels it.
// A rotation that waits (Chrono ShadowSlayer's `Wait.ForTrue`, the 100 ms sleeps) pauses the whole
// script for that long, where C# only paused its skill thread.
// `OnSignal` (an event only Boot subscribes to) logs straight away.

import {
    type Aura,
    bot,
    type EventMap,
    type InventoryItem,
    type Monster,
    type PlayerStats,
    type QuestItem,
    type ShopItem,
} from "turu";
import { CapeSpecial, CoreAdvanced, EnhancementType, HelmSpecial, WeaponSpecial } from "../../core/CoreAdvanced";
import { Core, rethrowIfStopped } from "../../core/CoreBots";
import { type TaskStep, tasks, until } from "../../core/CoreTasks";

const Adv = new CoreAdvanced();

export class CoreEngine {
    readonly _cache: Map<string, unknown | null> = new Map();
    readonly _throttle: Map<string, number> = new Map();

    /** C#'s `_runSkills`: the name of the skill loop's task. */
    private static readonly SKILLS_TASK = "EclipseSkills";

    throttleDuration: number = 3 * 1000;
    /** C#'s `OnSignal`: Boot subscribes `Bot.Log` to it, OnScriptStopping removes it. */
    private signalOn = false;

    //#region Settings
    d1 = 250;
    d2 = 700;
    d3 = 1400;
    d4 = 2800;

    boot(): void {
        if (tasks.running(CoreEngine.SKILLS_TASK)) {
            return;
        }

        this.signalOn = true;

        bot.events.on("scriptStopping", this.onScriptStopping);
        bot.ultraBossHelper.disableCounterAttack();

        tasks.start(CoreEngine.SKILLS_TASK, () => this.skillsAsync());

        this.log("SKUA", "System online");

        this.chill();

        bot.bank.open();

        if (bot.bank.items == null || bot.bank.items.length === 0) {
            bot.bank.load();
            bot.wait.forTrue(() => (bot.bank.items?.length ?? 0) > 0, 20);
        }

        bot.options.safeTimings = true;
        bot.options.infiniteRange = true;
        bot.options.skipCutscenes = true;
        bot.lite.hidePlayers = true;
        bot.drops.start();
        Core.join("whitemap-100000");
    }

    onScriptStopping = (_e: EventMap["scriptStopping"]): boolean => {
        this.disableSkills();
        Core.jumpWait();
        Core.logger("System offline");

        bot.lite.hidePlayers = false;

        // C# cancels the skill task and waits up to 2 s for it; the task is cancelled at once here.
        tasks.cancel(CoreEngine.SKILLS_TASK);
        this.signalOn = false;

        this._cache.clear();
        this._throttle.clear();

        bot.skills.stop();
        return true;
    };

    //#endregion
    //#region Quest
    waitQuest(questId: number): void {
        if (bot.quests.hasBeenCompleted(questId)) {
            return;
        }

        if (!this.isAvailable(questId)) {
            return;
        }

        while (!this.canCompleteFullCheck(questId) && !bot.shouldExit) {
            bot.sleep(2000);
        }

        if (this.canCompleteFullCheck(questId)) {
            bot.quests.complete(questId);
            bot.wait.forQuestComplete(questId);
        }
    }

    /**
     * C#'s five `KillQuest` overloads: `(questId, map, monster[, jumpCell[, jumpPad]])`, or the
     * quantity, temp, best gear, alt jump, cell, pad and priority settings as options.
     */
    killQuest(questId: number, map: string, monster: string, jumpCell?: string, jumpPad?: string): void;
    killQuest(questId: number, map: string, monster: string, opts: KillQuestOptions): void;
    killQuest(
        questId: number,
        map: string,
        monster: string,
        cellOrOpts?: string | KillQuestOptions,
        jumpPad?: string,
    ): void {
        if (typeof cellOrOpts === "string" || cellOrOpts === undefined) {
            this.killQuestCore(questId, map, monster, "", 1, true, false, false, cellOrOpts ?? null, jumpPad ?? "Left");
            return;
        }
        const o = cellOrOpts;
        this.killQuestCore(
            questId,
            map,
            monster,
            "",
            o.quantity ?? 1,
            o.isTemp ?? true,
            o.useBestGear ?? false,
            o.altJump ?? false,
            o.jumpCell ?? null,
            o.jumpPad ?? "Left",
            o.priority ?? false,
        );
    }

    private killQuestCore(
        questId: number,
        map: string,
        monster: string,
        item: string,
        quantity: number,
        isTemp: boolean,
        useBestGear: boolean,
        altJump: boolean,
        jumpCell: string | null,
        jumpPad = "Left",
        priority = false,
    ): void {
        if (!this.isAvailable(questId)) {
            return;
        }

        const q = bot.quests.ensureLoad(questId);
        if (q == null) {
            return;
        }

        if (!item?.trim()) {
            const reqs = q.requirements;
            if (reqs == null || reqs.length === 0) {
                return;
            }
            if (reqs.length !== 1 || !reqs[0]?.name?.trim()) {
                return;
            }
            item = reqs[0].name;
        }

        if (quantity <= 1 && q.requirements != null) {
            const r = q.requirements.find((x) => !!x?.name?.trim() && x.name.toLowerCase() === item.toLowerCase());
            if (r != null && r.quantity > 0) {
                quantity = r.quantity;
            }
        }

        this.preloadQuestAccept(questId);
        this.join(map);

        this.forItem(monster, map, item, quantity, isTemp, useBestGear, altJump, jumpCell, jumpPad, priority);

        if (this.canCompleteFullCheck(questId)) {
            this.chill(false);
            bot.quests.ensureComplete(questId);
            bot.wait.forQuestComplete(questId);
        }
    }

    isAvailable(id: number): boolean {
        const quest = bot.quests.ensureLoad(id);

        if (quest == null) {
            this.log("QUEST", `[${id}] not found.`);
            return false;
        }

        if (bot.quests.isDailyComplete(id)) {
            this.log("QUEST", `${quest.name} [${id}] is already marked as daily complete.`);
            return false;
        }

        if (!bot.quests.isUnlocked(id)) {
            this.log("QUEST", `${quest.name} [${id}] is locked.`);
            return false;
        }

        if (quest.upgrade && !bot.player.isMember) {
            this.log("QUEST", `${quest.name} [${id}] requires membership.`);
            return false;
        }

        if (bot.player.level < quest.level) {
            this.log("QUEST", `${quest.name} [${id}] requires level ${quest.level}, current ${bot.player.level}.`);
            return false;
        }

        // Turu: `Quest` has no class and faction requirements; they're read from `world.questTree`
        // (C#'s RequiredClassID `iClass`, RequiredClassPoints `iReqCP`, RequiredFactionId
        // `FactionID`, RequiredFactionRep `iReqRep`).
        const questField = (field: string): number => Number(bot.flash.get(`world.questTree.${id}.${field}`)) || 0;

        const requiredClassId = questField("iClass");
        if (requiredClassId > 0) {
            const requiredClassPoints = questField("iReqCP");
            const cp = Number(bot.flash.callGameFunction("world.myAvatar.getCPByID", requiredClassId)) || 0;
            if (cp < requiredClassPoints) {
                this.log("QUEST", `${quest.name} [${id}] requires ${requiredClassPoints} CP, current ${cp}.`);
                return false;
            }
        }

        const requiredFactionId = questField("FactionID");
        if (requiredFactionId > 1) {
            const requiredFactionRep = questField("iReqRep");
            const rep = Number(bot.flash.callGameFunction("world.myAvatar.getRep", requiredFactionId)) || 0;
            if (rep < requiredFactionRep) {
                this.log("QUEST", `${quest.name} [${id}] requires faction rep ${requiredFactionRep}, current ${rep}.`);
                return false;
            }
        }

        if (!quest.acceptRequirements.every((r) => this.ownedAtLeast(r.name, r.quantity))) {
            this.log("QUEST", `${quest.name} [${id}] missing required items.`);
            return false;
        }

        return true;
    }

    canCompleteFullCheck(id: number): boolean {
        if (bot.quests.canComplete(id)) {
            return true;
        }

        const quest = bot.quests.ensureLoad(id);
        if (quest == null) {
            this.log("QUEST", `Quest [${id}] not found.`);
            return false;
        }

        const requirements: QuestItem[] = [...quest.requirements, ...quest.acceptRequirements];

        if (requirements.length === 0) {
            return true;
        }

        for (const item of requirements) {
            if (this.ownedAtLeast(item.name, item.quantity, false)) {
                continue;
            }

            return false;
        }

        return true;
    }

    switchAlignment(id: number): void {
        const alignment = id === 1 ? "Good" : id === 2 ? "Evil" : id === 3 ? "Chaos" : "Unknown";

        bot.send.packet(`%xt%zm%updateQuest%${bot.map.roomId}%41%${id}%`);

        this.log("ALIGNMENT", `Switched to ${alignment} (${id}).`);
    }

    hasBeenCompleted(storyName: string, lastQuestId: number): boolean {
        if (bot.quests.hasBeenCompleted(lastQuestId)) {
            this.log("STORY", `Skipping storyline '${storyName}' — already completed.`);
            return false;
        }

        this.log("STORY", `Starting storyline '${storyName}'.`);
        return true;
    }

    private preloadQuestAccept(questId: number): void {
        if (bot.quests.isInProgress(questId)) {
            return;
        }

        const q0 = bot.quests.ensureLoad(questId);
        if (q0 == null || (q0.upgrade && !bot.player.isMember)) {
            return;
        }

        bot.quests.ensureAccept(questId);
        bot.wait.forQuestAccept(questId);

        const ids = Array.from({ length: 10 }, (_, i) => questId + i);

        for (let tries = 0; tries < 3; tries++) {
            bot.quests.load(...ids);
            bot.sleep(500);
        }

        const slot = q0.slot;
        // Lowercase names: C#'s OrdinalIgnoreCase set.
        const seenReqs = new Set<string>();
        const r0 = q0.requirements?.[0]?.name;
        if (r0?.trim()) {
            seenReqs.add(r0.toLowerCase());
        }

        let changed: boolean;
        do {
            changed = false;
            for (const id of ids) {
                if (id === questId) {
                    continue;
                }

                // C#'s `TryGetQuest`: the quest as the client has it loaded.
                const q = bot.quests.get(id);
                if (
                    q != null &&
                    q.slot === slot &&
                    q.value !== -1 &&
                    !(q.upgrade && !bot.player.isMember) &&
                    !bot.quests.isInProgress(id)
                ) {
                    const reqName = q.requirements?.[0]?.name;
                    if (reqName?.trim() && seenReqs.has(reqName.toLowerCase())) {
                        continue; // same requirement already active
                    }

                    bot.quests.ensureAccept(id);
                    bot.wait.forQuestAccept(id);
                    bot.sleep(700);
                    if (reqName?.trim()) {
                        seenReqs.add(reqName.toLowerCase());
                    }
                    changed = true;
                }
            }
        } while (changed);
    }

    //#endregion
    //#region Items
    forItem(
        monsters: string,
        map: string | null,
        key: string | number,
        quantity = 1,
        isTemp = false,
        useBestGear = false,
        alt = false,
        cell: string | null = null,
        pad = "Left",
        priority = false,
    ): void {
        if (key == null || quantity <= 0) {
            return;
        }

        const targets = (monsters ?? "")
            .replaceAll("|", ",")
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t.length > 0);

        let prioKeys: MonsterKey[] = [];
        if (priority && targets.length > 0) {
            prioKeys = targets.map((t) => MonsterKey.fromName(t));
        }
        const targetKeys = targets.map((t) => MonsterKey.fromName(t));

        const qty = (): number => this.owned(key, isTemp);

        const pullFromBank = (): void => {
            if (isTemp) {
                return;
            }
            this.inBank(key);
        };

        const pickupKey = (): void => {
            this.pickup(key);
        };

        pullFromBank();
        pickupKey();

        const keyLabel = typeof key === "number" ? (this.getDropItem(key)?.name ?? `Item#${key}`) : key;

        const haveNow = qty();
        if (haveNow >= quantity) {
            this.log("FARMING", `✅ Already have ${haveNow}× ${keyLabel} (need ${quantity})`);
            return;
        }

        if (targets.length === 0) {
            this.log("FARMING", "❌ No monster targets");
            this.disableSkills();
            this.chill();
            return;
        }

        if (map?.trim()) {
            this.join(map);
        }
        this.chooseBestCell(monsters, alt, cell, pad);
        if (useBestGear) {
            this.chooseBestGear(monsters);
        }

        this.log("FARMING", `⚔️ ${targets.join(", ")} → ${quantity}× ${keyLabel}`);

        this.enableSkills();

        while (!bot.shouldExit) {
            if (qty() >= quantity) {
                this.log("SUCCESS", `✅ Got ${quantity}× ${keyLabel}`);
                this.disableSkills();
                this.chill();
                return;
            }

            pickupKey();

            if (priority) {
                this.killWithPriority(...prioKeys);
            } else {
                this.killAmong(...targetKeys);
            }
        }

        this.disableSkills();
        this.chill();
    }

    private equipBestClassCore<T>(
        prefs: [key: T, rank: number][] | null,
        owned: (k: T) => boolean,
        equipped: (k: T) => boolean,
        equip: (k: T) => void,
    ): void {
        if (prefs == null) {
            return;
        }
        const maxed = this.isCurrentClassMaxRank();

        for (const [k, r] of prefs) {
            try {
                if (!owned(k)) {
                    continue;
                }

                if (equipped(k) && (maxed || bot.player.currentClassRank >= r)) {
                    this.log("CLASS", `✅ Already using suitable class: ${k}`);
                    return;
                }

                this.log("CLASS", `🎓 Equipping: ${k}`);
                equip(k);
                bot.sleep(this.d3);
                return;
            } catch (error) {
                rethrowIfStopped(error);
            }
        }

        this.log("CLASS", "❌ No preferred class owned");
    }

    /** C#'s two `EquipBestClass` overloads: `[name, rank]` or `[id, rank]` pairs. */
    equipBestClass(priorities: [name: string, rank: number][] | [id: number, rank: number][]): void {
        if (priorities.length > 0 && typeof priorities[0][0] === "number") {
            this.equipBestClassCore(
                priorities as [number, number][],
                (id) => bot.inventory.items?.some((i) => i?.id === id) ?? false,
                (id) => {
                    const it = bot.inventory.items?.find((i) => i?.id === id);
                    return it != null && this.hasClassEquipped(it.name);
                },
                (id) => {
                    if (!bot.inventory.isEquipped(id)) {
                        bot.inventory.equipItem(id);
                    }
                },
            );
            return;
        }
        this.equipBestClassCore(
            priorities as [string, number][],
            (n) => !!n?.trim() && this.ownedAtLeast(n, 1),
            (n) => this.hasClassEquipped(n),
            (n) => {
                if (!bot.inventory.isEquipped(n)) {
                    bot.inventory.equipItem(n);
                }
            },
        );
    }

    /** C#'s `InBank(string)` and `InBank(int)`. */
    inBank(key: string | number): boolean {
        const byId = typeof key === "number";
        if ((byId ? key <= 0 : !key?.trim()) || !bot.bank.contains(key)) {
            return false;
        }
        const label = byId ? `#${key}` : key;
        try {
            this.chill();
            bot.bank.toInventory(key);
            // C#'s Wait.ForBankToInventory (14 tries).
            bot.wait.forTrue(() => bot.inventory.contains(key), 14);
            this.log("BANK", `🏦→🎒 ${label}`);
            return true;
        } catch (error) {
            rethrowIfStopped(error);
            this.log("BANK", `❌ Move failed: ${label}`);
            return false;
        }
    }

    /** C#'s `ToBank(string)` and `ToBank(int)`. */
    toBank(key: string | number): boolean {
        const byId = typeof key === "number";
        const label = byId ? `#${key}` : key;
        if ((byId ? key <= 0 : !key?.trim()) || !bot.inventory.contains(key)) {
            this.log("BANK", `❌ Not in inv: ${label}`);
            return false;
        }
        try {
            this.chill();
            bot.inventory.toBank(key);
            // C#'s Wait.ForInventoryToBank (14 tries).
            bot.wait.forTrue(() => bot.bank.contains(key), 14);
            this.log("BANK", `🎒→🏦 ${label}`);
            return true;
        } catch (error) {
            rethrowIfStopped(error);
            this.log("BANK", `❌ Move failed: ${label}`);
            return false;
        }
    }

    /** C#'s `int Owned(string|int, bool isTemp)`: how many you have. */
    owned(key: string | number, isTemp = false): number {
        if (typeof key === "number" ? key <= 0 : !key?.trim()) {
            return 0;
        }
        return isTemp ? (bot.tempInv?.getQuantity(key) ?? 0) : (bot.inventory?.getQuantity(key) ?? 0);
    }

    /** C#'s `bool Owned(string|int, int quantity, bool isTemp)`. */
    ownedAtLeast(key: string | number, quantity: number, isTemp = false): boolean {
        return this.owned(key, isTemp) >= quantity;
    }

    equipRandomClassAndReequip(holdMs = 1000): void {
        const isClass = (it: InventoryItem): boolean => (it.category ?? "").toLowerCase() === "class";

        const inv = bot.inventory.items;
        if (inv == null) {
            return;
        }

        let curId = -1;
        let curName: string | null = null;
        for (const it of inv) {
            if (it == null) {
                continue;
            }
            if (it.equipped === true && isClass(it)) {
                curId = it.id;
                curName = it.name;
                break;
            }
        }
        if (curId <= 0 && !curName?.trim()) {
            this.log("CLASS", "❌ No current class found");
            return;
        }

        const candidates: InventoryItem[] = [];
        for (const it of inv) {
            if (it == null) {
                continue;
            }
            if (!isClass(it)) {
                continue;
            }
            if (it.equipped === true) {
                continue;
            }
            candidates.push(it);
        }
        if (candidates.length === 0) {
            this.log("CLASS", "❌ No alternate class available");
            return;
        }

        const rnd = candidates[Math.floor(Math.random() * candidates.length)];

        if (!bot.inventory.isEquipped(rnd.id)) {
            for (let t = 0; t < 3 && !bot.shouldExit; t++) {
                bot.inventory.equipItem(rnd.id);
                bot.sleep(500);
                if (bot.inventory.isEquipped(rnd.id)) {
                    break;
                }
            }
        }
        if (!bot.inventory.isEquipped(rnd.id)) {
            this.log("CLASS", `❌ Failed to equip ${rnd.name}`);
            return;
        }

        this.log("CLASS", `🔀 Swapped to ${rnd.name}`);
        if (holdMs > 0) {
            bot.sleep(holdMs);
        }

        if (curId > 0) {
            for (let t = 0; t < 3 && !bot.shouldExit; t++) {
                if (bot.inventory.isEquipped(curId)) {
                    break;
                }
                bot.inventory.equipItem(curId);
                bot.sleep(500);
            }
            if (bot.inventory.isEquipped(curId)) {
                this.log("CLASS", `↩️ Back to ${curName ?? "#" + curId}`);
                return;
            }
        }

        if (curName?.trim()) {
            for (let t = 0; t < 3 && !bot.shouldExit; t++) {
                if (bot.inventory.isEquipped(curName)) {
                    break;
                }
                bot.inventory.equipItem(curName);
                bot.sleep(500);
            }
            if (bot.inventory.isEquipped(curName)) {
                this.log("CLASS", `↩️ Back to ${curName}`);
            } else {
                this.log("CLASS", `❌ Failed to re-equip ${curName}`);
            }
        }
    }

    //#endregion
    //#region Best Enhancement
    chooseBestEnhancement(itemGroup: string, ...priority: string[]): InventoryItem | null {
        if (priority == null || priority.length === 0) {
            return null;
        }
        if (bot?.inventory == null || bot.bank == null || bot.player == null) {
            return null;
        }

        const norm = (g: string): string => {
            if (!g?.trim()) {
                return g;
            }
            switch (g.trim().toLowerCase()) {
                case "weapon":
                    return "Weapon";
                case "helm":
                case "he":
                    return "he";
                case "back":
                case "ba":
                case "cape":
                    return "ba";
                case "class":
                case "co":
                    return "co";
                case "pet":
                case "pe":
                    return "pe";
                default:
                    return g;
            }
        };

        const enh = (id: number): string | null => ENHANCEMENT_NAMES[id] ?? null;
        const weaponTrait = (id: number): string | null => WEAPON_TRAITS[id] ?? null;

        const groupMatch = (i: InventoryItem, grp: string): boolean => {
            const g = i?.equipSlot;
            return !!g?.trim() && grp != null && g.toLowerCase() === grp.toLowerCase();
        };

        const matchWant = (i: InventoryItem, want: string, grp: string): boolean => {
            if (i == null || !want?.trim()) {
                return false;
            }

            const pat = enh(i.enhancementPatternId ?? -1);
            if (pat && pat.toLowerCase() === want.toLowerCase()) {
                return true;
            }

            if (grp.toLowerCase() === "weapon") {
                const tr = weaponTrait(i.procId ?? -1);
                if (tr && tr.toLowerCase() === want.toLowerCase()) {
                    return true;
                }
            }
            return false;
        };

        const findIn = (
            src: InventoryItem[] | null,
            want: string,
            grp: string,
            memOnlyIfUpgradeAllowed: boolean,
        ): InventoryItem | null => {
            if (src == null) {
                return null;
            }
            for (const i of src) {
                if (i == null) {
                    continue;
                }
                if (!groupMatch(i, grp)) {
                    continue;
                }
                if (i.upgrade && !memOnlyIfUpgradeAllowed) {
                    continue;
                }
                if (matchWant(i, want, grp)) {
                    return i;
                }
            }
            return null;
        };

        const equip = (it: InventoryItem | null): boolean => {
            if (it == null) {
                return false;
            }
            if (bot.inventory.isEquipped(it.id)) {
                return true;
            }
            for (let t = 0; t < 3 && !bot.shouldExit; t++) {
                bot.inventory.equipItem(it.id);
                bot.sleep(500);
                if (bot.inventory.isEquipped(it.id)) {
                    return true;
                }
            }
            return false;
        };

        const grp = norm(itemGroup);
        const mem = bot.player.isMember === true;

        const wants = (priority ?? []).filter((p) => !!p?.trim());

        this.log("ENHANCEMENT", `🛠️ ${grp}: ${wants.join(", ")}`);

        for (const want of wants) {
            // try inventory
            const hit = findIn(bot.inventory.items, want, grp, mem);
            if (hit != null) {
                if (equip(hit)) {
                    this.log("ENHANCEMENT", `✅ ${grp}: ${hit.name} (${want})`);
                    return hit;
                }
                this.log("ENHANCEMENT", `❌ Equip failed (inv): ${hit.name} (${want})`);
            }

            // try bank
            const fromBank = findIn(bot.bank.items, want, grp, mem);
            if (fromBank != null) {
                this.log("ENHANCEMENT", `🏦 Pulling ${fromBank.name} (${want})`);
                this.inBank(fromBank.name);
                bot.sleep(500);

                const pulled =
                    bot.inventory.items.find((i) => i?.id === fromBank.id) ??
                    findIn(bot.inventory.items, want, grp, mem);

                if (pulled == null) {
                    this.log("ENHANCEMENT", `❌ Pull failed (not in inventory): ${fromBank.name} (${want})`);
                } else if (equip(pulled)) {
                    // C# returns the first equipped item of the inventory, whatever its slot.
                    const equipped = bot.inventory.items?.find((i) => i != null && bot.inventory.isEquipped(i.id));
                    this.log("ENHANCEMENT", `✅ ${grp}: ${equipped?.name ?? pulled?.name} (${want})`);
                    return equipped ?? pulled;
                } else {
                    this.log("ENHANCEMENT", `❌ Equip failed (bank): ${fromBank.name} (${want})`);
                }
            }

            bot.sleep(500);
        }

        this.log("ENHANCEMENT", `🚫 No ${grp} matched: ${wants.join(", ")}`);
        return null;
    }

    //#endregion
    //#region Combat
    private match(k: MonsterKey): Monster[] {
        if (!bot.player.alive) {
            bot.wait.forTrue(() => bot.player.alive, 20);
        }

        const list = bot?.monsters?.mapMonsters;
        if (list == null) {
            return [];
        }

        return list.filter((m) => {
            if (m == null) {
                return false;
            }
            if (k.mapId != null && m.mapId !== k.mapId) {
                return false;
            }
            if (k.name?.trim() && (m.name ?? "").toLowerCase() !== k.name.toLowerCase()) {
                return false;
            }
            if (k.id != null && m.id !== k.id) {
                return false;
            }
            return true;
        });
    }

    isMonsterAliveByName(monName: string): boolean {
        let isAlive = false;

        monName = monName.toLowerCase();

        if (!bot.player.alive) {
            bot.wait.forTrue(() => bot.player.alive, 20);
        }
        try {
            const jsonData = bot.flash.call("availableMonsters");
            if (!jsonData) {
                bot.log("No monster data available.");
                return false;
            }
            const monsters = JSON.parse(jsonData) as Record<string, unknown>[];
            if (monsters.length === 0) {
                return false;
            }

            for (const monster of monsters) {
                if (String(monster["strMonName"] ?? "").toLowerCase() === monName) {
                    const intState = monster["intState"] == null ? "" : String(monster["intState"]);

                    if (!intState || intState === "1" || intState === "2") {
                        isAlive = true;
                    }
                }
            }

            return isAlive;
        } catch (error) {
            rethrowIfStopped(error);
            return true;
        }
    }

    isAlive(k: MonsterKey): boolean {
        if (!bot.player.alive) {
            bot.wait.forTrue(() => bot.player.alive, 20);
        }

        return this.match(k).some(isMonsterAlive);
    }

    isAliveByMapId(mapId: number | null = null, name: string | null = null, id: number | null = null): boolean {
        if (!bot.player.alive) {
            bot.wait.forTrue(() => bot.player.alive, 20);
        }
        return this.isAlive(new MonsterKey(mapId, name, id));
    }

    private attack(k: MonsterKey): void {
        if (!bot.player.alive) {
            bot.wait.forTrue(() => bot.player.alive, 20);
        }
        if (k.mapId != null) {
            bot.combat.attack(k.mapId);
        } else if (k.id != null) {
            bot.combat.attack(k.id);
        } else if (k.name?.trim()) {
            bot.combat.attack(k.name);
        }
    }

    /**
     * C#'s `Kill(MonsterKey)`, `Kill(string)` and `Kill(params string[])`: one key or name kills
     * the weakest living match; several names kill by priority.
     */
    kill(...keys: (MonsterKey | string | null)[]): void {
        if (keys.length === 1 && keys[0] instanceof MonsterKey) {
            this.killKey(keys[0]);
            return;
        }
        if (keys.length === 1 && typeof keys[0] === "string") {
            this.killKey(MonsterKey.fromName(keys[0]));
            return;
        }
        const names = keys.filter((n): n is string => typeof n === "string" && !!n.trim());
        if (names.length === 0) {
            return;
        }
        this.killWithPriority(...names.map((n) => MonsterKey.fromName(n)));
    }

    private killKey(k: MonsterKey): void {
        const target = this.weakest(this.match(k).filter(isMonsterAlive));

        if (target == null) {
            return;
        }

        this.attack(MonsterKey.fromMapId(target.mapId)!);
        bot.sleep(this.d1);
    }

    killAmong(...keys: MonsterKey[]): void {
        if (keys == null || keys.length === 0) {
            return;
        }

        const myCell = (bot.player.cell ?? "").toLowerCase();

        const target = this.weakest(
            keys
                .flatMap((k) => this.match(k))
                .filter((m) => isMonsterAlive(m) && (m.cell ?? "").toLowerCase() === myCell),
        );

        if (target == null) {
            return;
        }

        this.attack(MonsterKey.fromMapId(target.mapId)!);
        bot.sleep(this.d1);
    }

    /** C#'s `.OrderBy(m => m.HP).ThenBy(m => m.MapID).FirstOrDefault()`. */
    private weakest(monsters: Monster[]): Monster | null {
        let best: Monster | null = null;
        for (const m of monsters) {
            if (best == null || m.hp < best.hp || (m.hp === best.hp && m.mapId < best.mapId)) {
                best = m;
            }
        }
        return best;
    }

    lowestHpTarget(...keys: MonsterKey[]): Monster | null {
        let best: Monster | null = null;
        for (const k of keys) {
            for (const m of this.match(k)) {
                if (!isMonsterAlive(m)) {
                    continue;
                }
                if (best == null || m.hp < best.hp) {
                    best = m;
                }
            }
        }
        return best;
    }

    /** C#'s `KillWithPriority(params MonsterKey[])`: attacks the first key that has a living monster. */
    killWithPriority(...keys: (MonsterKey | null)[]): void {
        if (keys == null || keys.length === 0) {
            bot.sleep(this.d1);
            return;
        }

        for (const k of keys) {
            bot.wait.forTrue(() => bot.player.alive, 20);
            // C# passes a null key from FromId/FromMapId(null) on, which throws in Match; skip it.
            if (k != null && this.isAlive(k)) {
                bot.wait.forTrue(() => bot.player.alive, 20);
                this.attack(k);
                bot.sleep(this.d1);
                return;
            }
        }

        bot.sleep(this.d1);
    }

    killAtMapId(mapId: number | null): void {
        const key = MonsterKey.fromMapId(mapId);
        if (key != null) {
            this.killKey(key);
        }
    }

    /**
     * C#'s `KillWithPriority(string? primaryName, string? priorityName1[, string? priorityName2])`:
     * the priority monsters first, then the primary one. A missing name matches every monster.
     */
    killWithPriorityNames(
        primaryName: string | null,
        priorityName1: string | null,
        priorityName2?: string | null,
    ): void {
        if (priorityName2 === undefined) {
            this.killWithPriority(MonsterKey.fromName(priorityName1), MonsterKey.fromName(primaryName));
            return;
        }
        this.killWithPriority(
            MonsterKey.fromName(priorityName1),
            MonsterKey.fromName(priorityName2),
            MonsterKey.fromName(primaryName),
        );
    }

    /** C#'s `KillWithPriority(int? primaryId, int? priorityId1)`. */
    killWithPriorityIds(primaryId: number | null, priorityId1: number | null): void {
        this.killWithPriority(MonsterKey.fromId(priorityId1), MonsterKey.fromId(primaryId));
    }

    /** C#'s two `KillWithPriorityAtMapId` overloads. */
    killWithPriorityAtMapId(primaryMapId: number | null, priorityMapId1: number | null, priorityMapId2?: number): void {
        if (priorityMapId2 === undefined) {
            this.killWithPriority(MonsterKey.fromMapId(priorityMapId1), MonsterKey.fromMapId(primaryMapId));
            return;
        }
        this.killWithPriority(
            MonsterKey.fromMapId(priorityMapId1),
            MonsterKey.fromMapId(priorityMapId2),
            MonsterKey.fromMapId(primaryMapId),
        );
    }

    //#endregion
    //#region Factions
    private rank(name: string): number {
        if (!name?.trim()) {
            return 0;
        }
        const list = bot?.reputation?.factionList;
        if (list == null) {
            return 0;
        }

        for (const f of list) {
            const n = f?.name;
            if (n?.trim() && n.toLowerCase() === name.toLowerCase()) {
                return f?.rank ?? 0;
            }
        }
        return 0;
    }

    faction(name: string, minRank = 0): boolean {
        const need = minRank < 0 ? 0 : minRank;
        return this.rank(name) >= need;
    }

    //#endregion
    //#region Potions & Scrolls
    usePotion(): void {
        this.disableSkills();
        try {
            bot.sleep(this.d2);
            bot.skills.useSkill(5);
            bot.sleep(this.d2);
        } finally {
            this.enableSkills();
        }
    }

    equipConsumable(name: string): void {
        if (!name?.trim()) {
            return;
        }

        this.disableSkills();
        this.chill();
        try {
            if (!Core.checkInventory(name)) {
                return;
            }
            if (bot.inventory.isEquipped(name)) {
                return;
            }

            this.whiteMap();
            bot.inventory.equipUsableItem(name);
            bot.sleep(this.d3);
        } finally {
            this.enableSkills();
        }
    }

    equipEnrage(): void {
        if (!Core.checkInventory("Scroll of Enrage")) {
            return;
        }
        if (bot.inventory.isEquipped("Scroll of Enrage")) {
            return;
        }

        this.whiteMap();
        bot.inventory.equipUsableItem("Scroll of Enrage");
        bot.sleep(this.d3);
    }

    //#endregion
    //#region Best Gear
    chooseBestGear(names: string | null): void {
        if (bot?.monsters?.mapMonsters == null || bot?.inventory?.items == null || bot?.bank?.items == null) {
            return;
        }

        // Sets and maps hold lowercase keys: C#'s OrdinalIgnoreCase collections.
        const isSelectedMonster = (mName: string | null, set: Set<string>): boolean => {
            if (!mName?.trim()) {
                return false;
            }
            if (set == null || set.size === 0) {
                return true; // "*" or empty -> all
            }
            return set.has(mName.toLowerCase());
        };

        const normalizeRace = (r: string | null): string => {
            if (!r?.trim()) {
                return "allDmg";
            }
            if (r.toLowerCase() === "none") {
                return "allDmg";
            }
            return r;
        };

        const meta = (metaText: string, key: string): number => {
            if (!metaText?.trim()) {
                return 0;
            }
            const kAll = key.toLowerCase() === "alldmg";
            for (const token of metaText.split(/[\n\r,]/)) {
                const colon = token.indexOf(":");
                if (colon <= 0) {
                    continue;
                }

                const k = token.substring(0, colon).trim().toLowerCase();
                const vStr = token.substring(colon + 1).trim();

                if (!(k === key.toLowerCase() || (kAll && k === "dmgall"))) {
                    continue;
                }

                // C#'s double.TryParse(Float, InvariantCulture).
                const v = vStr.length > 0 ? Number(vStr) : NaN;
                if (!Number.isNaN(v)) {
                    return Math.max(0, v - 1);
                }
            }
            return 0;
        };

        const parseNameSet = (s: string): Set<string> => {
            const set = new Set<string>();
            if (!s?.trim() || s.trim() === "*") {
                return set; // empty => "select all"
            }
            for (const piece of s.split(",")) {
                const p = piece.trim();
                if (p.length > 0) {
                    set.add(p.toLowerCase());
                }
            }
            return set;
        };

        const isValidGroup = (g: string): boolean => {
            if (!g?.trim()) {
                return false;
            }
            const gl = g.toLowerCase();
            return gl === "weapon" || gl === "he" || gl === "ba" || gl === "co" || gl === "pe";
        };

        const equipped = (name: string): boolean => {
            const items = bot.inventory.items;
            if (items == null) {
                return false;
            }
            return items.some(
                (it) => it?.equipped === true && it.name != null && name.toLowerCase() === it.name.toLowerCase(),
            );
        };

        const equip = (g: Gear): void => {
            if (!g.name?.trim()) {
                return;
            }
            for (let t = 0; t < 3 && !bot.shouldExit; t++) {
                if (g.fromBank) {
                    this.inBank(g.name);
                }
                bot.inventory.equipItem(g.name);
                bot.sleep(500);
                if (equipped(g.name)) {
                    this.log("GEAR", `✅ Equipped ${g.name}`);
                    return;
                }
            }
            this.log("GEAR", `❌ Failed to equip ${g.name}`);
        };

        const selected = parseNameSet(names ?? "");
        let race = "allDmg";
        {
            const mobs = bot.monsters.mapMonsters;
            // Keyed by lowercase race; the first spelling seen is kept, as C#'s dictionary keeps its key.
            const raceCount = new Map<string, { race: string; count: number }>();
            if (mobs != null) {
                for (const m of mobs) {
                    const mn = m?.name;
                    if (!isSelectedMonster(mn, selected)) {
                        continue;
                    }
                    const r = normalizeRace(m?.race);
                    const entry = raceCount.get(r.toLowerCase());
                    if (entry == null) {
                        raceCount.set(r.toLowerCase(), { race: r, count: 1 });
                    } else {
                        entry.count++;
                    }
                }
            }
            let maxRaceCount = 0;
            for (const kv of raceCount.values()) {
                if (kv.count > maxRaceCount) {
                    maxRaceCount = kv.count;
                    race = kv.race;
                }
            }
            this.log("GEAR", `🎯 Target race: ${race}`);
        }

        // scan inventory + bank
        const bank = bot.bank.items ?? [];
        const inv = bot.inventory.items ?? [];

        const bankNames = new Set<string>();
        for (const b of bank) {
            if (b?.name?.trim()) {
                bankNames.add(b.name.toLowerCase());
            }
        }

        const bestAll = new Map<string, Gear>();
        const bestRace = new Map<string, Gear>();

        const consider = (it: InventoryItem): void => {
            if (it == null || !it.equipSlot?.trim()) {
                return;
            }
            if (!isValidGroup(it.equipSlot)) {
                return;
            }
            if (it.upgrade && !(bot?.player?.isMember === true)) {
                return;
            }

            const name = it.name ?? "";
            const grp = it.equipSlot;
            const fromBank = bankNames.has(name.toLowerCase());

            const all = meta(it.meta, "allDmg");
            const rac = meta(it.meta, race);

            if (all <= 0 && rac <= 0) {
                return;
            }

            const g: Gear = { name, group: grp, fromBank, all, race: rac };

            if (all > 0) {
                const curA = bestAll.get(grp.toLowerCase());
                if (curA == null || g.all > curA.all) {
                    bestAll.set(grp.toLowerCase(), g);
                }
            }
            if (rac > 0) {
                const curR = bestRace.get(grp.toLowerCase());
                if (curR == null || g.race > curR.race) {
                    bestRace.set(grp.toLowerCase(), g);
                }
            }
        };

        for (const it of inv) {
            consider(it);
        }
        for (const it of bank) {
            consider(it);
        }

        if (bestAll.size === 0 && bestRace.size === 0) {
            this.log("GEAR", "❌ No gear with bonuses found");
            return;
        }

        // choose best combo
        let bestA: Gear | null = null;
        let bestR: Gear | null = null;
        let bestSum = -Number.MAX_VALUE;

        for (const ga of bestAll.values()) {
            for (const gr of bestRace.values()) {
                if (ga.group.toLowerCase() === gr.group.toLowerCase()) {
                    continue;
                }
                const sum = ga.all + gr.race;
                if (sum > bestSum) {
                    bestSum = sum;
                    bestA = ga;
                    bestR = gr;
                }
            }
        }

        if (bestA != null && bestR != null) {
            this.log("GEAR", `🧩 Combo: ${bestA.name} + ${bestR.name}`);
            equip(bestA);
            equip(bestR);
            return;
        }

        // single best item overall
        let bestItem: Gear | null = null;
        let bestScore = -Number.MAX_VALUE;

        for (const g of [...bestAll.values(), ...bestRace.values()]) {
            const s = g.all > g.race ? g.all : g.race;
            if (s > bestScore) {
                bestScore = s;
                bestItem = g;
            }
        }

        if (bestItem != null) {
            this.log("GEAR", `✨ Best: ${bestItem.name}`);
            equip(bestItem);
        }
    }

    //#endregion
    //#region Auras
    private getAuraCollection(self: boolean): (Aura | null)[] | null {
        try {
            return self ? bot?.self?.auras : bot?.target?.auras;
        } catch (error) {
            rethrowIfStopped(error);

            return null;
        }
    }

    getAuraByName(auraName: string, self: boolean): Aura | null {
        if (!auraName?.trim()) {
            return null;
        }

        try {
            return (
                this.getAuraCollection(self)?.find(
                    (a) => a?.name != null && auraName.toLowerCase() === a.name.toLowerCase(),
                ) ?? null
            );
        } catch (error) {
            rethrowIfStopped(error);

            return null;
        }
    }

    hasAura(auraName: string, self = false): boolean {
        return this.getAuraByName(auraName, self) != null;
    }

    hasAnyAura(auraNames: string[], self = false): boolean {
        return auraNames != null && auraNames.some((name) => !!name?.trim() && this.hasAura(name, self));
    }

    hasAnyAuraOtherThan(auraName: string, self = false): boolean {
        if (!auraName?.trim()) {
            return false;
        }

        try {
            return (
                this.getAuraCollection(self)?.some(
                    (a) => a?.name != null && !(auraName.toLowerCase() === a.name.toLowerCase()),
                ) === true
            );
        } catch (error) {
            rethrowIfStopped(error);

            return false;
        }
    }

    /** Returns stacks as a float (preserves fractional stacks); 0 if missing. */
    getAuraStacksFloat(auraName: string, self = false): number {
        if (!auraName?.trim()) {
            return 0;
        }

        try {
            return (this.getAuraCollection(self)?.find((a) => a?.name === auraName) ?? null)?.value ?? 0;
        } catch (error) {
            rethrowIfStopped(error);

            return 0;
        }
    }

    /** Returns stacks as int (rounded), +1, for legacy code compatibility. */
    getAuraStacks(auraName: string, self = false): number {
        // C#'s Math.Round rounds a half to even.
        const value = this.getAuraStacksFloat(auraName, self);
        const rounded = Math.round(value);
        return (Math.abs(value % 1) === 0.5 && rounded % 2 !== 0 ? rounded - 1 : rounded) + 1;
    }

    /** Returns remaining seconds of an aura; 0 if missing or expired. */
    getAuraSecondsRemaining(auraName: string, self = false): number {
        const aura = this.getAuraByName(auraName, self);
        return aura != null && aura.timeStamp > 0 && aura.duration > 0
            ? Math.max(0, Math.trunc((aura.timeStamp + aura.duration * 1000 - Date.now()) / 1000))
            : 0;
    }

    /**
     * Checks if the aura has at least the specified quantity of stacks (int or float).
     * Returns false if aura is missing.
     */
    stacks(auraName: string, quantity: number, self = false): boolean {
        return (
            !!auraName?.trim() &&
            quantity > 0 &&
            ((self
                ? (bot.self.auras.find((a) => a?.name === auraName) ?? null)?.value
                : (bot.target.auras.find((a) => a?.name === auraName) ?? null)?.value) ?? 0) >= quantity
        );
    }

    /** Returns true if the aura has less than or equal to the specified duration in seconds remaining. */
    left(auraName: string, duration: number, self = false): boolean {
        return !!auraName?.trim() && duration >= 0 && this.getAuraSecondsRemaining(auraName, self) <= duration;
    }

    //#endregion
    //#region Shop
    /**
     * C#'s `BuyItem(itemKey, shopId, map, quantity = 1, ...)`: the named settings after the
     * quantity are options here.
     */
    buyItem(itemKey: string | number, shopId: number, map: string, quantity = 1, opts: BuyItemOptions = {}): boolean {
        const ensureMap = opts.ensureMap ?? true;
        const calculateRemaining = opts.calculateRemaining ?? true;
        const skipIfHaveEnough = opts.skipIfHaveEnough ?? true;
        const considerBank = opts.considerBank ?? true;
        const checkGold = opts.checkGold ?? true;
        const checkLevel = opts.checkLevel ?? true;
        const checkInvSpace = opts.checkInvSpace ?? true;
        const loadTimeoutMs = opts.loadTimeoutMs ?? 5000;

        if (typeof itemKey !== "number" && typeof itemKey !== "string") {
            this.log("SHOP", "❌ Invalid item key type.");
            return false;
        }
        if (quantity <= 0) {
            return false;
        }
        if (bot == null || bot.player == null || bot.shops == null) {
            return false;
        }

        const ensureMapJoin = (m: string): boolean => {
            if (!ensureMap) {
                return true;
            }
            if (!m?.trim()) {
                return true;
            }
            if ((bot.map?.name ?? "").toLowerCase() === m.toLowerCase()) {
                return true;
            }

            this.join(m);
            return (bot.map?.name ?? "").toLowerCase() === m.toLowerCase();
        };

        const loadShop = (id: number): boolean => {
            for (let attempt = 0; attempt < 3 && !bot.shouldExit; attempt++) {
                // Turu: no shop cache to compare against (C#'s `LoadedCache`); the loaded
                // shop's ID tells that this shop came in.
                bot.shops.load(id);

                const start = Date.now();
                while (!bot.shouldExit && Date.now() - start < loadTimeoutMs) {
                    const items = bot.shops.items?.length ?? 0;

                    if (items > 0 || bot.shops.id === id) {
                        return true;
                    }

                    bot.sleep(50);
                }
            }
            return false;
        };

        const findItem = (key: string | number): ShopItem | null => {
            const list = bot?.shops?.items;
            if (list == null) {
                return null;
            }

            if (typeof key === "number") {
                return key > 0 ? (list.find((item) => item != null && item.id === key) ?? null) : null;
            }

            if (key?.trim()) {
                return (
                    list.find((item) => !!item?.name?.trim() && item.name.toLowerCase() === key.toLowerCase()) ?? null
                );
            }

            return null;
        };

        const have = (name: string): number => {
            if (considerBank) {
                this.inBank(name);
            }
            return this.owned(name);
        };

        const need = (name: string, want: number): number => {
            const cur = have(name);
            if (skipIfHaveEnough && cur >= want) {
                return 0;
            }
            return calculateRemaining ? Math.max(0, want - cur) : want;
        };

        const hasInvSpace = (): boolean => (bot.inventory?.freeSlots ?? 0) > 0;

        // -------- FLOW --------

        if (!ensureMapJoin(map)) {
            this.log("SHOP", `❌ Failed to join ${map}`);
            return false;
        }

        if (!loadShop(shopId)) {
            this.log("SHOP", `❌ Failed to load shop ${shopId}`);
            return false;
        }

        const item = findItem(itemKey);
        if (item == null) {
            this.log("SHOP", `❌ Item not found: ${itemKey}`);
            return false;
        }

        const name = item.name;
        if (!name?.trim()) {
            this.log("SHOP", "❌ Item has no valid name.");
            return false;
        }

        const needed = need(name, quantity);
        if (needed === 0) {
            return true;
        }

        const price = item.cost * needed;
        if (checkGold && bot.player.gold < price) {
            this.log("SHOP", `💰 Not enough gold: need ${price}, have ${bot.player.gold}`);
            return false;
        }

        if (checkLevel && bot.player.level < item.level) {
            this.log("SHOP", `⬆️ Level ${item.level}+ required`);
            return false;
        }

        if (checkInvSpace && !hasInvSpace()) {
            this.log("SHOP", "📦 Inventory full");
            return false;
        }

        const before = this.owned(name); // inventory only

        bot.shops.buyItem(item.id, needed, item.shopItemId);

        const t0 = Date.now();
        while (Date.now() - t0 < 2000) {
            if (this.owned(name) > before) {
                break;
            }
            bot.sleep(50);
        }

        const gained = this.owned(name) - before;
        const success = gained > 0;

        this.log("SHOP", success ? `🛒 Purchased ${gained}x ${name}` : `❌ Purchase failed: ${name}`);

        return success;
    }

    //#endregion
    //#region Drops
    // Turu: C#'s `CurrentDrops` (names) and `CurrentDropInfos` are both `bot.drops.current`.
    private hasDrop(key: string | number): boolean {
        // Check by ID
        if (typeof key === "number") {
            return key > 0 && (bot.drops.current ?? []).some((item) => item?.id === key);
        }

        // Check by name
        if (key?.trim()) {
            return (bot.drops.current ?? []).some((item) => (item?.name ?? "").toLowerCase() === key.toLowerCase());
        }

        return false;
    }

    private getDropItem(key: string | number): InventoryItem | null {
        const infos = bot.drops.current;
        if (infos == null || infos.length === 0) {
            return null;
        }

        // Match by numeric ID
        if (typeof key === "number") {
            return key > 0 ? (infos.find((item) => item?.id === key) ?? null) : null;
        }

        // Match by item name
        if (key?.trim()) {
            return infos.find((item) => (item?.name ?? "").toLowerCase() === key.toLowerCase()) ?? null;
        }

        return null;
    }

    pickup(...keys: (string | number)[]): void {
        if (keys == null || keys.length === 0) {
            return;
        }

        this.rejectExcept(...keys);

        for (const key of keys) {
            // Handle numeric IDs
            if (typeof key === "number") {
                if (key > 0 && this.hasDrop(key)) {
                    bot.drops.pickup(key);
                    bot.sleep(this.d1);
                }

                continue;
            }

            // Handle item names
            if (key?.trim() && this.hasDrop(key)) {
                bot.drops.pickup(key);
                bot.sleep(this.d1);
            }
        }
    }

    waitForDrop(key: string | number, timeout = 30000): boolean {
        // Only allow int or string keys
        if (typeof key !== "number" && typeof key !== "string") {
            return false;
        }

        const start = Date.now();

        while (!bot.shouldExit && !this.hasDrop(key) && Date.now() - start < timeout) {
            bot.sleep(this.d1); // Sleep delay to avoid CPU spin
        }

        return this.hasDrop(key);
    }

    hasAny(...keys: (string | number)[]): boolean {
        if (keys == null || keys.length === 0) {
            return false;
        }

        for (const key of keys) {
            // Match valid int IDs
            if (typeof key === "number" && key > 0 && this.hasDrop(key)) {
                return true;
            }

            // Match valid string names
            if (typeof key === "string" && key.trim() && this.hasDrop(key)) {
                return true;
            }
        }

        return false;
    }

    rejectExcept(...keys: (string | number)[]): void {
        const toName = (k: string | number): string | null => {
            if (typeof k === "number") {
                return k > 0 ? (this.getDropItem(k)?.name ?? String(k)) : null;
            }
            return k?.trim() ? k : null;
        };

        const seen = new Set<string>();
        const names: string[] = [];
        for (const k of keys ?? []) {
            const n = toName(k);
            if (!n?.trim() || seen.has(n.toLowerCase())) {
                continue;
            }
            seen.add(n.toLowerCase());
            names.push(n);
        }

        bot.flash.call("rejectExcept", names.length > 0 ? names.join(",") : "");
    }

    //#endregion
    //#region Player
    getHealthPercentage(): number {
        if (bot?.player == null || bot.player.maxHealth <= 0) {
            return 0;
        }
        return (bot.player.health / bot.player.maxHealth) * 100;
    }

    getManaPercentage(): number {
        if (bot?.player == null || bot.player.maxMana <= 0) {
            return 0;
        }
        return (bot.player.mana / bot.player.maxMana) * 100;
    }

    // Returns true if current HP is below the given threshold.
    isHealthLow(percentage = 30): boolean {
        if (!bot.player.alive) {
            bot.wait.forTrue(() => bot.player.alive, 20);
        }
        return bot.player.alive && this.getHealthPercentage() < percentage;
    }

    // Returns true if current MP is below the given threshold.
    isManaLow(percentage = 30): boolean {
        if (!bot.player.alive) {
            bot.wait.forTrue(() => bot.player.alive, 20);
        }
        return bot.player.alive && this.getManaPercentage() < percentage;
    }

    // Returns true if current HP is above the given threshold.
    isHealthHigh(percentage = 90): boolean {
        if (!bot.player.alive) {
            bot.wait.forTrue(() => bot.player.alive, 20);
        }
        return bot.player.alive && this.getHealthPercentage() > percentage;
    }

    // Returns true if current MP is above the given threshold.
    isManaHigh(percentage = 90): boolean {
        if (!bot.player.alive) {
            bot.wait.forTrue(() => bot.player.alive, 20);
        }
        return bot.player.alive && this.getManaPercentage() > percentage;
    }

    isFullHealth(): boolean {
        if (bot?.player == null) {
            return false;
        }
        return bot.player.health >= bot.player.maxHealth;
    }

    isFullMana(): boolean {
        if (bot?.player == null) {
            return false;
        }
        return bot.player.mana >= bot.player.maxMana;
    }

    isFullHealthAndMana(): boolean {
        return this.isFullHealth() && this.isFullMana();
    }

    isDead(): boolean {
        if (bot?.player == null) {
            return true;
        }
        // Assume dead if can't check
        return bot.player.state === 0;
    }

    isIdle(): boolean {
        if (bot?.player == null) {
            return false;
        }
        return bot.player.state === 1;
    }

    getDistanceTo(x: number, y: number): number {
        const deltaX = bot.player.x - x;
        const deltaY = bot.player.y - y;
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }

    isInRangeOf(x: number, y: number, range = 50): boolean {
        return this.getDistanceTo(x, y) <= range;
    }

    getCurrentClassName(): string {
        return bot?.player?.currentClass ?? "No Class";
    }

    hasClassEquipped(className: string): boolean {
        if (!className?.trim()) {
            return false;
        }

        Core.debugLogger();

        if (!bot.player.alive) {
            bot.wait.forTrue(() => bot.player.alive, 20);
        }

        return bot.player.currentClass?.toLowerCase() === className.toLowerCase();
    }

    isCurrentClassMaxRank(): boolean {
        return bot.player.currentClassRank >= 10;
    }

    isInCell(cellName: string): boolean {
        if (!bot.player.alive) {
            bot.wait.forTrue(() => bot.player.alive, 20);
        }
        if (!cellName?.trim()) {
            return false;
        }
        return (bot?.player?.cell?.toLowerCase() === cellName.toLowerCase()) === true;
    }

    needsRest(healthThreshold = 50, manaThreshold = 50): boolean {
        return this.isHealthLow(healthThreshold) || this.isManaLow(manaThreshold);
    }

    shouldRest(): boolean {
        return !bot.player.inCombat && !this.isFullHealthAndMana();
    }

    getTargetName(): string {
        if (!bot.player.alive) {
            bot.wait.forTrue(() => bot.player.alive, 20);
        }
        return bot?.player?.target?.name ?? "";
    }

    getTargetHealthPercentage(): number {
        const target = bot?.player?.target;
        if (target == null || target.maxHp <= 0) {
            return 0;
        }
        return (target.hp / target.maxHp) * 100;
    }

    isTargetAlive(): boolean {
        if (!bot.player.alive) {
            bot.wait.forTrue(() => bot.player.alive, 20);
        }
        const target = bot.player.target;
        return target != null && target.hp > 0 && target.state > 0;
    }

    isTargetHealthLow(percentage = 30): boolean {
        if (!bot.player.alive) {
            bot.wait.forTrue(() => bot.player.alive, 20);
        }
        return this.getTargetHealthPercentage() < percentage;
    }

    hasEnoughGold(amount: number): boolean {
        return bot.player.gold >= amount;
    }

    getPlayerStats(): PlayerStats {
        return bot.player.stats ?? emptyStats();
    }

    getStatValue(statName: string): number {
        if (!statName?.trim()) {
            return 0;
        }

        const stats = bot?.player?.stats;
        if (stats == null) {
            return 0;
        }

        return ((v) =>
            v === "STR" || v === "STRENGTH"
                ? stats.strength
                : v === "WIS" || v === "WISDOM"
                  ? stats.wisdom
                  : v === "DEX" || v === "DEXTERITY"
                    ? stats.dexterity
                    : v === "END" || v === "ENDURANCE"
                      ? stats.endurance
                      : v === "INT" || v === "INTELLECT"
                        ? stats.intellect
                        : v === "LCK" || v === "LUCK"
                          ? stats.luck
                          : v === "AP" || v === "ATTACKPOWER"
                            ? stats.attackPower
                            : v === "SP" || v === "SPELLPOWER"
                              ? stats.spellPower
                              : 0)(statName.toUpperCase());
    }

    getCriticalChance(): number {
        return bot?.player?.stats?.criticalChance ?? 0;
    }

    getCriticalMultiplier(): number {
        return bot?.player?.stats?.criticalMultiplier ?? 0;
    }

    getEvasionChance(): number {
        return bot?.player?.stats?.evasionChance ?? 0;
    }

    getHaste(): number {
        return bot?.player?.stats?.haste ?? 0;
    }

    isReadyForCombat(): boolean {
        return bot.player.alive && bot.player.loaded;
    }

    getLowestHpPercentage(): number {
        const names = bot?.map?.playerNames;
        if (names == null || names.length === 0) {
            return 100.0;
        }

        let lowest = 100.0;
        for (const playerName of names) {
            if (!playerName?.trim()) {
                continue;
            }
            try {
                const hp = bot!.flash.get<number>(`world.uoTree.${playerName}.intHP`);
                const maxHp = bot.flash.get<number>(`world.uoTree.${playerName}.intHPMax`);
                if (maxHp > 0 && hp >= 0) {
                    const pct = (hp / maxHp) * 100.0;
                    if (pct < lowest) {
                        lowest = pct;
                    }
                }
            } catch (error) {
                rethrowIfStopped(error);
            }
        }
        return lowest;
    }

    isArmyHealthLow(percentage = 30.0): boolean {
        if (!bot.player.alive) {
            bot.wait.forTrue(() => bot.player.alive, 20);
        }

        return this.getLowestHpPercentage() < percentage;
    }

    inLoadedMap(name: string): boolean {
        return bot?.map?.loaded === true && (bot.map.name === name) === true;
    }

    //#endregion
    //#region Map
    _bestCell: string | null = null;
    _bestPad = "Left";

    join(map: string, cell = "Enter", pad = "Spawn", publicRoom = false, roomNumber: number | null = null): void {
        if (!map?.trim()) {
            return;
        }

        if (!bot.player.alive) {
            bot.wait.forTrue(() => bot.player.alive, 20);
        }

        const mapName = map.split("-")[0].trim();
        const target = publicRoom
            ? mapName
            : roomNumber != null
              ? `${mapName}-${roomNumber}`
              : map.includes("-")
                ? map
                : // C# hashes the machine's ID (its MachineGuid) into a room number.
                  `${mapName}-${bot.army.machineRoomNumber()}`;

        if (this.inLoadedMap(mapName)) {
            if (!!cell?.trim() && !this.isInCell(cell)) {
                bot.map.jump(cell, pad);
            }
            return;
        }

        this.chill();

        for (let i = 0; i < 5 && !bot.shouldExit && !this.inLoadedMap(mapName); i++) {
            bot.send.packet(`%xt%zm%cmd%${bot.map.roomId}%tfer%${bot.player.username}%${target}%${cell}%${pad}%`);

            const end = Date.now() + 8000;
            // up to 8s per try
            while (!bot.shouldExit && !this.inLoadedMap(mapName) && Date.now() < end) {
                bot.sleep(100);
            }

            if (!this.inLoadedMap(mapName)) {
                bot.sleep(300);
            }
        }

        if (this.inLoadedMap(mapName)) {
            this.log("MAP", `🌍 Joined ${mapName} (${target})`);
            if (!!cell?.trim() && !this.isInCell(cell)) {
                bot.map.jump(cell, pad);
            }
        } else {
            this.log("MAP", `❌ Failed to join ${mapName} (${target})`);
        }
    }

    chooseBestCell(monsterNames: string | null, alt = false, setCell: string | null = null, setPad = "Spawn"): void {
        const names = (monsterNames ?? "")
            .split(/[,|]/)
            .filter((x) => x)
            .map((n) => n.trim())
            .filter((n) => n.length > 0);

        const wildcard = names.length === 0 || (names.length === 1 && names[0] === "*");
        const pad = !setPad?.trim() ? "Left" : setPad;

        const monsters = (bot.monsters.mapMonsters ?? [])
            .filter((m) => m != null && !!m.cell?.trim())
            .filter((m) => wildcard || names.some((name) => (m.name ?? "").toLowerCase() === name.toLowerCase()));

        if (monsters.length === 0) {
            this.log("MAP", "❌ No matching monsters found");
            return;
        }

        const targetCell = !!setCell?.trim() ? setCell : alt ? (monsters[0] ?? null)?.cell : mostCommonCell(monsters);

        if (!targetCell?.trim()) {
            this.log("MAP", "❌ No valid target cell");
            return;
        }

        const mapCells = new Set((bot.map.cells as string[]) ?? []);
        if (!mapCells.has(targetCell)) {
            this.log("MAP", `❌ Cell not in map: ${targetCell}`);
            return;
        }

        this._bestCell = targetCell;
        this._bestPad = pad;

        if (!(bot.player.cell === targetCell)) {
            this.log("MAP", `⁀➴ Jumping to '${targetCell}' (${pad})`);
            bot.map.jump(targetCell, pad);
            bot.player.setSpawnPoint();
        } else {
            this.log("MAP", `✅ Already in ${targetCell}`);
        }
    }

    whiteMap(): void {
        this.join("whitemap");
    }

    //#endregion
    //#region Utils
    chill(sleepMore = true): void {
        bot.combat.cancelAutoAttack();
        bot.combat.cancelTarget();

        const cells = bot.map.cells ?? [];
        const mobs = bot.monsters?.mapMonsters ?? [];

        const safeCell =
            [
                ...cells.filter(
                    (c) =>
                        !!c?.trim() &&
                        !(c.toLowerCase() === "Wait".toLowerCase()) &&
                        !(c.toLowerCase() === "Blank".toLowerCase()) &&
                        !c.toLowerCase().startsWith("cut"),
                ),
            ].sort((a, b) =>
                compare(
                    ((c) => mobs.filter((m) => m?.cell === c).length)(a),
                    ((c) => mobs.filter((m) => m?.cell === c).length)(b),
                ),
            )[0] ?? bot.player.cell;

        const pad = !bot.player.pad?.trim() ? "Left" : bot.player.pad;

        this.log("CHILL", `🍃 Safe cell: ${safeCell} (${pad})`);

        while (!bot.shouldExit && bot.player.state === 2) {
            if (!this.isInCell(safeCell)) {
                bot.map.jump(safeCell, pad);
            }

            bot.sleep(this.d1);
        }

        if (sleepMore) {
            bot.sleep(this.d3);
        }
    }

    log(category: string, message: string): void {
        if (!category?.trim() || !message?.trim()) {
            return;
        }
        if (this.signalOn) bot.log(`[${category}] ${message}`);
    }

    //#endregion
    //#region Skills
    readonly skillsDelay = 50;

    *skillsAsync(): Generator<TaskStep, void, boolean> {
        while (!bot.shouldExit) {
            try {
                if (!bot.player.alive) {
                    yield until(() => bot.player.alive, 20);
                }
                this.skills();
            } catch (error) {
                rethrowIfStopped(error);
                // C# waits a second after a failed delay; a failing rotation goes on at once.
            }

            yield this.skillsDelay;
        }
    }

    notUltraDage(): boolean {
        return !(bot.map.name?.toLowerCase() === "ultradage"?.toLowerCase());
    }

    skills(): void {
        // C# waits up to 2 s for a revive here; skillsAsync waits with `yield`.
        if (!bot.player.alive) {
            return;
        }

        if (!bot.player.hasTarget) {
            return;
        }

        const className = bot.player.currentClass?.toLowerCase() ?? null;
        if (!className?.trim()) {
            return;
        }

        switch (className) {
            //#region Ultra Classes
            // Ultra classes
            case "legion revenant":

            case "legion revenant (ioda)":
                this.legionRevenantClass();
                break;
            case "archpaladin":
                this.archPaladinClass();
                break;
            case "stonecrusher":
                this.stoneCrusherClass();
                break;
            case "infinity titan":
                this.infinityTitanClass();
                break;
            case "lord of order":
                this.lordsOfOrderClass();
                break;
            case "void highlord":

            case "void highlord (ioda)":
                this.voidHighlordClass();
                break;
            case "chaos avenger":
                this.chaosAvengerClass();
                break;
            case "lightcaster":
                this.lightCasterClass();
                break;
            case "legion doomknight":
                this.legionDoomKnightClass();
                break;
            case "dragon of time":
                this.dragonOfTimeClass();
                break;
            case "archmage":
                this.archmageClass();
                break;
            case "verus doomknight":
                this.verusDoomKnight();
                break;
            case "arcana invoker":
                this.arcanaInvokerClass();
                break;
            //#endregion
            //#region Chrono Classes
            // Chrono classes
            case "archivist of time":
                this.archivistofTime();
                break;
            case "chrono dragonknight":

            case "chrono dataknight":
                this.chronoDataKnightClass();
                break;
            case "shadowstalker of time":

            case "shadowweaver of time":

            case "shadowwalker of time":
                this.shadowWeaverOfTimeClass();
                break;
            case "continuum chronomancer":

            case "quantum chronomancer":
                this.quantumChronomancerClass();
                break;
            case "nechronomancer":

            case "necrotic chronomancer":
                this.necroticChronomancerClass();
                break;
            case "legion paladin":

            case "obsidian paladin chronomancer":
                this.obsidianPaladinChronomancerClass();
                break;
            case "chrono shadowslayer":

            case "chrono shadowhunter":
                this.chronoShadowSlayerClass();
                break;
            case "Phantom Chronmancer":

            case "Phantasm Chronmancer":
                this.phantomPhantasmChronomancer();
                break;
            //#endregion
            //#region  Common classes
            // Common classes
            case "master ranger":
                this.masterRangerClass();
                break;
            case "dragonslayer general":
                this.dragonslayerGeneralClass();
                break;
            case "cryomancer":
                this.cryomancerClass();
                break;
            case "dragon knight":
                this.dragonKnightClass();
                break;
            case "shaman":
                this.shamanClass();
                break;
            case "evolved shaman":
                this.evolvedShamanClass();
                break;
            case "dark legendary hero":
                this.darkLegendaryHeroClass();
                break;
            case "necromancer":
                this.necromancerClass();
                break;
            case "chrono assassin":
                this.chronoAssassinClass();
                break;
            case "guardian":
                this.guardianClass();
                break;
            case "great thief":
                this.greatThiefClass();
                break;
            case "chaos slayer berserker":

            case "chaos slayer cleric":

            case "chaos slayer mystic":

            case "chaos slayer thief":

            case "chaos slayer":
                this.chaosSlayerClass();
                break;
            //#endregion
            //#region Basic classes
            // Basic classes
            case "mage":

            case "mage (rare)":
                this.mageClass();
                break;
            case "dragonslayer":
                this.dragonslayerClass();
                break;
            //#endregion
            default:
                // use base 1-2-3-4
                this.basicClass();
                break;
        }
    }

    basicClass(): void {
        if (this.cast(1)) {
            return;
        }
        if (this.cast(2)) {
            return;
        }
        if (this.cast(3)) {
            return;
        }
        if (this.cast(4)) {
            return;
        }
    }

    // --- ultra classes ---------------------------------------------------------------

    kingsEcho(): void {
        // --- 1. EMERGENCY ULTRA SHIELD RULE ---
        if (this.isHealthLow(50) && this.notUltraDage()) {
            if (this.cast(3)) {
                return;
            }
        }

        // --- 2. EMERGENCY MANA RECOVERY ---
        // If mana drops below 20 (the cost of Skill 3), force-cast CORVAK!
        // to refill your mana bar instantly, ignoring stack counts.
        if (bot.player.mana < 20) {
            if (this.cast(4)) {
                return;
            }
        }

        // --- 3. MAIN ULTRA COMBO (OPTIMAL NUKE) ---
        const energyStacks = this.getAuraStacks("Residual Energy", true);

        // If we are safely building stacks and hit our optimal low-mana/high-stack window
        if (energyStacks >= 6 && bot.player.mana < 40) {
            if (this.cast(4)) {
                return;
            }
        }

        // --- 4. STACK BUILDERS ---
        if (this.cast(1)) {
            return;
        }

        if (this.cast(2)) {
            return;
        }
    }

    legionRevenantClass(): void {
        if (this.cast(3)) {
            return;
        }
        if (this.cast(2)) {
            return;
        }
        if (this.cast(1)) {
            return;
        }
        if (this.cast(4)) {
            return;
        }
    }

    lordsOfOrderClass(): void {
        if (this.notUltraDage()) {
            if (this.cast(2)) {
                return;
            }
        }
        if (this.left("Empowerment", 2, true)) {
            if (this.cast(1)) {
                return;
            }
        }
        if (this.left("Clarity", 2, true)) {
            if (this.cast(3)) {
                return;
            }
        }
        if (this.cast(4)) {
            return;
        }
    }

    phantomPhantasmChronomancer(): void {
        if (this.cast(3)) {
            return;
        }
        if (this.cast(2)) {
            return;
        }
        if (this.cast(1)) {
            return;
        }
        if (this.cast(2)) {
            return;
        }
        if (this.cast(1)) {
            return;
        }
        if (this.cast(2)) {
            return;
        }
        if (this.cast(1)) {
            return;
        }
        if (this.cast(2)) {
            return;
        }
        if (this.cast(1)) {
            return;
        }
        if (this.cast(3)) {
            return;
        }
        if (this.cast(1)) {
            return;
        }
        if (this.cast(3)) {
            return;
        }
        if (this.cast(2)) {
            return;
        }
        if (this.cast(4)) {
            return;
        }
    }

    stoneCrusherClass(): void {
        // 1. Step 3: Stalagmite (Core Debuff)
        if (this.cast(2)) {
            return;
        }

        // 2. Step 5: Land's Embrace (Team Shield / Sustain)
        if (this.cast(4)) {
            return;
        }

        // 3. Step 4: Fault Line (Haste / Team DPS Buff)
        if (this.cast(3)) {
            return;
        }

        // 4. Step 2: Echoing Earth (Defense Shield / HoT)
        if (this.cast(1)) {
            return;
        }
    }

    infinityTitanClass(): void {
        const mode = this.getMode("InfinityTitan");

        if (mode === "Ultra") {
            if (this.isHealthLow(80) || (this.isArmyHealthLow(80) && this.hasAura("Anima", true))) {
                if (this.cast(3)) {
                    return;
                }
            }
            if (this.left("Universal Power", 1, true)) {
                if (this.cast(2)) {
                    return;
                }
            }
            if (this.cast(4)) {
                return;
            }
            if (this.cast(1)) {
                return;
            }
        } else {
            if (this.isHealthLow(80) || this.isArmyHealthLow(80)) {
                if (this.cast(3)) {
                    return;
                }
            }
            if (this.hasAura("Anima", true)) {
                if (this.cast(4)) {
                    return;
                }
            }
            if (this.left("Universal Power", 1, true)) {
                if (this.cast(2)) {
                    return;
                }
            }
            if (this.cast(1)) {
                return;
            }
        }
    }

    archPaladinClass(): void {
        // Hymn of Light (Heal) is action bar button 2
        if (this.notUltraDage()) {
            if (this.cast(2)) {
                return;
            }
        }

        // Righteous Seal is action bar button 3
        // If the monster target does NOT have the debuff, apply it
        if (!this.hasAura("Righteous Seal")) {
            if (this.cast(3)) {
                return;
            }
        }

        // Sacred Magic: Eden (Nuke) is action bar button 4
        // Only cast this if the target HAS the aura, and it has 1 second or less remaining
        if (this.hasAura("Righteous Seal") && this.left("Righteous Seal", 2)) {
            if (this.cast(4)) {
                return;
            }
        }

        // Commandment (Spam debuff) is action bar button 1
        if (this.cast(1)) {
            return;
        }
    }

    voidHighlordClass(): void {
        if (this.hasAura("Unshackled", true)) {
            if (this.cast(4)) {
                return;
            }
        }
        if (this.isHealthHigh(60)) {
            if (this.cast(1)) {
                return;
            }
        }
        if (this.cast(2)) {
            return;
        }
        if (this.isHealthHigh(60)) {
            if (this.cast(3)) {
                return;
            }
        }
    }

    chaosAvengerClass(): void {
        if (this.cast(2)) {
            return;
        }
        if (this.cast(4)) {
            return;
        }
        if (this.cast(1)) {
            return;
        }
        if (this.cast(3)) {
            return;
        }
    }

    lightCasterClass(): void {
        if (this.isHealthLow(85) || this.isArmyHealthLow(85) || this.left("Illuminated", 1, true)) {
            if (this.cast(3)) {
                return;
            }
        }
        if (this.cast(4)) {
            return;
        }
        if (this.cast(1)) {
            return;
        }
        if (this.cast(2)) {
            return;
        }
    }

    legionDoomKnightClass(): void {
        if (this.cast(4)) {
            return;
        }
        if (this.cast(1)) {
            return;
        }
        if (this.cast(2)) {
            return;
        }
        if (this.cast(3)) {
            return;
        }
    }

    dragonOfTimeClass(): void {
        if (this.isHealthLow(95)) {
            if (this.cast(2)) {
                return;
            }
        }
        if (this.hasAura("Convergence", true)) {
            if (this.cast(3)) {
                return;
            }
        }
        if (this.isHealthHigh(60)) {
            if (this.cast(4)) {
                return;
            }
        }
        if (this.cast(1)) {
            return;
        }
    }

    archmageClass(): void {
        if (this.isManaLow(30)) {
            if (this.cast(2)) {
                return;
            }
        }
        if (
            this.hasAura("Arcane Flux", true) &&
            !this.hasAura("Corporeal Ascension", true) &&
            !this.hasAura("Astral Ascension", true)
        ) {
            if (this.cast(4)) {
                return;
            }
        }
        if (this.hasAura("Corporeal Ascension", true) && !this.hasAura("Astral Ascension", true)) {
            if (this.cast(4)) {
                return;
            }
        }
        if (this.cast(1)) {
            return;
        }
        if (this.cast(3)) {
            return;
        }
    }

    verusDoomKnight(): void {
        if (this.isHealthLow(50)) {
            if (this.cast(2)) {
                return;
            }
        }
        if (this.getAuraStacks("Doom", true) > 9) {
            if (this.cast(4)) {
                return;
            }
        }
        if (this.cast(1)) {
            return;
        }
        if (this.cast(2)) {
            return;
        }
        if (this.cast(3)) {
            return;
        }
    }

    arcanaInvokerClass(): void {
        const standardRotation = (): void => {
            if (this.cast(2)) {
                return;
            }
            if (this.cast(4)) {
                return;
            }
            if (this.cast(3)) {
                return;
            }
        };
        if (this.hasAura("XXI - The World", true)) {
            if (this.left("XXI - The World", 8, true)) {
                if (this.cast(1)) {
                    return;
                }
            }

            standardRotation();
        } else {
            const hasJudgement = this.hasAura("XX - Judgement", true);
            const hasFool = this.hasAura("0 - The Fool", true);
            const needsFool = !hasFool || !this.hasAnyAuraOtherThan("0 - The Fool", true);

            if ((hasJudgement && hasFool) || needsFool) {
                if (this.cast(1)) {
                    return;
                }
            }

            if (hasFool) {
                standardRotation();
            }
        }
    }

    // --- chrono classes ---------------------------------------------------------------

    archivistofTime(): void {
        if (this.cast(0)) {
            return;
        }
        if (this.cast(2)) {
            return;
        }
        if (this.cast(2)) {
            return;
        }
        if (this.cast(0)) {
            return;
        }
        if (this.cast(2)) {
            return;
        }
        if (this.cast(3)) {
            return;
        }
        if (this.cast(0)) {
            return;
        }
        if (this.cast(1)) {
            return;
        }
        if (this.cast(1)) {
            return;
        }
        if (this.cast(0)) {
            return;
        }
        if (this.cast(1)) {
            return;
        }
        if (this.cast(1)) {
            return;
        }
        if (this.cast(0)) {
            return;
        }
        if (this.cast(1)) {
            return;
        }
        if (this.cast(1)) {
            return;
        }
        if (this.cast(0)) {
            return;
        }
        if (this.cast(1)) {
            return;
        }
        if (this.cast(1)) {
            return;
        }
        if (this.cast(0)) {
            return;
        }
        if (this.cast(1)) {
            return;
        }
        if (this.cast(1)) {
            return;
        }
    }

    chronoDataKnightClass(): void {
        if (this.stacks("Temporal Rift", 4, true)) {
            if (this.cast(4)) {
                return;
            }
        }
        if (this.cast(1)) {
            return;
        }
        if (this.cast(2)) {
            return;
        }
        if (this.cast(3)) {
            return;
        }
    }

    shadowWeaverOfTimeClass(): void {
        if (this.isHealthLow(50) || this.isManaLow(30)) {
            if (this.cast(3)) {
                return;
            }
        }
        if (this.stacks("Chaos Rift", 4, true)) {
            if (this.cast(4)) {
                return;
            }
        }
        if (this.cast(1)) {
            return;
        }
        if (this.cast(2)) {
            return;
        }
    }

    quantumChronomancerClass(): void {
        if (this.stacks("Temporal Rift", 4, true)) {
            if (this.cast(3)) {
                return;
            }
        }
        if (this.hasAura("Quantum Restructure", true)) {
            if (this.cast(4)) {
                return;
            }
        }
        if (this.cast(2)) {
            return;
        }
        if (this.cast(1)) {
            return;
        }
    }

    necroticChronomancerClass(): void {
        if (this.stacks("Chaos Rift", 4, true)) {
            if (this.cast(3)) {
                return;
            }
        }
        if (this.left("Debilitated", 2)) {
            if (this.cast(4)) {
                return;
            }
        }
        if (this.cast(2)) {
            return;
        }
        if (this.cast(1)) {
            return;
        }
    }

    obsidianPaladinChronomancerClass(): void {
        if (this.isHealthLow(50) || this.isArmyHealthLow(50)) {
            if (this.cast(3)) {
                return;
            }
        }
        if (this.isHealthLow(80) || this.isArmyHealthLow(80)) {
            if (this.cast(2)) {
                return;
            }
        }
        if (this.stacks("Temporal Rift", 4, true)) {
            if (this.cast(4)) {
                return;
            }
        }
        if (this.cast(1)) {
            return;
        }
    }

    private _alt23: boolean = false;

    chronoShadowSlayerClass(): void {
        // Snapshot
        const mana = bot.player.mana;
        const rift = Math.trunc(bot.self.getAura("Temporal Rift")?.value ?? 0);
        const rounds = Math.trunc(bot.self.getAura("Rounds Empty")?.value ?? 0);

        // High mana phase
        if (mana > 20) {
            if (rift >= 4) {
                if (this.cast(4)) {
                    bot.wait.forTrue(() => Math.trunc(bot.self.getAura("Temporal Rift")?.value ?? 0) === 0, 20);
                    return;
                }
            }

            if (this._alt23) {
                if (this.cast(2)) {
                    this._alt23 = false;
                    bot.sleep(100);
                    return;
                }
            } else {
                if (this.cast(3)) {
                    this._alt23 = true;
                    bot.sleep(100);
                    return;
                }
            }
        }

        // Low mana phase use nuke ability
        if (mana < 20 && bot.skills.canUseSkill(4)) {
            if (this.cast(4)) {
                bot.sleep(100);
                return;
            }
        } else if (mana < 20 && rounds > 0) {
            if (this.cast(1)) {
                bot.wait.forTrue(() => !bot.self.hasActiveAura("Rounds Empty"), 20);
                return;
            }
        }
    }

    // --- common classes ---------------------------------------------------------------

    masterRangerClass(): void {
        if (this.hasAura("Vampiric Shot", true)) {
            if (this.cast(3)) {
                return;
            }
        }
        if (this.stacks("Marks", 6, true)) {
            if (this.cast(4)) {
                return;
            }
        }
        if (this.stacks("Marks", 3, true)) {
            if (this.cast(2)) {
                return;
            }
        }
        if (this.cast(1)) {
            return;
        }
    }

    dragonslayerGeneralClass(): void {
        if (this.hasAura("General's Dragonbane")) {
            if (this.cast(2)) {
                return;
            }
        }
        if (this.hasAura("General's Dragonbane")) {
            if (this.cast(3)) {
                return;
            }
        }
        if (this.cast(4)) {
            return;
        }
        if (this.cast(1)) {
            return;
        }
    }

    cryomancerClass(): void {
        if (this.isHealthLow(60) && this.hasAura("Polar Vortex", true)) {
            if (this.cast(3)) {
                return;
            }
        }
        if (this.hasAura("Frozen") && this.hasAura("Polar Vortex", true)) {
            if (this.cast(2)) {
                return;
            }
        }
        if (this.cast(1)) {
            return;
        }
        if (this.cast(4)) {
            return;
        }
    }

    dragonslayerClass(): void {
        if (this.hasAura("Dragonbane") && !this.hasAura("Infected Wound")) {
            if (this.cast(2)) {
                return;
            }
        }
        if (this.hasAura("Dragonbane") && !this.hasAura("Weakened")) {
            if (this.cast(3)) {
                return;
            }
        }
        if (this.cast(4)) {
            return;
        }
        if (this.cast(1)) {
            return;
        }
    }

    dragonKnightClass(): void {
        if (this.cast(1)) {
            return;
        }
        if (this.hasAura("Flammable")) {
            if (this.cast(4)) {
                return;
            }
        }
        if (this.cast(2)) {
            return;
        }
        if (this.hasAura("Dumbfounded")) {
            if (this.cast(3)) {
                return;
            }
        }
    }

    shamanClass(): void {
        if (this.left("Elemental Embrace", 5)) {
            if (this.cast(4)) {
                return;
            }
        }
        if (this.hasAura("Elemental Embrace")) {
            if (this.cast(3)) {
                return;
            }
        }
        if (this.hasAura("Scorched Spirit")) {
            if (this.cast(2)) {
                return;
            }
        }
        if (this.cast(1)) {
            return;
        }
    }

    evolvedShamanClass(): void {
        if (this.isHealthLow(80) || this.isArmyHealthLow(80)) {
            if (this.cast(3)) {
                return;
            }
        }
        if (this.left("Elemental Grasp", 5)) {
            if (this.cast(4)) {
                return;
            }
        }
        if (this.cast(2)) {
            return;
        }
        if (this.cast(1)) {
            return;
        }
    }

    darkLegendaryHeroClass(): void {
        if (this.isHealthLow(30) || this.isArmyHealthLow(30)) {
            if (this.cast(4)) {
                return;
            }
        }
        if (this.cast(3)) {
            return;
        }
        if (this.cast(2)) {
            return;
        }
        if (this.cast(1)) {
            return;
        }
    }

    necromancerClass(): void {
        if (this.isManaLow(90) && this.isHealthHigh(80) && !this.hasAura("Deadly Frenzy", true)) {
            if (this.cast(3)) {
                return;
            }
        }
        if (this.isManaLow(30) && this.isHealthHigh(80) && this.hasAura("Deadly Frenzy", true)) {
            if (this.cast(3)) {
                return;
            }
        }
        if (this.isManaHigh(80) && this.isHealthHigh(80)) {
            if (this.cast(4)) {
                return;
            }
        }
        if (this.hasAura("Deadly Frenzy", true)) {
            if (this.cast(1)) {
                return;
            }
        }
        if (this.cast(2)) {
            return;
        }
    }

    chronoAssassinClass(): void {
        if (this.hasAura("Reverse Time", true)) {
            if (this.cast(4)) {
                return;
            }
        } else {
            if (this.cast(3)) {
                return;
            }
            if (this.cast(1)) {
                return;
            }
        }
        if (this.cast(2)) {
            return;
        }
    }

    guardianClass(): void {
        if (
            (this.hasAura("Hypercritical", true) || this.hasAura("Void Imbue", true)) &&
            this.stacks("Guardian Spirit", 15, true)
        ) {
            if (this.cast(4)) {
                return;
            }
        }
        if (this.isManaLow(70)) {
            if (this.cast(3)) {
                return;
            }
        }
        if (this.cast(1)) {
            return;
        }
        if (this.cast(2)) {
            return;
        }
    }

    greatThiefClass(): void {
        if (this.hasAura("Hidden Blade", true)) {
            if (this.cast(4)) {
                return;
            }
        }
        if (this.cast(3)) {
            return;
        }
        if (this.cast(1)) {
            return;
        }
        if (this.cast(2)) {
            return;
        }
    }

    chaosSlayerClass(): void {
        if (
            (this.hasAura("Impasse") || this.hasAura("Delusion") || this.hasAura("Angustied")) &&
            !this.hasAura("Corageous", true)
        ) {
            if (this.cast(4)) {
                return;
            }
        }
        if (this.cast(3)) {
            return;
        }
        if (this.cast(1)) {
            return;
        }
        if (this.cast(2)) {
            return;
        }
    }

    // --- basic classes ---------------------------------------------------------------

    mageClass(): void {
        if (this.left("Arcane Shield", 1, true)) {
            if (this.cast(4)) {
                return;
            }
        }
        if (this.hasAura("Frozen Blood")) {
            if (this.cast(1)) {
                return;
            }
        }
        if (this.hasAura("Scorched")) {
            if (this.cast(3)) {
                return;
            }
        }
        if (this.cast(2)) {
            return;
        }
    }

    archFiend(): void {
        // 1. Fiend Frenzy - 120% Crit Damage party buff (Use when available)
        if (this.cast(4)) {
            return;
        }

        // 2. Mark of Death - Free damage stack application
        if (this.cast(1)) {
            return;
        }

        // 3. Fiendish Strike - Builds personal ArchFiend's Mark stacks
        if (this.cast(2)) {
            return;
        }

        // 4. Consumed by the Abyss - Essential 25% Haste & Enemy Dodge reduction
        if (this.cast(3)) {
            return;
        }
    }

    // --- helpers ---------------------------------------------------------------

    enhancements(IsTaunter = false): void {
        const playerName = bot.player?.username;
        if (!playerName?.trim()) {
            Core.logger("[ERROR] Unable to determine player name.", undefined, { stopBot: true });
            return;
        }
        const acceptableDPSClasses = new Set([
            "Legion Revenant",
            "Chrono ShadowSlayer",
            "Lich",
            "Archfiend",
            "Quantum Chronomancer",
            "Hollowborn Vindicator",
            "Arachnomancer",
            "Infinity Knight",
            "Verus DoomKnight",
            "King's Echo",
            "Phantom Chronomancer",
            "Great Thief",
        ]);

        // Only equip if current class is NOT in the list
        const currentClass = bot.player.currentClass;
        if (!IsTaunter && !!currentClass && !acceptableDPSClasses.has(currentClass)) {
            const classToEquip = (
                bot.inventory.items.concat(...bot.bank.items).find((x) => acceptableDPSClasses.has(x.name)) ?? null
            )?.name;

            if (!!classToEquip) {
                Core.equip(classToEquip);
            }
        }
        // Cache currently equipped items
        const weaponItem =
            bot.inventory?.items?.find((x) => x?.equipped === true && Adv.weaponCatagories.includes(x.category)) ??
            null;
        const helmItem = bot.inventory?.items?.find((x) => x?.equipped === true && x.category === "Helm") ?? null;
        const capeItem = bot.inventory?.items?.find((x) => x?.equipped === true && x.category === "Cape") ?? null;
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
                Adv.enhanceItem(cape, EnhancementType.Wizard, { cSpecial: CapeSpecial.Vainglory });
                // or Lament if needed
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
                Adv.enhanceItem(helm, EnhancementType.Lucky, { hSpecial: HelmSpecial.Forge });
                // or Vim if needed
                Adv.enhanceItem(className, EnhancementType.Lucky);
                Adv.enhanceItem(weapon, EnhancementType.Lucky, { wSpecial: WeaponSpecial.Dauntless });
                // or Lucky HealthVamp
                Adv.enhanceItem(cape, EnhancementType.Lucky, { cSpecial: CapeSpecial.Vainglory });
                break;
        }
    }

    cast(index: number): boolean {
        return (
            index >= 1 && index <= 4 && bot?.skills != null && bot.skills.canUseSkill(index) && this.tryUseSkill(index)
        );
    }

    private tryUseSkill(index: number): boolean {
        try {
            bot.skills.useSkill(index);
            return true;
        } catch (error) {
            rethrowIfStopped(error);
            return false;
        }
    }

    /** Cancels the skill task only (unlike CoreEnginev3, the skills and the target are left alone). */
    disableSkills(): void {
        tasks.cancel(CoreEngine.SKILLS_TASK);
    }

    enableSkills(): void {
        if (tasks.running(CoreEngine.SKILLS_TASK)) {
            return;
        }

        tasks.start(CoreEngine.SKILLS_TASK, () => this.skillsAsync());
    }

    /** Keyed by the lowercase class name (C#'s OrdinalIgnoreCase). */
    private _classRotationMode: Map<string, string> = new Map();

    setClassRotation(className: string, mode: string): void {
        if (!className?.trim() || !mode?.trim()) {
            return;
        }

        this._classRotationMode.set(className.toLowerCase(), mode);
        this.log("Rotation", `${className} set to ${mode} mode`);
    }

    private getMode(className: string): string {
        return this._classRotationMode.get(className.toLowerCase()) ?? "Default";
    }

    //#endregion
}

function compare(a: any, b: any): number {
    return a < b ? -1 : a > b ? 1 : 0;
}

/** C#'s `monsters.GroupBy(m => m.Cell).OrderByDescending(g => g.Count()).Select(g => g.Key).FirstOrDefault()`. */
function mostCommonCell(monsters: Monster[]): string | null {
    const counts = new Map<string, number>();
    for (const m of monsters) counts.set(m.cell, (counts.get(m.cell) ?? 0) + 1);
    let best: string | null = null;
    let most = 0;
    // On a tie the first cell wins, as LINQ's stable OrderByDescending keeps the first group.
    for (const [cell, count] of counts) {
        if (count > most) {
            best = cell;
            most = count;
        }
    }
    return best;
}

/** C#'s `new PlayerStats()`. */
function emptyStats(): PlayerStats {
    return {
        haste: 0,
        strength: 0,
        wisdom: 0,
        dexterity: 0,
        endurance: 0,
        intellect: 0,
        luck: 0,
        attackPower: 0,
        spellPower: 0,
        criticalChance: 0,
        criticalMultiplier: 0,
        evasionChance: 0,
    };
}

/** C#'s `CoreEnginev3.MonsterKey` record: matches monsters by map ID, name and/or type ID. */
export class MonsterKey {
    constructor(
        readonly mapId: number | null = null,
        readonly name: string | null = null,
        readonly id: number | null = null,
    ) {}

    /** A null name gives an empty key, which matches every monster (as in C#). */
    static fromName(name: string | null | undefined): MonsterKey {
        if (name != null) {
            return new MonsterKey(null, name);
        }
        return new MonsterKey();
    }

    static fromId(id: number | null | undefined): MonsterKey | null {
        if (id != null) {
            return new MonsterKey(null, null, id);
        }
        return null;
    }

    static fromMapId(mapId: number | null | undefined): MonsterKey | null {
        if (mapId != null) {
            return new MonsterKey(mapId);
        }
        return null;
    }
}

/** The settings of C#'s longer `KillQuest` overloads. */
export interface KillQuestOptions {
    quantity?: number;
    isTemp?: boolean;
    useBestGear?: boolean;
    altJump?: boolean;
    jumpCell?: string | null;
    jumpPad?: string;
    priority?: boolean;
}

/** C#'s named `BuyItem` settings. */
export interface BuyItemOptions {
    ensureMap?: boolean;
    calculateRemaining?: boolean;
    skipIfHaveEnough?: boolean;
    considerBank?: boolean;
    checkGold?: boolean;
    checkLevel?: boolean;
    checkInvSpace?: boolean;
    loadTimeoutMs?: number;
}

/** C#'s `CoreEnginev3.Gear` record. */
export interface Gear {
    name: string;
    group: string;
    fromBank: boolean;
    all: number;
    race: number;
}

/** Skua's `Monster.Alive`. */
function isMonsterAlive(m: Monster): boolean {
    return m.hp > 0 && m.state > 0;
}

/** `ChooseBestEnhancement`'s names for `EnhancementPatternID`. */
const ENHANCEMENT_NAMES: Record<number, string> = {
    1: "Adventurer",
    2: "Fighter",
    3: "Thief",
    4: "Armsman",
    5: "Hybrid",
    6: "Wizard",
    7: "Healer",
    8: "Spellbreaker",
    9: "Lucky",
    10: "Forge",
    11: "Absolution",
    12: "Avarice",
    23: "Depths",
    24: "Vainglory",
    25: "Vim",
    26: "Examen",
    27: "Pneuma",
    28: "Anima",
    29: "Penitence",
    30: "Lament",
    32: "Hearty",
};

/** `ChooseBestEnhancement`'s names for the weapon `ProcID`. */
const WEAPON_TRAITS: Record<number, string> = {
    2: "Spiral Carve",
    3: "Awe Blast",
    4: "Health Vamp",
    5: "Mana Vamp",
    6: "Powerword Die",
    7: "Ravenous",
    8: "Lacerate",
    9: "Smite",
    10: "Valiance",
    11: "Arcana's Concerto",
    12: "Elysium",
    13: "Acheron",
    14: "Praxis",
    15: "Dauntless",
    99: "Forge",
};

/** Skua's `Aura.RemainingTime`: whole seconds until the aura expires (0 when unknown). */
export function auraRemainingTime(aura: Aura): number {
    return aura != null && aura.timeStamp > 0 && aura.duration > 0
        ? Math.max(0, Math.trunc((aura.timeStamp + aura.duration * 1000 - Date.now()) / 1000))
        : 0;
}

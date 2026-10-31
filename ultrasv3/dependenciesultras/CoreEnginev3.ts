/*
name: null
description: null
tags: null
*/
// Port of the parts of Scripts/Ultrasv3/DependenciesUltras/CoreEnginev3.cs that the ported Ultras
// reach: Boot, the boss checks, Potions & Scrolls, Auras, Player, Map, Utils and the skill engine
// (SkillsAsync and the class rotations). The Quest, Items, Best Enhancement, Combat, Factions, Best
// Gear, Shop and Drops regions aren't ported yet; port them in C# order when a script needs them.
//
// Turu: C#'s `Task.Run(() => SkillsAsync(token))` is the `UltraSkills` task of core/CoreTasks.ts,
// stepped every 100 ms (`skillsDelay`) between the script's bot calls; DisableSkills cancels it.
// A rotation that waits (Chrono ShadowSlayer's `Wait.ForTrue`, the 100 ms sleeps) pauses the whole
// script for that long, where C# only paused its skill thread.
// `OnSignal` (an event only Boot subscribes to) logs straight away.

import { type Aura, bot, type EventMap, type Monster, type PlayerStats } from "turu";
import { CapeSpecial, CoreAdvanced, EnhancementType, HelmSpecial, WeaponSpecial } from "../../core/CoreAdvanced";
import { Core, rethrowIfStopped } from "../../core/CoreBots";
import { type TaskStep, tasks, until } from "../../core/CoreTasks";

const Adv = new CoreAdvanced();

export class CoreEnginev3 {
    private static _instance: CoreEnginev3 | null = null;
    /** C#'s `CoreEnginev3.Instance`, which the helpers use (a script's own `new()` is another one). */
    static get instance(): CoreEnginev3 {
        return (CoreEnginev3._instance ??= new CoreEnginev3());
    }

    readonly _cache: Map<string, unknown | null> = new Map();
    readonly _throttle: Map<string, number> = new Map();

    /** C#'s `_runSkills`: the name of the skill loop's task. */
    private static readonly SKILLS_TASK = "UltraSkills";

    throttleDuration: number = 3 * 1000;
    /** C#'s `OnSignal`: Boot subscribes `Bot.Log` to it, OnScriptStopping removes it. */
    private signalOn = false;

    //#region Settings
    d1 = 250;
    d2 = 700;
    d3 = 1400;
    d4 = 2800;

    notUltraDage(): boolean {
        const mapName = bot.map.name ?? "";
        const targetName = bot.player.target?.name ?? "";
        const onDageMap = mapName.toLowerCase() === "ultradage".toLowerCase();
        const targetingDage = targetName.toLowerCase() === "Dage the Dark Lord".toLowerCase();
        return !(onDageMap || targetingDage);
    }

    notUltraDarkon(): boolean {
        const mapName = bot.map.name ?? "";
        const targetName = bot.player.target?.name ?? "";
        const onDarkonMap = mapName.toLowerCase() === "ultradarkon".toLowerCase();
        const targetingDarkon = targetName.toLowerCase() === "Darkon the Conductor".toLowerCase();
        return !(onDarkonMap || targetingDarkon);
    }

    notUltraSpeaker(): boolean {
        const mapName = bot.map.name ?? "";
        const targetName = bot.player.target?.name ?? "";
        const onSpeakerMap = mapName.toLowerCase() === "ultraspeaker".toLowerCase();
        const targetingSpeaker = targetName.toLowerCase() === "The First Speaker".toLowerCase();
        return !(onSpeakerMap || targetingSpeaker);
    }

    notKolr(): boolean {
        const mapName = bot.map.name ?? "";
        const targetName = bot.player.target?.name ?? "";
        const onKolrMap = mapName.toLowerCase().includes("flameusurper".toLowerCase());
        const targetingKolr = targetName.toLowerCase().includes("Kolr".toLowerCase());
        return !(onKolrMap || targetingKolr);
    }

    notAstral(): boolean {
        const mapName = bot.map.name ?? "";
        const targetName = bot.player.target?.name ?? "";
        const onAstralMap = mapName.toLowerCase().includes("astralshrine".toLowerCase());
        const targetingAstral = targetName.toLowerCase().includes("Astral Empyrean".toLowerCase());
        return !(onAstralMap || targetingAstral);
    }

    kolrLowHp(): boolean {
        if (this.notKolr()) {
            return false;
        }

        const target = bot.player.target;
        if (target == null || target.maxHp <= 0) {
            return false;
        }

        return (target.hp / target.maxHp) * 100 < 70;
    }

    boot(): void {
        if (tasks.running(CoreEnginev3.SKILLS_TASK)) {
            return;
        }

        this.signalOn = true;

        bot.events.on("scriptStopping", this.onScriptStopping);
        bot.ultraBossHelper.disableCounterAttack();

        bot.skills.stop();
        tasks.start(CoreEnginev3.SKILLS_TASK, () => this.skillsAsync());
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
        Core.join("whitemap-100000");
    }

    bootNoSkills(): void {
        // Properly kill any lingering SkillsAsync task from a previous run
        tasks.cancel(CoreEnginev3.SKILLS_TASK);

        this.signalOn = true;

        bot.events.on("scriptStopping", this.onScriptStopping);
        bot.ultraBossHelper.disableCounterAttack();

        bot.skills.stop();
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
        Core.join("whitemap-100000");
    }

    onScriptStopping = (_e: EventMap["scriptStopping"]): boolean => {
        this.disableSkills();
        Core.jumpWait();
        Core.logger("System offline");

        bot.lite.hidePlayers = false;
        this.signalOn = false;

        this._cache.clear();
        this._throttle.clear();
        return true;
    };

    //#endregion
    //#region Potions & Scrolls
    usePotion(): void {
        this.chill();
        bot.sleep(this.d2);
        this.cast(5);
        bot.sleep(this.d2);
    }

    equipConsumable(name: string): void {
        if (!name?.trim()) {
            return;
        }

        this.chill();
        if (!Core.checkInventory(name)) {
            return;
        }

        this.whiteMap();
        this.tryEquipConsumableItem(name);
    }

    equipEnrage(): void {
        const scroll = "Scroll of Enrage";

        if (!Core.checkInventory(scroll)) {
            return;
        }

        this.chill();
        this.whiteMap();
        this.tryEquipConsumableItem(scroll);
    }

    equipDecay(): void {
        const scroll = "Scroll of Decay";

        if (!Core.checkInventory(scroll)) {
            return;
        }

        this.chill();
        this.whiteMap();
        this.tryEquipConsumableItem(scroll);
    }

    private tryEquipConsumableItem(name: string): boolean {
        if (!name?.trim()) {
            return false;
        }

        const item = bot.inventory.getItem(name);
        if (item == null) {
            return false;
        }

        if (bot.inventory.isEquipped(name) && item.id > 0) {
            bot.send.packet(`%xt%zm%unequipItem%${bot.map.roomId}%${item.id}%`);
            bot.sleep(this.d1);
        }

        for (let attempt = 0; attempt < 3; attempt++) {
            bot.inventory.equipUsableItem(name);
            bot.sleep(this.d3);
            bot.wait.forItemEquip(name);
            if (bot.inventory.isEquipped(name)) {
                return true;
            }

            if (item.id > 0) {
                bot.send.packet(`%xt%zm%unequipItem%${bot.map.roomId}%${item.id}%`);
                bot.sleep(500);
            }
        }

        return bot.inventory.isEquipped(name);
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
            this.log("MAP", `🌍 Joined ${mapName}`);
            if (!!cell?.trim() && !this.isInCell(cell)) {
                bot.map.jump(cell, pad);
            }
        } else {
            this.log("MAP", `❌ Failed to join ${mapName} (${target})`);
        }
    }

    chooseBestCell(
        monsterNames: string | null,
        alt = false,
        setCell: string | null = null,
        setPad = "Spawn",
    ): [BestCell: string | null, BestPad: string | null] {
        const names = (monsterNames ?? "")
            .split(/[,|]/)
            .filter((x) => x)
            .map((n) => n.trim())
            .filter((n) => n.length > 0);

        const wildcard = names.length === 0 || (names.length === 1 && names[0] === "*");
        const pad = !setPad?.trim() ? "Left" : setPad;

        const monsters = (bot.monsters.mapMonsters ?? [])
            .filter((m) => m != null && !!m.cell?.trim())
            .filter((m) => wildcard || names.some((name) => m.name ?? ""?.toLowerCase() === name?.toLowerCase()));

        if (monsters.length === 0) {
            this.log("MAP", "❌ No matching monsters found");
            return [null, null];
        }

        const targetCell = !!setCell?.trim() ? setCell : alt ? (monsters[0] ?? null)?.cell : mostCommonCell(monsters);

        if (!targetCell?.trim()) {
            this.log("MAP", "❌ No valid target cell");
            return [null, null];
        }

        const mapCells = new Set((bot.map.cells as string[]) ?? []);
        if (!mapCells.has(targetCell)) {
            this.log("MAP", `❌ Cell not in map: ${targetCell}`);
            return [null, null];
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

        return [targetCell, pad];
    }

    /**
     * Identical to ChooseBestCell but treats the entire monsterNames string as a single monster name
     * (no comma/pipe splitting). Use this for monsters with commas in their name like "Kolr, Usurper of Flames".
     *
     * @param monsterName Single monster name (commas treated as part of the name, not separators).
     * @param alt If true, picks the first monster's cell instead of the most populated.
     * @param setCell Explicit cell override.
     * @param setPad Pad to jump to (default "Spawn").
     */
    chooseBestCellOneMonster(
        monsterName: string | null,
        alt = false,
        setCell: string | null = null,
        setPad = "Spawn",
    ): void {
        const wildcard = !monsterName?.trim() || monsterName === "*";
        const pad = !setPad?.trim() || setPad === "Spawn" ? "Left" : setPad;

        const monsters = (bot.monsters.mapMonsters ?? [])
            .filter((m) => m != null && !!m.cell?.trim())
            .filter((m) => (wildcard || m.name) ?? ""?.toLowerCase() === monsterName?.toLowerCase());

        if (monsters.length === 0) {
            this.log("MAP", `❌ No matching monsters found for "${monsterName}"`);
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

        if (this.isInCell(targetCell)) {
            this.log("MAP", `✅ Already in ${targetCell}`);
            return;
        }

        this.log("MAP", `⁀➴ Moving to '${targetCell}' (${pad})`);
        bot.map.jump(targetCell, pad, false);

        if (!this.isInCell(targetCell)) {
            this.log("MAP", `⚠️ Jump to '${targetCell}' silently failed (still at '${bot.player.cell}'). Retrying...`);
            if (bot.player.inCombat || bot.player.state === 2) {
                bot.combat.cancelAutoAttack();
                bot.combat.cancelTarget();
                bot.wait.forCombatExit();
            }
            bot.map.jump(targetCell, pad, false);
            bot.wait.forTrue(() => this.isInCell(targetCell), 10);
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
    readonly skillsDelay = 100;

    *skillsAsync(): Generator<TaskStep, void, boolean> {
        while (!bot.shouldExit) {
            try {
                // C# waits up to 2 s for a revive inside Skills(); a task waits with `yield`.
                if (!bot.player.alive) {
                    yield until(() => bot.player.alive, 20);
                }
                this.skills();
            } catch (error) {
                rethrowIfStopped(error);
            }

            yield this.skillsDelay;
        }
    }

    skills(): void {
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
            case "king's echo":
                this.kingsEcho();
                break;
            case "bard":
                this.bardClass();
                break;
            case "scion of flames":
                this.scionofFlamesClass();
                break;
            case "arachnomancer":
                this.arachnomancerClass();
                break;
            case "dragonsoul shinobi":
                this.dragonSoulShinobi();
                break;
            case "yami no ronin":
                this.yamiNoRonin();
                break;
            case "Warrior":
                this.warrior();
                break;
            case "archfiend":
                this.archFiend();
                break;
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
                this.lordOfOrderClass();
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

    bardStep = 0;
    bardLastTargetName: string | null = null;
    readonly bardSequence: number[] = [1, 4, 2, 3, 1, 2, 3, 4];

    bardClass(): void {
        if (this.bardStep < 0 || this.bardStep >= this.bardSequence.length) {
            this.bardStep = 0;
        }

        const currentTargetName = bot.player.target?.name;
        if (!(this.bardLastTargetName === currentTargetName)) {
            this.bardLastTargetName = currentTargetName ?? null;
            this.bardStep = 0;
        }

        const skillIndex = this.bardSequence[this.bardStep];
        if (bot.skills?.canUseSkill(skillIndex) !== true) {
            return;
        }

        bot.log(`[Bard] Casting skill ${skillIndex} at sequence position ${this.bardStep}`);
        if (this.tryUseSkill(skillIndex)) {
            this.bardStep = (this.bardStep + 1) % this.bardSequence.length;
            bot.log(`[Bard] Cast success skill ${skillIndex}, advancing bardStep to ${this.bardStep}`);
        }
    }

    warrior(): void {
        if (this.cast(4)) {
            return;
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

    dragonSoulShinobi(): void {
        if (this.cast(4)) {
            return;
        }

        if (this.cast(1)) {
            return;
        }
    }

    kingsEcho(): void {
        const energyStacks = this.getAuraStacks("Residual Energy", true);

        if (this.notUltraDarkon() && bot.player.mana < 26) {
            if (this.cast(4)) {
                return;
            }
        }

        if (!this.notUltraDarkon() && bot.player.mana < 37) {
            if (this.cast(4)) {
                return;
            }
        }

        if (
            this.notUltraDage() &&
            (!this.notUltraDarkon() || !this.notUltraSpeaker() || !this.notKolr()) &&
            this.kolrLowHp() &&
            !this.hasAura("Putrefaction", true) &&
            this.isHealthLow(80) &&
            this.left("Royal Resolve", 1, true)
        ) {
            if (this.cast(3)) {
                return;
            }
        }

        if (energyStacks >= 23) {
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

    scionofFlamesClass(): void {
        if (
            this.notUltraDage() &&
            (this.isHealthLow(50) || this.isArmyHealthLow(50) || this.hasAura("Purifying Flames", true))
        ) {
            if (this.cast(3)) {
                return;
            }
        }

        if (this.cast(0)) {
            return;
        }

        if (this.left("Transcending Flames", 2, true)) {
            if (this.cast(4)) {
                return;
            }
        }

        if (!this.hasAura("Fuel The Flame", true)) {
            if (this.cast(1)) {
                return;
            }
        }

        if (this.hasAura("Transcending Flames", true)) {
            if (this.cast(2)) {
                return;
            }
        }
    }

    arachnomancerClass(): void {
        if (this.isHealthHigh(40) && this.left("Panic", 1)) {
            if (this.cast(3)) {
                return;
            }
        }

        if (this.isHealthHigh(70) && this.left("Cocooned", 1)) {
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

    yamiNoRonin(): void {
        if (this.cast(1)) {
            return;
        }

        if (this.cast(4)) {
            return;
        }

        if (this.isHealthLow(70)) {
            if (this.cast(3)) {
                return;
            }
        }
    }

    archFiend(): void {
        if (this.cast(3)) {
            return;
        }

        if (this.cast(4)) {
            return;
        }

        if (this.cast(2)) {
            return;
        }

        if (this.cast(1)) {
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
    lordOfOrderClass(): void {
        if (
            this.notUltraDage() &&
            this.notKolr() &&
            this.notAstral() &&
            (this.isHealthLow(80) || this.isArmyHealthLow(80) || this.left("Resurgence", 2, true))
        ) {
            if (this.cast(2)) {
                return;
            }
        }

        if (
            !this.notKolr() &&
            !this.hasAura("Putrefaction", true) &&
            (this.isHealthLow(70) || this.isArmyHealthLow(70))
        ) {
            if (this.cast(2)) {
                return;
            }
        }

        if (!this.notAstral() && (this.isHealthLow(70) || this.isArmyHealthLow(70))) {
            if (this.cast(2)) {
                return;
            }
        }

        if (this.left("Clarity", 2, true)) {
            if (this.cast(3)) {
                return;
            }
        }

        if (this.left("Empowerment", 2, true)) {
            if (this.cast(1)) {
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
        if (this.notUltraDage()) {
            if (this.cast(3)) {
                return;
            }
        }

        if (this.cast(2)) {
            return;
        }

        if (this.cast(4)) {
            return;
        }

        if (this.cast(1)) {
            return;
        }
    }

    infinityTitanClass(): void {
        if (this.cast(2)) {
            return;
        }

        if (this.notUltraDage()) {
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

    archPaladinClass(): void {
        if (
            this.notUltraDage() &&
            this.notUltraSpeaker() &&
            this.notAstral() &&
            (this.isHealthLow(65) || this.isArmyHealthLow(65) || this.left("Hymn of Light", 2, true))
        ) {
            if (this.cast(2)) {
                return;
            }
        }

        if (!this.notUltraSpeaker()) {
            if (this.cast(2)) {
                return;
            }
        }

        if (!this.notAstral() && (this.isHealthLow(70) || this.isArmyHealthLow(70))) {
            if (this.cast(2)) {
                return;
            }
        }

        if (!this.hasAura("Righteous Seal")) {
            if (this.cast(3)) {
                return;
            }
        }

        if (this.hasAura("Righteous Seal") && this.left("Righteous Seal", 2)) {
            if (this.cast(4)) {
                return;
            }
        }

        if (this.cast(1)) {
            return;
        }
    }

    voidHighlordClass(): void {
        if (this.isHealthHigh(60)) {
            if (this.cast(3)) {
                return;
            }
        }

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
    }

    chaosAvengerClass(): void {
        if (this.cast(0)) {
            return;
        }
        if (this.cast(3)) {
            return;
        }
        if (this.cast(4)) {
            return;
        }
        if (this.cast(2)) {
            return;
        }
        if (this.cast(1)) {
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
        if (this.isHealthLow(60)) {
            if (this.cast(2)) {
                return;
            }
        }

        if (this.hasAura("Searing Timeline", true) && this.hasAura("Convergence", true)) {
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

        if (this.cast(2)) {
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
        if (this.isHealthLow(70)) {
            if (this.cast(2)) {
                return;
            }
        }

        if (this.cast(1)) {
            return;
        }

        if (this.notUltraSpeaker()) {
            if (this.cast(1)) {
                return;
            }
        }

        if (this.notUltraSpeaker()) {
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
    }

    hasArcana(): boolean {
        return (
            this.hasAura("I - The Magician", true) ||
            this.hasAura("II - The High Priestess", true) ||
            this.hasAura("III - The Empress", true) ||
            this.hasAura("IV - The Emperor", true) ||
            this.hasAura("V - The Hierophant", true) ||
            this.hasAura("VI - The Lovers", true) ||
            this.hasAura("VII - The Chariot", true) ||
            this.hasAura("VIII - Justice", true) ||
            this.hasAura("IX - The Hermit", true) ||
            this.hasAura("X - Wheel of Fortune", true) ||
            this.hasAura("XI - Strength", true) ||
            this.hasAura("XII - The Hanged Man", true) ||
            this.hasAura("XIII - Death", true) ||
            this.hasAura("XIV - Temperance", true) ||
            this.hasAura("XV - The Devil", true) ||
            this.hasAura("XVI - The Tower", true) ||
            this.hasAura("XVII - The Star", true) ||
            this.hasAura("XVIII - The Moon", true) ||
            this.hasAura("XIX - The Sun", true) ||
            this.hasAura("XX - Judgement", true)
        );
    }

    arcanaInvokerClass(): void {
        if (!this.hasAura("XXI - The World", true) && (!this.hasAura("0 - The Fool", true) || !this.hasArcana())) {
            if (this.cast(1)) {
                return;
            }
        }

        if (this.hasAura("XX - Judgement", true)) {
            if (this.cast(1)) {
                return;
            }
        }

        if (this.getAuraStacksFloat("End of the World", true) > 22) {
            if (this.cast(1)) {
                return;
            }
        }

        if (this.cast(2)) {
            return;
        }

        if (this.cast(4)) {
            return;
        }

        if (this.cast(3)) {
            return;
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
        if (this.left("Elemental Embrace", 2)) {
            if (this.cast(4)) {
                return;
            }
        }

        if (bot.player.mana > 30) {
            if (this.cast(1)) {
                return;
            }
        }

        if (bot.player.mana > 30) {
            if (this.cast(2)) {
                return;
            }
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
        if (this.notUltraDage() && (this.isHealthLow(30) || this.isArmyHealthLow(30))) {
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
        if (this.left("Arcane Shield", 2, true)) {
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
            "Mage",
            "Warrior",
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
            index >= 0 && index <= 5 && bot?.skills != null && bot.skills.canUseSkill(index) && this.tryUseSkill(index)
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

    disableSkills(): void {
        tasks.cancel(CoreEnginev3.SKILLS_TASK);

        bot.skills.stop();
        bot.combat.cancelAutoAttack();
        bot.combat.cancelTarget();
    }

    enableSkills(): void {
        if (tasks.running(CoreEnginev3.SKILLS_TASK)) {
            return;
        }

        tasks.start(CoreEnginev3.SKILLS_TASK, () => this.skillsAsync());
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

    getMode(className: string): string {
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

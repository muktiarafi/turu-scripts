/*
name: Solstice Moon Test
description: Runs only the Solstice Moon / Shrine - Left portion for testing Lunar Haze and Hollow Midnight taunt timing.
tags: solstice, moon, hollow midnight, lunar haze, army, taunt, test
*/
// Port of Scripts/Ultrasv3/Entwined Eclipse/SolsticeMoon.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, type EventMap, defineScriptOptions, option } from "turu";
import { CoreArmyLite } from "../../army/CoreArmyLite";
import { CapeSpecial, CoreAdvanced, EnhancementType, HelmSpecial, WeaponSpecial } from "../../core/CoreAdvanced";
import { Core, rethrowIfStopped } from "../../core/CoreBots";
import { auraRemainingTime, CoreEngine } from "./CoreEngine";
import { CoreUltra } from "./CoreUltra";

const Engine = new CoreEngine();
const Ultra = new CoreUltra();
const Adv = new CoreAdvanced();
const sArmy = new CoreArmyLite();

export class SolsticeMoonTest {
    // ── Item names ────────────────────────────────────────────────────────────
    static readonly sliverSunlight = "Sliver of Sunlight";
    static readonly sliverMoonlight = "Sliver of Moonlight";
    static readonly solarbrand = "Solarbrand";
    static readonly lunarbrand = "Lunarbrand";
    static readonly bladeBurningSun = "Blade of the Burning Sun";
    static readonly bladeGlowingMoon = "Blade of the Glowing Moon";
    static readonly greatMidnightSun = "Greatblade of the Midnight Sun";
    static readonly greatSolsticeMoon = "Greatblade of the Solstice Moon";
    // EO phase items — uncomment when ascendeclipse is ready
    // const string EclipticOffering  = "Ecliptic Offering"; // confirm: "Hallowed Remains"?
    // const string Umbrabrand        = "Umbrabrand";
    // const string BladeBoundEclipse = "Blade of the Bound Eclipse";
    // const string GreatEntwinedEcl  = "Greatblade of the Entwined Eclipse";

    // ── Shop ─────────────────────────────────────────────────────────────────
    static readonly mergeMap = "templeshrine";
    static readonly mergeShop = 2303;

    // Shop item IDs (prevents name-lookup ambiguity)
    static readonly id_RiteOfAscension = 10741;
    static readonly id_Solarbrand = 10744;
    static readonly id_Lunarbrand = 10745;
    static readonly id_Umbrabrand = 10746;
    static readonly id_BladeBurningSun = 10747;
    static readonly id_BladeGlowingMoon = 10748;
    static readonly id_BladeBoundEclipse = 10749;
    static readonly id_GreatMidnightSun = 10750;
    static readonly id_GreatSolsticeMoon = 10751;
    static readonly id_GreatEntwinedEclipse = 10752;

    // ── Totals for basic blade chain ─────────────────────────────────────────
    // Solarbrand ×3  (5  Sun ea)  →  15 Sun
    // BBS        ×2  (50 Sun ea)  → 100 Sun
    // GreatMidSun    (100 Sun)    → 100 Sun  ───  215 Sun total
    //
    // Lunarbrand ×3  (5  Moon ea) →  15 Moon
    // BGM        ×2  (50 Moon ea) → 100 Moon
    // GreatSolMoon   (100 Moon)   → 100 Moon ─── 215 Moon total
    static readonly sunlightNeeded = 215;
    static readonly moonlightNeeded = 215;

    autoEnhance: boolean = false;
    autoGetEnrage: boolean = false;
    checkUsableSlotBeforeBossRooms: boolean = false;
    usePotions: boolean = false;

    // Fixed 4-class lineup matching the working reference script
    static readonly player1Class = "Legion Revenant";
    // Lunar Haze taunter
    static readonly player2Class = "StoneCrusher";
    // DPS/support
    static readonly player3Class = "ArchPaladin";
    // Hollow Midnight taunter
    static readonly player4Class = "Lord of Order";
    // Hollow Midnight taunter

    readonly lrSkillList: number[] = [3, 4, 2, 1];
    readonly scSkillList: number[] = [3, 2, 4, 1];
    readonly apSkillList: number[] = [2, 3, 1, 4];
    readonly looSkillList: number[] = [2, 3, 1, 4];

    midnightRunCount: number = 0;
    solsticeRunCount: number = 0;
    syncFilesClearedOnStartup: boolean = false;

    /**
     * Optional orchestration hook: when > 0, the main loop exits once the account holds
     * at least this many Sliver of Moonlight. Leave 0 for the normal "loop forever" behavior.
     */
    targetSliverCount: number = 0;

    /**
     * Orchestration hook: when true, skip Core.SetOptions(true/false). Used when this
     * script is invoked from a parent orchestrator that runs its own SetOptions.
     */
    skipSetOptions: boolean = false;

    // ── Mode 1: Farm all materials first, then merge everything ───────────────

    grindFarmFirst(): void {
        Core.logger("Mode: Farm Max Stack First");
        this.farmSunlightTo(SolsticeMoonTest.sunlightNeeded);
        this.farmMoonlightTo(SolsticeMoonTest.moonlightNeeded);
        this.mergeBasicChain();
    }

    // ── Mode 2: Farm just enough for each weapon, merge as you go ─────────────

    grindIncremental(): void {
        Core.logger("Mode: Merge As Available");

        // Iteration 1 — first Solarbrand, Lunarbrand, BBS, BGM
        this.farmSunlightTo(5);
        this.mergeToHave(SolsticeMoonTest.solarbrand, SolsticeMoonTest.id_Solarbrand, 1);
        this.farmMoonlightTo(5);
        this.mergeToHave(SolsticeMoonTest.lunarbrand, SolsticeMoonTest.id_Lunarbrand, 1);
        this.farmSunlightTo(50);
        this.mergeToHave(SolsticeMoonTest.bladeBurningSun, SolsticeMoonTest.id_BladeBurningSun, 1);
        this.farmMoonlightTo(50);
        this.mergeToHave(SolsticeMoonTest.bladeGlowingMoon, SolsticeMoonTest.id_BladeGlowingMoon, 1);

        // Iteration 2 — second set
        this.farmSunlightTo(5);
        this.mergeToHave(SolsticeMoonTest.solarbrand, SolsticeMoonTest.id_Solarbrand, 2);
        this.farmMoonlightTo(5);
        this.mergeToHave(SolsticeMoonTest.lunarbrand, SolsticeMoonTest.id_Lunarbrand, 2);
        this.farmSunlightTo(50);
        this.mergeToHave(SolsticeMoonTest.bladeBurningSun, SolsticeMoonTest.id_BladeBurningSun, 2);
        this.farmMoonlightTo(50);
        this.mergeToHave(SolsticeMoonTest.bladeGlowingMoon, SolsticeMoonTest.id_BladeGlowingMoon, 2);

        // Third Solar + Lunar (held for Umbrabrand in the EO phase)
        this.farmSunlightTo(5);
        this.mergeToHave(SolsticeMoonTest.solarbrand, SolsticeMoonTest.id_Solarbrand, 3);
        this.farmMoonlightTo(5);
        this.mergeToHave(SolsticeMoonTest.lunarbrand, SolsticeMoonTest.id_Lunarbrand, 3);

        // Greatblades — one per side
        this.farmSunlightTo(100);
        this.mergeToHave(SolsticeMoonTest.greatMidnightSun, SolsticeMoonTest.id_GreatMidnightSun, 1);
        this.farmMoonlightTo(100);
        this.mergeToHave(SolsticeMoonTest.greatSolsticeMoon, SolsticeMoonTest.id_GreatSolsticeMoon, 1);

        Core.logger(
            "Basic blade chain complete! Remaining: 1× Solarbrand, 1× Lunarbrand, 1× BBS, 1× BGM — held for the Ecliptic Offering phase.",
        );
    }

    // ── Merge helpers ─────────────────────────────────────────────────────────

    mergeBasicChain(): void {
        Core.logger("Starting basic blade merge chain...");
        // 3× Solarbrand — 2 consumed by BBS, 1 held for Umbrabrand
        this.mergeToHave(SolsticeMoonTest.solarbrand, SolsticeMoonTest.id_Solarbrand, 3);
        // 3× Lunarbrand — 2 consumed by BGM, 1 held for Umbrabrand
        this.mergeToHave(SolsticeMoonTest.lunarbrand, SolsticeMoonTest.id_Lunarbrand, 3);
        // 2× BBS — 1 consumed by GreatMidnightSun, 1 held for BoBE
        this.mergeToHave(SolsticeMoonTest.bladeBurningSun, SolsticeMoonTest.id_BladeBurningSun, 2);
        // 2× BGM — 1 consumed by GreatSolsticeMoon, 1 held for BoBE
        this.mergeToHave(SolsticeMoonTest.bladeGlowingMoon, SolsticeMoonTest.id_BladeGlowingMoon, 2);
        this.mergeToHave(SolsticeMoonTest.greatMidnightSun, SolsticeMoonTest.id_GreatMidnightSun, 1);
        this.mergeToHave(SolsticeMoonTest.greatSolsticeMoon, SolsticeMoonTest.id_GreatSolsticeMoon, 1);
        Core.logger(
            "Basic blade chain complete! Remaining: 1× Solarbrand, 1× Lunarbrand, 1× BBS, 1× BGM — held for the Ecliptic Offering phase.",
        );
    }

    /**
     * Merges until we own at least `targetTotal` of the item.
     * Accounts for what's already in inventory — won't over-merge.
     */
    mergeToHave(itemName: string, shopItemID: number, targetTotal: number): void {
        const have = bot.inventory.getQuantity(itemName);
        const toBuy = targetTotal - have;
        if (toBuy <= 0) {
            return;
        }

        Core.logger(`Merging ${toBuy}× ${itemName} (${have} already owned)...`);
        Core.buyItem(SolsticeMoonTest.mergeMap, SolsticeMoonTest.mergeShop, itemName, toBuy, shopItemID);
    }

    // ── Farming ───────────────────────────────────────────────────────────────

    /**
     * Farms Sliver of Sunlight until we own at least `target`.
     * In army mode, every listed account must reach the target before moving on.
     */
    farmSunlightTo(target: number): void {
        if (this.armyHasItem(SolsticeMoonTest.sliverSunlight, target, `GreatbladeSunlightProgress_${target}.sync`)) {
            return;
        }
        Core.addDrop(SolsticeMoonTest.sliverSunlight);
        Core.logger(
            `Farming Sliver of Sunlight (need ${target}, have ${bot.inventory.getQuantity(SolsticeMoonTest.sliverSunlight)})...`,
        );
        while (
            !bot.shouldExit &&
            !this.armyHasItem(SolsticeMoonTest.sliverSunlight, target, `GreatbladeSunlightProgress_${target}.sync`)
        ) {
            this.runMidnightSun();
        }
    }

    /**
     * Farms Sliver of Moonlight until we own at least `target`.
     * In army mode, every listed account must reach the target before moving on.
     */
    farmMoonlightTo(target: number): void {
        if (this.armyHasItem(SolsticeMoonTest.sliverMoonlight, target, `GreatbladeMoonlightProgress_${target}.sync`)) {
            return;
        }
        Core.addDrop(SolsticeMoonTest.sliverMoonlight);
        Core.logger(
            `Farming Sliver of Moonlight (need ${target}, have ${bot.inventory.getQuantity(SolsticeMoonTest.sliverMoonlight)})...`,
        );
        while (
            !bot.shouldExit &&
            !this.armyHasItem(SolsticeMoonTest.sliverMoonlight, target, `GreatbladeMoonlightProgress_${target}.sync`)
        ) {
            this.runSolsticeMoon();
        }
    }

    syncGroupPath(syncFile: string): string {
        const group = this.getSyncGroup(syncFile);
        return Ultra.resolveSyncPath(`SolsticeMoon_${Core.privateRoomNumber}_${group}.sync`);
    }

    itemProgressSyncPath(syncFile: string): string {
        return Ultra.resolveSyncPath(`SolsticeMoon_${Core.privateRoomNumber}_${syncFile}`);
    }

    getSyncGroup(syncFile: string): string {
        const name = syncFile.toLowerCase();

        if (name.includes("party") || name.includes("setup")) {
            return "setup";
        }

        if (
            name.includes("reset") ||
            name.includes("whitemap") ||
            name.includes("rejoined") ||
            name.includes("restock")
        ) {
            return "reset";
        }

        return "run";
    }

    resetReusableSyncFiles(): void {
        Core.logger("[Sync] Moving to /whitemap before clearing reusable sync files.");
        Core.join("whitemap", "Enter", "Spawn");
        this.waitForMapName("whitemap", 8000);
        bot.sleep(1000);

        const isPlayer1 = this.isConfiguredAccount(bot.config!.get<string>("player1") ?? "");

        if (!isPlayer1) {
            if (!this.syncFilesClearedOnStartup) {
                Core.logger("[Sync] Waiting briefly while player1 clears startup sync files.");
            } else {
                Core.logger("[Sync] Waiting briefly while player1 resets reusable reset sync file.");
            }

            bot.sleep(1500);

            if (!this.syncFilesClearedOnStartup) {
                this.syncFilesClearedOnStartup = true;
                Core.logger("[Sync] Done waiting for player1 startup sync clear.");
            } else {
                Core.logger("[Sync] Done waiting for player1 sync reset.");
            }

            return;
        }

        if (!this.syncFilesClearedOnStartup) {
            Core.logger("[Sync] Player1 is clearing startup sync files for SolsticeMoon.");

            this.resetSyncFile(this.syncGroupPath("SolsticeMoon_reset_ready.sync"));
            this.resetSyncFile(this.syncGroupPath("SolsticeMoon_run_ready.sync"));

            this.syncFilesClearedOnStartup = true;

            Core.logger("[Sync] Startup sync files cleared.");
            bot.sleep(1500);
            return;
        }

        Core.logger("[Sync] Player1 is resetting reusable reset sync file for the new SolsticeMoon run.");

        this.resetSyncFile(this.syncGroupPath("SolsticeMoon_reset_ready.sync"));

        Core.logger("[Sync] Reusable reset sync file reset complete.");
        bot.sleep(1500);
    }

    resetSyncFile(path: string): void {
        try {
            bot.army.clearLog(path);
        } catch (error) {
            rethrowIfStopped(error);

            bot.sleep(100);
        }
    }

    syncArmy(syncFile: string): void {
        const partySize = sArmy.players().length;
        if (partySize <= 1) {
            return;
        }

        const path = this.syncGroupPath(syncFile);
        const username = Core.username().toLowerCase();
        const checkpoint = syncFile.replaceAll(":", "_");

        while (!bot.shouldExit) {
            let lines = this.readSyncLines(path);

            lines = lines.filter((line) => !line.toLowerCase().startsWith(`${checkpoint}:${username}:`.toLowerCase()));

            this.writeSyncLines(path, [...lines, `${checkpoint}:${username}:ready:${Math.floor(Date.now() / 1000)}`]);

            const now = Math.floor(Date.now() / 1000);

            const ready = [
                ...new Set(
                    this.readSyncLines(path)
                        .map((line) => line.split(":"))
                        .filter(
                            (parts) =>
                                parts.length >= 4 &&
                                parts[0].toLowerCase() === checkpoint.toLowerCase() &&
                                /^-?\d+$/.test(parts[3]) &&
                                now - Number(parts[3]) <= 120,
                        )
                        .map((parts) => parts[1]),
                ),
            ].length;

            if (ready >= partySize) {
                return;
            }

            bot.sleep(250);
        }
    }

    readSyncLines(path: string): string[] {
        try {
            return bot.army.readLog(path).filter((line) => !!line?.trim());
        } catch (error) {
            rethrowIfStopped(error);

            bot.sleep(100);
            return [];
        }
    }

    writeSyncLines(path: string, lines: string[]): void {
        try {
            bot.army.writeLog(path, lines);
        } catch (error) {
            rethrowIfStopped(error);

            bot.sleep(100);
        }
    }

    armyHasItem(itemName: string, target: number, syncFile: string): boolean {
        return this.armyProgress(itemName, target, syncFile);
    }

    armyProgress(itemName: string, target: number, syncFile: string): boolean {
        const partySize = sArmy.players().length;
        const path = this.itemProgressSyncPath(syncFile);
        const username = Core.username().toLowerCase();
        const quantity = bot.inventory.getQuantity(itemName);

        let lines = this.readSyncLines(path);
        lines = lines.filter((line) => !line.toLowerCase().startsWith(`${username}:`.toLowerCase()));
        this.writeSyncLines(path, [...lines, `${username}:${quantity}:${target}:${Math.floor(Date.now() / 1000)}`]);

        const now = Math.floor(Date.now() / 1000);
        // C#'s GroupBy(user).Select(Last): each user's latest line.
        const latest = new Map<string, string[]>();
        for (const parts of this.readSyncLines(path).map((line) => line.split(":"))) {
            if (parts.length >= 4 && /^-?\d+$/.test(parts[3]) && now - Number(parts[3]) <= 120)
                latest.set(parts[0].toLowerCase(), parts);
        }
        const complete = [...latest.values()].filter(
            (parts) => /^-?\d+$/.test(parts[1]) && Number(parts[1]) >= target,
        ).length;

        return complete >= partySize;
    }

    armyKillMonster(map: string, cell: string, pad: string, monster: string, checkpoint: string): void {
        this.joinAndFocus(map, cell, pad);
        this.syncArmy(`${checkpoint}_ready.sync`);
        this.killFocusedMonster(map, monster, cell, pad);
        this.syncArmy(`${checkpoint}_done.sync`);
    }

    armyKillWithDelayedTaunt(
        map: string,
        cell: string,
        pad: string,
        monster: string,
        checkpoint: string,
        sunSide: boolean,
        enrageMessage: string,
        tauntOffsetSeconds = 6,
    ): void {
        this.joinAndFocus(map, cell, pad);

        // Sun side (midnightsun): player1+2 alternate — player1 "starts" so player2 fires first.
        // Moon side (solsticemoon): player3+4 alternate — player3 "starts" so player4 fires first.
        const isTaunter = sunSide ? this.isSunTaunter() : this.isMoonTaunter();
        const startingTaunterConfig = sunSide ? "player1" : "player3";

        if (isTaunter) {
            this.checkUsableSlotBeforeBossRoom(`${monster} / ${enrageMessage}`);
        }

        this.syncArmy(`${checkpoint}_ready.sync`);

        this.bossFight(monster, cell, enrageMessage, isTaunter, tauntOffsetSeconds, startingTaunterConfig);

        this.syncArmy(`${checkpoint}_done.sync`);
    }

    armyKillLunarHazeWithLrTaunt(
        map: string,
        cell: string,
        pad: string,
        secondaryMob: string,
        checkpoint: string,
    ): void {
        this.joinAndFocus(map, cell, pad);
        this.syncArmy(`${checkpoint}_ready.sync`);

        this.killLunarHazeWithLrOnlyTaunt(cell, pad, secondaryMob);

        this.syncArmy(`${checkpoint}_done.sync`);
    }

    killLunarHazeWithLrOnlyTaunt(cell: string, pad: string, secondaryMob: string): void {
        const lunarHaze = "Lunar Haze";
        const lunarAura = "Moonlight Gaze";
        const tauntDelayMs = 6000;

        let noTargetSince = 0;

        let lrMoonlightGazeArmed = false;
        let lrMoonlightGazeTaunted = false;
        let lrTauntAt = 0;

        while (!bot.shouldExit) {
            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);

                if (bot.player.cell !== cell) {
                    bot.map.jump(cell, pad, false);
                    bot.wait.forCellChange(cell);
                }

                bot.player.setSpawnPoint();
                bot.sleep(500);
                continue;
            }

            if (bot.player.cell !== cell) {
                bot.map.jump(cell, pad, false);
                bot.wait.forCellChange(cell);
                bot.player.setSpawnPoint();
            }

            const isLegionRevenant = bot.player.currentClass?.toLowerCase() === "Legion Revenant"?.toLowerCase();

            const lunarHazeAlive = this.monsterAvailable(lunarHaze, cell);
            const secondaryAlive = this.monsterAvailable(secondaryMob, cell);

            const target = lunarHazeAlive ? lunarHaze : secondaryAlive ? secondaryMob : "";

            if (!!target?.trim()) {
                bot.combat.attack(target);
            }

            let handledTauntWindow = false;

            if (isLegionRevenant && target === lunarHaze && lunarHazeAlive) {
                const moonlightGazeActive = bot.self.hasActiveAura(lunarAura);

                if (moonlightGazeActive && !lrMoonlightGazeArmed) {
                    lrMoonlightGazeArmed = true;
                    lrMoonlightGazeTaunted = false;
                    lrTauntAt = Date.now() + tauntDelayMs;
                    Core.logger(
                        `[Lunar Haze LR Taunt] ${lunarAura} detected on ${lunarHaze}. Taunting in ${formatTenths(tauntDelayMs / 1000.0)} seconds.`,
                    );
                }

                if (lrMoonlightGazeArmed && !lrMoonlightGazeTaunted && Date.now() >= lrTauntAt) {
                    lrMoonlightGazeTaunted = this.tauntCurrentTarget("[Lunar Haze LR Taunt]", lunarHaze);
                    handledTauntWindow = true;
                }

                if (!moonlightGazeActive && lrMoonlightGazeTaunted) {
                    lrMoonlightGazeArmed = false;
                    lrMoonlightGazeTaunted = false;
                    lrTauntAt = 0;
                }
            } else {
                lrMoonlightGazeArmed = false;
                lrMoonlightGazeTaunted = false;
                lrTauntAt = 0;
            }

            if (!handledTauntWindow) {
                this.useClassSkills();
                bot.sleep(400);
            }

            if (!lunarHazeAlive && !secondaryAlive) {
                noTargetSince = noTargetSince === 0 ? Date.now() : noTargetSince;

                if (Date.now() - noTargetSince > 1800) {
                    break;
                }
            } else {
                noTargetSince = 0;
            }
        }
    }

    armyKillShrineBoss(
        map: string,
        cell: string,
        pad: string,
        monster: string,
        checkpoint: string,
        moonBoss: boolean,
    ): void {
        this.joinAndFocus(map, cell, pad);

        // Sun boss: player1+2 alternate — player1 fires first, player2 is "starting" (defers first).
        // Moon boss: player3+4 alternate — player3 fires first, player4 is "starting" (defers first).
        const isTaunter = moonBoss ? this.isMoonTaunter() : this.isSunTaunter();
        const enrageMessage = moonBoss ? "The Moon Converges" : "The Sun Converges";
        const startingTaunterConfig = moonBoss ? "player4" : "player2";

        if (isTaunter) {
            this.checkUsableSlotBeforeBossRoom(`${monster} / ${enrageMessage}`);
        }

        this.syncArmy(`${checkpoint}_ready.sync`);

        this.bossFight(monster, cell, enrageMessage, isTaunter, 0, startingTaunterConfig);

        if (cell?.toLowerCase() === "r3"?.toLowerCase()) {
            Core.logger(`[r3] ${monster} fight complete. Waiting for army done sync.`);
        }

        this.syncArmy(`${checkpoint}_done.sync`);
    }

    resetDungeonInstance(nextMap: string, checkpoint: string): void {
        this.syncArmy(`${checkpoint}_reset_ready.sync`);

        const whiteMapTarget = Core.privateRooms ? `whitemap-${Core.privateRoomNumber}` : "whitemap";

        Core.logger(`Resetting cleared dungeon by joining /${whiteMapTarget}...`);
        Core.join("whitemap", "Enter", "Spawn");
        this.waitForMapName("whitemap", 8000);
        bot.sleep(1000);

        this.syncArmy(`${checkpoint}_all_in_whitemap.sync`);

        this.sellHallowedRemainsIfMax();
        this.refreshPotionsIfAurasMissing();
        this.restockEnrageIfLow(`Before ${checkpoint}`, 80);
        this.ensureEnrageEquipped("Restock");

        this.syncArmy(`${checkpoint}_restock_done.sync`);

        this.joinShrineDungeon(nextMap, "Enter", "Left", true);
        bot.sleep(1000);

        this.syncArmy(`${checkpoint}_all_rejoined_dungeon.sync`);
    }

    getInventoryQuantity(itemName: string): number {
        return (
            (bot.inventory.items.find((item) => item.name.toLowerCase() === itemName.toLowerCase()) ?? null)
                ?.quantity ?? 0
        );
    }

    sellHallowedRemainsIfMax(): void {
        const itemName = "Hallowed Remains";
        const maxStack = 500;

        const quantity = bot.inventory.getQuantity(itemName);

        if (quantity < maxStack) {
            return;
        }

        Core.logger(`[Inventory] ${itemName} is at max stack (${quantity}/${maxStack}). Selling all.`);

        Core.sellItem(itemName, undefined, { all: true });

        bot.sleep(1000);
    }

    tryAcceptDailyQuest(questId: number, questName: string): void {
        const quest = Core.initializeWithRetries(() => Core.ensureLoad(questId));

        if (quest == null) {
            Core.logger(`[Daily] Failed to load ${questName} [${questId}]. Skipping.`);
            return;
        }

        if (bot.quests.isDailyComplete(questId)) {
            Core.logger(`[Daily] ${quest.name} [${quest.id}] is not available right now.`);
            return;
        }

        Core.logger(`[Daily] Accepting ${quest.name} [${quest.id}].`);
        Core.ensureAccept(questId);
        Core.addDrop(...quest.rewards.map((x) => x.name));
        Core.addDrop(...quest.requirements.map((x) => x.name));
    }

    tryCompleteDailyQuest(questId: number, rewardName: string): void {
        if (!bot.quests.isInProgress(questId)) {
            return;
        }

        Core.logger(`[Daily] Attempting to complete daily quest ${questId}.`);

        Core.ensureComplete(questId);
        bot.wait.forPickup(rewardName);

        Core.logger(`[Daily] Completed daily quest ${questId}.`);
    }

    restockEnrageIfLow(context: string, minimumCount = 80): void {
        const needsEnrage =
            this.isConfiguredAccount(bot.config!.get<string>("player1") ?? "") ||
            this.isConfiguredAccount(bot.config!.get<string>("player2") ?? "") ||
            this.isConfiguredAccount(bot.config!.get<string>("player3") ?? "") ||
            this.isConfiguredAccount(bot.config!.get<string>("player4") ?? "");

        if (!needsEnrage) {
            return;
        }

        if (!(bot.map.name?.toLowerCase() === "whitemap"?.toLowerCase())) {
            Core.logger(
                `[Taunt] ${context}: skipping Scroll of Enrage restock because this account is not in /whitemap.`,
            );
            return;
        }

        const count = this.getInventoryQuantity("Scroll of Enrage");
        Core.logger(`[Taunt] ${context}: ${count} Scroll of Enrage remaining.`);

        if (count >= minimumCount) {
            return;
        }

        Core.logger(`[Taunt] Scroll of Enrage is below ${minimumCount}. Restocking before continuing.`);

        Ultra.getScrollOfEnrage();

        const newCount = this.getInventoryQuantity("Scroll of Enrage");
        Core.logger(`[Taunt] Restock complete: ${newCount} Scroll of Enrage remaining.`);

        this.ensureEnrageEquipped("restock");
    }

    joinAndFocus(map: string, cell: string, pad: string): void {
        if (map === "midnightsun" || map === "solsticemoon") {
            this.joinShrineDungeon(map, cell, pad);
        } else {
            Core.join(map, cell, pad);
        }

        if (
            (map === "midnightsun" || map === "solsticemoon") &&
            bot.map.playerNames != null &&
            bot.map.playerNames.length < sArmy.players().length
        ) {
            Core.logger(
                `Only ${bot.map.playerNames.length}/${sArmy.players().length} players visible in /${map}-${Core.privateRoomNumber}; retrying dungeon join.`,
            );
            this.joinShrineDungeon(map, cell, pad, true);
            bot.sleep(1000);
        }

        if (bot.player.cell !== cell) {
            bot.map.jump(cell, pad, false);
            bot.wait.forCellChange(cell);
        }

        bot.player.setSpawnPoint();
        bot.options.aggroMonsters = false;
        bot.options.aggroAllMonsters = false;
    }

    joinShrineDungeon(map: string, cell: string, pad: string, force = false): void {
        const target = Core.privateRooms ? `${map}-${Core.privateRoomNumber}` : map;

        for (let attempt = 1; attempt <= 5 && !bot.shouldExit && (force || bot.map.name !== map); attempt++) {
            force = false;
            Core.logger(`Joining /${target} (${attempt}/5)...`);
            bot.send.packet(`%xt%zm%dungeonQueue%${bot.map.roomId}%${target}%`);
            this.waitForMapName(map, 8000);

            if (bot.map.name === map) {
                break;
            }

            bot.send.packet(`%xt%zm%cmd%${bot.map.roomId}%tfer%${bot.player.username}%${target}%${cell}%${pad}%`);
            this.waitForMapName(map, 8000);
            bot.sleep(500);
        }

        if (bot.map.name !== map) {
            Core.logger(`Could not join /${target}. Retrying next loop.`);
            return;
        }

        bot.wait.forTrue(() => bot.player.loaded, 10);
    }

    waitForMapName(map: string, timeoutMs: number): void {
        const end = Date.now() + timeoutMs;
        while (!bot.shouldExit && bot.map.name !== map && Date.now() < end) {
            bot.sleep(250);
        }
    }

    killFocusedMonster(map: string, monster: string, cell: string, pad: string): void {
        let noTargetSince = 0;

        while (!bot.shouldExit) {
            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);
                if (bot.player.cell !== cell) {
                    bot.map.jump(cell, pad, false);
                    bot.wait.forCellChange(cell);
                }
                bot.player.setSpawnPoint();
                bot.sleep(500);
                continue;
            }

            if (bot.player.cell !== cell) {
                bot.map.jump(cell, pad, false);
                bot.wait.forCellChange(cell);
            }

            this.attackPriorityTarget(map, cell, monster);
            this.useClassSkills();
            bot.sleep(400);

            if (bot.player.hasTarget) {
                noTargetSince = 0;
                continue;
            }

            if (!this.monsterAvailable(monster, cell)) {
                noTargetSince = noTargetSince === 0 ? Date.now() : noTargetSince;
                if (Date.now() - noTargetSince > 1800) {
                    break;
                }
            } else {
                noTargetSince = 0;
                bot.sleep(300);
            }
        }
    }

    targetBossDefeated(monster: string): boolean {
        try {
            return (
                bot.player.hasTarget &&
                bot.player.target != null &&
                bot.player.target.name?.toLowerCase() === monster?.toLowerCase() &&
                bot.player.target.hp <= 0
            );
        } catch (error) {
            rethrowIfStopped(error);

            return false;
        }
    }

    /**
     * Fights a monster with optional alternating Scroll of Enrage taunting.
     * Listens via Bot.Flash.FlashCall (same event as UltraDrakath),
     * fires Core.UsePotion() and retries until the boss has Focus/Reckless aura.
     * Both taunters (LR and LoO) participate and alternate each convergence.
     * startingTaunterConfig: the player config key whose account goes SECOND
     * (i.e. starts with usedLastEnrage=true so the other taunter fires first).
     */
    bossFight(
        monster: string,
        cell: string,
        enrageMessage: string,
        isTaunter: boolean,
        tauntOffsetSeconds = 0,
        startingTaunterConfig = "player2",
    ): void {
        const ReturnToFightCell = (targetCell: string): void => {
            if (!targetCell?.trim()) {
                return;
            }

            if (bot.player.cell?.toLowerCase() === targetCell?.toLowerCase()) {
                if (!fightSpawnSet) {
                    bot.player.setSpawnPoint();
                    fightSpawnSet = true;
                }
                return;
            }

            Core.logger(`[Recover] Returning to ${targetCell} after respawn/desync.`);
            bot.map.jump(targetCell, "Left", false);
            bot.wait.forCellChange(targetCell);
            bot.player.setSpawnPoint();
            fightSpawnSet = true;
            bot.sleep(500);
        };
        const Listener = (packet: EventMap["extensionPacket"]): void => {
            try {
                // C# listens to Bot.Flash.FlashCall ("pext" or "packetFromServer"); Turu's extensionPacket event
                // gives a JSON packet's data object as `params.dataObj` (C#'s `b.o`).
                const data: any | null = packet?.["params"]?.type === "json" ? packet["params"].dataObj : null;

                if (data == null || data!["cmd"]?.toString() !== "ct") {
                    return;
                }

                let triggered = false;

                if (data!["anims"] != null) {
                    for (const a of data!.anims) {
                        if (a?.msg != null && a!.msg.indexOf(enrageMessage) >= 0) {
                            triggered = true;
                            break;
                        }
                    }
                }

                if (!triggered && data!["a"] != null) {
                    for (const a of data.a) {
                        if (a != null && a!["cmd"]?.toString() === "aura+" && a!["auras"] != null) {
                            for (const aura of a!["auras"]) {
                                if (aura?.msgOn != null && aura!.msgOn.indexOf(enrageMessage) >= 0 && aura!.isNew) {
                                    triggered = true;
                                    break;
                                }
                            }
                        }
                    }
                }

                if (!triggered) {
                    return;
                }

                needsEnrage = true;
                usedEnrage = false;
                if (tauntOffsetSeconds > 0) {
                    tauntTime = Date.now() + tauntOffsetSeconds * 1000;
                }

                Core.logger(
                    `[Taunt] '${enrageMessage}' — ${tauntOffsetSeconds > 0 ? `enraging in ${tauntOffsetSeconds}s` : "enraging now"}.`,
                );
            } catch (error) {
                rethrowIfStopped(error);
            }
        };
        let needsEnrage = false;
        let usedEnrage = false;
        // The "starting" player defers first — so the other taunter fires on convergence 1,
        // then they swap each time, matching the PR's alternating pattern.
        let usedLastEnrage =
            isTaunter &&
            bot.player.username.toLowerCase() === (bot.config!.get<string>(startingTaunterConfig) ?? "").toLowerCase();
        let tauntTime = 0;
        let noTargetSince = 0;
        let fightSpawnSet = false;

        bot.events.on("extensionPacket", Listener);
        try {
            while (!bot.shouldExit) {
                if (!bot.player.alive) {
                    bot.wait.forTrue(() => bot.player.alive, 20);
                    ReturnToFightCell(cell);
                    bot.sleep(500);
                    continue;
                }

                ReturnToFightCell(cell);

                if (this.targetBossDefeated(monster)) {
                    break;
                }

                if (isTaunter && needsEnrage && !usedEnrage) {
                    if (
                        !usedLastEnrage &&
                        bot.player.hasTarget &&
                        (tauntOffsetSeconds <= 0 || Date.now() > tauntTime)
                    ) {
                        // My turn — apply the scroll and verify it landed.
                        Core.logger(`[Taunt] '${enrageMessage}' — my turn, applying Scroll of Enrage...`);

                        if (this.tauntCurrentTargetForMessage(enrageMessage, 10)) {
                            usedEnrage = true;
                            needsEnrage = false;
                            usedLastEnrage = true;
                            // other taunter goes next convergence
                        }
                    } else if (usedLastEnrage) {
                        // Other taunter's turn this convergence — stand by long enough to observe Focus/Reckless.
                        Core.logger(`[Taunt] '${enrageMessage}' — other taunter's turn.`);

                        const waitUntil = Date.now() + 2500;
                        while (
                            !bot.shouldExit &&
                            bot.player.hasTarget &&
                            !this.targetHasEnrageAura() &&
                            Date.now() < waitUntil
                        ) {
                            bot.sleep(100);
                        }

                        if (this.targetHasEnrageAura()) {
                            Core.logger("[Taunt] Other taunter's Enrage confirmed.");
                        } else {
                            Core.logger("[Taunt] Other taunter turn complete; rotating.");
                        }

                        usedEnrage = true;
                        needsEnrage = false;
                        usedLastEnrage = false;
                        // I go next convergence
                    }
                }

                if (!needsEnrage || usedEnrage || !bot.player.hasTarget) {
                    bot.combat.attack(monster);
                }

                this.useClassSkills();
                bot.sleep(300);

                if (bot.player.hasTarget) {
                    noTargetSince = 0;
                } else if (!this.monsterAvailable(monster, cell)) {
                    noTargetSince = noTargetSince === 0 ? Date.now() : noTargetSince;
                    if (Date.now() - noTargetSince > 1800) {
                        break;
                    }
                } else {
                    noTargetSince = 0;
                }
            }
        } finally {
            bot.events.off("extensionPacket", Listener);
        }
    }

    attackPriorityTarget(map: string, cell: string, fallbackMonster: string): void {
        for (const target of this.getRoomTargetPriority(map, cell, fallbackMonster)) {
            if (target === "*" || this.monsterAvailable(target, cell)) {
                bot.combat.attack(target);
                return;
            }
        }

        bot.combat.attack(fallbackMonster);
    }

    getRoomTargetPriority(map: string, cell: string, fallbackMonster: string): string[] {
        if (map?.toLowerCase() === "solsticemoon"?.toLowerCase() && cell?.toLowerCase() === "Enter"?.toLowerCase()) {
            return ["Shackled Fairy", "Faithless Deer", fallbackMonster];
        }

        return [fallbackMonster];
    }

    monsterAvailable(monster: string, cell: string): boolean {
        try {
            return bot.monsters.mapMonsters.some(
                (m) =>
                    m != null &&
                    m.cell?.toLowerCase() === cell?.toLowerCase() &&
                    (monster === "*" || m.name?.toLowerCase() === monster?.toLowerCase()) &&
                    m.hp > 0 &&
                    m.state > 0,
            );
        } catch (error) {
            rethrowIfStopped(error);

            return true;
        }
    }

    useClassSkills(): void {
        const className = bot.player.currentClass ?? "";

        switch (className.toLowerCase()) {
            case "legion revenant":
                this.useFirstAvailableSkill(this.lrSkillList);
                break;
            case "stonecrusher":

            case "infinity titan":
                this.useFirstAvailableSkill(this.scSkillList);
                break;
            case "archpaladin":
                this.useFirstAvailableSkill(this.apSkillList);
                break;
            case "lord of order":
                this.useFirstAvailableSkill(this.looSkillList);
                break;
        }
    }

    useFirstAvailableSkill(skillPriority: number[]): void {
        if (!bot.player.hasTarget || (bot.player.target?.hp ?? 1) <= 0) {
            return;
        }

        for (const skill of skillPriority) {
            if (bot.skills.canUseSkill(skill)) {
                bot.skills.useSkill(skill);
                return;
            }
        }
    }

    // Sun side: player1 (LR) + player2 (SC) alternate — midnightsun dungeon
    isSunTaunter(): boolean {
        return (
            this.isConfiguredAccount(bot.config!.get<string>("player1") ?? "") ||
            this.isConfiguredAccount(bot.config!.get<string>("player2") ?? "")
        );
    }

    // Moon side: player3 (AP) + player4 (LoO) alternate — solsticemoon dungeon
    isMoonTaunter(): boolean {
        return (
            this.isConfiguredAccount(bot.config!.get<string>("player3") ?? "") ||
            this.isConfiguredAccount(bot.config!.get<string>("player4") ?? "")
        );
    }

    isConfiguredAccount(account: string): boolean {
        return !!account?.trim() && Core.username()?.toLowerCase() === account?.toLowerCase();
    }

    equipClassByName(className: string): void {
        if (!className?.trim()) {
            return;
        }

        let classToEquip = className;

        if (!Core.checkInventory(classToEquip)) {
            if (className.toLowerCase() === "StoneCrusher".toLowerCase() && Core.checkInventory("Infinity Titan")) {
                Core.logger(
                    "This account is assigned to use StoneCrusher, but StoneCrusher is missing. Using Infinity Titan instead.",
                );
                classToEquip = "Infinity Titan";
            } else {
                Core.logger(
                    `This account is assigned to use ${className}, but that class is not in inventory.`,
                    undefined,
                    { stopBot: true },
                );
                return;
            }
        }

        if (!this.isClassEquipped(classToEquip)) {
            Core.equip(classToEquip);
            bot.wait.forItemEquip(classToEquip);
            bot.sleep(1000);
        }

        Core.logger(`Equipped ${classToEquip}; using custom skill rotation.`);
    }

    isClassEquipped(className: string): boolean {
        return !!className?.trim() && bot.player.currentClass?.toLowerCase() === className?.toLowerCase();
    }

    equipArmyClasses(): void {
        const username = Core.username();
        const p1 = bot.config!.get<string>("player1");
        const p2 = bot.config!.get<string>("player2");
        const p3 = bot.config!.get<string>("player3");
        const p4 = bot.config!.get<string>("player4");

        if (username.toLowerCase() === p1.toLowerCase()) {
            this.equipClassByName(SolsticeMoonTest.player1Class);
        } else if (username.toLowerCase() === p2.toLowerCase()) {
            this.equipClassByName(SolsticeMoonTest.player2Class);
        } else if (username.toLowerCase() === p3.toLowerCase()) {
            this.equipClassByName(SolsticeMoonTest.player3Class);
        } else if (username.toLowerCase() === p4.toLowerCase()) {
            this.equipClassByName(SolsticeMoonTest.player4Class);
        } else {
            Core.logger("This account was not matched to a player slot — keeping current class.");
        }
    }

    applyEnhancements(): void {
        const className = bot.player.currentClass ?? "";
        Core.logger(`Applying enhancements for ${className}...`);

        switch (className.toLowerCase()) {
            case "legion revenant":
                Adv.enhanceEquipped(EnhancementType.Wizard, {
                    hSpecial: HelmSpecial.None,
                    wSpecial: Adv.uElysium() ? WeaponSpecial.Elysium : WeaponSpecial.Valiance,
                    cSpecial: CapeSpecial.Penitence,
                });
                break;
            case "stonecrusher":

            case "infinity titan":
                Adv.enhanceEquipped(EnhancementType.Fighter, {
                    hSpecial: HelmSpecial.None,
                    wSpecial: WeaponSpecial.Valiance,
                    cSpecial: CapeSpecial.Absolution,
                });
                break;
            case "archpaladin":
                Adv.enhanceEquipped(EnhancementType.Lucky, {
                    hSpecial: HelmSpecial.None,
                    wSpecial: WeaponSpecial.Valiance,
                    cSpecial: CapeSpecial.Penitence,
                });
                break;
            case "lord of order":
                Adv.enhanceEquipped(EnhancementType.Lucky, {
                    hSpecial: HelmSpecial.None,
                    wSpecial: WeaponSpecial.Valiance,
                    cSpecial: CapeSpecial.Penitence,
                });
                break;
            default:
                Core.logger(`[Enhance] No profile for '${className}' — skipping.`);
                break;
        }
    }

    targetHasEnrageAura(): boolean {
        return (
            bot.player.hasTarget &&
            (bot.target.auras.some((x) => x.name.toLowerCase() === "Focus".toLowerCase() && auraRemainingTime(x) > 4) ||
                bot.target.auras.some(
                    (x) => x.name.toLowerCase() === "Reckless".toLowerCase() && auraRemainingTime(x) > 4,
                ))
        );
    }

    ensureEnrageEquipped(context: string): boolean {
        if (!Core.checkInventory("Scroll of Enrage")) {
            Core.logger(`[Taunt] ${context}: missing Scroll of Enrage.`);
            return false;
        }

        if (!bot.inventory.isEquipped("Scroll of Enrage")) {
            Core.logger(`[Taunt] ${context}: Scroll of Enrage was not equipped; re-equipping usable slot.`);
            bot.inventory.equipUsableItem("Scroll of Enrage");
            bot.sleep(600);
        }

        return bot.inventory.isEquipped("Scroll of Enrage");
    }

    checkUsableSlotBeforeBossRoom(context: string): void {
        if (!this.checkUsableSlotBeforeBossRooms) {
            return;
        }

        if (!this.ensureEnrageEquipped(context)) {
            return;
        }

        if (!bot.skills.canUseSkill(5)) {
            Core.logger(`[Taunt] ${context}: usable slot is not ready yet; waiting briefly before boss room.`);
            bot.wait.forTrue(() => bot.skills.canUseSkill(5), 10);
        }
    }

    tauntCurrentTarget(logPrefix: string, expectedTarget: string, maxAttempts = 10): boolean {
        if (!bot.player.hasTarget || (bot.player.target?.hp ?? 1) <= 0) {
            bot.sleep(300);
            return false;
        }

        Core.logger(`${logPrefix} Targeting ${expectedTarget} for Scroll of Enrage.`);
        Core.logger(`${logPrefix} Force-using Scroll of Enrage on ${expectedTarget}; skipping CanUseSkill(5) gate.`);

        bot.skills.pause();

        try {
            bot.combat.cancelAutoAttack();

            for (let attempt = 1; attempt <= maxAttempts && !bot.shouldExit; attempt++) {
                if (!bot.player.hasTarget) {
                    return false;
                }

                this.ensureEnrageEquipped(expectedTarget);

                Core.logger(`${logPrefix} Scroll attempt ${attempt}/${maxAttempts}.`);

                Core.usePotion();

                const confirmEnd = Date.now() + 1000;

                while (!bot.shouldExit && Date.now() < confirmEnd) {
                    bot.sleep(100);

                    if (this.targetHasEnrageAura()) {
                        Core.logger(`${logPrefix} Enrage confirmed on ${expectedTarget}.`);
                        return true;
                    }
                }

                bot.sleep(500);
            }

            Core.logger(
                `${logPrefix} Scroll force-use attempts failed; Enrage was not confirmed on ${expectedTarget}.`,
            );
            return false;
        } finally {
            bot.skills.resume();
        }
    }

    /** C#'s `TauntCurrentTarget(string enrageMessage, int maxAttempts = 10)` overload. */
    tauntCurrentTargetForMessage(enrageMessage: string, maxAttempts = 10): boolean {
        bot.skills.pause();

        try {
            for (let attempt = 1; attempt <= maxAttempts && !bot.shouldExit; attempt++) {
                if (!bot.player.hasTarget) {
                    return false;
                }

                if (this.targetHasEnrageAura()) {
                    return true;
                }

                this.ensureEnrageEquipped(enrageMessage);

                if (!bot.skills.canUseSkill(5)) {
                    bot.wait.forTrue(() => bot.skills.canUseSkill(5), 3);
                }

                Core.logger(`[Taunt] '${enrageMessage}' — Scroll of Enrage attempt ${attempt}/${maxAttempts}.`);

                bot.combat.cancelAutoAttack();
                Core.usePotion();
                bot.sleep(350);

                if (this.targetHasEnrageAura()) {
                    Core.logger("[Taunt] Enrage confirmed!");
                    return true;
                }
            }

            Core.logger(`[Taunt] WARNING: '${enrageMessage}' was not confirmed after ${maxAttempts} attempts.`);
            return false;
        } finally {
            bot.skills.resume();
        }
    }

    prepareTauntRole(): void {
        // All 4 players equip Scroll of Enrage:
        // player1+2 alternate on sun fights, player3+4 alternate on moon fights.
        if (this.autoGetEnrage) {
            Core.logger("Auto-crafting Scroll of Enrage...");
            Ultra.getScrollOfEnrage();
        }

        if (!this.ensureEnrageEquipped("setup")) {
            Core.logger("No Scroll of Enrage found — boss charges will NOT be redirected.");
            return;
        }

        Core.logger("Scroll of Enrage is equipped.");
    }

    // ── Dungeon clears ────────────────────────────────────────────────────────

    runMidnightSun(): void {
        this.resetReusableSyncFiles();
        const run = ++this.midnightRunCount;
        this.resetDungeonInstance("midnightsun", `GreatbladeMidnight_${run}`);
        this.armyKillMonster("midnightsun", "Enter", "Left", "Shining Star", `GreatbladeMidnight_${run}_01`);
        this.armyKillMonster("midnightsun", "Enter", "Left", "Dying Light", `GreatbladeMidnight_${run}_02`);
        this.armyKillMonster("midnightsun", "r1", "Left", "Shining Star", `GreatbladeMidnight_${run}_03`);
        // Dawn Knight at r1: player1+2 alternate on "The Light Gathers" (6 s offset)
        this.armyKillWithDelayedTaunt(
            "midnightsun",
            "r1",
            "Left",
            "Dawn Knight",
            `GreatbladeMidnight_${run}_04`,
            true,
            "The Light Gathers",
        );
        this.armyKillMonster("midnightsun", "r2", "Left", "Dying Light", `GreatbladeMidnight_${run}_05`);
        // Dawn Knight at r2: player1+2 alternate on "The Light Gathers" (6 s offset)
        this.armyKillWithDelayedTaunt(
            "midnightsun",
            "r2",
            "Left",
            "Dawn Knight",
            `GreatbladeMidnight_${run}_06`,
            true,
            "The Light Gathers",
        );
        // Shrine boss: Hollow Solstice — LR taunts on "The Sun Converges" (no offset)
        this.armyKillShrineBoss("midnightsun", "r3", "Left", "Hollow Solstice", `GreatbladeMidnight_${run}_07`, false);
    }

    runSolsticeMoon(): void {
        const run = ++this.solsticeRunCount;
        const runCheckpoint = `GreatbladeSolstice_${run}`;

        this.resetReusableSyncFiles();

        this.resetDungeonInstance("solsticemoon", runCheckpoint);

        this.armyKillMonster("solsticemoon", "Enter", "Left", "*", `GreatbladeSolstice_${run}_01`);

        // r1: everyone focuses Lunar Haze first, only LR taunts Moonlight Gaze.
        // After Lunar Haze dies, everyone swaps to Faithless Deer before moving on.
        this.armyKillLunarHazeWithLrTaunt(
            "solsticemoon",
            "r1",
            "Left",
            "Faithless Deer",
            `GreatbladeSolstice_${run}_02`,
        );

        // r2: everyone focuses Lunar Haze first, only LR taunts Moonlight Gaze.
        // After Lunar Haze dies, everyone swaps to Shackled Fairy before moving on.
        this.armyKillLunarHazeWithLrTaunt(
            "solsticemoon",
            "r2",
            "Left",
            "Shackled Fairy",
            `GreatbladeSolstice_${run}_03`,
        );

        // Shrine boss: Hollow Midnight — player3+4 alternate on "The Moon Converges".
        this.armyKillShrineBoss("solsticemoon", "r3", "Left", "Hollow Midnight", `GreatbladeSolstice_${run}_04`, true);

        this.tryCompleteDailyQuest(9303, "Sliver of Moonlight");
    }

    moveSolstice(checkpoint: string): void {
        switch (bot.player.cell) {
            case "Enter":
                bot.map.jump("r1", "Left", false);
                break;
            case "r1":
                bot.map.jump("r2", "Left", false);
                break;
            case "r2":
                bot.map.jump("r3", "Left", false);
                break;
            case "r3":

            case "r3a":
                this.restartSolstice(checkpoint);
                break;
        }
    }

    useClassPotions(): void {
        const className = bot.player.currentClass ?? "";

        Core.logger(`Using tonic/elixir for ${className}...`);

        switch (className.toLowerCase()) {
            case "legion revenant":
                this.usePotionSet("Sage Tonic", "Potent Malevolence Elixir");
                break;
            case "stonecrusher":

            case "infinity titan":
                this.usePotionSet("Might Tonic", "Potent Battle Elixir");
                break;
            case "archpaladin":
                this.usePotionSet("Fate Tonic", "Potent Battle Elixir");
                break;
            case "lord of order":
                this.usePotionSet("Fate Tonic", "Potent Destruction Elixir");
                break;
            default:
                Core.logger(`[Potions] No tonic/elixir profile for '${className}' — skipping.`);
                break;
        }
    }

    usePotionSet(tonic: string, elixir: string): void {
        this.usePotionItem(tonic);
        this.usePotionItem(elixir);
    }

    usePotionItem(itemName: string): void {
        if (!Core.checkInventory(itemName)) {
            this.buyAlchemyPotion(itemName);
        }

        if (!Core.checkInventory(itemName)) {
            Core.logger(`[Potions] Failed to get ${itemName}; skipping.`);
            return;
        }

        if (!bot.inventory.isEquipped(itemName)) {
            bot.inventory.equipUsableItem(itemName);
            bot.sleep(500);
        }

        Core.usePotion();
        bot.sleep(1000);
    }
    refreshPotionsIfAurasMissing(): void {
        if (!this.usePotions) {
            return;
        }

        const hasTonic =
            bot.self.hasActiveAura("Sage") || bot.self.hasActiveAura("Might") || bot.self.hasActiveAura("Fate");

        const hasElixir =
            bot.self.hasActiveAura("Potent Malevolence Elixir") ||
            bot.self.hasActiveAura("Potent Battle Elixir") ||
            bot.self.hasActiveAura("Potent Destruction Elixir");

        if (hasTonic && hasElixir) {
            Core.logger("[Potions] Potion auras still active. Skipping potion refresh.");
            return;
        }

        Core.logger("[Potions] Missing potion aura. Refreshing class potions.");
        this.useClassPotions();
    }

    buyAlchemyPotion(itemName: string): void {
        const NeedVoucher = (wanted: number): void => {
            const missing = Math.max(0, wanted - bot.inventory.getQuantity(voucher));

            if (missing > 0) {
                Core.logger(`[Potions] Buying ${missing}x ${voucher}.`);
                Engine.buyItem(voucher, shopId, map, missing);
                bot.sleep(500);
            }
        };
        const BuyPotion = (count: number): void => {
            Core.logger(`[Potions] Buying ${count}x ${itemName}.`);
            Engine.buyItem(itemName, shopId, map, count, { calculateRemaining: false });
            bot.sleep(500);
        };
        if (!itemName?.trim() || Core.checkInventory(itemName)) {
            if (!!itemName?.trim()) {
                Core.logger(`[Potions] Have: ${itemName}`);
            }
            return;
        }

        const shopId = 2036;
        const map = "alchemyacademy";
        const voucher = "Gold Voucher 500k";

        switch (itemName) {
            case "Might Tonic":

            case "Sage Tonic":

            case "Fate Tonic":
                if (!Engine.faction("Alchemy", 8)) {
                    Core.logger("[Potions] Alchemy rank 8 required for tonic.");
                    return;
                }
                NeedVoucher(2);
                BuyPotion(10);
                break;
            case "Potent Malevolence Elixir":

            case "Potent Battle Elixir":

            case "Potent Destruction Elixir":
                NeedVoucher(4);
                BuyPotion(8);
                break;
            default:
                Core.logger(`[Potions] Unknown potion: ${itemName}`);
                return;
        }
    }

    restartSolstice(checkpoint: string): void {
        this.syncArmy(`${checkpoint}_restart_ready.sync`);
        const target = Core.privateRooms ? `solsticemoon-${Core.privateRoomNumber}` : "solsticemoon";
        Core.logger(`Restarting /${target} with EclipseAscent packet 24946...`);
        bot.send.packet(`%xt%zm%dungeonQueue%24946%${target}%`);
        bot.wait.forMapLoad("solsticemoon");
        bot.wait.forTrue(() => bot.player.cell?.toLowerCase() === "Enter"?.toLowerCase(), 20);
        this.syncArmy(`${checkpoint}_restart_done.sync`);
    }

    /**
     * C#'s `ScriptMain`, a method so that GreatbladeOfTheEntwinedEclipse can run this script with
     * its own options (`skipSetOptions`).
     */
    scriptMain(): void {
        const script = this;
        if (!script.skipSetOptions) {
            Core.setOptions(undefined, { disableClassSwap: true });
        }
        if (sArmy.players().length < 4) {
            Core.logger("Add 4 account names in the script options before starting the army farm.");
            Core.setOptions(false);
            return;
        }

        Core.privateRooms = true;
        const configuredRoom = bot.config!.get<number>("privateRoomNumber");
        if (configuredRoom >= 1000 && configuredRoom <= 99999) {
            Core.privateRoomNumber = configuredRoom;
        } else {
            Core.logger(`Invalid private room number '${configuredRoom}'. Generating a fallback room number.`);
            Core.privateRoomNumber = sArmy.getRoomNr();
        }

        Core.logger(`Army mode enabled: ${sArmy.players().length} accounts, private room #${Core.privateRoomNumber}.`);

        script.autoEnhance = bot.config.get<boolean>("autoEnhance");
        script.autoGetEnrage = true;
        script.checkUsableSlotBeforeBossRooms = true;
        script.usePotions = bot.config.get<boolean>("usePotions");

        script.equipArmyClasses();

        if (script.autoEnhance) {
            script.applyEnhancements();
        }

        if (script.usePotions) {
            script.useClassPotions();
        }

        script.prepareTauntRole();

        script.tryAcceptDailyQuest(9303, "Night Falls");

        Core.addDrop(SolsticeMoonTest.sliverMoonlight);

        try {
            while (!bot.shouldExit) {
                if (
                    script.targetSliverCount > 0 &&
                    Core.checkInventory(SolsticeMoonTest.sliverMoonlight, script.targetSliverCount)
                ) {
                    Core.logger(
                        `[SolsticeMoon] Reached target of ${script.targetSliverCount} ${SolsticeMoonTest.sliverMoonlight}; stopping.`,
                    );
                    break;
                }
                script.runSolsticeMoon();
            }
        } finally {
            if (!script.skipSetOptions) {
                Core.setOptions(false);
            }
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "SolsticeMoon_Test",
    [
        option.text("player1", "LR Account", "Name of the account that will use Legion Revenant.", ""),
        option.text("player2", "SC Account", "Name of the account that will use StoneCrusher.", ""),
        option.text("player3", "AP Account", "Name of the account that will use ArchPaladin.", ""),
        option.text("player4", "LoO Account", "Name of the account that will use Lord of Order.", ""),
        option.int(
            "privateRoomNumber",
            "Private Room Number (IMPORTANT)",
            "Private room number used by all 4 accounts. Set the same number on every account!",
            69420,
        ),
        sArmy.packetDelay,
        Core.skipOptions,
        option.bool(
            "autoEnhance",
            "Auto-Apply Enhancements",
            "ON: each account automatically applies the correct enhancements for its fixed class.\n" +
                "Slot 1 (LR): Wizard/Wizard Helm/Elysium/Penitence\n" +
                "Slot 2 (SC): Fighter/Fighter Helm/Valiance/Absolution\n" +
                "Slot 3 (AP): Lucky/Lucky Helm/Valiance/Penitence\n" +
                "Slot 4 (LoO): Lucky/Lucky Helm/Valiance/Penitence",
            true,
        ),
        option.bool(
            "usePotions",
            "Use Potions",
            "ON: equips and uses configured class potion sets before starting the dungeon loop. (TONICS and ELIXIRS ONLY)\n" +
                "OFF: skips potion usage.",
            false,
        ),
    ],
    true,
);

export default function main(): void {
    new SolsticeMoonTest().scriptMain();
}

/** C#'s `{x:0.#}`: at most one decimal, none when it's zero. */
function formatTenths(x: number): string {
    return String(Math.round(x * 10) / 10);
}

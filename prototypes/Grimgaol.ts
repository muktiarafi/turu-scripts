/*
name: Grimgaol
description: Goes through the Grimgaol dungeon... Testing Phase
tags: grimgoal, dungeon, why, did, we, make, this, Testing, WIP, beta
*/
// Port of Scripts/Prototypes/Grimgaol.cs.
// Differs from C#: scripts can't write files, so the personal best (C# keeps it in
// Prototypes/GrimGaolRunTimes.txt) lasts for the session only.

import { BoostType, bot, defineScriptOptions, option, type ScriptOption, type ScriptOptionItem } from "turu";
import { CapeSpecial, CoreAdvanced, EnhancementType, HelmSpecial, WeaponSpecial } from "../core/CoreAdvanced";
import { Core } from "../core/CoreBots";
import { CoreFarms } from "../core/CoreFarms";
import { CoreStory } from "../core/CoreStory";
import { UnlockForgeEnhancements } from "../enhancement/UnlockForgeEnhancements";
import { InfernalArenaMerge } from "../other/mergeshops/InfernalArenaMerge";
import { DoomVaultB } from "../story/DoomVaultB";
import { J6Saga } from "../story/J6Saga";

const Farm = new CoreFarms();
const Story = new CoreStory();
const Adv = new CoreAdvanced();
const DVB = new DoomVaultB();
const InfernalArena = new InfernalArenaMerge();
const J6 = new J6Saga();
const Forge = new UnlockForgeEnhancements();

/**
 * An item option (`option.item`) declared as a text option with its `item` field, so a Turu older
 * than `option.item` still loads the script and shows a text box.
 */
function itemOption(name: string, displayName: string, description: string, item: ScriptOptionItem): ScriptOption {
    return { ...option.text(name, displayName, description), item };
}

export class Grimgaol {
    readonly runTimer = new Stopwatch();
    runCount = 0;

    optionsStorage = "Grimgaol2";
    dontPreconfigure = true;
    options = [
        // Skip Options
        Core.skipOptions, // Skip Enhancements
        option.bool(
            "SkipEnhancements",
            "Skip Item Enhancing",
            "If enabled, will not enhance items for the run (this doesnt mean skip enhancements you dont have... these enhancements are **VERY** important).",
            false,
        ),
        option.bool(
            "RoomTimers",
            "Time each room?",
            "If enabled, this will log the time for each room into chat/the Logs > scripts tab.",
            false,
        ), // Helms
        itemOption("ForgeHelm", "Helm: Forge", "Your helm with the Forge enhancement", "helm"),
        itemOption("WizHelm", "Helm: Wizard", "Your helm with the Wizard enhancement", "helm"),
        itemOption("HealerHelm", "Helm: Healer", "Your helm with the Healer enhancement", "helm"), // Weapons
        itemOption("Elysium", "Weapon: Elysium", "Your weapon with the Elysium enhancement", "weapon"), // Capes
        itemOption("Absolution", "Cape: Absolution", "Your cape with the Absolution enhancement", "cape"),
        itemOption("Penitence", "Cape: Penitence", "Your cape with the Penitence enhancement", "cape"),
    ];

    // ── Split Timer State ────────────────────────────────────────────────────
    static _lastSplit: number = 0;
    static _bestRun: number = Number.MAX_VALUE;
    static readonly _splits: Split[] = [];
    static _initialized: boolean = false;
    // ────────────────────────────────────────────────────────────────────────

    // ── Split Timer Methods ──────────────────────────────────────────────────

    /** Load the best run time from disk (runs once per session; nothing to load here). */
    ensureInit(): void {
        if (Grimgaol._initialized) {
            return;
        }

        Grimgaol._initialized = true;
    }

    /**
     * Call once at the start of each dungeon run.
     * Resets the stopwatch and clears previous split data.
     */
    startRun(): void {
        this.ensureInit();

        Grimgaol._splits.splice(0);
        Grimgaol._lastSplit = 0;

        this.runTimer.restart();
    }

    /**
     * Record a named checkpoint split based on elapsed combat time.
     * Only records if RoomTimers is enabled — otherwise silently skips.
     */
    recordSplit(name: string): void {
        const now = this.runTimer.elapsed;
        const delta = now - Grimgaol._lastSplit;
        Grimgaol._lastSplit = now;

        Grimgaol._splits.push(Object.assign(new Split(), { name: name, time: delta }));

        if (bot.config!.get<boolean>("RoomTimers")) {
            Core.logger(`⏱ ${name}: ${Grimgaol.formatTs(delta)}`);
        }
    }

    /**
     * Call at the end of a completed run.
     * Logs total time, compares to PB, appends to file, and prints split breakdown.
     */
    endRun(): void {
        this.runTimer.stop();
        const total = this.runTimer.elapsed;

        // PB check
        if (total < Grimgaol._bestRun) {
            Grimgaol._bestRun = total;
            Core.logger(`!! NEW PB: ${Grimgaol.formatTs(total)}`);
        } else {
            const diff = total - Grimgaol._bestRun;
            Core.logger(
                `Run complete: ${Grimgaol.formatTs(total)} | PB: ${Grimgaol.formatTs(Grimgaol._bestRun)} (+${Grimgaol.formatTs(diff)})`,
            );
        }

        // Always print split breakdown
        this.logSplits(total);
    }

    /** Prints the per-room split breakdown and the run total. */
    logSplits(total: number): void {
        if (Grimgaol._splits.length === 0) {
            return;
        }

        const slowest = Math.max(...Grimgaol._splits.map((s) => s.time));

        Core.logger("---- SPLIT BREAKDOWN ----");

        for (const s of Grimgaol._splits) {
            const isSlowest = s.time === slowest;

            const line = `${s.name.padEnd(25)} ${Grimgaol.formatTs(s.time)}` + (isSlowest ? " (slowest)" : "");

            Core.logger(Grimgaol.sanitize(line));
        }

        Core.logger(`TOTAL                    ${Grimgaol.formatTs(total)}`);
        Core.logger("------------------------");
    }

    /** Removes unsafe Unicode that can break AQW/Skua chat rendering. */
    static sanitize(input: string): string {
        if (!input) {
            return "";
        }

        // keep it brutally safe for legacy client chat parsers
        return [...input].filter((c) => c.charCodeAt(0) <= 127).join("");
    }

    /** Formats a TimeSpan as m:ss.ff — cleaner than the default ToString. */
    static formatTs(t: number): string {
        return `${Math.trunc(t / 60000)}:${String(Math.floor(t / 1000) % 60).padStart(2, "0")}.${String(Math.trunc((t % 1000) / 10)).padStart(2, "0")}`;
    }

    // ────────────────────────────────────────────────────────────────────────

    doGrimGaol(rank = 10): void {
        if (Farm.factionRank("Grimskull Trolling") >= rank) {
            Core.logger(`You already have rank ${rank} Grimskull Trolling reputation.`);
            return;
        }
        Core.logger("Checking prerequisites and configurations...");
        this.checkConfig();
        this.prereqs();
        bot.options.restPackets = true;
        Core.logger("Prerequisites and configurations checked successfully.");

        Core.logger(`Farming rank ${rank} Grimskull Trolling reputation.`);

        Farm.toggleBoost(BoostType.Reputation);
        while (!bot.shouldExit && Farm.factionRank("Grimskull Trolling") < rank) {
            if (!bot.quests.isDailyComplete(9469) && Core.hasWebBadge("SkullCrusher")) {
                Core.ensureAccept(9469);
            }

            Core.ensureAccept(!Core.hasWebBadge("SkullCrusher") ? 9466 : Core.isMember ? 9468 : 9467);

            if (bot.map.name.toLowerCase() === "grimgaol") {
                Core.logger("Already in the dungeon (weird flex but ok)... we'll continue from where you left off");
                this.init();
            } else {
                bot.send.packet(`%xt%zm%dungeonQueue%${bot.map.roomId}%grimgaol-100000%`);
                bot.wait.forMapLoad("grimgaol");

                // Incase we're in the Cutscene cell
                if (bot.player.cell !== "Enter") {
                    bot.map.jump("Enter", "Spawn", false);
                    bot.wait.forCellChange("Enter");
                }

                this.init();
            }
        }

        Core.logger(`Total Runs Complete: ${this.runCount}`);
        Farm.toggleBoost(BoostType.Reputation, false);
    }

    private init(): void {
        if (bot.player.cell.toLowerCase().includes("cut")) {
            Core.logger(`in ${bot.player.cell} cell, jumping to enter`);
            bot.map.jump("Enter", "Left", false);
            bot.wait.forCellChange("Enter");
        }

        // Start the run timer (resets stopwatch + clears splits)
        this.startRun();

        // Stop usage of AdvSkills after story & prereqs. as we'll use our own here.
        while (!bot.shouldExit && !bot.tempInv.contains("Grimskull's Gaol Cleared")) {
            this.jumpToAvailMonster();
            bot.skills.stop();
            if (bot.player != null) {
                switch (bot.player.cell) {
                    // Grimskull?
                    case "Enter":
                        this.rke(bot.player.cell);
                        this.recordSplit("Enter — Grimskull?");
                        if ((bot.player.cell as string) !== "r2") {
                            bot.map.jump("r2", "Left", false);
                            bot.wait.forCellChange("r2");
                        }
                        break;
                    // Grim Bomb
                    case "r2":
                        if (!Core.checkInventory(this.legionrevenant)) {
                            this.rDoT(bot.player.cell);
                        } else {
                            this.rlr(bot.player.cell);
                        }
                        this.recordSplit("r2 — Grim Bomb");
                        if ((bot.player.cell as string) !== "r3") {
                            bot.map.jump("r3", "Left", false);
                            bot.wait.forCellChange("r3");
                        }
                        break;
                    // Empress Angler
                    case "r3":
                        this.r3();
                        this.recordSplit("r3 — Empress Angler");
                        if ((bot.player.cell as string) !== "r4") {
                            bot.map.jump("r4", "Left", false);
                            bot.wait.forCellChange("r4");
                        }
                        break;
                    // Treasure Chest
                    case "r4":
                        this.rDoT(bot.player.cell);
                        this.recordSplit("r4 — Treasure Chest");
                        if ((bot.player.cell as string) !== "r5") {
                            bot.map.jump("r5", "Left", false);
                            bot.wait.forCellChange("r5");
                        }
                        break;
                    // Reinforced Shelleton
                    case "r5":
                        if (Core.checkInventory(this.legionrevenant)) {
                            this.rlr(bot.player.cell);
                        } else {
                            this.rbb(bot.player.cell);
                        }
                        this.recordSplit("r5 — Reinforced Shelleton");
                        if ((bot.player.cell as string) !== "r6") {
                            bot.map.jump("r6", "Left", false);
                            bot.wait.forCellChange("r6");
                        }
                        break;
                    // Fell Statue
                    case "r6":
                        this.rDoT(bot.player.cell);
                        this.recordSplit("r6 — Fell Statue");
                        if ((bot.player.cell as string) !== "r7") {
                            bot.map.jump("r7", "Left", false);
                            bot.wait.forCellChange("r7");
                        }
                        break;
                    // Emperor Angler
                    case "r7":
                        this.rDoT(bot.player.cell);
                        this.recordSplit("r7 — Emperor Angler");
                        if ((bot.player.cell as string) !== "r8") {
                            bot.map.jump("r8", "Left", false);
                            bot.wait.forCellChange("r8");
                        }
                        break;
                    // Treasure Chest
                    case "r8":
                        this.rDoT(bot.player.cell);
                        this.recordSplit("r8 — Treasure Chest");
                        if ((bot.player.cell as string) !== "r9") {
                            bot.map.jump("r9", "Left", false);
                            bot.wait.forCellChange("r9");
                        }
                        break;
                    // Rick, Grim Soldier
                    case "r9":
                        this.rDoT(bot.player.cell);
                        this.recordSplit("r9 — Rick, Grim Soldier");
                        if ((bot.player.cell as string) !== "r10") {
                            bot.map.jump("r10", "Left", false);
                            bot.wait.forCellChange("r10");
                        }
                        break;
                    // Mechro Lich + Rampaging Cyborg
                    case "r10":
                        this.r10();
                        this.recordSplit("r10 — Mechro Lich + Cyborg");
                        if ((bot.player.cell as string) !== "r11") {
                            bot.map.jump("r11", "Left", false);
                            bot.wait.forCellChange("r11");
                        }
                        break;
                    // Mechabinky & Raxborg
                    case "r11":
                        this.rke(bot.player.cell);
                        this.recordSplit(`r11 — Mechabinky & Raxborg`);
                        if ((bot.player.cell as string) !== "r12") {
                            bot.map.jump("r12", "Left", false);
                            bot.wait.forCellChange("r12");
                        }
                        break;
                    // Grimskull
                    case "r12":
                        this.rke(bot.player.cell);
                        this.recordSplit("r12 — Grimskull (Final Boss)");
                        if ((bot.player.cell as string) !== "r12a") {
                            bot.map.jump("r12a", "Left", false);
                            bot.wait.forCellChange("r12a");
                        }
                        break;
                    default:
                        break;
                }
            } else {
                Core.logger("Object Bot.Player is null.");
                break;
            }
            bot.sleep(200);
        }

        // End run: log total, compare PB, print splits
        if (Core.checkInventory("Grimskull's Gaol Cleared")) {
            this.runCount++;
            Core.logger(`Runs complete so far: ${this.runCount}`);
            this.endRun();
        }

        Core.ensureComplete(!Core.hasWebBadge("SkullCrusher") ? 9466 : Core.isMember ? 9468 : 9467);

        if (!bot.quests.isDailyComplete(9469) && Core.hasWebBadge("SkullCrusher")) {
            Core.ensureComplete(9469);
        }

        Core.join("whitemap-100000");

        bot.send.packet(`%xt%zm%dungeonQueue%${bot.map.roomId}%Grimgaol-100000%`);
        bot.wait.forMapLoad("Grimgaol");
        if (bot.player != null) {
            bot.wait.forTrue(() => bot.player.loaded, 20);
        }
    }

    //#region These are fine
    private rke(cell: string): void {
        if (bot.player.cell !== cell) {
            Core.logger("jump to enter");
            bot.map.jump("Enter", "Spawn", false);
            bot.wait.forCellChange("Enter");
        }

        if (bot.player.alive && !this.monsterAvail()) {
            this.runTimer.stop();
            return;
        }

        bot.player.setSpawnPoint();

        this.equipIfAvailable(this.kingsecho);
        this.equipIfAvailable(bot.config!.get<string>("Elysium"));
        this.equipIfAvailable(bot.config!.get<string>("ForgeHelm"));
        this.equipIfAvailable(bot.config!.get<string>("Penitence"));

        this.runTimer.start();

        let skillIndex = 0;
        const skillList = [1, 2];

        while (!bot.shouldExit) {
            if (!bot.player!.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);
                skillIndex = 0;
            }

            if (bot.player.alive && !this.monsterAvail()) {
                this.runTimer.stop();
                return;
            }

            if (bot.player.cell !== "Enter" && bot.player.cell !== "r11" && bot.player.cell !== "r12") {
                Core.logger("jump back to enter");
                bot.map.jump("Enter", "Left", false);
                bot.wait.forCellChange("Enter");
                bot.sleep(1000);
            }

            if (!bot.player.hasTarget) {
                bot.combat.attack("*");
            }

            if (bot.player.hasTarget && (bot.player.target?.hp ?? NaN) <= 0) {
                break;
            }

            const hasTalonTwisting = bot.target.hasActiveAura("Talon Twisting");
            const hasRetaliate = bot.target.hasActiveAura("Retaliate");

            const hasContrarium = bot.self.hasActiveAura("Contrarium");

            if (hasTalonTwisting && !hasRetaliate) {
                bot.combat.cancelTarget();
                bot.skills.pause();
                bot.sleep(7000);
                //lonewolf changed, original number was 1000

                bot.wait.forTrue(() => bot.player.hasTarget && bot.target.hasActiveAura("Retaliate") === true, 20);

                while (!bot.shouldExit && bot.player.hasTarget && bot.target.hasActiveAura("Retaliate") === true) {
                    bot.sleep(200);
                }

                bot.combat.stopAttacking = false;
                //skillIndex = 0;
                bot.skills.resume();
                bot.sleep(200);
            }

            if (bot.player.mana <= bot.player.maxMana * 0.25 && bot.skills.canUseSkill(4)) {
                bot.skills.useSkill(4);
                bot.sleep(200);
                continue;
            }

            if (bot.self.getAuraValue("Residual Aura") >= 24 && bot.skills.canUseSkill(4)) {
                bot.skills.useSkill(4);
                bot.sleep(200);
                continue;
            }

            if (
                bot.player.health <= bot.player.maxHealth * 0.65 &&
                bot.player.mana >= bot.player.maxMana * 0.5 &&
                !hasContrarium &&
                bot.skills.canUseSkill(3)
            ) {
                bot.skills.useSkill(3);
                bot.sleep(200);
                continue;
            }

            skillIndex = this.useSkillRotation(skillList, skillIndex);

            bot.sleep(200);
        }
    }

    //empress room
    private r3(): void {
        if ((bot.player.cell as string) !== "r3") {
            Core.logger("jump to r3");
            bot.map.jump("r3", "Left", false);
            bot.wait.forCellChange("r3");
        }
        bot.sleep(1000);

        if (bot.player.alive && !this.monsterAvail()) {
            this.runTimer.stop();
            return;
        }
        bot.player.setSpawnPoint();

        //#region Equipment Setup
        this.equipIfAvailable(this.dragonoftime);
        this.equipIfAvailable(bot.config!.get<string>("Elysium"));
        this.equipIfAvailable(bot.config!.get<string>("HealerHelm"));
        this.equipIfAvailable(bot.config!.get<string>("Absolution"));
        //#endregion
        this.runTimer.start();
        const skillList = [3, 2, 1, 2, 4, 2];
        let skillIndex = 0;

        while (!bot.shouldExit) {
            if (bot.player.alive && !this.monsterAvail()) {
                this.runTimer.stop();
                return;
            }

            if (!bot.player!.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);

                skillIndex = 0;
            }

            if (!bot.player.hasTarget || !bot.player.inCombat) {
                bot.combat.attack("*");
            }

            if (bot.player.hasTarget && (bot.player.target?.hp ?? NaN) <= 0) {
                if (bot.player.inCombat) {
                    bot.combat.cancelTarget();
                }

                continue;
            }

            //aura check
            const hasConcealedBlade =
                bot.player.hasTarget &&
                bot.target?.auras.some((x) => x != null && x.name === "Concealed Blade") === true;
            const hasBottomFeeder =
                bot.player.hasTarget && bot.target?.auras.some((x) => x != null && x.name === "Bottom Feeder") === true;
            if (hasConcealedBlade && !hasBottomFeeder) {
                Core.debugLogger("EXECUTE DETECTED!!! HEAL UP!!!");

                if (bot.skills.canUseSkill(2)) {
                    bot.skills.useSkill(2);
                }

                bot.sleep(250);
                continue;
            }

            skillIndex = this.useSkillRotation(skillList, skillIndex);
            bot.sleep(100);
        }
    }

    // 3x Lich room
    private r10(): void {
        if ((bot.player.cell as string) !== "r10") {
            Core.logger("jump to r10");
            bot.map.jump("r10", "Left", false);
            bot.wait.forCellChange("r10");
        }
        bot.sleep(1000);

        if (bot.player.alive && !this.monsterAvail()) {
            this.runTimer.stop();
            return;
        }
        bot.player.setSpawnPoint();

        //#region Equipment Setup
        this.equipIfAvailable(this.dragonoftime);
        this.equipIfAvailable(bot.config!.get<string>("Elysium"));
        this.equipIfAvailable(bot.config!.get<string>("WizHelm"));
        this.equipIfAvailable(bot.config!.get<string>("Absolution"));
        //#endregion
        this.runTimer.start();
        const skillList = [3, 2, 1, 2, 4, 2];
        let skillIndex = 0;

        let monsId = "16";
        let monsIdInt = 16;

        while (!bot.shouldExit) {
            if (!bot.player!.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);
                skillIndex = 0;
            }

            if (bot.player.alive && !this.monsterAvail()) {
                this.runTimer.stop();
                return;
            }

            if (
                monsId !== "*" &&
                bot.monsters.mapMonsters.some(
                    (x) =>
                        String(x != null && x?.cell === bot.player.cell && x?.mapId) === monsId &&
                        (x?.hp <= 70000 || x?.hp <= 50000 || x?.hp <= 20000),
                )
            ) {
                switch (monsId) {
                    case "16":
                        monsId = "17";
                        monsIdInt = 17;
                        break;
                    case "17":
                        monsId = "18";
                        monsIdInt = 18;
                        break;
                    case "18":
                        monsId = "*";
                        break;
                }
            }

            if (monsId === "*") {
                this.doPriorityAttackId([16, 17, 18, 19]);
            } else {
                this.doPriorityAttackId([monsIdInt]);
            }

            skillIndex = this.useSkillRotation(skillList, skillIndex);
            bot.sleep(100);
        }
    }

    useWizHelm: boolean = false;
    private rDoT(cell: string, statues = false, _cancellationToken: unknown = null): void {
        // Jump to cell if needed
        if (bot.player.cell !== cell) {
            Core.logger(`Jumping to "${cell}"`);
            bot.map.jump(cell, "Left", false);
            bot.wait.forCellChange(cell);
        }

        const WizHelmCells = ["r4", "r7", "r9", "r10", "r12"];
        if (WizHelmCells.includes(bot.player.cell)) {
            this.useWizHelm = true;
        }

        if (bot.player.alive && !this.monsterAvail()) {
            this.runTimer.stop();
            return;
        }

        bot.player.setSpawnPoint();

        //#region Equipment Setup
        this.equipIfAvailable(this.dragonoftime);
        this.equipIfAvailable(bot.config!.get<string>("Elysium"));
        this.equipIfAvailable(bot.config!.get<string>(this.useWizHelm ? "WizHelm" : "HealerHelm"));
        this.equipIfAvailable(bot.config!.get<string>("Absolution"));
        //#endregion
        this.runTimer.start();
        bot.skills.stop();

        let skillIndex = 0;
        const skillList = [3, 2, 1, 2, 4, 2];
        while (!bot.shouldExit) {
            if (bot.player.alive && !this.monsterAvail()) {
                this.runTimer.stop();

                return;
            }

            for (const m of bot.monsters.currentAvailableMonsters) {
                if (m == null || m.hp <= 0 || m.state === 0 || !(m.hp > 0 && m.state > 0)) {
                    continue;
                }

                while (!bot.shouldExit) {
                    // The C# returns here only in r3, so in other rooms it never leaves once the
                    // last monster dies: `m` is a copy taken before the fight (its HP never drops)
                    // and the target is gone (getTargetMonster drops a dead one).
                    if (bot.player.alive && !this.monsterAvail()) {
                        this.runTimer.stop();
                        return;
                    }

                    if (!bot.player!.alive) {
                        bot.wait.forTrue(() => bot.player.alive, 20);
                        skillIndex = 0;
                    }

                    // This monster is dead (read from the game, not from the copy): the next one.
                    if (bot.player.alive && !this.monsterAvailId(m.mapId)) {
                        if (bot.player.inCombat) {
                            bot.combat.cancelTarget();
                        }
                        break;
                    }

                    if (!bot.player.hasTarget || !bot.player.inCombat) {
                        bot.combat.attack(m!.mapId);
                    }

                    // Empress Angler Aura Checks
                    if (bot.player.cell === "r3") {
                        while (!bot.shouldExit) {
                            if (!bot.player.hasTarget || !bot.player.inCombat) {
                                bot.combat.attack(m!.mapId);
                            }

                            if (bot.player.health < bot.player.maxHealth) {
                                if (bot.skills.canUseSkill(2)) {
                                    bot.skills.useSkill(2);
                                }
                                bot.sleep(250);
                            } else {
                                skillIndex = this.useSkillRotation(skillList, skillIndex);
                            }
                        }
                    }

                    if (
                        (bot.player.target?.hp ?? NaN) <= 0 ||
                        m.hp <= 0 ||
                        m.state === 0 ||
                        !(m.hp > 0 && m.state > 0)
                    ) {
                        if (bot.player.inCombat) {
                            bot.combat.cancelTarget();
                        }
                        break;
                    }

                    skillIndex = this.useSkillRotation(skillList, skillIndex);

                    bot.sleep(100);
                }
            }
        }
    }

    /** Uses the next skill of the rotation; returns the new index (C# passes it by `ref`). */
    private useSkillRotation(skillList: number[], skillIndex: number): number {
        if (bot.player.hasTarget && (bot.player.target?.hp ?? NaN) > 0) {
            const skill = skillList[skillIndex];

            if (bot.skills.canUseSkill(skill)) {
                bot.skills.useSkill(skill);
                skillIndex = (skillIndex + 1) % skillList.length;
            }
        }
        return skillIndex;
    }

    private rlr(cell: string): void {
        // Jump to cell if needed
        if (bot.player.cell !== cell) {
            Core.logger(`Jumping to "${cell}"`);
            bot.map.jump(cell, "Left", false);
            bot.wait.forCellChange(cell);
        }

        if (bot.player.alive && !this.monsterAvail()) {
            this.runTimer.stop();
            return;
        }

        bot.player.setSpawnPoint();

        //#region Equipment Setup
        this.equipIfAvailable(this.legionrevenant);
        this.equipIfAvailable(bot.config!.get<string>("ForgeHelm"));
        this.equipIfAvailable(bot.config!.get<string>("Elysium"));
        this.equipIfAvailable(bot.config!.get<string>("Penitence"));
        //#endregion
        this.runTimer.start();

        let skillIndex = 0;
        const skillList = [3, 4, 1, 2];

        while (!bot.shouldExit) {
            if (bot.player.alive && !this.monsterAvail()) {
                this.runTimer.stop();
                return;
            }

            for (const m of bot.monsters.currentAvailableMonsters) {
                if (m == null || m.hp <= 0 || m.state === 0 || !(m.hp > 0 && m.state > 0)) {
                    continue;
                }

                while (!bot.shouldExit) {
                    if (bot.player.alive && !this.monsterAvail()) {
                        this.runTimer.stop();
                        return;
                    }

                    if (!bot.player!.alive) {
                        bot.wait.forTrue(() => bot.player.alive, 20);
                        skillIndex = 0;
                    }

                    // This monster is dead (read from the game, not from `m`, a copy taken before the
                    // fight): the next one. Otherwise the bot keeps targeting the dead one and stands
                    // idle while the others are alive (in r2 the Grim Bomb left alive kills it).
                    if (bot.player.alive && !this.monsterAvailId(m.mapId)) {
                        if (bot.player.inCombat) {
                            bot.combat.cancelTarget();
                        }
                        break;
                    }

                    if (!bot.player.hasTarget || !bot.player.inCombat) {
                        bot.combat.attack(m!.mapId);
                    }

                    if (
                        (bot.player.target?.hp ?? NaN) <= 0 ||
                        m.hp <= 0 ||
                        m.state === 0 ||
                        !(m.hp > 0 && m.state > 0)
                    ) {
                        if (bot.player.inCombat) {
                            bot.combat.cancelTarget();
                        }
                        break;
                    }
                    //not using UseSkillRotation on purpose so that every skill is used instead of waiting for cooldowns
                    if (bot.player.hasTarget && (bot.player.target?.hp ?? NaN) > 0) {
                        bot.skills.useSkill(skillList[skillIndex]);
                        skillIndex = (skillIndex + 1) % skillList.length;
                    }
                    bot.sleep(100);
                }
            }
        }
    }
    private rbb(cell: string): void {
        // Jump to cell if needed
        if (bot.player.cell !== cell) {
            Core.logger(`Jumping to "${cell}"`);
            bot.map.jump(cell, "Left", false);
            bot.wait.forCellChange(cell);
        }

        if (bot.player.alive && !this.monsterAvail()) {
            this.runTimer.stop();
            return;
        }

        bot.player.setSpawnPoint();

        //#region Equipment Setup
        this.equipIfAvailable(this.blazebinder);
        this.equipIfAvailable(bot.config!.get<string>("WizHelm"));
        this.equipIfAvailable(bot.config!.get<string>("Elysium"));
        this.equipIfAvailable(bot.config!.get<string>("Absolution"));
        //#endregion
        this.runTimer.start();

        let skillIndex = 0;
        const skillList = [3, 4, 1, 2];

        while (!bot.shouldExit) {
            if (bot.player.alive && !this.monsterAvail()) {
                this.runTimer.stop();
                return;
            }

            for (const m of bot.monsters.currentAvailableMonsters) {
                if (m == null || m.hp <= 0 || m.state === 0 || !(m.hp > 0 && m.state > 0)) {
                    continue;
                }

                while (!bot.shouldExit) {
                    if (bot.player.alive && !this.monsterAvail()) {
                        this.runTimer.stop();
                        return;
                    }

                    if (!bot.player!.alive) {
                        bot.wait.forTrue(() => bot.player.alive, 20);
                        skillIndex = 0;
                    }

                    // This monster is dead (read from the game, not from `m`, a copy taken before the
                    // fight): the next one. Otherwise the bot keeps targeting the dead one and stands
                    // idle while the others are alive (in r2 the Grim Bomb left alive kills it).
                    if (bot.player.alive && !this.monsterAvailId(m.mapId)) {
                        if (bot.player.inCombat) {
                            bot.combat.cancelTarget();
                        }
                        break;
                    }

                    if (!bot.player.hasTarget || !bot.player.inCombat) {
                        bot.combat.attack(m!.mapId);
                    }

                    if (
                        (bot.player.target?.hp ?? NaN) <= 0 ||
                        m.hp <= 0 ||
                        m.state === 0 ||
                        !(m.hp > 0 && m.state > 0)
                    ) {
                        if (bot.player.inCombat) {
                            bot.combat.cancelTarget();
                        }
                        break;
                    }
                    //not using UseSkillRotation on purpose so that every skill is used instead of waiting for cooldowns
                    if (bot.player.hasTarget && (bot.player.target?.hp ?? NaN) > 0) {
                        bot.skills.useSkill(skillList[skillIndex]);
                        skillIndex = (skillIndex + 1) % skillList.length;
                    }
                    bot.sleep(100);
                }
            }
        }
    }

    //#endregion
    equipIfAvailable(itemName: string | null): void {
        if (!itemName?.trim()) {
            return;
        }

        if (!Core.checkInventory(itemName)) {
            Core.logger(`Item not found in inventory or bank: "${itemName}"`, "EquipIfAvailable");
            return;
        }

        // Equip repeatedly until equipped or script exits
        while (!bot.shouldExit && !bot.inventory.isEquipped(itemName)) {
            bot.inventory.equipItem(itemName);
            bot.wait.forActionCooldown("equipItem");
            Core.sleep();
        }
    }

    private doPriorityAttackId(monsterListId: number[]): void {
        for (const id of monsterListId) {
            if (this.monsterAvailId(id)) {
                bot.combat.attack(id);
                return;
            }
        }
    }

    private monsterAvailId(id: number): boolean {
        if (
            bot.monsters.mapMonsters.some(
                (x) => x != null && x.mapId === id && x.cell === bot.player.cell && (x.hp > 0 || x.state !== 0),
            )
        ) {
            return true;
        }
        return false;
    }

    private monsterAvail(): boolean {
        if (
            bot.monsters.mapMonsters.some(
                (x) => x != null && x?.cell === bot.player.cell && (x?.hp > 0 || x?.state !== 0),
            )
        ) {
            return true;
        }
        return false;
    }

    private jumpToAvailMonster(): void {
        for (const m of bot.monsters.mapMonsters) {
            if (m == null || m.hp <= 0 || m.state === 0) {
                continue;
            }

            if (bot.player.cell !== m!.cell) {
                bot.map.jump(m.cell, "Left", false);
                bot.wait.forCellChange(m.cell);
            }
            return;
        }
    }

    // Auto-select IoDA version if available (getters: C# reads them when the class is made, which
    // here is when the script loads, before the game can be asked)
    get dragonoftime(): string {
        return Core.checkInventory("Dragon of Time (IoDA)") ? "Dragon of Time (IoDA)" : "Dragon of Time";
    }
    get legionrevenant(): string {
        return Core.checkInventory("Legion Revenant (IoDA)") ? "Legion Revenant (IoDA)" : "Legion Revenant";
    }
    readonly kingsecho = "King's Echo";
    readonly blazebinder = "Blaze Binder";

    private checkConfig(): void {
        const EnhanceIfFound = (
            Name: string | null,
            type: EnhancementType,
            cape: CapeSpecial = CapeSpecial.None,
            helm: HelmSpecial = HelmSpecial.None,
            weapon: WeaponSpecial = WeaponSpecial.None,
        ): void => {
            if (!Name?.trim()) {
                return;
            }

            if (!Core.checkInventory(Name)) {
                const key = Name.toLowerCase().trim();
                if (allItemNames.has(key)) {
                    Core.logger(
                        `[WARN] "${Name}" is in inventory/bank but may have a capitalization/spacing mismatch.`,
                    );
                } else {
                    Core.logger(`[MISSING] Enhancement target "${Name}" not found in inventory or bank.`);
                }
                return;
            }

            if (!skipEnh) {
                Adv.enhanceItem(Name, type, { cSpecial: cape, hSpecial: helm, wSpecial: weapon, logging: false });
                summaryLogs.push(
                    `- ${Name}: ${EnhancementType[type]}` +
                        (weapon !== WeaponSpecial.None
                            ? ` (${WeaponSpecial[weapon]})`
                            : cape !== CapeSpecial.None
                              ? ` (${CapeSpecial[cape]})`
                              : helm !== HelmSpecial.None
                                ? ` (${HelmSpecial[helm]})`
                                : ""),
                );
            }
        };
        const gear = new Map([
            // Weapon Enhancements
            ["Elysium", bot.config!.get<string>("Elysium")],
            // Cape Enhancements
            ["Penitence", bot.config!.get<string>("Penitence")],
            ["Absolution", bot.config!.get<string>("Absolution")],
            // Helm Enhancements
            ["WizHelm", bot.config!.get<string>("WizHelm")],
            ["HealerHelm", bot.config!.get<string>("HealerHelm")],
            ["ForgeHelm", bot.config!.get<string>("ForgeHelm")],
        ]);

        // Optional: Check all and log missing
        const requiredClasses = [
            this.dragonoftime,
            Core.checkInventory(this.legionrevenant) ? this.legionrevenant : this.blazebinder,
            this.kingsecho,
        ];
        const missingClasses = [...requiredClasses.filter((c) => !Core.checkInventory(c))];

        if (missingClasses.length > 0) {
            Core.logger(
                `Missing required classes (${missingClasses.length}):\n- ${missingClasses.join("\n- ")}`,
                "Missing required classes",
                { stopBot: true, messageBox: true },
            );
        }

        // Filter non-null and non-whitespace items and cast to non-nullable string
        const requiredItems = [...gear.values()]
            .filter((item) => !!item?.trim())
            .map((item) => item!)
            .filter((item) => !bot.inventory.isEquipped(item) && !bot.bank.contains(item));

        Core.checkInventory([...requiredItems]);

        // Determine whether to skip enhancements
        const skipEnh = bot.config!.get<boolean>("SkipEnhancements");

        // Validate config values
        for (const opt of this.options.filter((o) => o.kind === "text")) {
            if (opt === Core.skipOptions) {
                continue;
            }

            if (!gear.has(opt.name)) {
                continue;
            }
            const value = gear.get(opt.name);

            if (!value?.trim()) {
                Core.logger(
                    `The item for enhancement '${opt.name}' is missing.\n` +
                        `Go to: Scripts > [Edit Script Options], then enter the exact item Name (case-sensitive).\n` +
                        `Use Tools > Grabber > Inventory to get the correct Name.`,
                    `Missing Item: ${opt.name}`,
                    { stopBot: true },
                );
            }
        }

        // Precompile lowercase Name list for comparison
        const allItemNames = new Set(
            bot.inventory.items.concat(...bot.bank.items).map((i) => i.name.toLowerCase().trim()),
        );

        // Enhancement result log
        const summaryLogs: string[] = [];

        // Static class enhancements
        EnhanceIfFound(this.kingsecho, EnhancementType.Lucky);
        EnhanceIfFound(
            Core.checkInventory(this.legionrevenant) ? this.legionrevenant : this.blazebinder,
            EnhancementType.Wizard,
        );
        EnhanceIfFound(this.dragonoftime, EnhancementType.Wizard);

        // Weapon enhancements
        EnhanceIfFound(gear.get("Elysium")!, EnhancementType.Wizard, undefined, undefined, WeaponSpecial.Elysium);

        // Helm enhancements
        EnhanceIfFound(gear.get("ForgeHelm")!, EnhancementType.Lucky, undefined, HelmSpecial.Forge);
        EnhanceIfFound(gear.get("WizHelm")!, EnhancementType.Wizard);
        EnhanceIfFound(gear.get("HealerHelm")!, EnhancementType.Healer);

        // Cape enhancements
        EnhanceIfFound(gear.get("Penitence")!, EnhancementType.Wizard, CapeSpecial.Penitence);
        EnhanceIfFound(gear.get("Absolution")!, EnhancementType.Wizard, CapeSpecial.Absolution);

        // Final log
        if (!skipEnh) {
            for (const log of summaryLogs) {
                Core.logger(log);
            }
        }
    }

    private prereqs(): void {
        if (Core.isCompletedBefore(9465)) {
            return;
        }

        Farm.experience(80);
        DVB.storyLine();

        Forge.smite();

        //#region Grimgaol Prereqs
        // Smite the Boulder! (9463)
        if (!Story.questProgression(9463)) {
            Core.ensureAccept(9463);
            Adv.buyItem("forge", 2142, 70990);
            Core.getMapItem(12327, undefined, "gaolcell");
            Core.ensureComplete(9463);
        }

        // Strike the Boulder! (9464)
        if (!Story.questProgression(9464)) {
            InfernalArena.buyAllMerge("Scythe of Azalith");
            Core.ensureAccept(9464);
            Core.getMapItem(12328, undefined, "gaolcell");
            Core.ensureComplete(9464);
        }

        // Smash the Boulder! (9465)
        if (!Story.questProgression(9465)) {
            J6.j6(true);
            Adv.buyItem("hyperspace", 194, "J6's Hammer");
            Core.ensureAccept(9465);
            Core.getMapItem(12329, undefined, "gaolcell");
            Core.ensureComplete(9465);
        }
        //#endregion Grimgaol Prereqs
    }
}

/** C# `Stopwatch`: elapsed milliseconds while running. */
class Stopwatch {
    private started: number | null = null;
    private total = 0;

    get elapsed(): number {
        return this.total + (this.started === null ? 0 : Date.now() - this.started);
    }

    start(): void {
        this.started ??= Date.now();
    }

    stop(): void {
        this.total = this.elapsed;
        this.started = null;
    }

    restart(): void {
        this.total = 0;
        this.started = Date.now();
    }
}

export class Split {
    name: string = "";
    time!: number;
}

export const scriptOptions = (() => {
    const g = new Grimgaol();
    return defineScriptOptions(g.optionsStorage, g.options, g.dontPreconfigure);
})();

export default function main(): void {
    const script = new Grimgaol();
    Core.setOptions(undefined, { disableClassSwap: true });

    script.doGrimGaol();

    Core.setOptions(false);
}

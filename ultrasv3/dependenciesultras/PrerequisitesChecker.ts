/*
name: null
description: null
tags: null
*/
// Port of Scripts/Ultrasv3/DependenciesUltras/PrerequisitesChecker.cs.

import { bot, type InventoryItem } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core, rethrowIfStopped } from "../../core/CoreBots";
import { CoreEnginev3 } from "./CoreEnginev3";
import { CoreUltrav3 } from "./CoreUltrav3";
import { UltraWaitForArmy } from "./UltraWaitForArmy";

const Engine = CoreEnginev3.instance;
const Ultra = new CoreUltrav3();

export class PrerequisitesChecker {
    private get adv(): CoreAdvanced {
        return (this._Adv ??= new CoreAdvanced());
    }
    private _Adv: CoreAdvanced | null = null;

    static readonly prereqResultFile = "PrerequisiteArmyChecker.sync";
    static readonly prereqGateFile = "PrereqGate.sync";

    private static readonly requiredClasses: string[] = [
        "Verus DoomKnight",
        "Shaman",
        "StoneCrusher",
        "King's Echo",
        "ArchPaladin",
        "Dragon of Time",
        "ArchFiend",
    ];

    private static readonly raceKeys: string[] = ["Human", "Undead", "Dragonkin", "Chaos", "Elemental"];

    enforce(): void {
        const failures = this.runChecks();

        if (failures.length === 0) {
            Core.logger("[PrerequisitesChecker] All prerequisites met.", "Info");
            return;
        }

        Core.logger(
            "[PrerequisitesChecker] FAILED — missing prerequisites:" +
                "\n" +
                failures.map((f) => `  ✗ ${f}`).join("\n"),
            "Error",
            { messageBox: true, stopBot: true },
        );
    }

    check(): boolean {
        this._messageLines.splice(0);
        const failures = this.runChecks();

        if (failures.length > 0) {
            Core.logger("[PrerequisitesChecker] Missing prerequisites:", "Warning");
            for (const f of failures) {
                Core.logger(`  ✗ ${f}`, "Warning");
            }

            const sb: string[] = [];
            sb.push(`Player: ${Core.username()}`);
            sb.push("");
            for (const line of this._messageLines) {
                sb.push(line);
            }
            sb.push("");
            sb.push(`❌ ${failures.length} prerequisite(s) failed.`);
            bot.showMessageBox(sb.map((l) => `${l}\n`).join(""), "Ultras-v3 Prerequisites");
            return false;
        }

        Core.logger("[PrerequisitesChecker] All prerequisites met.", "Info");
        return true;
    }

    private runChecks(): string[] {
        const failures = [];
        failures.push(...this.checkClasses());
        failures.push(...this.checkLevelAndGold());
        failures.push(...this.checkForgeEnhancements());
        failures.push(...this.checkDamageBoosts());
        failures.push(...this.checkReputation());
        return failures;
    }

    _classFails: number = 0;
    _levelGoldFails: number = 0;
    _forgeFails: number = 0;
    _boostFails: number = 0;
    _repFails: number = 0;
    readonly _messageLines: string[] = [];

    //#region Class Checks
    checkClasses(): string[] {
        this._classFails = 0;
        const failures = [];

        Core.logger("[PrerequisitesChecker] --- Classes ---", "Info");
        this._messageLines.push("--- Classes ---");

        for (const requiredCls of PrerequisitesChecker.requiredClasses) {
            // Local copy so we can swap it to "Infinity Titan" below without touching the foreach iterator
            let cls = requiredCls;

            if (cls === "StoneCrusher") {
                const hasStoneCrusher = Core.checkInventory("StoneCrusher");
                const hasInfiniteTitan = Core.checkInventory("Infinity Titan");

                // Neither the class nor its alternate is owned — fail as usual
                if (!hasStoneCrusher && !hasInfiniteTitan) {
                    Core.logger(`  ✗ ${cls}: NOT OWNED`, "Error");
                    this._messageLines.push(
                        `  ✗ ${cls}: NOT OWNED — You must own this class to use and it must be rank 10`,
                    );
                    failures.push(`Missing class: ${cls}`);
                    continue;
                }

                // SC itself isn't owned, but the Infinity Titan alternate is — check/log against that instead
                if (!hasStoneCrusher && hasInfiniteTitan) {
                    cls = "Infinity Titan";
                }
            } else if (!Core.checkInventory(cls)) {
                Core.logger(`  ✗ ${cls}: NOT OWNED`, "Error");
                this._messageLines.push(
                    `  ✗ ${cls}: NOT OWNED — You must own this class to use and it must be rank 10`,
                );
                failures.push(`Missing class: ${cls}`);
                continue;
            }

            const rank = Core.checkClassRank({ className: cls });
            if (rank < 10) {
                Core.logger(`  ✗ ${cls}: rank ${rank} (need 10)`, "Error");
                this._messageLines.push(`  ✗ ${cls}: rank ${rank} — You need this class to be rank 10`);
                failures.push(`${cls} is rank ${rank}, need rank 10`);
            } else {
                Core.logger(`  ✓ ${cls}: rank 10`, "Info");
                this._messageLines.push(`  ✓ ${cls}: rank 10`);
            }
        }
        // Warrior — must be owned, any rank is fine
        if (!Core.checkInventory("Warrior")) {
            Core.logger("  ✗ Warrior: NOT OWNED", "Error");
            this._messageLines.push("  ✗ Warrior: NOT OWNED — You must own the Warrior class (any rank)");
            failures.push("Missing class: Warrior");
        } else {
            const rank = Core.checkClassRank({ className: "Warrior" });
            Core.logger(`  ✓ Warrior: rank ${rank} (owned)`, "Info");
            this._messageLines.push(`  ✓ Warrior: rank ${rank} (owned)`);
        }

        this._classFails = failures.length;
        return failures;
    }

    //#endregion
    //#region Level & Gold
    checkLevelAndGold(): string[] {
        this._levelGoldFails = 0;
        const failures = [];

        Core.logger("[PrerequisitesChecker] --- Level & Gold ---", "Info");
        this._messageLines.push("--- Level & Gold ---");

        // Level >= 100
        const level = bot.player.level;
        if (level >= 100) {
            Core.logger(`  ✓ Level: ${level}`, "Info");
            this._messageLines.push(`  ✓ Level: ${level}`);
        } else {
            Core.logger(`  ✗ Level: ${level} (need ≥ 100)`, "Error");
            this._messageLines.push(`  ✗ Level: ${level} — Must be at least level 100`);
            failures.push(`Level is ${level}, need ≥ 100`);
        }

        // Gold >= 10 million
        const gold = bot.player.gold;
        if (gold >= 10000000) {
            Core.logger(
                `  ✓ Gold: ${gold.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
                "Info",
            );
            this._messageLines.push(
                `  ✓ Gold: ${gold.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
            );
        } else {
            Core.logger(
                `  ✗ Gold: ${gold.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} (need ≥ 10,000,000)`,
                "Error",
            );
            this._messageLines.push(
                `  ✗ Gold: ${gold.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} — You need at least 30m gold`,
            );
            failures.push(
                `Gold is ${gold.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}, need ≥ 10,000,000`,
            );
        }

        this._levelGoldFails = failures.length;
        return failures;
    }

    //#endregion
    //#region Forge Enhancements
    checkForgeEnhancements(): string[] {
        this._forgeFails = 0;
        const failures = [];

        Core.logger("[PrerequisitesChecker] --- Forge Enhancements ---", "Info");
        this._messageLines.push("--- Forge Enhancements ---");

        // Weapon: Lacerate and Praxis unlocked
        const hasLacerate = this.adv.uLacerate();
        const hasPraxis = this.adv.uPraxis();
        if (hasLacerate && hasPraxis) {
            Core.logger("  ✓ Forge Weapon: Lacerate, Praxis", "Info");
            this._messageLines.push("  ✓ Forge Weapon: Lacerate, Praxis");
        } else {
            const missing = [];
            if (!hasLacerate) {
                missing.push("Lacerate");
            }
            if (!hasPraxis) {
                missing.push("Praxis");
            }
            Core.logger(`  ✗ Forge Weapon: missing ${missing.join(", ")}`, "Error");
            this._messageLines.push(
                `  ✗ Forge Weapon: missing ${missing.join(", ")} — Complete the forge enhancement quests for Lacerate and Praxis`,
            );
            failures.push(`Forge Weapon: missing ${missing.join(", ")}`);
        }

        // Helm: all helm forges unlocked
        if (this.adv.uForgeHelm()) {
            Core.logger("  ✓ Forge Helm: all unlocked", "Info");
            this._messageLines.push("  ✓ Forge Helm: all unlocked");
        } else {
            Core.logger("  ✗ Forge Helm: not all helm forges unlocked", "Error");
            this._messageLines.push("  ✗ Forge Helm: not unlocked — Complete all of the Forge Helm quest");
            failures.push("Forge Helm: not all helm forges unlocked");
        }

        // Cape: all cape forges unlocked
        if (this.adv.uForgeCape()) {
            Core.logger("  ✓ Forge Cape: all unlocked", "Info");
            this._messageLines.push("  ✓ Forge Cape: all unlocked");
        } else {
            Core.logger("  ✗ Forge Cape: not all cape forges unlocked", "Error");
            this._messageLines.push("  ✗ Forge Cape: not unlocked — Complete all of the Forge Cape quest");
            failures.push("Forge Cape: not all cape forges unlocked");
        }

        this._forgeFails = failures.length;
        return failures;
    }

    //#endregion
    //#region Damage Boosts
    checkDamageBoosts(): string[] {
        this._boostFails = 0;
        const failures = [];

        Core.logger("[PrerequisitesChecker] --- Damage Boosts ---", "Info");
        this._messageLines.push("--- Damage Boosts ---");

        // --- Weapon boost (dmgAll >= 1.4) ---
        const weapon = this.findEquippedWeapon();
        if (weapon == null) {
            Core.logger("  ✗ Weapon: none equipped", "Error");
            this._messageLines.push("  ✗ Weapon: none equipped");
            failures.push("Weapon boost: no weapon equipped");
        } else {
            const dmgAll = Core.getBoostFloat(weapon, "dmgAll");
            if (dmgAll >= 1.4) {
                Core.logger(`  ✓ Weapon: ${weapon.name} (${`${(dmgAll * 100).toFixed(0)} %`} all)`, "Info");
                this._messageLines.push(`  ✓ Weapon: ${weapon.name} (${`${(dmgAll * 100).toFixed(0)} %`} all)`);
            } else {
                Core.logger(
                    `  ✗ Weapon: ${weapon.name} has ${`${(dmgAll * 100).toFixed(0)} %`} all (need ≥ 1.40)`,
                    "Error",
                );
                this._messageLines.push(
                    `  ✗ Weapon: ${weapon.name} has ${`${(dmgAll * 100).toFixed(0)} %`} all — Needs at least a 40% all damage boost`,
                );
                failures.push(
                    `Weapon boost: ${weapon.name} has ${`${(dmgAll * 100).toFixed(0)} %`} dmgAll, need ≥ 1.40`,
                );
            }
        }

        // --- Armor / Pet race boosts (all 5 races >= 1.3) ---
        const armor = bot.inventory.items.find((i) => i.equipped && i.category === "Armor") ?? null;
        const pet = this.findEquippedPet();

        let armorPass = false;
        if (armor != null) {
            const missing = PrerequisitesChecker.raceKeys.filter((r) => Core.getBoostFloat(armor, r) < 1.3);
            armorPass = missing.length === 0;
            if (armorPass) {
                const vals = PrerequisitesChecker.raceKeys.map(
                    (r) => `${r}=${`${(Core.getBoostFloat(armor, r) * 100).toFixed(0)} %`}`,
                );
                Core.logger(`  ✓ Armor: ${armor.name} (${vals.join(", ")})`, "Info");
                this._messageLines.push(`  ✓ Armor: ${armor.name} (${vals.join(", ")})`);
            } else {
                Core.logger(`  ✗ Armor: ${armor.name} missing ${missing.join(", ")} ≥ 1.30`, "Error");
                this._messageLines.push(
                    `  ✗ Armor: ${armor.name} — Needs at least 30% boost for each race (${missing.join(", ")} below 30%)`,
                );
            }
        } else {
            Core.logger("  ✗ Armor: none equipped", "Error");
            this._messageLines.push("  ✗ Armor: none equipped");
        }

        let petPass = false;
        if (pet != null) {
            const missing = PrerequisitesChecker.raceKeys.filter((r) => Core.getBoostFloat(pet, r) < 1.3);
            petPass = missing.length === 0;
            if (petPass) {
                const vals = PrerequisitesChecker.raceKeys.map(
                    (r) => `${r}=${`${(Core.getBoostFloat(pet, r) * 100).toFixed(0)} %`}`,
                );
                Core.logger(`  ✓ Pet: ${pet.name} (${vals.join(", ")})`, "Info");
                this._messageLines.push(`  ✓ Pet: ${pet.name} (${vals.join(", ")})`);
            } else {
                Core.logger(`  ✗ Pet: ${pet.name} missing ${missing.join(", ")} ≥ 1.30`, "Error");
                this._messageLines.push(
                    `  ✗ Pet: ${pet.name} — Needs at least 30% boost for each race (${missing.join(", ")} below 30%)`,
                );
            }
        }

        if (armorPass || petPass) {
            // Pass — one of them covers all 5 races
        } else {
            let details = "";
            if (armor != null) {
                const missing = PrerequisitesChecker.raceKeys.filter((r) => Core.getBoostFloat(armor, r) < 1.3);
                details = `armor missing: ${missing.join(", ")}`;
            }
            if (pet != null) {
                const missing = PrerequisitesChecker.raceKeys.filter((r) => Core.getBoostFloat(pet, r) < 1.3);
                if (details.length > 0) {
                    details += "; ";
                }
                details += `pet missing: ${missing.join(", ")}`;
            }
            if (!details) {
                details = "no armor or pet with race boosts found";
            }
            Core.logger(`  ✗ Race Boosts: ${details}`, "Error");
            this._messageLines.push(`  ✗ Race Boosts: ${details} — Needs at least 30% boost for each race`);
            failures.push(`Race boosts: ${details}`);
        }

        this._boostFails = failures.length;
        return failures;
    }

    private findEquippedWeapon(): InventoryItem | null {
        const weaponCats = [
            "Sword",
            "Axe",
            "Dagger",
            "Gun",
            "HandGun",
            "Rifle",
            "Bow",
            "Mace",
            "Gauntlet",
            "Polearm",
            "Staff",
            "Wand",
            "Whip",
        ];

        return bot.inventory.items.find((i) => i.equipped && weaponCats.includes(i.category)) ?? null;
    }

    private findEquippedPet(): InventoryItem | null {
        // Try inventory first
        let pet = bot.inventory.items.find((i) => i.equipped && (i.category ?? "").toLowerCase() === "pet") ?? null;

        if (pet != null) {
            return pet;
        }

        // Try Flash game object
        try {
            const petId = bot.flash.callGameFunction<number>("world.myAvatar.intPetID");
            if (petId > 0) {
                pet = bot.inventory.items.find((i) => i.id === petId) ?? null;
            }
        } catch (error) {
            rethrowIfStopped(error);
        }

        return pet;
    }

    //#endregion
    //#region Reputation
    checkReputation(): string[] {
        this._repFails = 0;
        const failures = [];

        Core.logger("[PrerequisitesChecker] --- Reputation ---", "Info");
        this._messageLines.push("--- Reputation ---");

        const alchRank = bot.reputation.getRank("Alchemy");
        if (alchRank >= 8) {
            Core.logger(`  ✓ Alchemy: rank ${alchRank}`, "Info");
            this._messageLines.push(`  ✓ Alchemy: rank ${alchRank}`);
        } else {
            Core.logger(`  ✗ Alchemy: rank ${alchRank} (need 8)`, "Error");
            this._messageLines.push(`  ✗ Alchemy: rank ${alchRank} — Must be rank 8 Alchemy`);
            failures.push(`Reputation: Alchemy rank ${alchRank}, need 8`);
        }

        const goodRank = bot.reputation.getRank("Good");
        if (goodRank >= 10) {
            Core.logger(`  ✓ Good: rank ${goodRank}`, "Info");
            this._messageLines.push(`  ✓ Good: rank ${goodRank}`);
        } else {
            Core.logger(`  ✗ Good: rank ${goodRank} (need 10)`, "Error");
            this._messageLines.push(`  ✗ Good: rank ${goodRank} — Must be rank 10 Good`);
            failures.push(`Reputation: Good rank ${goodRank}, need 10`);
        }

        this._repFails = failures.length;
        return failures;
    }

    //#endregion
    //#region Sync Gate
    /**
     * Two-phase prereq gate:
     * Phase 1 — run check, write pass/fail to result file
     * Phase 2 — NewWaitForArmy to ensure ALL accounts registered
     * Phase 3 — read result file; any "0" → stop ALL
     */
    prerequisiteSyncGate(armySize: number): boolean {
        // --- Phase 1: run prereq check, write result ---
        const resultPath = Ultra.resolveSyncPath(PrerequisitesChecker.prereqResultFile);
        Ultra.clearSyncFile(resultPath);

        const passed = this.check();
        const myKey = `${bot.player.username}|${bot.player.currentClass}`.replaceAll(":", "-");
        Ultra.updateEntry(resultPath, myKey, passed ? "1" : "0");

        if (!passed) {
            Core.logger(`[PrereqSync] ${Core.username()} failed prerequisites — waiting for all accounts.`, "Error");
        } else {
            Core.logger(`[PrereqSync] ${Core.username()} passed — waiting for all accounts.`, "Info");
        }

        // --- Phase 2: wait for all accounts to arrive ---
        UltraWaitForArmy.instance.newWaitForArmy(
            armySize - 1,
            PrerequisitesChecker.prereqGateFile,
            undefined,
            undefined,
            false,
        );

        // --- Phase 3: check results ---
        const lines = Ultra.readLines(resultPath);
        const failedAccounts = [];
        for (const line of lines) {
            const parts = line.split(":");
            if (parts.length >= 2 && parts[1] === "0") {
                const keyPart = parts[0];
                if (!keyPart?.trim() || !keyPart.includes("|")) {
                    continue; // skip malformed / stale lines
                }
                const accountName = keyPart.split("|")[0];
                if (accountName?.trim()) {
                    failedAccounts.push(accountName);
                }
            }
        }

        if (failedAccounts.length > 0) {
            const who = failedAccounts.join(", ");
            Core.logger(
                `[PrereqSync] ${failedAccounts.length} account(s) failed prerequisites: ${who}. Stopping ALL.`,
                "Error",
                { stopBot: true },
            );
            return false;
        }

        Core.logger("[PrereqSync] All accounts passed prerequisites! Proceeding to ultras.", "Info");
        return true;
    }

    //#endregion
}

export default function main(): void {
    const script = new PrerequisitesChecker();
    Core.setOptions(true);
    Engine.boot();

    Core.logger("[PrerequisitesChecker] === Checking prerequisites for Ultras-v3 ===", "Info");
    Core.logger("", "Info");

    script.checkClasses();
    script.checkLevelAndGold();
    script.checkForgeEnhancements();
    script.checkDamageBoosts();
    script.checkReputation();

    const total =
        script._classFails + script._levelGoldFails + script._forgeFails + script._boostFails + script._repFails;
    if (total === 0) {
        Core.logger("[PrerequisitesChecker] ✅ All prerequisites met! You're ready for Ultras-v3.", "Info");
    } else {
        Core.logger(
            `[PrerequisitesChecker] ❌ ${total} prerequisite(s) failed. Fix the issues above before running ultras.`,
            "Error",
        );
    }

    // Build and show message box only on failure
    if (total > 0) {
        const sb: string[] = [];
        sb.push(`Player: ${Core.username()}`);
        sb.push("");
        for (const line of script._messageLines) {
            sb.push(line);
        }
        sb.push("");
        sb.push(`❌ ${total} prerequisite(s) failed.`);
        bot.showMessageBox(sb.map((l) => `${l}\n`).join(""), "Ultras-v3 Prerequisites");
    }

    Engine.disableSkills();
    Core.setOptions(false);
    bot.stop();
}

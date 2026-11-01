/*
name: UltraNulgathv3
description: Ultra Nulgath v3 — 3 taunters + 1 DPSAttackBlade with pulse-driven taunt and army sync.
tags: null
*/
// Port of Scripts/Ultrasv3/IndividualUltras/6UltraNulgathv3.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, type EventMap } from "turu";
import { Core } from "../../core/CoreBots";
import { CancellationTokenSource } from "../../core/CoreTasks";
import { CoreEnginev3 } from "../dependenciesultras/CoreEnginev3";
import { CoreUltrav3 } from "../dependenciesultras/CoreUltrav3";
import { GetScrolls } from "../dependenciesultras/GetScrolls";
import { UltraAsync } from "../dependenciesultras/UltraAsync";
import { UltraCustomClassSync } from "../dependenciesultras/UltraCustomClassSync";
import { UltraEnhancements } from "../dependenciesultras/UltraEnhancements";
import { UltraGeneral } from "../dependenciesultras/UltraGeneral";
import { UltraPotions } from "../dependenciesultras/UltraPotions";
import { UltraWaitForArmy } from "../dependenciesultras/UltraWaitForArmy";

const Engine = CoreEnginev3.instance;
const Ultra = new CoreUltrav3();
const Enh = new UltraEnhancements();
const Pots = new UltraPotions();
const Scrolls = new GetScrolls();

export class UltraNulgathv3 {
    private static readonly taunter1 = "Lord of Order";
    private static readonly taunter2 = "StoneCrusher";
    private static readonly taunter3AttackBlade = "Verus DoomKnight";
    private static readonly dpsAttackBlade = "King's Echo";

    private static readonly ultraClassesByRole: string[][] = [
        [UltraNulgathv3.taunter1],
        [UltraNulgathv3.taunter2],
        [UltraNulgathv3.taunter3AttackBlade],
        [UltraNulgathv3.dpsAttackBlade],
    ];

    private _tauntCts: CancellationTokenSource = new CancellationTokenSource();
    private fightStartTime: number = 0;
    private _role = "";

    runBoss(): void {
        Core.setOptions(true);

        Engine.boot();
        this._tauntCts = new CancellationTokenSource();
        bot.events.off("scriptStopping", this.stopTauntEvent);
        bot.events.on("scriptStopping", this.stopTauntEvent);

        try {
            this.prep();
            this.fight();
        } finally {
            bot.events.off("scriptStopping", this.stopTauntEvent);
            this._tauntCts.cancel();

            Engine.disableSkills();
            Core.setOptions(false);
        }
    }

    private stopTauntEvent = (e: EventMap["scriptStopping"]): boolean => {
        this._tauntCts.cancel();
        return true;
    };

    private isTaunter(): boolean {
        return this._role !== "DPSAttackBlade";
    }

    private equipPresetClasses(): void {
        const armySize = 4;
        const allowDuplicates = true;

        Core.logger(`[UltraNulgath-v3] Equipping role-based ultra classes for army size ${armySize}.`);
        const classSlots = new Array(armySize).fill(null);

        for (let i = 0; i < armySize; i++) {
            classSlots[i] =
                i < UltraNulgathv3.ultraClassesByRole.length
                    ? UltraNulgathv3.ultraClassesByRole[i]
                    : UltraNulgathv3.ultraClassesByRole[0];
        }

        UltraCustomClassSync.customClassSync(
            Ultra,
            bot,
            classSlots,
            armySize,
            "ultra_nulgath_class-v3.sync",
            allowDuplicates,
        );
    }

    private prep(): void {
        UltraGeneral.equipWarriorClass();
        bot.sleep(2000);
        this.equipPresetClasses();
        bot.sleep(2000);

        // Determine role based on equipped class
        const className = bot.player.currentClass;
        if (className === UltraNulgathv3.taunter1) {
            this._role = "Taunter1";
        } else if (className === UltraNulgathv3.taunter2) {
            this._role = "Taunter2";
        } else if (className === UltraNulgathv3.taunter3AttackBlade) {
            this._role = "Taunter3AttackBlade";
        } else {
            this._role = "DPSAttackBlade";
        }

        Enh.applyNulgath();

        Core.logger(`[UltraNulgath-v3] Role: ${this._role} (${className})`);
    }

    private fight(): void {
        const map = "ultranulgath";
        const boss = "Nulgath the Archfiend";
        const bossDefeatedTemp = "Nulgath the Archfiend Defeated?";

        const waitSyncFile = "ultra_nulgath.sync";
        const fightTimeSyncFile = "UltraNulgathFightTime.sync";
        const completionSyncFile = "UltraNulgathCompletion.sync";
        const armySize = 4;

        const questId = 8692;

        if (!UltraGeneral.isQuestGreen(bot, questId)) {
            UltraGeneral.ensureAcceptOnce(bot, questId);
        }

        Ultra.clearSyncFile(Ultra.resolveSyncPath(fightTimeSyncFile));
        Ultra.clearSyncFile(Ultra.resolveSyncPath(completionSyncFile));

        const skipThird = this.isTaunter();
        Pots.ensureRecommendedPotions(undefined, skipThird);
        Scrolls.getScrollOfEnrage();

        Core.join("Whitemap");
        UltraWaitForArmy.instance.newWaitForArmy(armySize - 1, waitSyncFile, undefined, undefined, false);

        Pots.useRecommendedPotions(undefined, skipThird, undefined, false);

        if (skipThird) {
            Core.logger("[UltraNulgath-v3] Taunter detected, equipping Scroll of Enrage.");
            Engine.equipEnrage();
        }

        Engine.join(map);
        UltraWaitForArmy.instance.newWaitForArmy(armySize - 1, waitSyncFile, undefined, undefined, true);

        Engine.chooseBestCell(boss);
        bot.player.setSpawnPoint();
        bot.sleep(2000);

        // Pre-seed completion sync file so all 4 entries exist before the loop starts.
        const _username = bot.player.username;
        const _className = bot.player.currentClass;
        if (!!_username?.trim() && !!_className?.trim()) {
            const _myKey = `${_username}|${_className}`.replaceAll(":", "-");
            Ultra.updateEntry(Ultra.resolveSyncPath(completionSyncFile), _myKey, "0");
        }

        const fightTimeSyncPath = Ultra.resolveSyncPath(fightTimeSyncFile);

        const shouldSkipTaunt = () => Engine.hasAura("Contract of Despair", true);

        // Set or retrieve fight start time, then launch the appropriate taunter loop
        if (this._role === "Taunter1") {
            Core.logger("[UltraNulgath-v3] Taunter1 (Primary) — setting fight start time.");
            this.fightStartTime = UltraAsync.setFightTime(Core, fightTimeSyncPath);
            UltraAsync.startTauntLoop(
                bot,
                Core,
                Engine,
                this.fightStartTime,
                0,
                3,
                shouldSkipTaunt,
                undefined,
                this._tauntCts.token,
            );
        } else if (this._role === "Taunter2") {
            Core.logger("[UltraNulgath-v3] Taunter2 — reading fight start time.");
            this.fightStartTime = UltraAsync.getFightTime(Ultra, Core, fightTimeSyncPath);
            UltraAsync.startTauntLoop(
                bot,
                Core,
                Engine,
                this.fightStartTime,
                1,
                3,
                shouldSkipTaunt,
                undefined,
                this._tauntCts.token,
            );
        } else if (this._role === "Taunter3AttackBlade") {
            Core.logger("[UltraNulgath-v3] Taunter3AttackBlade — reading fight start time.");
            this.fightStartTime = UltraAsync.getFightTime(Ultra, Core, fightTimeSyncPath);
            UltraAsync.startTauntLoop(
                bot,
                Core,
                Engine,
                this.fightStartTime,
                2,
                3,
                shouldSkipTaunt,
                undefined,
                this._tauntCts.token,
            );
        }

        while (!bot.shouldExit) {
            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);
                continue;
            }

            if (Ultra.checkArmyProgressBool(() => bot.tempInv.contains(bossDefeatedTemp, 1), completionSyncFile)) {
                Core.logger("Nulgath the Archfiend defeated. Finishing quest.");
                bot.events.off("scriptStopping", this.stopTauntEvent);
                this._tauntCts.cancel();
                Engine.disableSkills();
                Engine.join(map);
                Ultra.persistentJoinHouse();
                UltraGeneral.completeQuest(bot, questId);
                bot.sleep(3000);
                break;
            }

            // ── Dynamic targeting ──
            // Taunter1/Taunter2: always attack Nulgath; DPSAttackBlade: attack Blade
            // Taunter3: attack Blade normally, switch to Nulgath during taunt pulse;
            //           if Blade is dead, fall back to Nulgath
            if (this._role === "Taunter3AttackBlade" && !shouldSkipTaunt()) {
                const elapsed = (Date.now() - this.fightStartTime) / 1000;
                const timeInCycle = elapsed % 15;
                // Taunter3 fires at t=10,25,40... (index 2, 5s interval, 15s cycle)
                // Pre-switch to Nulgath at 9s (1s early), stay until 13s (taunt ~3s)
                const targetNulgath = timeInCycle >= 9 && timeInCycle <= 13;

                if (targetNulgath) {
                    if (bot.player.target?.mapId !== 2) {
                        bot.combat.attack(2);
                    }
                } else {
                    // Attack Blade (MapID 1) if alive, else fall back to Nulgath (MapID 2)
                    if (bot.monsters.currentAvailableMonsters.some((x) => x != null && x.mapId === 1 && x.hp > 0)) {
                        if (bot.player.target?.mapId !== 1) {
                            bot.combat.attack(1);
                        }
                    } else if (bot.player.target?.mapId !== 2) {
                        bot.combat.attack(2);
                    }
                }
            } else if (this._role === "DPSAttackBlade") {
                // DPSAttackBlade — attack Blade (MapID 1) if alive, else Nulgath (MapID 2)
                if (bot.monsters.currentAvailableMonsters.some((x) => x != null && x.mapId === 1 && x.hp > 0)) {
                    if (bot.player.target?.mapId !== 1) {
                        bot.combat.attack(1);
                    }
                } else if (bot.player.target?.mapId !== 2) {
                    bot.combat.attack(2);
                }
            } else {
                // Taunter1, Taunter2 — always on Nulgath
                if (bot.player.target?.name !== boss) {
                    bot.combat.attack(boss);
                }
            }

            Pots.activateEquippedPotion();

            bot.sleep(500);
        }
    }
}

export default function main(): void {
    const script = new UltraNulgathv3();
    script.runBoss();
    bot.stop();
}

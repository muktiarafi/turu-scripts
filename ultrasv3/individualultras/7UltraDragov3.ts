/*
name: UltraDragov3
description: Ultra King Drago v3 — Taunter1AttackRightSummon1 + Taunter2AttackRightSummon2 + DPSAttackRightSummon1 + DPSAttackRightSummon2.
tags: null
*/
// Port of Scripts/Ultrasv3/IndividualUltras/7UltraDragov3.cs.
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

export class UltraDragov3 {
    private static readonly taunter1AttackRightSummon1 = "Lord of Order";
    private static readonly taunter2AttackRightSummon2 = "Verus DoomKnight";
    private static readonly dpsAttackRightSummon1 = "StoneCrusher";
    private static readonly dpsAttackRightSummon2 = "King's Echo";

    private static readonly ultraClassesByRole: string[][] = [
        [UltraDragov3.taunter1AttackRightSummon1],
        [UltraDragov3.taunter2AttackRightSummon2],
        [UltraDragov3.dpsAttackRightSummon1],
        [UltraDragov3.dpsAttackRightSummon2],
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
        const className = bot.player.currentClass;
        return (
            className === UltraDragov3.taunter1AttackRightSummon1 ||
            className === UltraDragov3.taunter2AttackRightSummon2
        );
    }

    private equipPresetClasses(): void {
        const armySize = 4;
        const allowDuplicates = armySize > UltraDragov3.ultraClassesByRole.length;

        Core.logger(`[UltraDrago-v3] Equipping role-based ultra classes for army size ${armySize}.`);
        const classSlots = new Array(armySize).fill(null);

        for (let i = 0; i < armySize; i++) {
            classSlots[i] =
                i < UltraDragov3.ultraClassesByRole.length
                    ? UltraDragov3.ultraClassesByRole[i]
                    : UltraDragov3.ultraClassesByRole[0];
        }

        UltraCustomClassSync.customClassSync(
            Ultra,
            bot,
            classSlots,
            armySize,
            "ultra_drago_class-v3.sync",
            allowDuplicates,
        );
    }

    private prep(): void {
        UltraGeneral.equipWarriorClass();
        bot.sleep(2000);
        this.equipPresetClasses();
        bot.sleep(2000);

        const className = bot.player.currentClass;
        if (className === UltraDragov3.taunter1AttackRightSummon1) {
            this._role = "Taunter1AttackRightSummon1";
        } else if (className === UltraDragov3.taunter2AttackRightSummon2) {
            this._role = "Taunter2AttackRightSummon2";
        } else if (className === UltraDragov3.dpsAttackRightSummon1) {
            this._role = "DPSAttackRightSummon1";
        } else {
            this._role = "DPSAttackRightSummon2";
        }

        Enh.apply();

        Core.logger(`[UltraDrago-v3] Role: ${this._role} (${className})`);
    }

    private fight(): void {
        const map = "ultradrago";
        const boss = "King Drago";
        const bossDefeatedTemp = "Drago Dethroned";
        const leftSummon = "Executioner Dene";
        const rightSummon = "Bowmaster Algie";

        const waitSyncFile = "ultra_drago.sync";
        const fightTimeSyncFile = "UltraDragoFightTime.sync";
        const completionSyncFile = "UltraDragoCompletion.sync";
        const armySize = 4;

        const questId = 8397;

        if (!bot.quests.isUnlocked(questId)) {
            bot.quests.updateQuest(8395);
        }

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
            Core.logger("[UltraDrago-v3] Taunter detected, equipping Scroll of Enrage.");
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

        // Set or retrieve fight start time, then launch the appropriate taunter loop
        if (this._role === "Taunter1AttackRightSummon1") {
            Core.logger("[UltraDrago-v3] Taunter1AttackRightSummon1 (Primary) — setting fight start time.");
            this.fightStartTime = UltraAsync.setFightTime(Core, fightTimeSyncPath);
            UltraAsync.startTauntLoop(
                bot,
                Core,
                Engine,
                this.fightStartTime,
                0,
                undefined,
                undefined,
                undefined,
                this._tauntCts.token,
            );
        } else if (this._role === "Taunter2AttackRightSummon2") {
            Core.logger("[UltraDrago-v3] Taunter2AttackRightSummon2 — reading fight start time.");
            this.fightStartTime = UltraAsync.getFightTime(Ultra, Core, fightTimeSyncPath);
            UltraAsync.startTauntLoop(
                bot,
                Core,
                Engine,
                this.fightStartTime,
                1,
                undefined,
                undefined,
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
                Core.logger("King Drago defeated. Finishing quest.");
                bot.events.off("scriptStopping", this.stopTauntEvent);
                this._tauntCts.cancel();
                Engine.disableSkills();
                Engine.join(map);
                Ultra.persistentJoinHouse();
                UltraGeneral.completeQuest(bot, questId);
                bot.sleep(3000);
                break;
            }

            if (this.isTaunter()) {
                // Taunters — attack rightSummon normally;
                // 1s before taunt pulse, switch to leftSummon to taunt it (like Taunter3AttackBlade)
                const elapsed = (Date.now() - this.fightStartTime) / 1000;
                const timeInCycle = elapsed % 10;

                let targetLeftSummon: boolean;
                if (this._role === "Taunter1AttackRightSummon1") {
                    targetLeftSummon = timeInCycle >= 9 || timeInCycle <= 3;
                } else {
                    targetLeftSummon = timeInCycle >= 4 && timeInCycle <= 8;
                }

                if (targetLeftSummon) {
                    // Target leftSummon for taunt
                    if (Ultra.monsterAlive(leftSummon)) {
                        if (bot.player.target?.name !== leftSummon) {
                            bot.combat.attack(leftSummon);
                        }
                    } else if (Ultra.monsterAlive(rightSummon)) {
                        if (bot.player.target?.name !== rightSummon) {
                            bot.combat.attack(rightSummon);
                        }
                    } else {
                        if (bot.player.target?.name !== boss) {
                            bot.combat.attack(boss);
                        }
                    }
                } else {
                    // Attack rightSummon primarily
                    if (Ultra.monsterAlive(rightSummon)) {
                        if (bot.player.target?.name !== rightSummon) {
                            bot.combat.attack(rightSummon);
                        }
                    } else if (Ultra.monsterAlive(leftSummon)) {
                        if (bot.player.target?.name !== leftSummon) {
                            bot.combat.attack(leftSummon);
                        }
                    } else {
                        if (bot.player.target?.name !== boss) {
                            bot.combat.attack(boss);
                        }
                    }
                }
            } else {
                if (Ultra.monsterAlive(rightSummon)) {
                    if (bot.player.target?.name !== rightSummon) {
                        bot.combat.attack(rightSummon);
                    }
                } else if (Ultra.monsterAlive(leftSummon)) {
                    if (bot.player.target?.name !== leftSummon) {
                        bot.combat.attack(leftSummon);
                    }
                } else {
                    if (bot.player.target?.name !== boss) {
                        bot.combat.attack(boss);
                    }
                }
            }
            Pots.activateEquippedPotion();

            bot.sleep(500);
        }
    }
}

export default function main(): void {
    const script = new UltraDragov3();
    script.runBoss();
    bot.stop();
}

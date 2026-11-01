/*
name: UltraWardenv3
description: Ultra Warden v3 — timer-based 2-taunter rotation with army synchronization.
tags: null
*/
// Port of Scripts/Ultrasv3/IndividualUltras/2UltraWardenv3.cs.
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

export class UltraWardenv3 {
    private static readonly taunter1 = "Verus DoomKnight";
    private static readonly taunter2 = "Lord of Order";
    private static readonly dps1 = "King's Echo";
    private static readonly dps2 = "StoneCrusher";

    private static readonly ultraClassesByRole: string[][] = [
        [UltraWardenv3.taunter1],
        [UltraWardenv3.taunter2],
        [UltraWardenv3.dps1],
        [UltraWardenv3.dps2],
    ];

    private _tauntCts: CancellationTokenSource = new CancellationTokenSource();
    private fightStartTime: number = 0;
    lastTauntTime: number = 0;
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
        return this._role === "Taunter1" || this._role === "Taunter2";
    }

    private equipPresetClasses(): void {
        const armySize = 4;
        const allowDuplicates = armySize > UltraWardenv3.ultraClassesByRole.length;

        Core.logger(`[UltraWarden-v3] Equipping role-based ultra classes for army size ${armySize}.`);
        const classSlots = new Array(armySize).fill(null);

        for (let i = 0; i < armySize; i++) {
            classSlots[i] =
                i < UltraWardenv3.ultraClassesByRole.length
                    ? UltraWardenv3.ultraClassesByRole[i]
                    : UltraWardenv3.ultraClassesByRole[0];
        }

        UltraCustomClassSync.customClassSync(
            Ultra,
            bot,
            classSlots,
            armySize,
            "ultra_warden_class-v3.sync",
            allowDuplicates,
        );
    }

    private prep(): void {
        UltraGeneral.equipWarriorClass();
        bot.sleep(2000);
        this.equipPresetClasses();
        bot.sleep(2000);

        const className = bot.player.currentClass;
        if (className === UltraWardenv3.taunter1) {
            this._role = "Taunter1";
        } else if (className === UltraWardenv3.taunter2) {
            this._role = "Taunter2";
        } else if (className === UltraWardenv3.dps1) {
            this._role = "Dps1";
        } else {
            this._role = "Dps2";
        }

        Enh.apply();

        Core.logger(`[UltraWarden-v3] Role: ${this._role} (${className})`);
    }

    private fight(): void {
        const map = "ultrawarden";
        const boss = "Ultra Warden";
        const bossDefeatedTemp = "Ultra Warden Defeated";

        const waitSyncFile = "ultra_warden.sync";
        const fightTimeSyncFile = "UltraWardenFightTime.sync";
        const completionSyncFile = "UltraWardenCompletion.sync";
        const armySize = 4;

        const questId = 8153;

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
            Core.logger("[UltraWarden-v3] Taunter detected, equipping Scroll of Enrage.");
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
        if (this._role === "Taunter1") {
            Core.logger("[UltraWarden-v3] Taunter1 (Primary) — setting fight start time.");
            this.fightStartTime = UltraAsync.setFightTime(Core, fightTimeSyncPath);
            UltraAsync.startTauntLoop(
                bot,
                Core,
                Engine,
                this.fightStartTime,
                0,
                2,
                undefined,
                undefined,
                this._tauntCts.token,
            );
        } else if (this._role === "Taunter2") {
            Core.logger("[UltraWarden-v3] Taunter2 (Secondary) — reading fight start time.");
            this.fightStartTime = UltraAsync.getFightTime(Ultra, Core, fightTimeSyncPath);
            UltraAsync.startTauntLoop(
                bot,
                Core,
                Engine,
                this.fightStartTime,
                1,
                2,
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
                Core.logger("Ultra Warden defeated. Finishing quest.");
                bot.events.off("scriptStopping", this.stopTauntEvent);
                this._tauntCts.cancel();
                Engine.disableSkills();
                Engine.join(map);
                Ultra.persistentJoinHouse();
                UltraGeneral.completeQuest(bot, questId);
                bot.sleep(3000);
                break;
            }

            // ── All 4 attack Ultra Warden ──
            if (bot.player.target?.name !== boss) {
                bot.combat.attack(boss);
            }

            Pots.activateEquippedPotion();

            bot.sleep(500);
        }
    }
}

export default function main(): void {
    const script = new UltraWardenv3();
    script.runBoss();
    bot.stop();
}

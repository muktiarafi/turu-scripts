/*
name: ChampionDrakathv3
description: Champion Drakath v3 — 3 taunters + 1 DPS with UltraAsync pulse taunt (0/4/8).
tags: null
*/
// Port of Scripts/Ultrasv3/IndividualUltras/5ChampionDrakathv3.cs.
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

export class ChampionDrakathv3 {
    private static readonly taunter1 = "ArchPaladin";
    private static readonly taunter2 = "Lord of Order";
    private static readonly taunter3 = "Shaman";
    private static readonly dps = "StoneCrusher";

    private static readonly ultraClassesByRole: string[][] = [
        [ChampionDrakathv3.taunter1],
        [ChampionDrakathv3.taunter2],
        [ChampionDrakathv3.taunter3],
        [ChampionDrakathv3.dps],
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

    private equipPresetClasses(): void {
        const armySize = 4;
        const allowDuplicates = armySize > ChampionDrakathv3.ultraClassesByRole.length;

        Core.logger(`[ChampionDrakath-v3] Equipping role-based ultra classes for army size ${armySize}.`);
        const classSlots = new Array(armySize).fill(null);

        for (let i = 0; i < armySize; i++) {
            classSlots[i] =
                i < ChampionDrakathv3.ultraClassesByRole.length
                    ? ChampionDrakathv3.ultraClassesByRole[i]
                    : ChampionDrakathv3.ultraClassesByRole[0];
        }

        UltraCustomClassSync.customClassSync(
            Ultra,
            bot,
            classSlots,
            armySize,
            "champion_drakath_class-v3.sync",
            allowDuplicates,
        );
    }

    private isTaunter(): boolean {
        return this._role !== "Dps";
    }

    private prep(): void {
        UltraGeneral.equipWarriorClass();
        bot.sleep(2000);
        this.equipPresetClasses();
        bot.sleep(2000);

        const className = bot.player.currentClass;
        if (className === ChampionDrakathv3.taunter1) {
            this._role = "Taunter1";
        } else if (className === ChampionDrakathv3.taunter2) {
            this._role = "Taunter2";
        } else if (className === ChampionDrakathv3.taunter3) {
            this._role = "Taunter3";
        } else {
            this._role = "Dps";
        }

        Enh.applyDrakath();

        Core.logger(`[ChampionDrakath-v3] Role: ${this._role} (${className})`);
    }

    private fight(): void {
        const map = "championdrakath";
        const boss = "Champion Drakath";
        const bossDefeatedTemp = "Champion Drakath Defeated";

        const waitSyncFile = "champion_drakath.sync";
        const fightTimeSyncFile = "ChampionDrakathFightTime.sync";
        const completionSyncFile = "ChampionDrakathCompletion.sync";
        const armySize = 4;

        const questId = 8300;

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
            Core.logger("[ChampionDrakath-v3] Taunter detected, equipping Scroll of Enrage.");
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
            Core.logger("[ChampionDrakath-v3] Taunter1 (Primary) — setting fight start time.");
            this.fightStartTime = UltraAsync.setFightTime(Core, fightTimeSyncPath);
            UltraAsync.startTauntLoop(bot, Core, Engine, this.fightStartTime, 0, 3, undefined, 4, this._tauntCts.token);
        } else if (this._role === "Taunter2") {
            Core.logger("[ChampionDrakath-v3] Taunter2 (Secondary) — reading fight start time.");
            this.fightStartTime = UltraAsync.getFightTime(Ultra, Core, fightTimeSyncPath);
            UltraAsync.startTauntLoop(bot, Core, Engine, this.fightStartTime, 1, 3, undefined, 4, this._tauntCts.token);
        } else if (this._role === "Taunter3") {
            Core.logger("[ChampionDrakath-v3] Taunter3 — reading fight start time.");
            this.fightStartTime = UltraAsync.getFightTime(Ultra, Core, fightTimeSyncPath);
            UltraAsync.startTauntLoop(bot, Core, Engine, this.fightStartTime, 2, 3, undefined, 4, this._tauntCts.token);
        }

        while (!bot.shouldExit) {
            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);
                continue;
            }

            if (Ultra.checkArmyProgressBool(() => bot.tempInv.contains(bossDefeatedTemp, 1), completionSyncFile)) {
                Core.logger("Champion Drakath defeated. Finishing quest.");
                bot.events.off("scriptStopping", this.stopTauntEvent);
                this._tauntCts.cancel();
                Engine.disableSkills();
                Engine.join(map);
                Ultra.persistentJoinHouse();
                UltraGeneral.completeQuest(bot, questId);
                bot.sleep(3000);
                break;
            }

            // ── All 4 attack Champion Drakath ──
            if (bot.player.target?.name !== boss) {
                bot.combat.attack(boss);
            }

            Pots.activateEquippedPotion();

            bot.sleep(500);
        }
    }
}

export default function main(): void {
    const script = new ChampionDrakathv3();
    script.runBoss();
    bot.stop();
}

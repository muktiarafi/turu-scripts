/*
name: UltraEngineerv3
description: Ultra Engineer v3 — prioritizes drones with KillWithPriority and army sync. Uses synced class equip and no-taunt fight flow.
tags: null
*/
// Port of Scripts/Ultrasv3/IndividualUltras/3UltraEngineerv3.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreEnginev3 } from "../dependenciesultras/CoreEnginev3";
import { CoreUltrav3 } from "../dependenciesultras/CoreUltrav3";
import { UltraCustomClassSync } from "../dependenciesultras/UltraCustomClassSync";
import { UltraEnhancements } from "../dependenciesultras/UltraEnhancements";
import { UltraGeneral } from "../dependenciesultras/UltraGeneral";
import { UltraPotions } from "../dependenciesultras/UltraPotions";
import { UltraWaitForArmy } from "../dependenciesultras/UltraWaitForArmy";

const Engine = CoreEnginev3.instance;
const Ultra = new CoreUltrav3();
const Enh = new UltraEnhancements();
const Pots = new UltraPotions();

export class UltraEngineerv3 {
    private static readonly dps1 = "Verus DoomKnight";
    private static readonly dps2 = "StoneCrusher";
    private static readonly dps3 = "Lord of Order";
    private static readonly dps4 = "King's Echo";

    private static readonly ultraClassesByRole: string[][] = [
        [UltraEngineerv3.dps1],
        [UltraEngineerv3.dps2],
        [UltraEngineerv3.dps3],
        [UltraEngineerv3.dps4],
    ];

    runBoss(): void {
        Core.setOptions(true);

        Engine.boot();

        try {
            this.prep();
            this.fight();
        } finally {
            Engine.disableSkills();
            Core.setOptions(false);
        }
    }

    private equipPresetClasses(): void {
        const armySize = 4;
        const allowDuplicates = armySize > UltraEngineerv3.ultraClassesByRole.length;

        Core.logger(`[UltraEngineer-v3] Equipping role-based ultra classes for army size ${armySize}.`);
        const classSlots = new Array(armySize).fill(null);

        for (let i = 0; i < armySize; i++) {
            classSlots[i] =
                i < UltraEngineerv3.ultraClassesByRole.length
                    ? UltraEngineerv3.ultraClassesByRole[i]
                    : UltraEngineerv3.ultraClassesByRole[0];
        }

        UltraCustomClassSync.customClassSync(
            Ultra,
            bot,
            classSlots,
            armySize,
            "ultra_engineer_class-v3.sync",
            allowDuplicates,
        );
    }

    private prep(): void {
        UltraGeneral.equipWarriorClass();
        bot.sleep(2000);
        this.equipPresetClasses();
        bot.sleep(2000);

        Enh.apply();
    }

    private fight(): void {
        const map = "ultraengineer";
        const boss = "Ultra Engineer";
        const bossDefeatedTemp = "Ultra Engineer Defeated";
        const priority1 = "Defense Drone";
        const priority2 = "Attack Drone";

        const waitSyncFile = "ultra_engineer.sync";
        const completionSyncFile = "UltraEngineerCompletion.sync";
        const armySize = 4;

        const questId = 8154;

        if (!UltraGeneral.isQuestGreen(bot, questId)) {
            UltraGeneral.ensureAcceptOnce(bot, questId);
        }

        Ultra.clearSyncFile(Ultra.resolveSyncPath(completionSyncFile));

        Pots.ensureRecommendedPotions(undefined, false);

        Core.join("Whitemap");
        UltraWaitForArmy.instance.newWaitForArmy(armySize - 1, waitSyncFile, undefined, undefined, false);

        Pots.useRecommendedPotions(undefined, false, undefined, false);

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

        while (!bot.shouldExit) {
            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);
                continue;
            }

            if (Ultra.checkArmyProgressBool(() => bot.tempInv.contains(bossDefeatedTemp, 1), completionSyncFile)) {
                Core.logger("Ultra Engineer defeated. Finishing quest.");
                Engine.disableSkills();
                Engine.join(map);
                Ultra.persistentJoinHouse();
                UltraGeneral.completeQuest(bot, questId);
                bot.sleep(3000);
                break;
            }

            Ultra.killWithPriority(boss, 3, priority1, 2, priority2, 1);
            Pots.activateEquippedPotion();
            bot.sleep(500);
        }
    }
}

export default function main(): void {
    const script = new UltraEngineerv3();
    script.runBoss();
    bot.stop();
}

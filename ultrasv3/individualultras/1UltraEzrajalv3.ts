/*
name: UltraEzrajalv3
description: Ultra Ezrajal v3 — handles Counter Attack windows with army sync. Uses synced class equip and no-taunt fight flow.
tags: null
*/
// Port of Scripts/Ultrasv3/IndividualUltras/1UltraEzrajalv3.cs.
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

export class UltraEzrajalv3 {
    private static readonly dps1 = "Verus DoomKnight";
    private static readonly dps2 = "StoneCrusher";
    private static readonly dps3 = "Lord of Order";
    private static readonly dps4 = "King's Echo";

    private static readonly ultraClassesByRole: string[][] = [
        [UltraEzrajalv3.dps1],
        [UltraEzrajalv3.dps2],
        [UltraEzrajalv3.dps3],
        [UltraEzrajalv3.dps4],
    ];

    runBoss(): void {
        Core.setOptions(true);

        Engine.boot();

        bot.ultraBossHelper.enableCounterAttack();

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
        const allowDuplicates = armySize > UltraEzrajalv3.ultraClassesByRole.length;

        Core.logger(`[UltraEzrajal-v3] Equipping role-based ultra classes for army size ${armySize}.`);
        const classSlots = new Array(armySize).fill(null);

        for (let i = 0; i < armySize; i++) {
            classSlots[i] =
                i < UltraEzrajalv3.ultraClassesByRole.length
                    ? UltraEzrajalv3.ultraClassesByRole[i]
                    : UltraEzrajalv3.ultraClassesByRole[0];
        }

        UltraCustomClassSync.customClassSync(
            Ultra,
            bot,
            classSlots,
            armySize,
            "ultra_ezrajal_class-v3.sync",
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
        const map = "ultraezrajal";
        const boss = "Ultra Ezrajal";
        const bossDefeatedTemp = "Ultra Ezrajal Defeated";

        const waitSyncFile = "ultra_ezrajal.sync";
        const completionSyncFile = "UltraEzrajalCompletion.sync";
        const armySize = 4;

        const questId = 8152;

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
                Core.logger("Ultra Ezrajal defeated. Finishing quest.");
                Engine.disableSkills();
                Engine.join(map);
                bot.ultraBossHelper.disableCounterAttack();
                Ultra.persistentJoinHouse();
                UltraGeneral.completeQuest(bot, questId);
                bot.sleep(3000);
                break;
            }

            // Counter Attack handler — stop attacking when Ezrajal reflects
            if (
                bot.player.hasTarget &&
                bot.target?.auras?.some((a) => a != null && a.name === "Counter Attack") === true
            ) {
                bot.combat.cancelAutoAttack();
                bot.sleep(6300);
            } else {
                bot.combat.attack(boss);
            }

            Pots.activateEquippedPotion();
            bot.sleep(500);
        }
    }
}

export default function main(): void {
    const script = new UltraEzrajalv3();
    script.runBoss();
    bot.stop();
}

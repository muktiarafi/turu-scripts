/*
name: Kolrv3  No Op
description: Farm Kolr, Usurper of Flames for Choronzonite. No config needed. It needs 4 clients, it will go to the map 2/2 2/2.
tags: null
*/
// Port of Scripts/Ultrasv3/DependenciesDailies/KolrNoOptionv3.cs.
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

export class KolrNoOpv3 {
    private static readonly group1Dps1 = "King's Echo";
    private static readonly group1Dps2 = "Lord of Order";
    private static readonly group2Dps1 = "King's Echo";
    private static readonly group2Dps2 = "Lord of Order";

    private static readonly ultraClassesByRole: string[][] = [
        [KolrNoOpv3.group1Dps1],
        [KolrNoOpv3.group1Dps2],
        [KolrNoOpv3.group2Dps1],
        [KolrNoOpv3.group2Dps2],
    ];

    private static _roomOffset = 0;

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
        const allowDuplicates = true;

        Core.logger(`[Kolrv3] Equipping role-based ultra classes for army size ${armySize}.`);
        const classSlots = new Array(armySize).fill(null);

        for (let i = 0; i < armySize; i++) {
            classSlots[i] =
                i < KolrNoOpv3.ultraClassesByRole.length
                    ? KolrNoOpv3.ultraClassesByRole[i]
                    : KolrNoOpv3.ultraClassesByRole[0];
        }

        UltraCustomClassSync.customClassSync(Ultra, bot, classSlots, armySize, "kolrv3_class.sync", allowDuplicates);

        this.assignGroup(armySize);
    }

    private assignGroup(armySize: number): void {
        const username = bot.player.username;
        const groupSync = Ultra.resolveSyncPath("kolrv3_group.sync");

        Ultra.updateEntry(groupSync, username, "1");
        bot.sleep(500);

        while (!bot.shouldExit) {
            const lines = Ultra.readLines(groupSync);
            const valid = [...new Set(lines.map((l) => l.split(":")[0]).filter((n) => !!n?.trim()))];
            if (valid.length >= armySize) {
                break;
            }
            Ultra.updateEntry(groupSync, username, "1");
            bot.sleep(500);
        }

        const accounts = [
            ...[
                ...new Set(
                    Ultra.readLines(groupSync)
                        .map((l) => l.split(":")[0])
                        .filter((n) => !!n?.trim()),
                ),
            ],
        ].sort((a, b) => compare(((n) => n)(a), ((n) => n)(b)));

        const myIndex = accounts.findIndex((a) => a?.toLowerCase() === username?.toLowerCase());
        const half = armySize / 2;
        KolrNoOpv3._roomOffset = (myIndex / half) * 10;

        Core.logger(`[Kolrv3] Assigned to Group${myIndex / half + 1} (room offset: +${KolrNoOpv3._roomOffset})`);
    }

    private prep(): void {
        UltraGeneral.equipWarriorClass();
        bot.sleep(2000);
        this.equipPresetClasses();
        bot.sleep(2000);

        Enh.applyKolr();

        bot.sleep(2500);
    }

    private fight(): void {
        const boss = "Kolr, Usurper of Flames";
        const bossDefeatedTemp = "Choronzonite";

        const waitSyncFile = "kolrv3.sync";
        const completionSyncFile = "Kolrv3Completion.sync";
        const armySize = 4;

        const questId = 10715;

        if (!UltraGeneral.isQuestGreen(bot, questId)) {
            UltraGeneral.ensureAcceptOnce(bot, questId);
        }

        Ultra.clearSyncFile(Ultra.resolveSyncPath(completionSyncFile));

        const potionQuant = 10;
        Pots.ensureRecommendedPotions(potionQuant, false, "Kolr");

        Core.join("Whitemap");
        UltraWaitForArmy.instance.newWaitForArmy(armySize - 1, waitSyncFile, undefined, undefined, false);

        Pots.useRecommendedPotions(potionQuant, false, "Kolr", false);

        Core.join(`flameusurper-${Core.privateRoomNumber + KolrNoOpv3._roomOffset}`);
        UltraWaitForArmy.instance.newWaitForArmy(armySize - 1, waitSyncFile, undefined, undefined, true);

        Engine.chooseBestCellOneMonster(boss);
        bot.player.setSpawnPoint();
        bot.sleep(2000);

        // Pre-seed completion sync file
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
                Core.logger("Boss defeated. Finishing quest.");
                Engine.disableSkills();
                Core.join(`flameusurper-${Core.privateRoomNumber + KolrNoOpv3._roomOffset}`);
                Ultra.persistentJoinHouse();
                UltraGeneral.completeQuest(bot, questId);
                bot.sleep(3000);
                break;
            }

            // Default — attack the boss
            if (bot.player.target?.name !== boss) {
                bot.combat.attack(boss);
            }

            Pots.activateEquippedPotion();
            bot.sleep(500);
        }
    }
}

export default function main(): void {
    const script = new KolrNoOpv3();
    script.runBoss();
    bot.stop();
}

function compare(a: any, b: any): number {
    return a < b ? -1 : a > b ? 1 : 0;
}

/*
name: Kathoolv3 No Op
description: Kill God of the Depths for Sacrosanct Morsel (Frenzy Feast daily). No config needed.
tags: null
*/
// Port of Scripts/Ultrasv3/DependenciesDailies/KathoolNoOptionv3.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.
//
// Turu: C#'s `UseVigilAsync` (fired and forgotten from the packet listener) is a task of
// core/CoreTasks.ts.

import { bot, type EventMap } from "turu";
import { Core, rethrowIfStopped } from "../../core/CoreBots";
import { type TaskStep, tasks } from "../../core/CoreTasks";
import { CoreEnginev3 } from "../dependenciesultras/CoreEnginev3";
import { CoreUltrav3 } from "../dependenciesultras/CoreUltrav3";
import { GetScrolls } from "../dependenciesultras/GetScrolls";
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

export class KathoolNoOpv3 {
    private static readonly dps1 = "Verus DoomKnight";
    private static readonly dps2 = "King's Echo";
    private static readonly dps3 = "Lord of Order";
    private static readonly dps4 = "StoneCrusher";

    private static readonly ultraClassesByRole: string[][] = [
        [KathoolNoOpv3.dps1],
        [KathoolNoOpv3.dps2],
        [KathoolNoOpv3.dps3],
        [KathoolNoOpv3.dps4],
    ];

    runBoss(): void {
        Core.setOptions(true);

        Engine.boot();

        bot.events.on("extensionPacket", this.kathoolFlashListener);
        try {
            this.prep();
            this.fight();
        } finally {
            bot.events.off("extensionPacket", this.kathoolFlashListener);

            Engine.disableSkills();
            Core.setOptions(false);
        }
    }

    private equipPresetClasses(): void {
        const armySize = 4;
        const allowDuplicates = armySize > KathoolNoOpv3.ultraClassesByRole.length;

        Core.logger(`[Kathoolv3] Equipping DPS classes for army size ${armySize}.`);
        const classSlots = new Array(armySize).fill(null);

        for (let i = 0; i < armySize; i++) {
            classSlots[i] =
                i < KathoolNoOpv3.ultraClassesByRole.length
                    ? KathoolNoOpv3.ultraClassesByRole[i]
                    : KathoolNoOpv3.ultraClassesByRole[0];
        }

        UltraCustomClassSync.customClassSync(Ultra, bot, classSlots, armySize, "kathoolv3_class.sync", allowDuplicates);
    }

    private prep(): void {
        UltraGeneral.equipWarriorClass();
        bot.sleep(2000);
        this.equipPresetClasses();
        bot.sleep(2000);

        Enh.apply();

        Scrolls.buyVigil();
        bot.sleep(2500);
    }

    private *useVigilAsync(): Generator<TaskStep, void, boolean> {
        for (let i = 0; i < 60; i++) {
            Engine.cast(5);
            yield 50;
        }
    }

    /**
     * C# listens to `Bot.Flash.FlashCall`'s "packetFromServer" and reads the packet's `b.o`; Turu's
     * `extensionPacket` event gives that object as `params.dataObj` of a JSON packet.
     */
    private kathoolFlashListener = (packet: EventMap["extensionPacket"]): void => {
        try {
            if (packet?.["params"]?.type !== "json") {
                return;
            }

            const data: any | null = packet["params"].dataObj;

            if (data == null || data!["cmd"]?.toString() !== "ct") {
                return;
            }

            if (data!["anims"] != null) {
                for (const anim of data["anims"]) {
                    if (anim?.msg != null) {
                        const msg = anim.msg;
                        if (msg.toLowerCase().includes("You cannot resist.".toLowerCase())) {
                            Core.logger("[Kathool] Detected 'You cannot resist.' — using Vigil.");
                            tasks.start("KathoolVigil", () => this.useVigilAsync());
                        }
                    }
                }
            }
        } catch (error) {
            rethrowIfStopped(error);
        }
    };

    private fight(): void {
        const map = "kathooldepths";
        const boss = "God of the Depths";
        const bossDefeatedTemp = "Sacrosanct Morsel";

        const waitSyncFile = "kathoolv3.sync";
        const completionSyncFile = "Kathoolv3Completion.sync";
        const armySize = 4;

        const questId = 9350;

        if (!UltraGeneral.isQuestGreen(bot, questId)) {
            UltraGeneral.ensureAcceptOnce(bot, questId);
        }

        Ultra.clearSyncFile(Ultra.resolveSyncPath(completionSyncFile));

        const potionQuant = 10;
        Pots.ensureRecommendedPotions(potionQuant, true);

        Scrolls.buyVigil();

        Core.join("Whitemap");
        UltraWaitForArmy.instance.newWaitForArmy(armySize - 1, waitSyncFile, undefined, undefined, false);

        Pots.useRecommendedPotions(potionQuant, true, undefined, false);
        Scrolls.equipVigil();

        Engine.join(map);
        UltraWaitForArmy.instance.newWaitForArmy(armySize - 1, waitSyncFile, undefined, undefined, true);

        Engine.chooseBestCell(boss);
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
                Engine.join(map);
                Ultra.persistentJoinHouse();
                UltraGeneral.completeQuest(bot, questId);
                bot.sleep(3000);
                break;
            }

            // Target priority: Tendril (MapID 3) > Tendril (MapID 1) > God of the Depths (MapID 2)
            const priority = [3, 1, 2];
            let targetMapId = 0;
            for (const mapId of priority) {
                const mon =
                    bot.monsters.mapMonsters.find((m) => m != null && m.mapId === mapId && m.hp > 0 && m.state > 0) ??
                    null;
                if (mon != null) {
                    targetMapId = mapId;
                    break;
                }
            }
            if (targetMapId > 0 && (bot.player.target?.mapId !== targetMapId || !bot.player.hasTarget)) {
                bot.combat.attack(targetMapId);
            }

            Pots.activateEquippedPotion();
            bot.sleep(500);
        }
    }
}

export default function main(): void {
    const script = new KathoolNoOpv3();
    script.runBoss();
    bot.stop();
}

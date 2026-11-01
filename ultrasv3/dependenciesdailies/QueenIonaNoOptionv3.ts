/*
name: QueenIonav3  No Op
description: Queen Iona v3 — no config needed, automatically uses enhancements and potions.
tags: null
*/
// Port of Scripts/Ultrasv3/DependenciesDailies/QueenIonaNoOptionv3.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, type EventMap } from "turu";
import { Core, rethrowIfStopped } from "../../core/CoreBots";
import { type TaskStep, tasks } from "../../core/CoreTasks";
import { CoreEnginev3 } from "../dependenciesultras/CoreEnginev3";
import { CoreUltrav3 } from "../dependenciesultras/CoreUltrav3";
import { UltraEnhancements } from "../dependenciesultras/UltraEnhancements";
import { UltraGeneral } from "../dependenciesultras/UltraGeneral";
import { UltraPotions } from "../dependenciesultras/UltraPotions";
import { UltraWaitForArmy } from "../dependenciesultras/UltraWaitForArmy";

const Engine = CoreEnginev3.instance;
const Ultra = new CoreUltrav3();
const Enh = new UltraEnhancements();
const Pots = new UltraPotions();

export class QueenIonaNoOpv3 {
    runBoss(): void {
        Core.setOptions();

        try {
            this.prep();
            this.fight();
        } finally {
            Core.setOptions(false);
        }
    }

    private prep(): void {
        UltraGeneral.equipWarriorClass();
        bot.sleep(2000);
        Core.equip("King's Echo");
        bot.sleep(2000);

        Enh.apply();

        bot.sleep(2500);
    }

    private fight(): void {
        const map = "queeniona";
        const boss = "Queen Iona";
        const item = "Lightning Diadem";
        const armySize = 4;
        const waitSyncFile = "queeniona.sync";

        const questId = 9852;

        if (!bot.quests.isDailyComplete(questId)) {
            Core.ensureAccept(questId);
        }

        const potionQuant = 10;
        Pots.ensureRecommendedPotions(potionQuant, false);

        UltraWaitForArmy.instance.newWaitForArmy(armySize - 1, waitSyncFile, undefined, undefined, false);

        Pots.useRecommendedPotions(potionQuant, false, undefined, false);

        Core.join("Whitemap");
        UltraWaitForArmy.instance.newWaitForArmy(armySize - 1, waitSyncFile, undefined, undefined, false);

        Core.join(map);
        UltraWaitForArmy.instance.newWaitForArmy(armySize - 1, waitSyncFile, undefined, undefined, true);

        Engine.chooseBestCell(boss);
        bot.player.setSpawnPoint();

        bot.events.on("extensionPacket", this.queenIonaListener);

        while (!bot.shouldExit) {
            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);
                continue;
            }

            if (bot.tempInv.contains(item, 1)) {
                Core.logger("Queen Iona defeated. Finishing quest.");
                bot.events.off("extensionPacket", this.queenIonaListener);
                Core.join(map);
                Ultra.persistentJoinHouse();
                UltraGeneral.completeQuest(bot, questId);
                bot.sleep(3000);
                break;
            }

            if (!bot.player.hasTarget) {
                bot.combat.attack("*");
            }

            Pots.activateEquippedPotion();
            bot.sleep(500);
        }

        bot.events.off("extensionPacket", this.queenIonaListener);
    }

    private queenIonaListener = (packet: EventMap["extensionPacket"]): void => {
        if (packet?.["params"]?.type?.toString() !== "json") {
            return;
        }

        if (!bot.player.alive) {
            return;
        }

        const data = packet["params"].dataObj;
        if (data?.cmd?.toString() !== "event") {
            return;
        }

        const zoneSet: string | undefined = data?.args?.zoneSet?.toString();
        if (!zoneSet) {
            return;
        }

        // C#'s `async void` listener goes on after its first await; here that part is a task (a newer
        // zone event replaces it).
        tasks.start("QueenIonaZone", () => this.moveToSafeZone(zoneSet));
    };

    private *moveToSafeZone(zoneSet: string): Generator<TaskStep, void, boolean> {
        // Wait until a charge aura appears
        let chargeAura: string | null = null;
        while (!bot.shouldExit) {
            if (!bot.player.alive) {
                return;
            }

            chargeAura =
                (
                    bot.self?.auras?.find(
                        (a) =>
                            a != null &&
                            (a?.name === "Positive Charge" ||
                                a?.name === "Negative Charge" ||
                                a?.name === "Positive Charge?" ||
                                a?.name === "Negative Charge?"),
                    ) ?? null
                )?.name ?? null;

            if (!!chargeAura) {
                break;
            }

            yield 100;
        }

        if (!chargeAura) {
            return;
        }

        const zoneA: [x: number, y: number] = [373, 447];
        const zoneB: [x: number, y: number] = [569, 442];

        const inverted = chargeAura.endsWith("?");
        let target: [x: number, y: number];

        if (!inverted) {
            target =
                chargeAura === "Positive Charge"
                    ? zoneSet.toLowerCase() === "A".toLowerCase()
                        ? zoneB
                        : zoneA
                    : zoneSet.toLowerCase() === "A".toLowerCase()
                      ? zoneA
                      : zoneB;
        } else {
            target =
                chargeAura === "Positive Charge?"
                    ? zoneSet.toLowerCase() === "A".toLowerCase()
                        ? zoneA
                        : zoneB
                    : zoneSet.toLowerCase() === "A".toLowerCase()
                      ? zoneB
                      : zoneA;
        }

        try {
            bot.player.walkTo(target[0], target[1]);
        } catch (ex) {
            rethrowIfStopped(ex);

            Core.logger(`[QueenIona] WalkTo failed: ${ex instanceof Error ? ex.message : String(ex)}`);
        }
    }
}

export default function main(): void {
    const script = new QueenIonaNoOpv3();
    script.runBoss();
    bot.stop();
}

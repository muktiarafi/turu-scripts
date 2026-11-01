/*
name: QueenIonav3
description: Queen Iona v3 — farm using Engine/Ultra infrastructure.
tags: null
*/
// Port of Scripts/Ultrasv3/ChallengeBosses/QueenIonav3.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, type EventMap, option } from "turu";
import { Core, rethrowIfStopped } from "../../core/CoreBots";
import { type TaskStep, tasks } from "../../core/CoreTasks";
import { CoreEnginev3 } from "../dependenciesultras/CoreEnginev3";
import { CoreUltrav3 } from "../dependenciesultras/CoreUltrav3";
import { UltraEnhancements } from "../dependenciesultras/UltraEnhancements";
import { UltraGeneral } from "../dependenciesultras/UltraGeneral";
import { UltraPotions } from "../dependenciesultras/UltraPotions";

const Engine = CoreEnginev3.instance;
const Ultra = new CoreUltrav3();
const Pots = new UltraPotions();

export class QueenIonav3 {
    usePotions: boolean = false;

    private get hasQuestItem(): boolean {
        return Core.checkInventory("Queen Iona Bank Companion");
    }

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

        this.usePotions = bot.config!.get<boolean>("UsePotions");

        if (bot.config!.get<boolean>("DoEnh")) {
            new UltraEnhancements().apply();
        }

        bot.sleep(2500);
    }

    private fight(): void {
        const map = "queeniona";
        const boss = "Queen Iona";
        const item = "Lightning Diadem";

        const questId = 9852;

        const farmQuest = Core.isMember ? 9853 : this.hasQuestItem ? 9854 : 0;

        if (!bot.quests.isDailyComplete(questId)) {
            Core.ensureAccept(questId);
        }

        Core.addDrop(item);
        if (farmQuest > 0) {
            Core.ensureAccept(farmQuest);
        }

        const potionQuant = bot.config!.get<number>("PotionQuantity");
        if (this.usePotions) {
            Pots.ensureRecommendedPotions(potionQuant, false);
            Pots.useRecommendedPotions(potionQuant, false, undefined, false);
        }

        Core.join(map);

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
                UltraGeneral.completeQuest(bot, farmQuest > 0 ? farmQuest : questId);
                bot.sleep(3000);
                break;
            }

            if (!bot.player.hasTarget) {
                bot.combat.attack("*");
            }

            if (this.usePotions) {
                Pots.activateEquippedPotion();
            }
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

export const scriptOptions = defineScriptOptions(
    "QueenIonav3",
    [
        option.bool("DoEnh", "Do Enhancements", "Auto-Enhance Gear properly for the fight", true),
        option.bool("UsePotions", "Use Potions", "Enable buying and consuming recommended potions.", true),
        option.int("PotionQuantity", "Potion Quantity", "How many potions to keep stocked.", 10),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new QueenIonav3();
    script.runBoss();
    bot.stop();
}

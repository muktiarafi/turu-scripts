/*
name: QueenIona
description: Queen Iona solo
tags: Ultra, queen, iona, queen iona
*/
// Port of Scripts/Ultrasv3/DependenciesMerge/QueenIona.cs.
//
// Turu: the zone listener's work after its first await (C#'s `async void`) is a task of
// core/CoreTasks.ts. `DoEnh` and `ZoneDebuglog` are read with `configOr`, as the scripts that
// include this (LothianTreasuryMerge) don't declare them and C#'s `Get` gives false then.

import { bot, defineScriptOptions, type EventMap, option } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { configOr, Core, rethrowIfStopped } from "../../core/CoreBots";
import { type TaskStep, tasks } from "../../core/CoreTasks";
import { CoreEngine } from "../entwined eclipse/CoreEngine";
import { CoreUltra } from "../entwined eclipse/CoreUltra";

const Adv = new CoreAdvanced();
const coreEngine = new CoreEngine();
const Ultra = new CoreUltra();

export class QueenIona {
    isVHL = false;
    get hasQuestItem(): boolean {
        return Core.checkInventory("Queen Iona Bank Companion");
    }

    prep(AnotherScript = false): void {
        bot.skills.stop();
        if (
            (bot.player!.alive && bot.player!.currentClass === "Void Highlord") ||
            bot.player!.currentClass === "Void Highlord (IoDA)"
        ) {
            this.isVHL = true;
        }

        if (AnotherScript || configOr("DoEnh", false)) {
            Adv.gearStore(undefined, { enhAfter: true });
            Adv.smartEnhance(bot.player.currentClass);
        }
        Ultra.useAlchemyPotions(Ultra.getBestTonicPotion(), Ultra.getBestElixirPotion());
    }

    fight(item = "Lothian's Lightning", quant = 100, AnotherScript = false): void {
        if (item == null || Core.checkInventory(item, quant)) {
            return;
        }

        this.prep(AnotherScript);
        bot.events.on("extensionPacket", this.queenIonaListener);

        const map = "queeniona";
        const boss = "Queen Iona";

        if (!Core.isMember && !bot.quests.isDailyComplete(9852)) {
            Core.ensureAccept(9852);
        }

        Core.addDrop(item);

        Core.farmingLogger(item, quant);

        const questId = !Core.isMember && this.hasQuestItem ? 9854 : 9853;
        if (item === "Lothian's Lightning") {
            let itemQuantity = bot.inventory.getQuantity(item) + bot.tempInv.getQuantity(item);
            const houseItem = bot.house.getItem(item);
            if (houseItem != null) {
                itemQuantity += houseItem.quantity;
            }

            Core.logger(
                `Queen Iona farming check: Core member=${Core.isMember}, player member=${bot.player!.isMember}, ` +
                    `quest=${questId}, ${item} (${itemQuantity}/${quant}).`,
            );
        }

        Core.registerQuests(questId);

        // Always private
        Core.join(map + -100000, "r2", "Left");
        coreEngine.chooseBestCell(boss);

        bot.player!.setSpawnPoint();

        if (!this.isVHL) {
            coreEngine.enableSkills();
        }

        let skillIndex = 0;
        const skillList = [1, 4, 2];

        while (!bot.shouldExit && !Core.checkInventory(item, quant)) {
            // Dead → wait for respawn
            if (!bot.player!.alive) {
                bot.wait.forTrue(() => bot.player!.alive, 20);
                continue;
            }

            if (bot.player!.cell !== "r2") {
                bot.map.jump("r2", "Left", false);
                bot.wait.forCellChange("r2");
            }

            if (
                !Core.isMember &&
                item === "Lothian's Lightning" &&
                !this.hasQuestItem &&
                !bot.quests.isDailyComplete(9852) &&
                bot.tempInv.contains(87681)
            ) {
                Core.jump("Enter", "Spawn");
                Core.ensureComplete(9852);
                if (this.hasQuestItem) {
                    continue;
                }

                Core.logger("Daily complete come back tomorrow");
                bot.events.off("extensionPacket", this.queenIonaListener);
                return;
            }

            if (!bot.player!.hasTarget) {
                bot.combat.attack("*");
            }

            // VHL skill usage
            if (this.isVHL) {
                if (bot.player!.health <= 2500 && bot.skills.canUseSkill(2)) {
                    bot.skills.useSkill(2);
                }

                if (
                    bot.player!.hasTarget &&
                    (bot.player!.target?.hp ?? 0) > 0 &&
                    !bot.self.auras.some((a) => a?.name === "Shackled") &&
                    bot.skills.canUseSkill(skillList[skillIndex])
                ) {
                    bot.skills.useSkill(skillList[skillIndex]);
                    skillIndex = (skillIndex + 1) % skillList.length;
                }
            }

            bot.sleep(200);
        }
        bot.events.off("extensionPacket", this.queenIonaListener);
        //turn all the stuffs back on from main scripts
        Core.setOptions(true);

        if (configOr("DoEnh", false)) {
            Adv.gearStore(true, { enhAfter: true });
        }
    }

    queenIonaListener = (packet: EventMap["extensionPacket"]): void => {
        if (packet?.["params"]?.type?.toString() !== "json") {
            return;
        }

        if (!bot.player!.alive) {
            return;
        }

        const data = packet["params"].dataObj;
        if (data?.cmd?.toString() !== "event") {
            return;
        }

        const zoneSet: string | undefined = data?.args?.zoneSet?.toString();
        if (!zoneSet) {
            return; // ignore empty packets
        }

        // C#'s `async void` listener goes on after its first await; here that part is a task (a newer
        // zone event replaces it).
        tasks.start("QueenIonaZone", () => this.moveToSafeZone(zoneSet));
    };

    private *moveToSafeZone(zoneSet: string): Generator<TaskStep, void, boolean> {
        // Wait until a charge appears (normal or inverted)
        let chargeAura: string | null = null;
        while (!bot.shouldExit) {
            if (!bot.player!.alive) {
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

            if (!!chargeAura!) {
                break;
            }

            yield 100;
        }

        if (!chargeAura) {
            return;
        }

        // Zone coordinates
        const zoneA: [x: number, y: number] = [373, 447];
        const zoneB: [x: number, y: number] = [569, 442];

        // Determine if the aura is inverted
        const inverted = chargeAura!.endsWith("?");

        // Decide target
        let target: [x: number, y: number];

        if (!inverted) {
            // Normal charges
            target =
                chargeAura === "Positive Charge"
                    ? zoneSet.toLowerCase() === "A".toLowerCase()
                        ? zoneB
                        : zoneA
                    : zoneSet.toLowerCase() === "A".toLowerCase()
                      ? zoneA
                      : zoneB;
        } else {
            // Inverted charges (with ?)
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
            bot.player!.walkTo(target[0], target[1]);
        } catch (ex) {
            rethrowIfStopped(ex);

            if (configOr("ZoneDebuglog", false)) {
                Core.logger(`[Iona] WalkTo failed: ${ex instanceof Error ? ex.message : String(ex)}`, "Listener");
            }
        }

        if (configOr("ZoneDebuglog", false)) {
            Core.logger(
                `Charge=${chargeAura} | Zone=${zoneSet} | Moving to ${target === zoneA ? "A" : "B"} | Inverted=${inverted}`,
                "Listener",
            );
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "QueenIona",
    [
        option.bool("ZoneDebuglog", "Zone Logs", "En/Disable the Logging of zones in chat/logs.", true),
        option.bool("DoEnh", "Do Enhancements", "Auto-Enhance Gear properly for the fight", true),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new QueenIona();
    if (
        bot.config != null &&
        bot.config.has(Core.skipOptions.name) &&
        !bot.config.get<boolean>(Core.skipOptions.name)
    ) {
        bot.config.configure();
    }

    coreEngine.boot();
    script.fight();
    Core.setOptions(false);
}

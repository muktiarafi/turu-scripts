/*
name: Kathoolv3
description: Kill God of the Depths for Sacrosanct Morsel (Frenzy Feast daily).
tags: null
*/
// Port of Scripts/Ultrasv3/ChallengeBosses/Kathoolv3.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.
//
// Turu: C#'s `UseVigilAsync` (fired and forgotten from the packet listener) is a task of
// core/CoreTasks.ts.

import { bot, defineScriptOptions, type EventMap, option } from "turu";
import { Core, rethrowIfStopped } from "../../core/CoreBots";
import { type TaskStep, tasks } from "../../core/CoreTasks";
import { CoreEnginev3 } from "../dependenciesultras/CoreEnginev3";
import { CoreUltrav3 } from "../dependenciesultras/CoreUltrav3";
import { GetScrolls } from "../dependenciesultras/GetScrolls";
import { UltraEnhancements } from "../dependenciesultras/UltraEnhancements";
import { UltraGeneral } from "../dependenciesultras/UltraGeneral";
import { UltraPotions } from "../dependenciesultras/UltraPotions";
import { UltraWaitForArmy } from "../dependenciesultras/UltraWaitForArmy";

const Engine = CoreEnginev3.instance;
const Ultra = new CoreUltrav3();
const Enh = new UltraEnhancements();
const Pots = new UltraPotions();
const Scrolls = new GetScrolls();

export class Kathoolv3 {
    usePotions: boolean = false;

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
        UltraGeneral.equipPresetClasses(Ultra, bot, "challengeboss_template_class-v3.sync");
    }

    private prep(): void {
        UltraGeneral.equipWarriorClass();
        bot.sleep(2000);
        this.equipPresetClasses();
        bot.sleep(2000);

        this.usePotions = bot.config!.get<boolean>("UsePotions");

        if (bot.config!.get<boolean>("DoEnh")) {
            this.doEnhs();
        }

        bot.sleep(2500);
    }

    doEnhs(): void {
        Enh.apply();
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
                            Core.logger("[Kathool/Flash] Detected 'You cannot resist.' — using Vigil.");
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
        const completionSyncFile = "KathoolCompletion.sync";
        const armySize = Math.max(1, bot.config!.get<number>("ArmySize"));

        const questId = 9350;

        if (!UltraGeneral.isQuestGreen(bot, questId)) {
            UltraGeneral.ensureAcceptOnce(bot, questId);
        }

        Ultra.clearSyncFile(Ultra.resolveSyncPath(completionSyncFile));

        const potionQuant = bot.config!.get<number>("PotionQuantity");
        if (this.usePotions) {
            Pots.ensureRecommendedPotions(potionQuant, true);
        }

        Scrolls.buyVigil();

        Core.join("Whitemap");
        UltraWaitForArmy.instance.newWaitForArmy(armySize - 1, waitSyncFile, undefined, undefined, false);

        if (this.usePotions) {
            Pots.useRecommendedPotions(potionQuant, true, undefined, false);
        }

        Scrolls.equipVigil();

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

            if (this.usePotions) {
                Pots.activateEquippedPotion();
            }
            bot.sleep(500);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "Kathoolv3",
    [
        option.int("ArmySize", "Army Size", "How many players are in your army (including yourself).", 4),
        option.text(
            "Class1",
            "Class 1",
            "Preset class 1 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "Verus DoomKnight",
        ),
        option.text(
            "Class2",
            "Class 2",
            "Preset class 2 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "Lord of Order",
        ),
        option.text(
            "Class3",
            "Class 3",
            "Preset class 3 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "StoneCrusher",
        ),
        option.text(
            "Class4",
            "Class 4",
            "Preset class 4 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "King's Echo",
        ),
        option.text(
            "Class5",
            "Class 5",
            "Preset class 5 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "",
        ),
        option.text(
            "Class6",
            "Class 6",
            "Preset class 6 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "",
        ),
        option.text(
            "Class7",
            "Class 7",
            "Preset class 7 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "",
        ),
        option.bool("DoEnh", "Do Enhancements", "Auto-Enhance Gear properly for the fight", true),
        option.bool("UsePotions", "Use Potions", "Enable buying and consuming recommended potions.", true),
        option.int("PotionQuantity", "Potion Quantity", "How many potions to keep stocked.", 10),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new Kathoolv3();
    script.runBoss();
    bot.stop();
}

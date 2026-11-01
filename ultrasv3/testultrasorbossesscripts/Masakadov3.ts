/*
name: Masakadov3
description: Challenge Boss Template v3 — single-taunter fight flow with synced class equip. Copy and adapt for specific bosses.
tags: null
*/
// Port of Scripts/Ultrasv3/TestUltrasOrBossesScripts/Masakadov3.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, type EventMap, option } from "turu";
import { Core } from "../../core/CoreBots";
import { CancellationTokenSource } from "../../core/CoreTasks";
import { CoreEnginev3 } from "../dependenciesultras/CoreEnginev3";
import { CoreUltrav3 } from "../dependenciesultras/CoreUltrav3";
import { UltraAsync } from "../dependenciesultras/UltraAsync";
import { UltraCounterAttack } from "../dependenciesultras/UltraCounterAttack";
import { UltraEnhancements } from "../dependenciesultras/UltraEnhancements";
import { UltraGeneral } from "../dependenciesultras/UltraGeneral";
import { UltraPotions } from "../dependenciesultras/UltraPotions";
import { UltraWaitForArmy } from "../dependenciesultras/UltraWaitForArmy";

const Engine = CoreEnginev3.instance;
const Ultra = new CoreUltrav3();
const Enh = new UltraEnhancements();
const Pots = new UltraPotions();

export class Masakadov3 {
    usePotions: boolean = false;
    private _tauntCts: CancellationTokenSource = new CancellationTokenSource();
    private _role = "";

    runBoss(): void {
        Core.setOptions(true);

        Engine.boot();

        UltraCounterAttack.enable();

        try {
            this._tauntCts?.cancel();
            this._tauntCts = new CancellationTokenSource();
            bot.events.off("scriptStopping", this.stopTauntEvent);
            bot.events.on("scriptStopping", this.stopTauntEvent);

            this.prep();
            this.fight();
        } finally {
            bot.events.off("scriptStopping", this.stopTauntEvent);
            UltraCounterAttack.disable();
            this._tauntCts.cancel();

            Engine.disableSkills();
            Core.setOptions(false);
        }
    }

    private equipPresetClasses(): void {
        UltraGeneral.equipPresetClasses(Ultra, bot, "masakadov3_class.sync");
    }

    private prep(): void {
        UltraGeneral.equipWarriorClass();
        bot.sleep(2000);
        this.equipPresetClasses();
        bot.sleep(2000);

        this.usePotions = bot.config!.get<boolean>("UsePotions");

        const className = bot.player.currentClass;
        const tc1 = bot.config!.get<string>("TauntClass1");
        const tc2 = bot.config!.get<string>("TauntClass2");
        const hasTwoTaunters = !!tc1?.trim() && !!tc2?.trim();

        if (hasTwoTaunters) {
            if (className === tc1) {
                this._role = "Taunter1";
            } else if (className === tc2) {
                this._role = "Taunter2";
            } else {
                this._role = "Dps";
            }
        } else {
            if (className === tc1) {
                this._role = "Taunter";
            } else {
                this._role = "Dps";
            }
        }
        Core.logger(`[Masakadov3] Role: ${this._role} (${className})`);

        if (bot.config!.get<boolean>("DoEnh")) {
            this.doEnhs();
        }

        bot.sleep(2500);
    }

    doEnhs(): void {
        Enh.apply();
    }

    private isTaunter(): boolean {
        return this._role === "Taunter" || this._role === "Taunter1" || this._role === "Taunter2";
    }

    private stopTauntEvent = (e: EventMap["scriptStopping"]): boolean => {
        this._tauntCts.cancel();
        return true;
    };

    private fight(): void {
        const map = "victormatsuri";
        const boss = "Masakado";
        const bossDefeatedTemp = "Agehachou Crest";

        const waitSyncFile = "masakadov3_ready.sync";
        const fightTimeSyncFile = "masakadov3_fighttime.sync";
        const completionSyncFile = "masakadov3_completion.sync";
        const armySize = Math.max(1, bot.config!.get<number>("ArmySize"));

        const questId = 10295;

        if (!UltraGeneral.isQuestGreen(bot, questId)) {
            UltraGeneral.ensureAcceptOnce(bot, questId);
        }

        Ultra.clearSyncFile(Ultra.resolveSyncPath(fightTimeSyncFile));
        Ultra.clearSyncFile(Ultra.resolveSyncPath(completionSyncFile));

        const skipThird = this.isTaunter();
        const potionQuant = bot.config!.get<number>("PotionQuantity");
        if (this.usePotions) {
            Pots.ensureRecommendedPotions(potionQuant, skipThird);
        }

        Core.join("Whitemap");
        UltraWaitForArmy.instance.newWaitForArmy(armySize - 1, waitSyncFile, undefined, undefined, false);

        if (this.usePotions) {
            Pots.useRecommendedPotions(potionQuant, skipThird, undefined, false);
        }

        if (skipThird) {
            Core.logger("[Masakadov3] Taunter detected, equipping Scroll of Enrage.");
            Engine.equipEnrage();
        }

        Engine.join(map);
        UltraWaitForArmy.instance.newWaitForArmy(armySize - 1, waitSyncFile, undefined, undefined, true);

        Engine.chooseBestCell(boss);
        bot.player.setSpawnPoint();

        const fightTimeSyncPath = Ultra.resolveSyncPath(fightTimeSyncFile);
        const hasTwoTaunters = !!bot.config!.get<string>("TauntClass2")?.trim();

        if (hasTwoTaunters) {
            if (this._role === "Taunter1") {
                Core.logger("[Masakadov3] Taunter1 (Primary) — setting fight start time.");
                const fightStart = UltraAsync.setFightTime(Core, fightTimeSyncPath);
                UltraAsync.startTauntLoop(
                    bot,
                    Core,
                    Engine,
                    fightStart,
                    0,
                    2,
                    undefined,
                    undefined,
                    this._tauntCts.token,
                );
            } else if (this._role === "Taunter2") {
                Core.logger("[Masakadov3] Taunter2 (Secondary) — reading fight start time.");
                const fightStart = UltraAsync.getFightTime(Ultra, Core, fightTimeSyncPath);
                UltraAsync.startTauntLoop(
                    bot,
                    Core,
                    Engine,
                    fightStart,
                    1,
                    2,
                    undefined,
                    undefined,
                    this._tauntCts.token,
                );
            }
        } else if (this._role === "Taunter") {
            Core.logger("[Masakadov3] Taunter detected — starting taunt loop.");
            UltraAsync.startTauntLoop(bot, Core, Engine, Date.now(), 0, 1, undefined, undefined, this._tauntCts.token);
        }

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
                bot.events.off("scriptStopping", this.stopTauntEvent);
                UltraCounterAttack.disable();
                this._tauntCts.cancel();
                Engine.disableSkills();
                Engine.join(map);
                Ultra.persistentJoinHouse();
                UltraGeneral.completeQuest(bot, questId);
                bot.sleep(3000);
                break;
            }

            bot.combat.attack(boss);

            if (this.usePotions) {
                Pots.activateEquippedPotion();
            }
            bot.sleep(500);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "Masakadov3",
    [
        option.int("ArmySize", "Army Size", "How many players are in your army (including yourself).", 4),
        option.text("TauntClass1", "Taunt Class 1", "First taunter class. Leave empty for no taunter.", "ArchPaladin"),
        option.text(
            "TauntClass2",
            "Taunt Class 2",
            "Second taunter class. Leave empty for single taunter.",
            "Lord of Order",
        ),
        option.text(
            "Class1",
            "Class 1",
            "Preset class 1 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "King's Echo",
        ),
        option.text(
            "Class2",
            "Class 2",
            "Preset class 2 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "StoneCrusher",
        ),
        option.text(
            "Class3",
            "Class 3",
            "Preset class 3 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "ArchPaladin",
        ),
        option.text(
            "Class4",
            "Class 4",
            "Preset class 4 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "Lord of Order",
        ),
        option.bool("DoEnh", "Do Enhancements", "Auto-Enhance Gear properly for the fight", true),
        option.bool("UsePotions", "Use Potions", "Enable buying and consuming recommended potions.", true),
        option.int("PotionQuantity", "Potion Quantity", "How many potions to keep stocked.", 10),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new Masakadov3();
    script.runBoss();
    bot.stop();
}

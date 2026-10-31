/*
name: NightmareCarnax
description: NightmareCarnax helper for army farming Calamitous Ruin.
tags: Ultra, Carnax, Nightmare Carnax
*/
// Port of Scripts/Ultrasv3/ChallengeBosses/NightmareCarnaxv3.cs.
//
// Turu: C# writes `fbs_mute.sync` in Skua's folder while it fights, for VibeSkua's FBS plugin to
// stay quiet; Turu has no such plugin, so it isn't written. C#'s `Core` (CoreEnginev3) is `Engine`
// here, as `Core` is CoreBots (C#'s `C`). The skill loop runs as a task (core/CoreTasks.ts).

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreEnginev3 } from "../dependenciesultras/CoreEnginev3";
import { CoreUltrav3 } from "../dependenciesultras/CoreUltrav3";
import { UltraEnhancements } from "../dependenciesultras/UltraEnhancements";
import { UltraGeneral } from "../dependenciesultras/UltraGeneral";
import { UltraPotions } from "../dependenciesultras/UltraPotions";

const Adv = new CoreAdvanced();
const Pots = new UltraPotions();
const Enh = new UltraEnhancements();
const Engine = new CoreEnginev3();
const Ultra = new CoreUltrav3();

export class NightmareCarnax {
    usePotions: boolean = false;

    private equipPresetClasses(): void {
        UltraGeneral.equipPresetClasses(Ultra, bot, "nightmarecarnax_class-v3.sync");
    }

    prep(): void {
        this.equipPresetClasses();

        this.usePotions = bot.config!.get<boolean>("UsePotions");

        if (bot.config!.get<boolean>("DoEnh")) {
            this.doEnhs();
        }

        const potionQuant = bot.config!.get<number>("PotionQuantity");
        if (this.usePotions) {
            Pots.ensureRecommendedPotions(potionQuant, false);
            Pots.useRecommendedPotions(potionQuant, false, undefined, false);
        }

        bot.sleep(2500);
    }

    private hasBossTarget(boss: string): boolean {
        return bot.player.hasTarget && bot.player.target?.name?.toLowerCase() === boss?.toLowerCase();
    }

    fight(): void {
        const map = "darkcarnax";
        const boss = "Nightmare Carnax";

        const syncPath = Ultra.resolveSyncPath("UltraItemCheck.sync");
        const wipeDeadSyncPath = Ultra.resolveSyncPath("NightmareCarnaxWipeDead.sync");
        const wipeAliveSyncPath = Ultra.resolveSyncPath("NightmareCarnaxWipeAlive.sync");
        Ultra.clearSyncFile(syncPath);
        Ultra.clearSyncFile(wipeDeadSyncPath);
        Ultra.clearSyncFile(wipeAliveSyncPath);
        bot.sleep(2500);

        Core.addDrop("Calamitous Ruin");
        Core.registerQuests(8872);

        Engine.join(map);
        const armySize = Math.max(1, bot.config!.get<number>("ArmySize"));
        Ultra.waitForArmy(armySize - 1, "darkcarnax.sync");
        Engine.chooseBestCell(boss);

        bot.player.setSpawnPoint();

        Core.logger("Fight start synced.");

        let armyWipeDetected = false;

        while (!bot.shouldExit) {
            const allDead = UltraGeneral.isWholeArmyDead(Ultra, bot, wipeDeadSyncPath);
            if (allDead) {
                if (!armyWipeDetected) {
                    Core.logger("Army wipe detected — all clients dead.");
                }
                armyWipeDetected = true;
            }

            if (armyWipeDetected) {
                const allAlive = UltraGeneral.isWholeArmyAlive(Ultra, bot, wipeAliveSyncPath);
                if (allAlive) {
                    Core.logger("Army wipe recovered — all clients alive again.");
                    Ultra.clearSyncFile(wipeDeadSyncPath);
                    Ultra.clearSyncFile(wipeAliveSyncPath);
                    bot.combat.cancelTarget();
                    armyWipeDetected = false;
                    Core.logger("Army wipe recovered — resuming fight.");
                    continue;
                }

                bot.combat.cancelTarget();
                Core.logger("Army wipe active — waiting for everyone to respawn before fighting.");
                bot.sleep(250);
                continue;
            }

            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);
                continue;
            }

            if (Ultra.checkArmyProgressBool(() => Core.checkInventory("Calamitous Ruin", 1), syncPath)) {
                Core.logger("All players finished farm.");
                Ultra.joinHouse();
                Core.cancelRegisteredQuests();
                if (bot.config!.get<boolean>("DoEnh")) {
                    Adv.gearStore(true, { enhAfter: true });
                }
                break;
            }

            if (!this.hasBossTarget(boss)) {
                bot.combat.attack(boss);
            }

            if (this.usePotions) {
                Pots.activateEquippedPotion();
            }
            bot.sleep(100);
        }
    }

    doEnhs(): void {
        Enh.apply();
    }
}

export const scriptOptions = defineScriptOptions(
    "NightmareCarnax-v3",
    [
        option.int("ArmySize", "Army Size", "How many players are in your army (including yourself).", 4),
        option.text(
            "Class1",
            "Class 1",
            "Preset class 1 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "ArchPaladin",
        ),
        option.text(
            "Class2",
            "Class 2",
            "Preset class 2 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "ArchPaladin",
        ),
        option.text(
            "Class3",
            "Class 3",
            "Preset class 3 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "Lord of Order",
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
    const script = new NightmareCarnax();
    Core.setOptions(true);
    Engine.boot();
    try {
        script.prep();
        script.fight();
    } finally {
        Engine.disableSkills();
        Core.setOptions(false);
        bot.stop();
    }
}

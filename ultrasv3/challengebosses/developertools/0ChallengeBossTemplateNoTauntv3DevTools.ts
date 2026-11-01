/*
name: ChallengeBossTemplateNoTaunt
description: Challenge Boss Template v3 — no-taunt fight flow with synced class equip. Copy and adapt for specific bosses.
tags: null
*/
// Port of Scripts/Ultrasv3/ChallengeBosses/DeveloperTools/0ChallengeBossTemplateNoTauntv3DevTools.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { Core } from "../../../core/CoreBots";
import { CoreEnginev3 } from "../../dependenciesultras/CoreEnginev3";
import { CoreUltrav3 } from "../../dependenciesultras/CoreUltrav3";
import { UltraEnhancements } from "../../dependenciesultras/UltraEnhancements";
import { UltraGeneral } from "../../dependenciesultras/UltraGeneral";
import { UltraPotions } from "../../dependenciesultras/UltraPotions";
import { UltraWaitForArmy } from "../../dependenciesultras/UltraWaitForArmy";

const Engine = CoreEnginev3.instance;
const Ultra = new CoreUltrav3();
const Enh = new UltraEnhancements();
const Pots = new UltraPotions();

export class ChallengeBossTemplateNoTaunt {
    usePotions: boolean = false;

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

        const potionQuant = bot.config!.get<number>("PotionQuantity");
        if (this.usePotions) {
            Pots.ensureRecommendedPotions(potionQuant, false);
            Pots.useRecommendedPotions(potionQuant, false, undefined, false);
        }

        bot.sleep(2500);
    }

    doEnhs(): void {
        Enh.apply();
    }

    private fight(): void {
        const map = "changemap";
        const boss = "Change Boss Name";
        const bossDefeatedTemp = "Change Boss Defeated Temp";

        const waitSyncFile = "challengeboss_template.sync";
        const completionSyncFile = "ChallengeBossCompletion.sync";
        const armySize = Math.max(1, bot.config!.get<number>("ArmySize"));

        const questId = 0;

        if (!UltraGeneral.isQuestGreen(bot, questId)) {
            UltraGeneral.ensureAcceptOnce(bot, questId);
        }

        Ultra.clearSyncFile(Ultra.resolveSyncPath(completionSyncFile));

        const potionQuant = bot.config!.get<number>("PotionQuantity");
        if (this.usePotions) {
            Pots.ensureRecommendedPotions(potionQuant, false);
        }

        Core.join("Whitemap");
        UltraWaitForArmy.instance.newWaitForArmy(armySize - 1, waitSyncFile, undefined, undefined, false);

        if (this.usePotions) {
            Pots.useRecommendedPotions(potionQuant, false, undefined, false);
        }

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

            // Default — attack the boss
            if (bot.player.target?.name !== boss) {
                bot.combat.attack(boss);
            }

            if (this.usePotions) {
                Pots.activateEquippedPotion();
            }
            bot.sleep(500);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "ChallengeBossTemplateNoTaunt",
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
    const script = new ChallengeBossTemplateNoTaunt();
    script.runBoss();
    bot.stop();
}

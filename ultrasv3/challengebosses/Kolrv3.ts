/*
name: Kolrv3
description: 2 man Kolr Scripts, uses KE LoO. Don't change the classes, KE LoO has a specific skillset for this boss.
tags: null
*/
// Port of Scripts/Ultrasv3/ChallengeBosses/Kolrv3.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { Core } from "../../core/CoreBots";
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

export class Kolrv3 {
    usePotions: boolean = false;

    static readonly selectDrops = [
        option.bool("GreatFlameOfYew", "Great Flame of Yew", "Farm Great Flame of Yew from Kolr.", false),
        option.int(
            "GreatFlameOfYewQuant",
            "Great Flame of Yew Quantity",
            "How many Great Flame of Yew to farm per player.",
            1,
        ),
    ];

    runBoss(): void {
        Core.setOptions(true);

        Engine.boot();

        try {
            const dailyOnly = this.doDailyOnly;

            if (dailyOnly) {
                // Daily mode: single run, complete quest, done
                this.prep();
                this.fight();
            } else {
                // Drop-farm mode: cycle kills until drops collected
                if (bot.config!.get<boolean>("SelectDrops", "GreatFlameOfYew")) {
                    Core.addDrop("Great Flame of Yew");
                }

                while (!bot.shouldExit && !this.hasSelectedDrops()) {
                    const current = bot.inventory.getQuantity("Great Flame of Yew");
                    const target = bot.config!.get<number>("SelectDrops", "GreatFlameOfYewQuant");
                    Core.logger(`Great Flame of Yew: ${current}/${target}`);

                    this.prep();
                    this.fight();
                    // kills boss once, syncs army, joins house

                    // Re-enable skills for next cycle (Fight disables them on boss kill)
                    Engine.enableSkills();
                    bot.sleep(1000);
                }

                if (!bot.shouldExit) {
                    Core.logger("All selected drops collected. Farm complete.");
                }
            }
        } finally {
            Engine.disableSkills();
            Core.setOptions(false);
        }
    }

    private equipPresetClasses(): void {
        UltraGeneral.equipPresetClasses(Ultra, bot, "kolrv3_class-v3.sync");
    }

    private get doDailyOnly(): boolean {
        return bot.config!.get<boolean>("DoDailyOnly");
    }

    private prep(): void {
        UltraGeneral.equipWarriorClass();
        bot.sleep(2000);
        this.equipPresetClasses();
        bot.sleep(2000);

        this.usePotions = bot.config!.get<boolean>("UsePotions");

        if (bot.config!.get<boolean>("DoEnh")) {
            Enh.applyKolr();
        }

        // Register drops for SelectDrops if not doing daily-only
        if (!this.doDailyOnly) {
            if (bot.config!.get<boolean>("SelectDrops", "GreatFlameOfYew")) {
                Core.addDrop("Great Flame of Yew");
            }
        }

        bot.sleep(2500);
    }

    /** Returns true when all enabled SelectDrops targets are met. */
    private hasSelectedDrops(): boolean {
        if (bot.config!.get<boolean>("SelectDrops", "GreatFlameOfYew")) {
            const quant = bot.config!.get<number>("SelectDrops", "GreatFlameOfYewQuant");
            if (!Core.checkInventory("Great Flame of Yew", quant)) {
                return false;
            }
        }
        return true;
    }

    private fight(): void {
        const map = "flameusurper";
        const boss = "Kolr, Usurper of Flames";
        const bossDefeatedTemp = "Choronzonite";

        const waitSyncFile = "kolrv3.sync";
        const completionSyncFile = "Kolrv3Completion.sync";
        const killSyncFile = "Kolrv3Kill.sync";
        const armySize = Math.max(1, bot.config!.get<number>("ArmySize"));

        const questId = 10715;

        const dailyOnly = this.doDailyOnly;

        if (dailyOnly) {
            if (!UltraGeneral.isQuestGreen(bot, questId)) {
                UltraGeneral.ensureAcceptOnce(bot, questId);
            }
        } else {
            // Drop mode: fresh kill sync file each cycle
            Ultra.clearSyncFile(Ultra.resolveSyncPath(killSyncFile));
        }

        Ultra.clearSyncFile(Ultra.resolveSyncPath(completionSyncFile));

        const potionQuant = bot.config!.get<number>("PotionQuantity");
        if (this.usePotions) {
            Pots.ensureRecommendedPotions(potionQuant, false, "Kolr");
        }

        Core.join("Whitemap");
        UltraWaitForArmy.instance.newWaitForArmy(armySize - 1, waitSyncFile, undefined, undefined, false);

        if (this.usePotions) {
            Pots.useRecommendedPotions(potionQuant, false, "Kolr", false);
        }

        Core.join(map);
        UltraWaitForArmy.instance.newWaitForArmy(armySize - 1, waitSyncFile, undefined, undefined, true);

        Engine.chooseBestCellOneMonster(boss);
        bot.player.setSpawnPoint();
        bot.sleep(2000);

        // Pre-seed completion sync file so all entries exist before the loop starts.
        const _username = bot.player.username;
        const _className = bot.player.currentClass;
        if (!!_username?.trim() && !!_className?.trim()) {
            const _myKey = `${_username}|${_className}`.replaceAll(":", "-");
            Ultra.updateEntry(Ultra.resolveSyncPath(completionSyncFile), _myKey, "0");
        }

        let bossWasEngaged = false;

        while (!bot.shouldExit) {
            if (!bot.player.alive) {
                bot.wait.forTrue(() => bot.player.alive, 20);
                continue;
            }

            if (dailyOnly) {
                // Daily mode: check for boss temp item, complete quest
                if (Ultra.checkArmyProgressBool(() => bot.tempInv.contains(bossDefeatedTemp, 1), completionSyncFile)) {
                    Core.logger("Boss defeated. Finishing quest.");
                    Engine.disableSkills();
                    Engine.join(map);
                    Ultra.persistentJoinHouse();
                    UltraGeneral.completeQuest(bot, questId);
                    bot.sleep(3000);
                    break;
                }
            } else {
                // Drop-farm mode: detect boss death by target state
                // Mark engaged once we've attacked the boss
                if (bot.player.hasTarget && bot.player.target?.name === boss) {
                    bossWasEngaged = true;
                }

                // Boss died: target lost after having been engaged
                if (bossWasEngaged && (!bot.player.hasTarget || (bot.player.target?.hp ?? 1) <= 0)) {
                    // Signal this player's kill to the sync file
                    const key = `${bot.player.username}|kill`;
                    Ultra.updateEntry(Ultra.resolveSyncPath(killSyncFile), key, "1");

                    // Check if all army members have signaled the kill
                    const lines = Ultra.readLines(Ultra.resolveSyncPath(killSyncFile));
                    const killCount = lines.filter((l) => l.includes(":1:")).length;
                    Core.logger(`Boss kill signal: ${killCount}/${armySize}`);

                    if (killCount >= armySize) {
                        Core.logger("All players confirmed boss kill. Retreating to house.");
                        Engine.disableSkills();
                        Engine.join(map);
                        Ultra.persistentJoinHouse();
                        bot.sleep(3000);
                        break;
                    }
                }
            }

            // Attack the boss if not on cooldown
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
    "Kolrv3",
    [
        option.int("ArmySize", "Army Size", "How many players are in your army (including yourself).", 2),
        option.bool(
            "DoDailyOnly",
            "Do Daily Only",
            "True: do the daily quest only. False: farm selected drops instead.",
            true,
        ),
        option.text(
            "Class1",
            "Class 1",
            "Preset class 1 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "Lord of Order",
        ),
        option.text(
            "Class2",
            "Class 2",
            "Preset class 2 to auto-equip before the fight.\nUse format: ClassName,Username.\nOnly type ClassName if you want it to be random.",
            "King's Echo",
        ),
        option.bool("DoEnh", "Do Enhancements", "Auto-Enhance Gear properly for the fight", true),
        option.bool("UsePotions", "Use Potions", "Enable buying and consuming recommended potions.", true),
        option.int("PotionQuantity", "Potion Quantity", "How many potions to keep stocked.", 10),
        Core.skipOptions,
    ],
    true,
    {
        SelectDrops: Kolrv3.selectDrops,
    },
);

export default function main(): void {
    const script = new Kolrv3();
    script.runBoss();
    bot.stop();
}
